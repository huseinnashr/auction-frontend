import { Chip, Paper, Skeleton, Stack, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { GetAllBidResponse } from '../entity/bid.entity';
import EmojiEvents from '@mui/icons-material/EmojiEvents';
import { TablePagination } from '../components/TablePagination';
import { useFetch } from '../hooks/usefetch.hooks';
import { AccessTime, Cancel, CurrencyExchange, PriceCheck, TrendingDown } from '@mui/icons-material';
import { ItemStatus } from '../entity/item.entity';
import { PaginationLimit } from '../config';
import { Link } from 'react-router-dom';

export function UserBidPage() {
  const getBids = useFetch("POST", "/user/bid/all", GetAllBidResponse, { noUserField: true, useAuth: true })

  const [page, setPage] = useState(1)
  const [cursors, setCursors] = useState<number[]>([])

  useEffect(() => {
    getBids.fetch({ onlyActive: false, pagination: { nextId: 0, limit: PaginationLimit } })
  }, [])


  useEffect(() => {
    if (cursors[page] == null) return
    getBids.fetch({ onlyActive: false, pagination: { nextId: cursors[page], limit: PaginationLimit } })
  }, [page])

  useEffect(() => {
    if (getBids.data) {
      const newCursors = [...cursors]
      newCursors[page] = getBids.data.pagination.currId
      newCursors[page + 1] = getBids.data.pagination.nextId

      return setCursors(newCursors)
    }
  }, [getBids.data])

  return (
    <Stack padding={8}>
      <Typography variant='h4' gutterBottom={true}>Bid List</Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Item Name</TableCell>
              <TableCell align="right">Bidded At</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getBids.data?.bids.map((bid, i) => (
              <TableRow key={i}>
                <TableCell width="35%"><Link to={"/item/detail/" + bid.itemId}>{bid.item.name}</Link></TableCell>
                <TableCell align="right">{bid.createdAt.toISOString()}</TableCell>
                <TableCell align="right">${bid.amount}</TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="end">
                    {!bid.isActive ? <Chip variant="outlined" size='small' color="default" label="Cancelled" icon={<Cancel />} /> : null}
                    {bid.isActive && bid.item.status == ItemStatus.ONGOING ? <Chip variant="outlined" size='small' color="primary" label="Ongoing" icon={<AccessTime />} /> : null}
                    {bid.isActive && bid.item.status == ItemStatus.FINISHED && !bid.isWinner ? <Chip variant="outlined" size='small' color="error" label="Lose" icon={<TrendingDown />} /> : null}
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
                  <TableCell width="20%" align='right'><Skeleton /></TableCell>
                  <TableCell width="15%" align='right'><Skeleton /></TableCell>
                  <TableCell width="20%" align='right'><Skeleton /></TableCell>
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
    </Stack >
  )
}