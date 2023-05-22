import { Chip, CircularProgress, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { BidEntity } from '../entity/bid.entity';
import EmojiEvents from '@mui/icons-material/EmojiEvents';

function ItemBiddedPage() {
  return (
    <Stack padding={8}>
      <Typography variant='h4' gutterBottom={true}>Bidded Item List</Typography>
      <Bid />
    </Stack>
  )
}

export default ItemBiddedPage

function Bid() {
  const [bids, setBids] = useState<BidEntity[]>([])
  const [currBids, setCurrBids] = useState<BidEntity[]>([])
  const [initCursor, setInitCursor] = useState<UpstreamCursor<number>>({ count: 10, cursor: null, page: 1 })

  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    initComponent()
  }, [])

  const initComponent = async (): Promise<void> => {
    const [count, cursor] = await onFetchData(null)
    setInitCursor({ count, page: 1, cursor })
  }

  const onFetchData = async (cursor: Nullable<number>): Promise<[number, Nullable<number>]> => {
    const newBids: BidEntity[] = []

    await (new Promise((r) => setTimeout(r, 1000)))
    setBids(bids.concat(newBids))
    setCurrBids(newBids)

    return [9, 0]
  }

  const onCursorChange = (cursor: LocalCursor) => {
    setCurrBids(bids.slice(cursor.start, cursor.end))
  }

  return (
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
          <BidRow />
          <BidRow />
          <BidRow />
        </TableBody>
        <TableFooter>
          <TableRow >
            <TableCell colSpan={4} padding="none" align='right'>
              <AppPagination initCursor={initCursor} isLoading={isLoading} pageSize={10} onFetchData={onFetchData} onCursorChange={onCursorChange} />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  )
}

type Nullable<T> = T | null
interface LocalCursor {
  start: number
  end: number
}

interface UpstreamCursor<T> {
  page: number
  count: number
  cursor: Nullable<T>
}

interface AppPaginationProps<T> {
  pageSize: number
  initCursor: UpstreamCursor<T>
  onFetchData: (cursor: T) => Promise<[number, Nullable<T>]>;
  onCursorChange: (cursor: LocalCursor) => void;
  isLoading: boolean
}

function AppPagination<T>(props: AppPaginationProps<T>) {
  const [head, setHead] = useState<UpstreamCursor<T>>(props.initCursor)
  const [page, setPage] = useState<number>(1)

  useEffect(() => {
    setHead(props.initCursor)
  }, [props.initCursor])

  const firstPageClick = async () => {
    props.onCursorChange({ start: 0, end: props.pageSize - 1 })
    setPage(1)
  };

  const previousPageClick = async () => {
    const start = (page - 2) * props.pageSize
    props.onCursorChange({ start, end: start + props.pageSize - 1 })
    setPage(page - 1)
  };

  const nextPageClick = async () => {
    if (page == head.page) {
      if (head.cursor == null) {
        return
      }

      const [count, cursor] = await props.onFetchData(head.cursor);
      setHead({ count, page: page + 1, cursor })
      setPage(page + 1)
      return
    }

    const start = page * props.pageSize
    props.onCursorChange({ start, end: start + props.pageSize - 1 })
    setPage(page + 1)
    return
  };


  return (
    <Stack direction="row" alignItems="center" justifyContent="right">
      <IconButton
        onClick={firstPageClick}
        disabled={page === 1 || props.isLoading}
        aria-label="first page"
      >
        <FirstPageIcon />
      </IconButton>
      <IconButton
        onClick={previousPageClick}
        disabled={page === 1 || props.isLoading}
        aria-label="previous page"
      >
        <KeyboardArrowLeft />
      </IconButton>
      {props.isLoading ?
        <CircularProgress size={16} sx={{ marginX: "12px" }} /> : <Typography mx={2}>{page}</Typography>
      }
      <IconButton
        onClick={nextPageClick}
        disabled={(head.cursor == null) && (page == head.page) || props.isLoading}
        aria-label="next page"
      >
        <KeyboardArrowRight />
      </IconButton>
    </Stack>
  );
}

function BidRow() {
  return (
    <TableRow>
      <TableCell>Lorem ipsum dolor sit amet</TableCell>
      <TableCell align="right">2023-02-02 08:00:00</TableCell>
      <TableCell align="right">2321</TableCell>
      <TableCell align="right">
        <Stack direction="row" spacing={1} justifyContent="end">
          <Chip variant="outlined" color="warning" label="Won" icon={<EmojiEvents />} />
        </Stack>
      </TableCell>
    </TableRow>
  )
}