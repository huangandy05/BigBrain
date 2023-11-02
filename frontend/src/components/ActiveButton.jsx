import React from 'react';
import Button from '@mui/material/Button';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked'; // Material-UI icon for the red radio button

const ActiveButton = () => {
  return (
    <Button
      variant='outlined'
      color='primary'
      endIcon={<RadioButtonCheckedIcon color='red'/>}
    >
      Active Session
    </Button>
  );
};

export default ActiveButton;
