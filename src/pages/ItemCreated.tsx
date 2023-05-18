import { Button, Stack, Typography } from '@mui/material';
import React from 'react';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import Item from '../components/Item';
import { ItemEntity } from '../entity/item.entity';

function ItemCreated() {
  return (
    <Stack padding={8}>
      <Typography variant='h4' gutterBottom={true}>Created Item List</Typography>
      <Grid2 columnSpacing={2} container>
        <Grid2 xs={4}><Item data={new ItemEntity()} button={<Button>Publish</Button>} /></Grid2>
        <Grid2 xs={4}><Item data={new ItemEntity()} button={<Button>Publish</Button>} /></Grid2>
        <Grid2 xs={4}><Item data={new ItemEntity()} button={<Button>Publish</Button>} /></Grid2>
      </Grid2>
    </Stack>
  )
}

export default ItemCreated