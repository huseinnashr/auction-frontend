import { Button, Modal, Paper, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import Item from '../components/Item';
import { ItemEntity } from '../entity/item.entity';

function Home() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <Stack padding={8}>
      <Typography variant='h4' gutterBottom={true}>Home Page</Typography>
      <Grid2 columnSpacing={2} container>
        <Grid2 xs={4}><Item data={new ItemEntity()} button={<Button onClick={() => setModalOpen(true)}>Bid</Button>} /></Grid2>
        <Grid2 xs={4}><Item data={new ItemEntity()} button={<Button onClick={() => setModalOpen(true)}>Bid</Button>} /></Grid2>
        <Grid2 xs={4}><Item data={new ItemEntity()} button={<Button onClick={() => setModalOpen(true)}>Bid</Button>} /></Grid2>
      </Grid2>
      <Modal
        keepMounted
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <Stack spacing={1} marginX="auto" width="500px" height="100vh" justifyContent="center">
          <Paper elevation={2}>
            <Stack margin={2} spacing={1}>
              <Typography variant="h4" gutterBottom={true}>Bid Item Name</Typography>
              <TextField id="outlined-basic" label="Bid Price ($)" variant="outlined" type='number' />
              <Stack direction="row" justifyContent="end" spacing={1}>
                <Button variant="outlined" onClick={() => setModalOpen(false)}>Cancel</Button>
                <Button variant="outlined">Submit</Button>
              </Stack>
            </Stack>
          </Paper>
        </Stack>
      </Modal>
    </Stack>
  )
}

export default Home
