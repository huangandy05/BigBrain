import React, { useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import GenericBox from './GenericBox';
import InnerBox from './InnerBox';
import GenericTextfield from './GenericTextfield';
import TextField from '@mui/material/TextField';
import { fileToDataUrl } from '../utils/helpers';
import GenericSelect from './GenericSelect';
import ReactPlayer from 'react-player';
import Alert from '@mui/material/Alert';
import Radio from '@mui/material/Radio';
import { Checkbox } from '@mui/material';

const CreateQuestionContainer = (props) => {
  const token = localStorage.getItem('token');
  const questions = props.questionList;

  // State variables for inputs
  const [questionType, setQuestionType] = useState('single');
  const [questionText, setQuestionText] = useState('');
  const [timeLimit, setTimeLimit] = useState(30);
  const [points, setPoints] = useState(1);
  const [attachmentType, setAttachmentType] = useState('noMedia'); // Set default value to none
  const [attachmentFile, setAttachmentFile] = useState(null);
  // List of answers containing attribute for answer number, text and correct or not
  const [answers, setAnswers] = useState([
    {
      id: 1,
      text: 'Answer 1',
      correct: false,
    },
    {
      id: 2,
      text: 'Answer 2',
      correct: false,
    },
  ]);

  const [alert, setAlert] = React.useState(false);
  const [alertContent, setAlertContent] = React.useState('');

  async function updateGame (qs) {
    const response = await fetch(
      `http://localhost:5005/admin/quiz/${props.gameID}`,
      {
        method: 'PUT',
        body: JSON.stringify({
          questions: qs,
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    if (data.error) {
      alert('Cannot update question');
    }
    props.fetchQuestions();
  }

  function generateQuestionID () {
    let randomID = Math.floor(Math.random() * 10000000);
    // Makes sure random id is not already in use
    while (questions.findIndex((q) => q.questionId === randomID) !== -1) {
      randomID = Math.floor(Math.random() * 10000000);
    }
    return randomID;
  }

  const editQuestion = (e) => {
    e.preventDefault();
    if (!questionText) {
      setAlert('error');
      setAlertContent('Please provide a question');
    } else if (!timeLimit) {
      setAlert('error');
      setAlertContent('Please provide a time limit');
    } else if (!points || points <= 0) {
      setAlert('error');
      setAlertContent('Please provide a valid number of points');
    } else if (attachmentType === 'image' && attachmentFile === null) {
      setAlert('error');
      setAlertContent('Please provide an image');
    } else if (answers.findIndex((answer) => answer.correct === true) === -1) {
      setAlert('error');
      setAlertContent('Please select a correct answer');
    } else {
      const newQuestion = {
        questionId: generateQuestionID(),
        type: questionType,
        text: questionText,
        timeLimit,
        points,
        answer: answers,
        attachmentType,
        attachmentFile,
      };
      const updatedQuestions = [...questions, newQuestion];
      setAlert('success');
      setAlertContent('Question Created');
      updateGame(updatedQuestions);
    }
  };

  const handleCorrectAnswerChange = (id) => {
    const updatedAnswers = [...answers];
    if (questionType === 'single') {
      updatedAnswers.forEach((answer) => {
        if (answer.id === id) {
          answer.correct = true;
        } else {
          answer.correct = false;
        }
      });
    } else {
      updatedAnswers[id - 1].correct = !updatedAnswers[id - 1].correct;
    }
    setAnswers(updatedAnswers);
  };

  const handleAnswerChange = (e, id) => {
    const updatedAnswers = [...answers];
    const answerIndex = updatedAnswers.findIndex((answer) => answer.id === id);
    updatedAnswers[answerIndex].text = e.target.value;
    setAnswers(updatedAnswers);
  };

  // Function to add more answers
  const handleAddAnswer = () => {
    if (answers.length < 6) {
      const newid = answers.length + 1;
      setAnswers([
        ...answers,
        {
          id: newid,
          text: `Answer ${newid}`,
          correct: false,
        },
      ]);
    }
  };

  const handleRemoveAnswer = () => {
    if (answers.length > 2) {
      setAnswers(answers.slice(0, -1));
    }
  };

  const handleImageAttachment = async (imgFile) => {
    try {
      const img = await fileToDataUrl(imgFile);
      setAttachmentFile(img);
    } catch (error) {
      setAlertContent('Please upload a valid image in png, jpg or jpeg form');
      setAlert('error');
    }
  };

  function handleVideoAttachment (url) {
    setAttachmentFile(url);

    if (
      !/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/.test(
        url
      )
    ) {
      setAlert('error');
      setAlertContent('Please provide a valid Youtube URL');
    }
  }

  return (
    <GenericBox>
      <InnerBox>
        <h1>Create Question</h1>
        <GenericTextfield
          label="Question"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
        />
        <GenericTextfield
          label="Time limit (sec)"
          type="number"
          value={timeLimit}
          onChange={(e) => setTimeLimit(e.target.value)}
        />
        <GenericTextfield
          label="Points"
          type="number"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
        />
        <InputLabel htmlFor="attachment-type-select">
          Attachment Type
        </InputLabel>
        <GenericSelect
          value={attachmentType}
          onChange={(e) =>
            setAttachmentType(e.target.value) && setAttachmentFile('')
          }
        >
          <MenuItem value="noMedia">No Image or Video</MenuItem>
          <MenuItem value="image">Image</MenuItem>
          <MenuItem value="video">Video</MenuItem>
        </GenericSelect>
        {attachmentType === 'noMedia'
          ? (
          <></>
            )
          : attachmentType === 'image'
            ? (
          <>
            <input
              type="file"
              onChange={(e) => handleImageAttachment(e.target.files[0])}
            />
            <img width={340} src={attachmentFile} />
          </>
              )
            : (
          <>
            <GenericTextfield
              label="Youtube url"
              value={attachmentFile}
              onChange={(e) => handleVideoAttachment(e.target.value)}
            />
            {/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/.test(
              attachmentFile
            )
              ? (
              <ReactPlayer
                width={340}
                url={attachmentFile}
                controls={true}
              />
                )
              : (
              <></>
                )}
          </>
              )}

        <InputLabel htmlFor="question-type-select">Question Type</InputLabel>
        <GenericSelect
          label="Question Type"
          value={questionType}
          onChange={(e) => setQuestionType(e.target.value)}
        >
          <MenuItem value="single">Single Choice</MenuItem>
          <MenuItem value="multiple">Multiple Choice</MenuItem>
        </GenericSelect>
        {answers.map((answer) => (
          <div key={answer.id}>
            <TextField
              type="text"
              value={answer.text}
              onChange={(e) => handleAnswerChange(e, answer.id)}
            />
            {questionType === 'single'
              ? (
              <Radio
                checked={answer.correct}
                onChange={() => handleCorrectAnswerChange(answer.id)}
              />
                )
              : (
              <Checkbox
                checked={answer.correct}
                onChange={() => handleCorrectAnswerChange(answer.id)}
              />
                )}
          </div>
        ))}
        {answers.length < 6 && (
          <Button type="button" onClick={handleAddAnswer}>
            Add Answer
          </Button>
        )}
        {answers.length > 2 && (
          <Button type="button" onClick={handleRemoveAnswer}>
            Remove Answer
          </Button>
        )}
        {alert ? <Alert severity={alert}>{alertContent}</Alert> : <></>}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={(e) => editQuestion(e)}
        >
          Create Question
        </Button>
      </InnerBox>
    </GenericBox>
  );
};

export default CreateQuestionContainer;
