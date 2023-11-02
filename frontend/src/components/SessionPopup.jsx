import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import IconButton from '@mui/icons-material/Link';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import GenericBox from './GenericBox';

const SessionPopup = ({ currQuizID, sessionID, open, onClose }) => {
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const navigate = useNavigate();

  // Function to handle click event of Copy Link button
  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `http://localhost:3000/playjoin/${sessionID}`
    );
    setIsLinkCopied(true);
  };

  // Function to handle closing of Snackbar
  const handleCloseSnackbar = () => {
    setIsLinkCopied(false);
  };

  const handleGoToGameControl = () => {
    navigate(`/GameControl/${currQuizID}/${sessionID}`);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <GenericBox>
          <h1>
            New Session ID:
            <br />
            {sessionID}{' '}
            <IconButton
              onClick={handleCopyLink}
              color="primary"
              aria-label="copy-link"
            >
              <FileCopyIcon />
            </IconButton>
          </h1>
          <DialogActions>
            <Button variant="contained" onClick={handleGoToGameControl}>
              Game Controls
            </Button>
            <Button variant="contained" onClick={onClose}>
              Close
            </Button>
          </DialogActions>
        </GenericBox>
      </DialogTitle>
      <DialogContent>
        <Snackbar
          open={isLinkCopied}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            severity="success"
            onClose={handleCloseSnackbar}
          >
            Link Copied!
          </MuiAlert>
        </Snackbar>
      </DialogContent>
    </Dialog>
  );
};

export default SessionPopup;
