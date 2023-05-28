import { Alert, Stack, TextField, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { FieldError, useFetch } from '../hooks/usefetch.hooks';
import { AccountStatus, LoginResponse, StatusResponse } from '../entity/auth.entity';
import LoadingButton from '@mui/lab/LoadingButton';
import { Nullable } from '../pkg/safecatch/safecatch.type';
import { ViewMessageError } from '../entity/errors.entity';
import { Map } from 'immutable';
import { Context } from '../context/index.context';
import { Link } from 'react-router-dom';

function LoginPage() {
  const getStatus = useFetch("POST", "/auth/status", StatusResponse)
  const login = useFetch("POST", "/auth/login", LoginResponse)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<Nullable<ViewMessageError>>(null)
  const [fieldError, setFieldError] = useState<FieldError>(Map())

  const { auth } = useContext(Context)

  useEffect(() => {
    setError(getStatus.error)
    setFieldError(getStatus.fieldError)
  }, [getStatus.error, getStatus.fieldError])

  useEffect(() => {
    setError(login.error)
    setFieldError(login.fieldError)
  }, [login.error, login.fieldError])


  useEffect(() => {
    if (getStatus.data?.status == AccountStatus.VERIFIED) {
      login.fetch({ email, password })
    }
  }, [getStatus.data])

  useEffect(() => {
    if (login.data) {
      auth.login(login.data)
    }
  }, [login.data])

  return <Stack width="100%" height="100vh" justifyContent="center">
    <Stack spacing={1} marginX="auto" width="300px">
      <Typography variant="h4" gutterBottom alignSelf="center">Login</Typography>

      {error ? <Alert severity="error">{error.message}</Alert> : null}

      {getStatus.data?.status == AccountStatus.NOT_FOUND ?
        <Alert severity="error">Email is not found. You can <Link to={"/register"}>create a new user</Link></Alert> : null}
      {getStatus.data?.status == AccountStatus.NOT_VERIFIED ?
        <Alert severity="error">Email is not verified. Please see console log or <Link to={"/resend"}>resend verification link</Link></Alert> : null}

      <TextField label="email" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} error={fieldError.has("email")} helperText={fieldError.get("email")} />
      <TextField label="password" variant="outlined" type="password" value={password} onChange={(e) => setPassword(e.target.value)} error={fieldError.has("password")} helperText={fieldError.get("password")} />

      <LoadingButton variant="outlined" loading={login.loading} onClick={() => getStatus.fetch({ email })}>Login</LoadingButton>
      <Link to={"/register"} style={{ alignSelf: "center" }}>Register</Link>
    </Stack>
  </Stack>
}

export default LoginPage