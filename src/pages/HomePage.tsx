import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Snackbar, Stack, TextField, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { GetAllItemResponse, GetItemResponse, ItemEntity, ItemStatus, PublishItemResponse } from '../entity/item.entity';
import { useFetch } from '../hooks/usefetch.hooks';
import { LoadingButton } from '@mui/lab';
import { PaginationLimit, TimerHTTPDelay as APIFetchTimerDelay } from '../config';
import { ItemSkeleton } from '../components/ItemSkeleton';
import PeopleIcon from '@mui/icons-material/People';
import { ViewMessageError } from '../entity/errors.entity';
import { Nullable } from '../pkg/safecatch/safecatch.type';
import { ConvertSecondsLeftToString, useTimer } from '../hooks/usetimer.hooks';
import { BidResponse } from '../entity/bid.entity';
import { Context } from '../context/index.context';
import { EmojiEvents } from '@mui/icons-material';

export const HomePage = () => {
  const getAll = useFetch("POST", "/item/all", GetAllItemResponse, { noUserField: true })

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
      <Typography variant='h4' gutterBottom={true}>Home Page</Typography>
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
  const { auth } = useContext(Context)

  const bid = useFetch("POST", "/item/bid", BidResponse, { useAuth: true, noUserField: true })
  const getOne = useFetch("POST", "/item/one", GetItemResponse, { useAuth: true, noUserField: true })

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [amount, setAmount] = useState(props.data.bidAmount + 1)

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

  useEffect(() => { if (bid.data) getOne.fetch({ itemId: props.data.id }) }, [bid.data])
  useEffect(() => { if (getOne.data) props.setData(getOne.data.item) }, [getOne.data])

  useEffect(() => { if (bid.error) setError(bid.error) }, [bid.error])
  useEffect(() => { if (getOne.error) setError(getOne.error) }, [getOne.error])

  useEffect(() => { if (error) setErrSBOpen(true) }, [error])
  useEffect(() => { if (bid.data) setSuccessSBOpen(true) }, [bid.data])

  return <Paper elevation={2} >
    <Stack direction="row">
      <Stack direction="column" flexGrow={1} sx={{ padding: "8px" }}>
        <Typography>{props.data.name}</Typography>
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
        {props.data.status == ItemStatus.ONGOING ?
          props.data.creator.id == auth.data?.user.id ?
            <Button variant="outlined" sx={{ height: "100%" }} disabled>Owned</Button> :
            <LoadingButton variant="outlined" loading={bid.loading || getOne.loading} onClick={() => setDialogOpen(true)} sx={{ height: "100%" }}>Bid</LoadingButton> :
          <Button variant="outlined" sx={{ height: "100%" }} disabled>Finished</Button>}
      </Stack>
    </Stack>
    {props.data.winner != null ?
      <Alert severity='warning' icon={<EmojiEvents />}>
        {props.data.winner.username} at ${props.data.winner.amount}
      </Alert> : null
    }
    <Snackbar open={successSBOpen} autoHideDuration={6000} onClose={() => setSuccessSBOpen(false)} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
      <Alert onClose={() => setSuccessSBOpen(false)} severity="success" sx={{ width: '100%' }}>
        Success bidding {props.data.name} at ${amount}
      </Alert>
    </Snackbar>
    <Snackbar open={errSBOpen} autoHideDuration={6000} onClose={() => setErrSBOpen(false)} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
      <Alert onClose={() => setErrSBOpen(false)} severity="error" sx={{ width: '100%' }}>
        Failed to bid. {error?.message}
      </Alert>
    </Snackbar>
    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth>
      <DialogTitle>Bid {props.data.name}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Current price: ${props.data.bidAmount}
        </DialogContentText>
        <TextField autoFocus fullWidth margin="dense" label="Amount ($)" variant="outlined" value={amount} onChange={(e) => e.target.value == "" || /^[0-9\b]+$/.test(e.target.value) ? setAmount(+e.target.value) : null} type="tel" error={bid.fieldError.has("amount")} helperText={bid.fieldError.get("amount")} />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
        <Button onClick={() => {
          setDialogOpen(false)
          bid.fetch({ itemId: props.data.id, amount })
        }}>Bid</Button>
      </DialogActions>
    </Dialog>
  </Paper>
}
