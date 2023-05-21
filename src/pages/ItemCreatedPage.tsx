import { Alert, Button, Paper, Snackbar, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { GetAllItemResponse, GetItemResponse, ItemEntity, ItemStatus, PublishItemResponse } from '../entity/item.entity';
import { useFetch } from '../hooks/usefetch.hooks';
import { LoadingButton, Masonry } from '@mui/lab';
import { PaginationLimit } from '../config';
import { ItemSkeleton } from '../components/ItemSkeleton';
import PeopleIcon from '@mui/icons-material/People';
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { ViewMessageError } from '../entity/errors.entity';
import { Nullable } from '../pkg/safecatch/safecatch.type';

export const ItemCreatedPage = () => {
  const getAll = useFetch("POST", "/user/item/all", GetAllItemResponse, { useAuth: true, noUserField: true })

  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const [items, setItems] = useState<ItemEntity[]>([])
  const [nextId, setNextId] = useState(0)

  console.log(nextId)
  useEffect(() => {
    getAll.fetch({ pagination: { nextId: 0, limit: PaginationLimit } })
  }, [])

  useEffect(() => {
    if (getAll.data) {
      setItems([...items, ...getAll.data.items])
      setNextId(getAll.data.pagination.nextId)
    }
  }, [getAll.data])
  useEffect(() => { if (getAll.error) { setSnackbarOpen(true) } }, [getAll.error])

  return (
    <Stack padding={8}>
      <Typography variant='h4' gutterBottom={true}>Created Item List</Typography>
      <Masonry columns={3} spacing={2}>
        {items.map((item, i) => <Item key={i} data={item} setData={(newItem) => setItems(items.splice(i, 1, newItem))} />)}
        {getAll.loading ? Array.from({ length: PaginationLimit }).map((_, i) => <ItemSkeleton key={i} />) : null}
      </Masonry>

      {!getAll.loading && nextId == 0 ?
        <Typography alignSelf="center">No more item to see</Typography> :
        <LoadingButton variant="contained" loading={getAll.loading} onClick={async () => await getAll.fetch({ pagination: { nextId, limit: PaginationLimit } })}>Load More</LoadingButton>
      }

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={() => setSnackbarOpen(false)} severity="error" sx={{ width: '100%' }}>
          Cannot get item list. {getAll.error?.message}
        </Alert>
      </Snackbar>
    </Stack>
  )
}

interface ItemProps {
  data: ItemEntity
  setData: (item: ItemEntity) => void
}

export const Item = (props: ItemProps) => {
  const publish = useFetch("POST", "/item/publish", PublishItemResponse, { useAuth: true, noUserField: true })
  const getOne = useFetch("POST", "/user/item/one", GetItemResponse, { useAuth: true, noUserField: true })

  useEffect(() => { if (publish.data) getOne.fetch({ pagination: { nextId: props.data.id, limit: 1 } }) }, [publish.data])
  useEffect(() => { if (getOne.data) props.setData(getOne.data.item) }, [getOne.data])

  const [loading, setLoading] = useState(false)
  useEffect(() => publish.loading || publish.loading ? setLoading(true) : setLoading(false), [publish.loading, getOne.loading])

  const [error, setError] = useState<Nullable<ViewMessageError>>(null)
  useEffect(() => { if (publish.error) setError(publish.error) }, [publish.error])
  useEffect(() => { if (getOne.error) setError(getOne.error) }, [getOne.error])

  const [snackbarOpen, setSnackbarOpen] = useState(false)
  useEffect(() => { if (error) setSnackbarOpen(true) }, [error])

  return <Grid2 xs={4}>
    <Paper elevation={1} sx={{ padding: "8px" }}>
      <Stack direction="column">
        <Typography variant='h5'>{props.data.name}</Typography>
        <Stack direction="row">
          <Stack direction="column" flexGrow={1}>
            <Typography>By: {props.data.createdBy}</Typography>
            <Typography>1 minute left</Typography>
          </Stack>
          <Stack direction="row" alignSelf="center" alignItems="center" >
            <Typography variant='h5' alignSelf="end" marginRight={1}>${props.data.bidAmount}</Typography>
            <PeopleIcon />
            <Typography variant='h5' alignSelf="end">{props.data.bidCount}</Typography>
          </Stack>
        </Stack>
        {props.data.status == ItemStatus.DRAFT ?
          <LoadingButton variant="outlined" loading={loading} onClick={() => publish.fetch({ itemId: props.data.id })}>Publish</LoadingButton> :
          <Button variant="outlined" disabled>Published</Button>
        }
      </Stack>
    </Paper>
    <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
      <Alert onClose={() => setSnackbarOpen(false)} severity="error" sx={{ width: '100%' }}>
        Failed to publish item. {error?.message}
      </Alert>
    </Snackbar>
  </Grid2 >
}