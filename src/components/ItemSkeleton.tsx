import { Paper, Skeleton, Stack } from "@mui/material"
import React from 'react';
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

const TitleHeights = [32, 64, 80];
export const ItemSkeleton = () => {
  return <Grid2 xs={4}>
    <Paper elevation={1} sx={{ padding: "8px" }}>
      <Stack direction="column" spacing={1}>
        <Skeleton variant="rectangular" height={TitleHeights[Math.floor(Math.random() * TitleHeights.length)]} />
        <Stack direction="row" spacing={1}>
          <Stack direction="column" flexGrow={1} >
            <Skeleton variant="rectangular" sx={{ mb: 0.5 }} />
            <Skeleton variant="rectangular" />
          </Stack>
          <Stack direction="row" alignSelf="center" alignItems="center" spacing={1}>
            <Skeleton variant="rectangular" width={32} height={32} />
            <Skeleton variant="rectangular" width={32} height={32} />
          </Stack>
        </Stack>
        <Skeleton variant="rectangular" height={32} />
      </Stack>
    </Paper>
  </Grid2 >
}