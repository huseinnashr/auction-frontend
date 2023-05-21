import { Alert, Stack, TextField, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { FieldError, useFetch } from '../hooks/usefetch.hooks';
import { AccountStatus, LoginResponse, StatusResponse } from '../entity/auth.entity';
import LoadingButton from '@mui/lab/LoadingButton';
import { Nullable } from '../pkg/safecatch/safecatch.type';
import { ViewMessageError } from '../entity/errors.entity';
import { Map } from 'immutable';
import { Context } from '../context/index.context';

function LoginPage() {
  const status = useFetch("POST", "/auth/status", StatusResponse)
  const login = useFetch("POST", "/auth/login", LoginResponse)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<Nullable<ViewMessageError>>(null)
  const [fieldError, setFieldError] = useState<FieldError>(Map())

  const { auth } = useContext(Context)

  useEffect(() => {
    setError(status.error)
    setFieldError(status.fieldError)
  }, [status.error, status.fieldError])

  useEffect(() => {
    setError(login.error)
    setFieldError(login.fieldError)
  }, [login.error, login.fieldError])

  useEffect(() => {
    if (login.data) {
      auth.login(login.data)
    }
  }, [login.data])


  return <Stack width="100%" height="100vh" justifyContent="center">
    <Stack spacing={1} marginX="auto" width="300px">
      <Typography variant="h4" gutterBottom alignSelf="center">Login</Typography>

      {error ? <Alert severity="error">{error.message}</Alert> : null}

      {status.data?.status == AccountStatus.NOT_FOUND ?
        <Alert severity="error">Email is not found. You can <a href="/register">create a new user</a></Alert> : null}
      {status.data?.status == AccountStatus.NOT_VERIFIED ?
        <Alert severity="error">Email is not verified. Please see console log or <a href="/resend">resend verification link</a></Alert> : null}

      <TextField label="email" variant="outlined" onChange={(e) => setEmail(e.target.value)} error={fieldError.has("email")} helperText={fieldError.get("email")} />

      {status.data?.status == AccountStatus.VERIFIED ?
        <TextField label="password" variant="outlined" type="password" onChange={(e) => setPassword(e.target.value)} error={fieldError.has("password")} helperText={fieldError.get("password")} /> : null}
      {status.data?.status == AccountStatus.VERIFIED ?
        <LoadingButton variant="outlined" loading={login.loading} onClick={async () => await login.fetch({ email, password })}>Login</LoadingButton> :
        <LoadingButton variant="outlined" loading={status.loading} onClick={async () => await status.fetch({ email })}>Next</LoadingButton>}

    </Stack>
  </Stack>
}

export default LoginPage