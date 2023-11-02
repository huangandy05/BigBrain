import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import GenericBox from './GenericBox';

const StopButtonPopup = ({ currQuizID, sessionID, open, onClose }) => {
  const navigate = useNavigate();

  const handleGoToResults = () => {
    navigate(`/GameControl/${currQuizID}/${sessionID}`);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <GenericBox>
          <h1>
            Would you like to view results?
          </h1>
          <DialogActions>
            <Button variant="contained" onClick={handleGoToResults}>
              Yes
            </Button>
            <Button variant="contained" onClick={onClose}>
              No
            </Button>
          </DialogActions>
        </GenericBox>
      </DialogTitle>
    </Dialog>
  );
};

export default StopButtonPopup;
