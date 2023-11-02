import React, { useState } from 'react';
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { useNavigate, useParams } from 'react-router-dom';
import InnerBox from '../components/InnerBox';
import GenericTextfield from '../components/GenericTextfield';
import GenericBox from '../components/GenericBox';
import IntroScreenButton from '../components/IntroScreenButton';

const PlayJoin = () => {
  const urlSession = useParams().sessionID;
  const [sessionId, setSessionId] = useState(urlSession);
  const [isInvalidSessionId, setIsInvalidSessionId] = useState(false);
  const [name, setName] = useState('');
  const [isNameEmpty, setIsNameEmpty] = useState(false);
  const navigate = useNavigate();

  const handleSessionIdChange = (event) => {
    setSessionId(event.target.value);
    setIsInvalidSessionId(false);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
    setIsNameEmpty(false);
  };

  const handleJoinClick = () => {
    // Make a fetch call to see if joined
    fetch(`http://localhost:5005/play/join/${sessionId}`, {
      method: 'POST',
      body: JSON.stringify({
        name,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setIsInvalidSessionId(true);
        } else if (name === '') {
          setIsNameEmpty(true);
        } else if (sessionId === '') {
          setIsInvalidSessionId(true);
        } else {
          navigate(`/playGame/${sessionId}/${data.playerId}`);
        }
      });
  };

  const handleSnackbarClose = () => {
    setIsInvalidSessionId(false);
    setIsNameEmpty(false);
  };

  return (
    <GenericBox>
      <InnerBox>
        <h1>Join a BigBrain game</h1>
        <GenericTextfield
          label="Session ID"
          value={sessionId}
          onChange={handleSessionIdChange}
        />
        <GenericTextfield
          label="Name"
          value={name}
          onChange={handleNameChange}
        />
        <IntroScreenButton variant="contained" onClick={handleJoinClick}>
          Join
        </IntroScreenButton>
        {isInvalidSessionId && (
          <Snackbar
            open={isInvalidSessionId}
            autoHideDuration={3000}
            onClose={handleSnackbarClose}
          >
            <MuiAlert elevation={6} variant="filled" severity="error">
              Invalid session ID.
            </MuiAlert>
          </Snackbar>
        )}
        {isNameEmpty && (
          <Snackbar
            open={isNameEmpty}
            autoHideDuration={3000}
            onClose={handleSnackbarClose}
          >
            <MuiAlert elevation={6} variant="filled" severity="error">
              Please provide a name.
            </MuiAlert>
          </Snackbar>
        )}
      </InnerBox>
    </GenericBox>
  );
};

export default PlayJoin;
