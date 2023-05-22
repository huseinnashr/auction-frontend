import { Paper, Skeleton, Stack } from "@mui/material"
import React from 'react';

export const ItemSkeleton = () => {
  return <Paper elevation={1}>
    <Stack direction="row">
      <Stack direction="column" flexGrow={1} sx={{ padding: "8px" }}>
        <Skeleton />
        <Stack direction="row" >
          <Stack direction="row" flexGrow={1} spacing={1}>
            <Skeleton width={150} />
            <Skeleton width={100} />
          </Stack>
          <Stack direction="row" spacing={1}>
            <Skeleton width={50} />
            <Skeleton width={50} />
          </Stack>
        </Stack>
      </Stack>
      <Stack justifyContent="center" width="100px" padding={1}>
        <Skeleton height="100%" />
      </Stack>
    </Stack>
  </Paper>
}