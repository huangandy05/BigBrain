import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LogoutButton from './LogoutButton';

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar sx={{ bgcolor: 'rgb(25,118,210)' }}>
        <Typography variant="h6" component="div" sx={{ color: 'white' }}>
          BigBrain
        </Typography>
        <Button sx={{ color: 'white', flexGrow: 1 }} onClick={() => navigate('/dashboard')}>Dashboard</Button>
        <LogoutButton/>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
