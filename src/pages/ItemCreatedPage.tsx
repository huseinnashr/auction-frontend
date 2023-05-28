import { Alert, Button, Card, Snackbar, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { GetAllItemResponse, GetItemResponse, ItemEntity, ItemStatus, PublishItemResponse } from '../entity/item.entity';
import { useFetch } from '../hooks/usefetch.hooks';
import { LoadingButton } from '@mui/lab';
import { PaginationLimit, TimerHTTPDelay as APIFetchTimerDelay } from '../config';
import { ItemSkeleton } from '../components/ItemSkeleton';
import PeopleIcon from '@mui/icons-material/People';
import { ViewMessageError } from '../entity/errors.entity';
import { Nullable } from '../pkg/safecatch/safecatch.type';
import { ConvertSecondsLeftToString, useTimer } from '../hooks/usetimer.hooks';
import { EmojiEvents } from '@mui/icons-material';
import { Link } from 'react-router-dom';

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

  const [error, setError] = useState<Nullable<ViewMessageError>>(null)

  const [errSBOpen, setErrSBOpen] = useState(false)
  const [successSBOpen, setSuccessSBOpen] = useState(false)

  const expiryTimer = useTimer({
    onExpire: () => { getOne.fetch({ itemId: props.data.id }) },
    delay: APIFetchTimerDelay
  })

  useEffect(() => {
    if (props.data.startedAt && props.data.status == ItemStatus.ONGOING) {
      const endTime = new Date(props.data.startedAt.getTime() + props.data.timeWindow * 1000)
      expiryTimer.start(endTime)
    }
  }, [props.data])

  useEffect(() => { if (publish.data) getOne.fetch({ itemId: props.data.id }) }, [publish.data])
  useEffect(() => { if (getOne.data) props.setData(getOne.data.item) }, [getOne.data])

  useEffect(() => { if (publish.error) setError(publish.error) }, [publish.error])
  useEffect(() => { if (getOne.error) setError(getOne.error) }, [getOne.error])

  useEffect(() => { if (error) setErrSBOpen(true) }, [error])
  useEffect(() => { if (publish.data) setSuccessSBOpen(true) }, [publish.data])

  return <Card>
    <Stack direction="row">
      <Stack direction="column" flexGrow={1} sx={{ padding: "8px" }}>
        <Link to={"/item/detail/" + props.data.id}>{props.data.name}</Link>
        <Stack direction="row" >
          <Stack direction="row" flexGrow={1} spacing={1}>
            <Typography variant='caption'>By: {props.data.creator.username}</Typography>
            {props.data.status == ItemStatus.ONGOING ?
              <Typography variant='caption'>{ConvertSecondsLeftToString(expiryTimer.seconds)}</Typography> : null
            }
          </Stack>
          <Stack direction="row">
            <Typography variant='caption' marginRight={1} >${props.data.bidAmount}</Typography>
            <PeopleIcon fontSize='small' /> <Typography variant='caption' >{props.data.bidCount}</Typography>
          </Stack>
        </Stack>
      </Stack>
      <Stack justifyContent="center" width="100px" padding={1}>
        {props.data.status == ItemStatus.DRAFT ?
          <LoadingButton variant="outlined" loading={publish.loading || getOne.loading} onClick={() => publish.fetch({ itemId: props.data.id })} sx={{ height: "100%" }}>Publish</LoadingButton>
          : <Button variant="outlined" sx={{ height: "100%" }} disabled>{props.data.status == ItemStatus.ONGOING ? "Published" : "Finished"}</Button>}
      </Stack>
    </Stack>
    {props.data.winner != null ?
      <Alert severity='warning' icon={<EmojiEvents />}>
        {props.data.winner.username} at ${props.data.winner.amount}
      </Alert> : null
    }
    <Snackbar open={successSBOpen} autoHideDuration={6000} onClose={() => setSuccessSBOpen(false)} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
      <Alert onClose={() => setSuccessSBOpen(false)} severity="success" sx={{ width: '100%' }}>
        Success publishing {props.data.name}
      </Alert>
    </Snackbar>
    <Snackbar open={errSBOpen} autoHideDuration={6000} onClose={() => setErrSBOpen(false)} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
      <Alert onClose={() => setErrSBOpen(false)} severity="error" sx={{ width: '100%' }}>
        Failed to publish item. {error?.message}
      </Alert>
    </Snackbar>
  </Card>
}
