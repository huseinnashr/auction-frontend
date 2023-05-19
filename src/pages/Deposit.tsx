import { Button, Stack, TextField, Typography } from '@mui/material';
import React from 'react';
import Navbar from '../components/Navbar';

function Deposit() {
  return (
    <Stack padding={8} spacing={2} >
      <Typography variant='h4' gutterBottom={true}>Deposit</Typography>
      <TextField label="Amount ($)" variant="outlined" />
      <Stack direction="row" justifyContent="end">
        <Button variant="outlined">Deposit</Button>
      </Stack>
    </Stack>
  )
}

export default Deposit