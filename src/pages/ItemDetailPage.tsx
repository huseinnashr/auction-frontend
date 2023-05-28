import { Alert, Card, Chip, Paper, Skeleton, Snackbar, Stack, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import EmojiEvents from '@mui/icons-material/EmojiEvents';
import { TablePagination } from '../components/TablePagination';
import { useFetch } from '../hooks/usefetch.hooks';
import { AccessTime, Cancel, CheckCircle, CurrencyExchange, Mode, People, PriceCheck, TrendingDown } from '@mui/icons-material';
import { GetItemResponse, ItemStatus } from '../entity/item.entity';
import { PaginationLimit, TimerHTTPDelay } from '../config';
import { useParams } from 'react-router-dom';
import { GetAllBidResponse } from '../entity/bid.entity';
import { ViewMessageError } from '../entity/errors.entity';
import { Nullable } from '../pkg/safecatch/safecatch.type';
import { ConvertSecondsLeftToString, useTimer } from '../hooks/usetimer.hooks';

export function ItemDetailPage() {
  const params = useParams()
  const getItem = useFetch("POST", "/item/one", GetItemResponse, { noUserField: true })
  const getBids = useFetch("POST", "/item/bid/all", GetAllBidResponse, { noUserField: true })

  const [page, setPage] = useState(1)
  const [cursors, setCursors] = useState<number[]>([])

  const itemId = params.itemId ? +params.itemId : 0

  useEffect(() => {
    getItem.fetch({ itemId })
    getBids.fetch({ itemId, pagination: { nextId: 0, limit: PaginationLimit } })
  }, [])

  useEffect(() => {
    if (cursors[page] == null) return
    getBids.fetch({ itemId, pagination: { nextId: cursors[page], limit: PaginationLimit } })
  }, [page])

  useEffect(() => {
    if (getBids.data) {
      const newCursors = [...cursors]
      newCursors[page] = getBids.data.pagination.currId
      newCursors[page + 1] = getBids.data.pagination.nextId

      return setCursors(newCursors)
    }
  }, [getBids.data])

  const expiryTimer = useTimer({
    onExpire: () => { getItem.fetch({ itemId }) },
    delay: TimerHTTPDelay
  })

  useEffect(() => {
    if (getItem.data?.item.startedAt && getItem.data?.item.status == ItemStatus.ONGOING) {
      const endTime = new Date(getItem.data?.item.startedAt.getTime() + getItem.data?.item.timeWindow * 1000)
      expiryTimer.start(endTime)
    }
  }, [getItem.data])

  const [error, setError] = useState<Nullable<ViewMessageError>>(null)
  useEffect(() => { if (getItem.error) setError(getItem.error) }, [getItem.error])
  useEffect(() => { if (getBids.error) setError(getBids.error) }, [getBids.error])

  const [errSBOpen, setErrSBOpen] = useState(false)
  useEffect(() => { if (error) setErrSBOpen(true) }, [error])

  return (
    <Stack padding={8}>
      <Typography variant='h4'>{getItem.data?.item.name}</Typography>
      <Card sx={{ marginBottom: 2 }}>
        <Stack direction="column" flexGrow={1} sx={{ padding: "8px" }}>
          <Stack direction="row" >
            <Stack direction="row" flexGrow={1} spacing={1}>
              <Typography >By: {getItem.data?.item.creator.username}</Typography>
              {getItem.data?.item.status == ItemStatus.ONGOING ?
                <Typography >{ConvertSecondsLeftToString(expiryTimer.seconds)}</Typography> : null
              }
              {getItem.data?.item.status == ItemStatus.DRAFT ?
                <Chip variant="outlined" size='small' color="default" label="Draft" icon={<Mode />} /> : null}
              {getItem.data?.item.status == ItemStatus.ONGOING ?
                <Chip variant="outlined" size='small' color="primary" label="Ongoing" icon={<AccessTime />} /> : null}
              {getItem.data?.item.status == ItemStatus.FINISHED ?
                <Chip variant="outlined" size='small' color="success" label="Finished" icon={<CheckCircle />} /> : null}
            </Stack>
            <Stack direction="row">
              <Typography marginRight={1} >${getItem.data?.item.bidAmount}</Typography>
              <People fontSize='small' /> <Typography >{getItem.data?.item.bidCount}</Typography>
            </Stack>
          </Stack>
        </Stack>
      </Card>
      <Typography variant='h5' gutterBottom={true}>Bid List</Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell align="right">Bidded At</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getBids.data?.bids.map((bid, i) => (
              <TableRow key={i}>
                <TableCell width="35%">{bid.bidder.username}</TableCell>
                <TableCell align="right">{bid.createdAt.toISOString()}</TableCell>
                <TableCell align="right">${bid.amount}</TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="end">
                    {!bid.isActive ? <Chip variant="outlined" size='small' color="default" label="Cancelled" icon={<Cancel />} /> : null}
                    {bid.isActive && getItem.data?.item.status == ItemStatus.ONGOING ? <Chip variant="outlined" size='small' color="primary" label="Ongoing" icon={<AccessTime />} /> : null}
                    {bid.isActive && getItem.data?.item.status == ItemStatus.FINISHED && !bid.isWinner ? <Chip variant="outlined" size='small' color="error" label="Lose" icon={<TrendingDown />} /> : null}
                    {bid.isWinner ? <Chip variant="outlined" size='small' color="warning" label="Won" icon={<EmojiEvents />} /> : null}

                    {bid.isReturned ? <Chip variant="outlined" size='small' color="info" label="Returned" icon={<CurrencyExchange />} /> : null}
                    {bid.isPaid ? <Chip variant="outlined" size='small' color="success" label="Paid" icon={<PriceCheck />} /> : null}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {getBids.loading ?
              new Array(PaginationLimit).fill(0).map((_, i) => (
                <TableRow key={i}>
                  <TableCell width="35%"><Skeleton /></TableCell>
                  <TableCell width="15%" align='right'><Skeleton /></TableCell>
                  <TableCell width="15%" align='right'><Skeleton /></TableCell>
                  <TableCell width="25%" align='right'><Skeleton /></TableCell>
                </TableRow>
              )) : null}
          </TableBody>
          <TableFooter>
            <TableRow >
              <TableCell colSpan={4} padding="none" align='right'>
                <TablePagination page={page} lastPage={cursors[page + 1] == 0} onPageChange={(page) => setPage(page)} loading={getBids.loading} />
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <Snackbar open={errSBOpen} autoHideDuration={6000} onClose={() => setErrSBOpen(false)} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity="error" onClose={() => setErrSBOpen(false)} sx={{ width: '100%' }}>
          Failed to load item detail. {error?.message}
        </Alert>
      </Snackbar>
    </Stack >
  )
}