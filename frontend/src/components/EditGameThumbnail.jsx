import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import { fileToDataUrl } from '../utils/helpers';
import defaultThumbnail from '../assets/defaultThumbnail.jpg';
import GenericBox from './GenericBox';

const EditGameThumbnail = ({ thumbnail, gameID }) => {
  const [openEdit, setOpenEdit] = useState(false);
  const [thumbnailImage, setThumbnailImage] = useState('');
  const [inputImage, setInputImage] = useState();
  const token = localStorage.getItem('token');

  const handleSaveClick = async () => {
    if (inputImage) {
      const inputImageBase64 = await fileToDataUrl(inputImage);
      setOpenEdit(false);
      setThumbnailImage(inputImageBase64);

      fetch(`http://localhost:5005/admin/quiz/${gameID}`, {
        method: 'PUT',
        body: JSON.stringify({
          thumbnail: inputImageBase64,
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    }
  };

  useEffect(() => {
    if (thumbnail !== null) {
      setThumbnailImage(thumbnail);
    } else {
      setThumbnailImage(defaultThumbnail);
    }
    // Update the header text when the title prop changes
  }, [thumbnail]);

  return (
    <GenericBox>
      <IconButton color="inherit" onClick={() => setOpenEdit(true)}>
        <img
          src={thumbnailImage}
          width={300}
        />
        <EditIcon />
      </IconButton>
      <Dialog open={openEdit}>
        <DialogContent>
          <DialogTitle>Update thumbnail</DialogTitle>
          <input
            type="file"
            onChange={(e) => setInputImage(e.target.files[0])}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button onClick={handleSaveClick}>Save</Button>
        </DialogActions>
      </Dialog>
    </GenericBox>
  );
};

export default EditGameThumbnail;
