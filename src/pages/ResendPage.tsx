import { Alert, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { FieldError, useFetch } from '../hooks/usefetch.hooks';
import { AccountStatus, ResendResponse, StatusResponse } from '../entity/auth.entity';
import LoadingButton from '@mui/lab/LoadingButton';
import { Nullable } from '../pkg/safecatch/safecatch.type';
import { ViewMessageError } from '../entity/errors.entity';
import { Map } from 'immutable';
import { Link } from 'react-router-dom';

export function ResendPage() {
  const getStatus = useFetch("POST", "/auth/status", StatusResponse)
  const resend = useFetch("POST", "/auth/resend-verification", ResendResponse)

  const [email, setEmail] = useState("")
  const [error, setError] = useState<Nullable<ViewMessageError>>(null)
  const [fieldError, setFieldError] = useState<FieldError>(Map())

  useEffect(() => {
    setError(getStatus.error)
    setFieldError(getStatus.fieldError)
  }, [getStatus.error, getStatus.fieldError])

  useEffect(() => {
    setError(resend.error)
    setFieldError(resend.fieldError)
  }, [resend.error, resend.fieldError])


  useEffect(() => {
    if (getStatus.data?.status == AccountStatus.NOT_VERIFIED) {
      resend.fetch({ email })
    }
  }, [getStatus.data])

  return <Stack width="100%" height="100vh" justifyContent="center">
    <Stack spacing={1} marginX="auto" width="300px">
      <Typography variant="h4" gutterBottom alignSelf="center">Resend Verification</Typography>

      {!error && getStatus.data?.status == AccountStatus.NOT_VERIFIED && resend.data ? <Alert severity="info">{resend.data.message}</Alert> : null}
      {error ? <Alert severity="error">{error.message}</Alert> : null}

      {getStatus.data?.status == AccountStatus.NOT_FOUND ?
        <Alert severity="error">Email is not found. You can <Link to={"/register"}>create a new user</Link></Alert> : null}
      {getStatus.data?.status == AccountStatus.VERIFIED ?
        <Alert severity="error">Email is already verified. Please <Link to={"/login"}>Login</Link></Alert> : null}

      <TextField label="email" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} error={fieldError.has("email")} helperText={fieldError.get("email")} />

      <LoadingButton variant="outlined" loading={getStatus.loading || resend.loading} onClick={() => getStatus.fetch({ email })}>Resend</LoadingButton>
      <Link to={"/login"} style={{ alignSelf: "center" }}>Login</Link>
    </Stack>
  </Stack>
}