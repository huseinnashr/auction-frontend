import { Paper, Skeleton, Stack, Typography } from "@mui/material"
import React from 'react';
import { ItemEntity } from "../entity/item.entity";
import PeopleIcon from '@mui/icons-material/People';
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

interface ItemProps {
  data: ItemEntity
  button: React.JSX.Element
}

export const Item = (props: ItemProps) => {
  return <Grid2 xs={4}>
    <Paper elevation={1} sx={{ padding: "8px" }}>
      <Stack direction="column">
        <Typography variant='h5'>{props.data.name}</Typography>
        <Stack direction="row">
          <Stack direction="column" flexGrow={1}>
            <Typography>By: {props.data.createdBy}</Typography>
            <Typography>1 minute left</Typography>
          </Stack>
          <Stack direction="row" alignSelf="center" alignItems="center" >
            <Typography variant='h5' alignSelf="end" marginRight={1}>${props.data.bidAmount}</Typography>
            <PeopleIcon />
            <Typography variant='h5' alignSelf="end">{props.data.bidCount}</Typography>
          </Stack>
        </Stack>
        {props.button}
      </Stack>
    </Paper>
  </Grid2 >
}


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