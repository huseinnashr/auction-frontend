import { Button, Link, Stack, TextField, Typography } from '@mui/material';
import React from 'react';

function Register() {
  return <Stack width="100%" height="100vh" justifyContent="center">
    <Stack spacing={1} marginX="auto" width="300px">
      <Typography variant="h4" gutterBottom alignSelf="center">Register</Typography>
      <TextField label="email" variant="outlined" />
      <TextField label="password" variant="outlined" type="password" />
      <TextField label="username" variant="outlined" />
      <Button variant="outlined">Next</Button>
      <Button variant="outlined">Resend</Button>
      <Button variant="outlined">Register</Button>
      <Link href="/login" alignSelf="center">Login</Link>
    </Stack>
  </Stack>
}

export default Register