import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import { Typography } from '@mui/material';
import InnerBox from './InnerBox';

const EditGameName = ({ title, gameID }) => {
  const [openEdit, setOpenEdit] = useState(false);
  const [headerText, setHeaderText] = useState('');
  const [inputText, setInputText] = useState('');
  const token = localStorage.getItem('token');

  const handleSaveClick = () => {
    if (inputText) {
      setOpenEdit(false);
      setHeaderText(inputText);
      fetch(`http://localhost:5005/admin/quiz/${gameID}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: inputText,
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    }
  };

  useEffect(() => {
    // Update the header text when the title prop changes
    setHeaderText(title);
    setInputText(title);
  }, [title]);

  return (
    <>
      <InnerBox>
        <IconButton color="inherit" onClick={() => setOpenEdit(true)}>
          <Typography variant='h3' sx={{ wordBreak: 'break-all' }}>{headerText}</Typography>
          <EditIcon />
        </IconButton>
      </InnerBox>
      <Dialog open={openEdit}>
        <DialogContent>
          <TextField
            autoFocus
            label="Quiz title"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button onClick={handleSaveClick}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditGameName;
