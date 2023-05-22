import { Alert, Button, Paper, Snackbar, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { GetAllItemResponse, GetItemResponse, ItemEntity, ItemStatus, PublishItemResponse } from '../entity/item.entity';
import { useFetch } from '../hooks/usefetch.hooks';
import { LoadingButton } from '@mui/lab';
import { PaginationLimit } from '../config';
import { ItemSkeleton } from '../components/ItemSkeleton';
import PeopleIcon from '@mui/icons-material/People';
import { ViewMessageError } from '../entity/errors.entity';
import { Nullable } from '../pkg/safecatch/safecatch.type';

export const ItemCreatedPage = () => {
  const getAll = useFetch("POST", "/user/item/all", GetAllItemResponse, { useAuth: true, noUserField: true })

  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const [items, setItems] = useState<ItemEntity[]>([])
  const [nextId, setNextId] = useState(0)

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

  const setData = (i: number, newItem: ItemEntity) => {
    const newItems = items.slice()
    newItems[i] = newItem
    setItems(newItems)
  }

  return (
    <Stack padding={8} spacing={2}>
      <Typography variant='h4' gutterBottom={true}>Created Item List</Typography>
      <Stack spacing={1}>
        {items.map((item, i) => <Item key={i} data={item} setData={(newItem) => setData(i, newItem)} />)}
        {getAll.loading ? Array.from({ length: PaginationLimit }).map((_, i) => <ItemSkeleton key={i} />) : null}
      </Stack>
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

  useEffect(() => { if (publish.data) getOne.fetch({ itemId: props.data.id }) }, [publish.data])
  useEffect(() => { if (getOne.data) props.setData(getOne.data.item) }, [getOne.data])

  const [loading, setLoading] = useState(false)
  useEffect(() => publish.loading || getOne.loading ? setLoading(true) : setLoading(false), [publish.loading, getOne.loading])

  const [error, setError] = useState<Nullable<ViewMessageError>>(null)
  useEffect(() => { if (publish.error) setError(publish.error) }, [publish.error])
  useEffect(() => { if (getOne.error) setError(getOne.error) }, [getOne.error])

  const [snackbarOpen, setSnackbarOpen] = useState(false)
  useEffect(() => { if (error) setSnackbarOpen(true) }, [error])

  return <Paper elevation={2} >
    <Stack direction="row">
      <Stack direction="column" flexGrow={1} sx={{ padding: "8px" }}>
        <Typography>{props.data.name}</Typography>
        <Stack direction="row" >
          <Stack direction="row" flexGrow={1} >
            <Typography variant='caption'>By: {props.data.createdBy}</Typography>
            <Typography variant='caption'>1 minute left</Typography>
          </Stack>
          <Stack direction="row">
            <Typography variant='caption' marginRight={1} >${props.data.bidAmount}</Typography>
            <PeopleIcon fontSize='small' /> <Typography variant='caption' >{props.data.bidCount}</Typography>
          </Stack>
        </Stack>
      </Stack>
      <Stack justifyContent="center" width="100px" padding={1}>
        {props.data.status == ItemStatus.DRAFT ?
          <LoadingButton variant="outlined" loading={loading} onClick={() => publish.fetch({ itemId: props.data.id })} sx={{ height: "100%" }}>Publish</LoadingButton>
          : <Button variant="outlined" sx={{ height: "100%" }} disabled>Published</Button>}
      </Stack>
    </Stack>
    <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
      <Alert onClose={() => setSnackbarOpen(false)} severity="error" sx={{ width: '100%' }}>
        Failed to publish item. {error?.message}
      </Alert>
    </Snackbar>
  </Paper>
}
