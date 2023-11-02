import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  async function logout () {
    const response = await fetch(
      new URL('admin/auth/logout', 'http://localhost:5005/'),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    const data = await response.json();
    if (data.error) {
      alert('Not logged in');
    } else {
      localStorage.setItem('token', null);
    }
    navigate('/login');
  }
  return <Button sx={{ color: 'white', float: 'right' }} onClick={logout}>Logout</Button>;
};

export default LogoutButton;
