import { Paper, Stack, Typography } from "@mui/material"
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