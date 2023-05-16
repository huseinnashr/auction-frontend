import { Paper, Stack, Typography } from "@mui/material"
import React from 'react';
import { ItemEntity } from "../entity/item.entity";
import PeopleIcon from '@mui/icons-material/People';

interface ItemProps {
  data: ItemEntity
  button: React.JSX.Element
}

function Item(props: ItemProps) {
  return <Paper elevation={1} sx={{ padding: "8px" }}>
    <Stack direction="column">
      <Stack direction="row" mb={1}>
        <Stack direction="column" flexGrow={1}>
          <Typography variant='h5'>Lorem Ipsum Dolor Sit Amet</Typography>
          <Typography>By: test.user@test.com</Typography>
          <Stack>1 minute left</Stack>
        </Stack>
        <Stack direction="column">
          <Typography variant='h5'>$100</Typography>
          <Stack direction="row" alignItems="center">
            <PeopleIcon />
            <Typography variant='h5' alignSelf="end" alignContent="center">15</Typography>
          </Stack>
        </Stack>
      </Stack>
      {props.button}
    </Stack>
  </Paper>
}

export default Item