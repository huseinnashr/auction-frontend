import { Alert, CircularProgress, Snackbar, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useFetch } from '../hooks/usefetch.hooks';
import { DepositResponse, GetBalanceResponse } from '../entity/user.entity';
import { LoadingButton } from '@mui/lab';

function Deposit() {
  const balance = useFetch("GET", "/user/balance", GetBalanceResponse, { useAuth: true })
  const deposit = useFetch("POST", "/user/deposit", DepositResponse, { useAuth: true })
  const [amount, setAmount] = useState(0)

  const [bSnackbarOpen, setBSnackbarOpen] = useState(false)
  const [dSnackbarOpen, setDSnackbarOpen] = useState(false)

  useEffect(() => {
    balance.fetch(null)
  }, [])

  useEffect(() => {
    if (deposit.data == null) return

    balance.fetch(null)
    setAmount(0)
  }, [deposit.data])

  useEffect(() => { if (balance.error) { setBSnackbarOpen(true) } }, [balance.error])
  useEffect(() => { if (deposit.data) { setDSnackbarOpen(true) } }, [deposit.data])

  return (
    <Stack padding={8} spacing={2} >
      <Typography variant='h4' gutterBottom={true}>Deposit</Typography>
      <Typography variant="h5">Current Balance: {balance.loading ? <CircularProgress size={16} /> : (balance.data ? "$" + balance.data.balance : "N/A")}</Typography>
      {deposit.error ? <Alert severity="error">{deposit.error.message}</Alert> : null}
      <TextField label="Amount ($)" variant="outlined" value={amount} onChange={(e) => e.target.value == "" || /^[0-9\b]+$/.test(e.target.value) ? setAmount(+e.target.value) : null} type="tel" error={deposit.fieldError.has("amount")} helperText={deposit.fieldError.get("amount")} />
      <Stack direction="row" justifyContent="end">
        <LoadingButton variant="outlined" loading={deposit.loading} onClick={() => deposit.fetch({ amount })}>Deposit</LoadingButton>
      </Stack>

      <Snackbar open={bSnackbarOpen} autoHideDuration={6000} onClose={() => setBSnackbarOpen(false)} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity="error" onClose={() => setBSnackbarOpen(false)} sx={{ width: '100%' }}>
          Failed to load balance. {balance.error?.message}
        </Alert>
      </Snackbar>

      <Snackbar open={dSnackbarOpen} autoHideDuration={6000} onClose={() => setDSnackbarOpen(false)} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity="success" onClose={() => setDSnackbarOpen(false)} sx={{ width: '100%' }}>
          Deposit success
        </Alert>
      </Snackbar>
    </Stack>
  )
}

export default Deposit