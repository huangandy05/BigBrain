import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useInterval } from '../utils/helpers';
import LoadingComponent from '../components/PlayGameComponents/LoadingComponent';
import defaultThumbnail from '../assets/defaultThumbnail.jpg';
import ReactPlayer from 'react-player';
import PlayerResults from '../components/PlayGameComponents/PlayerResults';
import { styled } from '@mui/material/styles';
import { Container, Typography } from '@mui/material';
import GenericBox from '../components/GenericBox';
import InnerBox from '../components/InnerBox';
import AnswerPage from '../components/PlayGameComponents/AnswerPage';

const AnswerButton = ({
  answer,
  selectedAnswers,
  setSelectedAnswers,
  questionType,
}) => {
  const isSelected = selectedAnswers.includes(answer.id);

  const handleAnswerClick = () => {
    if (isSelected) {
      setSelectedAnswers(selectedAnswers.filter((id) => id !== answer.id));
    } else {
      // Can only select one asnwer
      if (questionType === 'single') {
        setSelectedAnswers([answer.id]);
      } else {
        setSelectedAnswers([...selectedAnswers, answer.id]);
      }
    }
  };

  const AnswerButton = styled(Container)({
    padding: '10px',
    margin: '5px',
    backgroundColor: isSelected ? 'green' : 'white',
    color: isSelected ? 'white' : 'black',
    boxShadow:
      '0 12px 28px 0 rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.5)',
    borderRadius: '35px',
    cursor: 'pointer',
    width: '600px',
    '@media(max-width: 700px)': {
      width: '300px',
    },
    wordBreak: 'break-all',
  });

  return <AnswerButton onClick={handleAnswerClick}>{answer.text}</AnswerButton>;
};

const PlayGame = () => {
  // Game States
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(10000);

  // Player and Game info
  const playerID = useParams().playerID;

  // Question Data
  const [question, setQuestion] = useState();
  const [questionType, setQuestionType] = useState();
  const [answers, setAnswers] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [mediaType, setMediaType] = useState();
  const [mediaFile, setMediaFile] = useState();

  // Make a periodic fetch to see if game has started
  useInterval(async () => {
    // Make fetch to get status of game -> has game started
    if (!gameEnded) {
      fetch(`http://localhost:5005/play/${playerID}/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            if (data.error === 'Session ID is not an active session') {
              setGameEnded(true);
            } else {
              setGameEnded(false);
              setGameStarted(false);
            }
          } else {
            setGameStarted(data.started);
          }
        });
    }
  }, [1000]);

  // Make fetch for question
  useInterval(async () => {
    // Make fetch to get status of game -> has game started
    if (gameStarted && !gameEnded) {
      const response = await fetch(
        `http://localhost:5005/play/${playerID}/question`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      if (data.error) {
        setGameEnded(true);
      } else {
        if (question !== data.question.text) {
          setSelectedAnswers([]);
        }
        setQuestion(data.question.text);
        setQuestionType(data.question.type);
        setAnswers(data.question.answer);
        setMediaType(data.question.attachmentType);
        setMediaFile(data.question.attachmentFile);
        // Update Remaining time
        calcRemainingTime(
          data.question.timeLimit,
          data.question.isoTimeLastQuestionStarted
        );
      }
    }
  }, [1000]);

  const calcRemainingTime = (totalTime, time) => {
    const diff = Date.now() - Date.parse(time);
    setTimeRemaining(totalTime - Math.floor(diff / 1000));
  };

  // Check if Time is up -> will need to show answers
  useEffect(() => {
    if (timeRemaining < 1) {
      setIsTimeUp(true);
      // Make a fetch to get the answer
      fetchAnswers();
    } else {
      setIsTimeUp(false);
    }
  }, [timeRemaining]);

  const fetchAnswers = () => {
    fetch(`http://localhost:5005/play/${playerID}/answer`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setSelectedAnswers([]);
      });
  };

  // Submit Answers whenever answers have been changed (only if time is not up..)
  useEffect(async () => {
    if (!isTimeUp) {
      await fetch(`http://localhost:5005/play/${playerID}/answer`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answerIds: selectedAnswers }),
      });
    }
  }, [selectedAnswers]);

  return (
    <GenericBox marginBottom={5}>
      {!gameStarted
        ? (
          <>
        <LoadingComponent />
          </>
          )
        : gameEnded
          ? (
        <PlayerResults />
            )
          : isTimeUp
            ? (
          <AnswerPage answers={answers} />
              )
            : (
        <InnerBox sx={{ backgroundColor: 'transparent', boxShadow: '0' }}>
          <h1>{question}</h1>

          <p>Time left: <Typography color={'purple'}>{timeRemaining}</Typography></p>

          {mediaType === 'noMedia'
            ? (
            <>
              <img src={defaultThumbnail} width={350} />
            </>
              )
            : (
            <>
              {mediaType === 'image'
                ? (
                <img src={mediaFile} width={350}></img>
                  )
                : (
                <ReactPlayer url={mediaFile} controls={true} width={350} />
                  )}
            </>
              )}
          {questionType === 'single'
            ? (
            <div><h3>Select one answer</h3></div>
              )
            : (
            <div><Typography fontFamily={'cursive'} fontStyle={'italic'} >Multiple choice</Typography></div>
              )}
          {answers.map((answer) => (
            <AnswerButton
              key={answer.id}
              answer={answer}
              selectedAnswers={selectedAnswers}
              setSelectedAnswers={setSelectedAnswers}
              questionType={questionType}
            />
          ))}
        </InnerBox>
              )}
    </GenericBox>
  );
};

export default PlayGame;
