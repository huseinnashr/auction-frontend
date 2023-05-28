import { Alert, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { FieldError, useFetch } from '../hooks/usefetch.hooks';
import { AccountStatus, RegisterResponse, StatusResponse } from '../entity/auth.entity';
import LoadingButton from '@mui/lab/LoadingButton';
import { Nullable } from '../pkg/safecatch/safecatch.type';
import { ViewMessageError } from '../entity/errors.entity';
import { Map } from 'immutable';
import { Link } from 'react-router-dom';

export function RegisterPage() {
  const getStatus = useFetch("POST", "/auth/status", StatusResponse)
  const register = useFetch("POST", "/auth/register", RegisterResponse)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [error, setError] = useState<Nullable<ViewMessageError>>(null)
  const [fieldError, setFieldError] = useState<FieldError>(Map())

  useEffect(() => {
    setError(getStatus.error)
    setFieldError(getStatus.fieldError)
  }, [getStatus.error, getStatus.fieldError])

  useEffect(() => {
    setError(register.error)
    setFieldError(register.fieldError)
  }, [register.error, register.fieldError])


  useEffect(() => {
    if (getStatus.data?.status == AccountStatus.NOT_FOUND) {
      register.fetch({ email, password, username })
    }
  }, [getStatus.data])

  return <Stack width="100%" height="100vh" justifyContent="center">
    <Stack spacing={1} marginX="auto" width="300px">
      <Typography variant="h4" gutterBottom alignSelf="center">Register</Typography>

      {!error && getStatus.data?.status == AccountStatus.NOT_FOUND && register.data ? <Alert severity="info">{register.data.message}</Alert> : null}
      {error ? <Alert severity="error">{error.message}</Alert> : null}

      {getStatus.data?.status == AccountStatus.NOT_VERIFIED ?
        <Alert severity="error">Email is not verified. Please see console log or <Link to={"/resend"}>resend verification link</Link></Alert> : null}
      {getStatus.data?.status == AccountStatus.VERIFIED ?
        <Alert severity="error">Email is already exist. Please <Link to={"/login"}>Login</Link></Alert> : null}

      <TextField label="email" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} error={fieldError.has("email")} helperText={fieldError.get("email")} />
      <TextField label="password" variant="outlined" type="password" value={password} onChange={(e) => setPassword(e.target.value)} error={fieldError.has("password")} helperText={fieldError.get("password")} />
      <TextField label="username" variant="outlined" value={username} onChange={(e) => setUsername(e.target.value)} error={fieldError.has("username")} helperText={fieldError.get("username")} />

      <LoadingButton variant="outlined" loading={getStatus.loading || register.loading} onClick={() => getStatus.fetch({ email })}>Register</LoadingButton>
      <Link to={"/login"} style={{ alignSelf: "center" }}>Login</Link>
    </Stack>
  </Stack>
}
