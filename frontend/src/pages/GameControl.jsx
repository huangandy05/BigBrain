import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import Results from '../components/Results';
import GenericBox from '../components/GenericBox';
import NavBar from '../components/NavBar';
import InnerBox from '../components/InnerBox';
import { Typography } from '@mui/material';

const GameControl = () => {
  const gameID = useParams().gameID;
  const sessionID = useParams().sessionID;
  const token = localStorage.getItem('token');

  const [isActive, setIsActive] = useState(true);
  const [position, setPosition] = useState();

  const fetchSessionStatus = async () => {
    const response = await fetch(
      `http://localhost:5005/admin/session/${sessionID}/status`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    setIsActive(data.results.active);
    setPosition(data.results.position);
  };

  const advanceQuestion = async () => {
    const response = await fetch(
      `http://localhost:5005/admin/quiz/${gameID}/advance`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else {
      fetchSessionStatus();
    }
  };

  const handleStopGame = () => {
    fetch(`http://localhost:5005/admin/quiz/${gameID}/end`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    setIsActive(false);
  };

  useEffect(() => {
    fetchSessionStatus();
  }, []);

  return (
    <GenericBox>
      <NavBar />
      <InnerBox>
        {isActive
          ? (
          <>
            <h1>Game Controls</h1>
            <Typography fontSize={'20px'}>
              Position:
              {position === -1 ? ' Lobby' : ` Question ${parseInt(position) + 1}`}
            </Typography>
            <Button
              sx={{ margin: '10px' }}
              variant="contained"
              onClick={advanceQuestion}
            >
              Next Question
            </Button>
            <Button
              color="error"
              sx={{ margin: '10px' }}
              variant="contained"
              onClick={handleStopGame}
            >
              Stop Game
            </Button>
          </>
            )
          : (
          <Results sessionID={sessionID} />
            )}
      </InnerBox>
    </GenericBox>
  );
};

export default GameControl;
