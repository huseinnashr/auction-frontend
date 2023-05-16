import { Alert, Button, Link, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useFetch } from '../hooks/usefetch.hooks';
import { AccountStatus, LoginResponse, StatusResponse } from '../entity/auth.entity';
import LoadingButton from '@mui/lab/LoadingButton';
import { MessageError, UnexpectedError } from '../entity/errors.entity';

function Login() {
  const [isLoading, status, getStatus] = useFetch("POST", "/auth/status", StatusResponse)
  const [email, setEmail] = useState("")

  console.log(status)
  return <Stack width="100%" height="100vh" justifyContent="center">
    <Stack spacing={1} marginX="auto" width="300px">
      <Typography variant="h4" gutterBottom alignSelf="center">Login</Typography>

      {status instanceof MessageError ? <Alert severity="error">{status.message}</Alert> : null}
      {status instanceof UnexpectedError ? <Alert severity="error">{status.message}</Alert> : null}
      {status instanceof StatusResponse && status.status == AccountStatus.NOT_FOUND ?
        <Alert severity="error">Email is not found. You can <a href="/register">create a new user</a></Alert> : null}
      {status instanceof StatusResponse && status.status == AccountStatus.NOT_VERIFIED ?
        <Alert severity="error">Email is not verified. Please see console log or <a href="/resend">resend verification link</a></Alert> : null}

      <TextField id="outlined-basic" label="email" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} />
      {status instanceof StatusResponse && status.status == AccountStatus.VERIFIED ?
        [<TextField id="outlined-basic" label="password" variant="outlined" type="password" />
          , <Link href="/register" alignSelf="center">Register</Link>]
        : null}

      <LoadingButton variant="outlined" loading={isLoading} onClick={async () => await getStatus({ email })}>Next</LoadingButton>
    </Stack>
  </Stack>
}

export default Login