import { Stack, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export const NavbarView = () => {
  return (
    <Stack>
      <Navbar />
      <Outlet />
    </Stack>
  )
}