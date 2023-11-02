import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import GenericBox from '../GenericBox';
import InnerBox from '../InnerBox';
import { Container } from '@mui/material';

const correctStyle = {
  backgroundColor: 'lightgreen',
};

const incorrectStyle = {
  backgroundColor: 'lightcoral',
};

const AnswerPage = ({ answers }) => {
  const [correctAnswerIds, setCorrectAnswerIds] = useState([]);
  const playerID = useParams().playerID;

  // Fetch answer Ids
  const fetchAnswerIDs = () => {
    fetch(`http://localhost:5005/play/${playerID}/answer`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCorrectAnswerIds(data.answerIds);
      });
  };

  // Fetch answers when this page loads
  useEffect(() => {
    fetchAnswerIDs();
  }, []);

  return (
    <GenericBox>
      <InnerBox>
        <h1> The answer was...</h1>
        {answers.map((answer) => (
          <GenericBox key={answer.id}>
            <Container
              width={'350px'}
              sx={{
                padding: '5px',
                margin: '5px 0',
                width: '350px',
                borderRadius: '20px',
                ...(correctAnswerIds.includes(answer.id)
                  ? correctStyle
                  : incorrectStyle),
              }}
            >
              {answer.text}
              {correctAnswerIds.includes(answer.id)
                ? (
                <CheckIcon
                  sx={{ verticalAlign: 'bottom', marginLeft: '10px' }}
                />
                  )
                : (
                <CloseIcon
                  sx={{ verticalAlign: 'bottom', marginLeft: '10px' }}
                />
                  )}
            </Container>
          </GenericBox>
        ))}
      </InnerBox>
    </GenericBox>
  );
};

export default AnswerPage;
