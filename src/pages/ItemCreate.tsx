import { Alert, Button, Snackbar, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useFetch } from '../hooks/usefetch.hooks';
import { CreateItemResponse } from '../entity/item.entity';
import { useNavigate } from 'react-router-dom';

function ItemCreate() {
  const create = useFetch("POST", "/item/create", CreateItemResponse, { useAuth: true })
  const [name, setName] = useState("")
  const [startPrice, setStartPrice] = useState(0)
  const [timeWindow, setTimeWindow] = useState(0)

  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (create.data == null) return

    setName("")
    setStartPrice(0)
    setTimeWindow(0)
    setSnackbarOpen(true)

  }, [create.data])

  return (
    <Stack padding={8} spacing={2} >
      <Typography variant='h4' gutterBottom={true}>Create New Item</Typography>
      {create.error ? <Alert severity="error">{create.error.message}</Alert> : null}
      <TextField label="Name" variant="outlined" value={name} onChange={(e) => setName(e.target.value)} error={create.fieldError.has("name")} helperText={create.fieldError.get("name")} InputLabelProps={{ shrink: name != "" }} />
      <TextField label="Start Price ($)" variant="outlined" value={startPrice} onChange={(e) => e.target.value == "" || /^[0-9\b]+$/.test(e.target.value) ? setStartPrice(+e.target.value) : null} type="tel" error={create.fieldError.has("startPrice")} helperText={create.fieldError.get("startPrice")} />
      <TextField label="Time Window (seconds)" variant="outlined" value={timeWindow} onChange={(e) => e.target.value == "" || /^[0-9\b]+$/.test(e.target.value) ? setTimeWindow(+e.target.value) : null} type="tel" error={create.fieldError.has("timeWindow")} helperText={create.fieldError.get("timeWindow")} />
      <Stack direction="row" justifyContent="end" spacing={2}>
        <Button variant="outlined" onClick={() => navigate(1)}>Cancel</Button>
        <Button variant="outlined" onClick={() => create.fetch({ name, startPrice, timeWindow })}>Create</Button>
      </Stack>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          This is a success message!
        </Alert>
      </Snackbar>
    </Stack >
  )
}

export default ItemCreate