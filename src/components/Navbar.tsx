import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import { Context } from '../context/index.context';

function Navbar() {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const { auth } = React.useContext(Context)

  return (
    <AppBar position='sticky'>
      <Toolbar disableGutters >
        <Button color='inherit' onClick={() => navigate('/')}>
          <Typography variant="h6" noWrap component="a" mx={2} display='block' sx={{
            fontFamily: 'monospace', fontWeight: 700,
            letterSpacing: '.3rem', color: 'inherit', textDecoration: 'none',
          }}> JITERA
          </Typography>
        </Button>

        <Box sx={{ flexGrow: 1, display: 'flex' }}>
          <Button key="created" color="inherit" onClick={() => navigate('/item/created')}>Created</Button>
          <Button key="bidded" color="inherit" onClick={() => navigate('/user/bid/all')}>Bidded</Button>
        </Box>
        <Box flexGrow={0} mx={2}>
          <Tooltip title="Open settings">
            <Button color="inherit" endIcon={<Avatar sx={{ width: 32, height: 32 }} />}
              sx={{ textTransform: "lowercase" }} onClick={(e) => setAnchorElUser(e.currentTarget)}>
              {auth.data?.user.username}
            </Button>
          </Tooltip>
          <Menu anchorEl={anchorElUser} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} keepMounted
            sx={{ mt: 1 }} open={Boolean(anchorElUser)} onClose={() => setAnchorElUser(null)} onClick={() => setAnchorElUser(null)}
          >
            <MenuItem onClick={() => navigate('/item/create')}>
              <Typography textAlign="center">Create New Item</Typography>
            </MenuItem>
            <MenuItem onClick={() => navigate('/deposit')} >
              <Typography textAlign="center">Deposit</Typography>
            </MenuItem>
            <MenuItem onClick={() => auth.logout()}>
              <Typography textAlign="center">Logout</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar >
  );
}
export default Navbar;