import { Alert, Snackbar, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Item, ItemSkeleton } from '../components/Item';
import { GetAllItemResponse, ItemEntity, PublishItemResponse } from '../entity/item.entity';
import { useFetch } from '../hooks/usefetch.hooks';
import { LoadingButton, Masonry } from '@mui/lab';
import { PaginationLimit } from '../config';

function ItemCreatedPage() {
  const getAll = useFetch("POST", "/user/item/all", GetAllItemResponse, { useAuth: true })
  const publish = useFetch("POST", "/item/publish", PublishItemResponse, { useAuth: true })

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
        {items.map((item) => <Item key={item.id} data={item} button={
          <LoadingButton variant="outlined" loading={publish.loading} onClick={() => publish.fetch({ itemId: item.id })}>Publish</LoadingButton>
        } />)}
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

export default ItemCreatedPage