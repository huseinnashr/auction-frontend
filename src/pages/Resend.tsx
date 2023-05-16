import { Button, Link, Stack, TextField, Typography } from '@mui/material';
import React from 'react';

function Resend() {
  return <Stack width="100%" height="100vh" justifyContent="center">
    <Stack spacing={1} marginX="auto" width="300px">
      <Typography variant="h4" gutterBottom alignSelf="center">Resend Verification</Typography>
      <TextField id="outlined-basic" label="email" variant="outlined" />
      <Button variant="outlined">Resend</Button>
      <Link href="/login" alignSelf="center">Login</Link>
    </Stack>
  </Stack>
}

export default Resend