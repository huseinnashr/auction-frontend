import { Chip, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { BidEntity, GetAllBidByUserResponse } from '../entity/bid.entity';
import EmojiEvents from '@mui/icons-material/EmojiEvents';
import { TablePagination } from '../components/TablePagination';
import { useFetch } from '../hooks/usefetch.hooks';
import { PaginationLimit } from '../config';
import { AccessTime, Cancel, CurrencyExchange, Leaderboard, PriceCheck, TrendingDown } from '@mui/icons-material';
import { ItemStatus } from '../entity/item.entity';

export function UserBidPage() {
  const getBids = useFetch("POST", "/user/bid/all", GetAllBidByUserResponse, { noUserField: true, useAuth: true })

  const [page, setPage] = useState(1)
  const [bids, setBids] = useState<BidEntity[]>([])
  const [cursor, setCursor] = useState<number[]>([])

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getBids.fetch({ onlyActive: false, pagination: { nextId: 0, limit: PaginationLimit } })
  }, [])

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
            {getBids.data?.bids.map((bid) => (
              <TableRow>
                <TableCell>{bid.item.name}</TableCell>
                <TableCell align="right">{bid.createdAt.toString()}</TableCell>
                <TableCell align="right">${bid.amount}</TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="end">
                    {!bid.isActive ? <Chip variant="outlined" color="default" label="Cancelled" icon={<Cancel />} /> : null}
                    {bid.isActive && bid.item.status == ItemStatus.ONGOING ? <Chip variant="outlined" color="primary" label="Ongoing" icon={<AccessTime />} /> : null}
                    {bid.isActive && bid.item.status == ItemStatus.FINISHED && !bid.isWinner ? <Chip variant="outlined" color="error" label="Lose" icon={<TrendingDown />} /> : null}
                    {bid.isWinner ? <Chip variant="outlined" color="warning" label="Won" icon={<EmojiEvents />} /> : null}

                    {bid.isReturned ? <Chip variant="outlined" color="info" label="Returned" icon={<CurrencyExchange />} /> : null}
                    {bid.isPaid ? <Chip variant="outlined" color="success" label="Paid" icon={<PriceCheck />} /> : null}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}

          </TableBody>
          <TableFooter>
            <TableRow >
              <TableCell colSpan={4} padding="none" align='right'>
                <TablePagination page={page} lastPage={cursor[page + 1] == null} onPageChange={(page) => setPage(page)} loading={loading} />
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Stack >
  )
}