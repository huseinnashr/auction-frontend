import { FirstPage, KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { CircularProgress, IconButton, Stack, Typography } from "@mui/material";

interface AppPaginationProps {
  page: number
  lastPage: boolean
  onPageChange: (page: number) => void
  loading: boolean
}

export function TablePagination(props: AppPaginationProps) {
  const firstPageClick = () => {
    props.onPageChange(1)
  };

  const previousPageClick = async () => {
    props.onPageChange(props.page - 1)
  };

  const nextPageClick = async () => {
    props.onPageChange(props.page + 1)
  };

  return (
    <Stack direction="row" alignItems="center" justifyContent="right">
      <IconButton
        onClick={firstPageClick}
        disabled={props.page === 1 || props.loading}
        aria-label="first page"
      >
        <FirstPage />
      </IconButton>
      <IconButton
        onClick={previousPageClick}
        disabled={props.page === 1 || props.loading}
        aria-label="previous page"
      >
        <KeyboardArrowLeft />
      </IconButton>
      {props.loading ?
        <CircularProgress size={16} sx={{ marginX: "12px" }} /> : <Typography mx={2}>{props.page}</Typography>
      }
      <IconButton
        onClick={nextPageClick}
        disabled={props.lastPage || props.loading}
        aria-label="next page"
      >
        <KeyboardArrowRight />
      </IconButton>
    </Stack>
  );
}