import { Button, Stack, TextField, Typography } from '@mui/material';
import React from 'react';

function ItemCreate() {
  return (
    <Stack padding={8} spacing={2} >
      <Typography variant='h4' gutterBottom={true}>Create New Item</Typography>
      <TextField id="outlined-basic" label="Name" variant="outlined" />
      <TextField id="outlined-basic" label="Start Price ($)" variant="outlined" type="number" />
      <TextField id="outlined-basic" label="Time Window (seconds)" variant="outlined" type="number" />
      <Stack direction="row" justifyContent="end" spacing={2}>
        <Button variant="outlined">Cancel</Button>
        <Button variant="outlined">Create</Button>
      </Stack>
    </Stack>
  )
}

export default ItemCreate