import { Button, Link, Stack, TextField, Typography } from '@mui/material';
import React from 'react';

function Login() {
  return <Stack width="100%" height="100vh" justifyContent="center">
    <Stack spacing={1} marginX="auto" width="300px">
      <Typography variant="h4" gutterBottom alignSelf="center">Login</Typography>
      <TextField id="outlined-basic" label="email" variant="outlined" />
      <TextField id="outlined-basic" label="password" variant="outlined" type="password" />
      <Button variant="outlined">Login</Button>
      <Link href="/register" alignSelf="center">Register</Link>
    </Stack>
  </Stack>
}

export default Login