import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import EditQuestionContainer from '../components/EditQuestionContainer';
import CreateQuestionContainer from '../components/CreateQuestionContainer';
import EditGameThumbnail from '../components/EditGameThumbnail';

import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import IconButton from '@mui/material/IconButton';
import EditGameName from '../components/EditGameName';
import { Drawer, List, ListItem, ListItemText } from '@material-ui/core';
import GenericBox from '../components/GenericBox';
import { Button, Toolbar } from '@mui/material';
import NavBar from '../components/NavBar';
import MenuIcon from '@mui/icons-material/Menu';

const EditGame = () => {
  const navigate = useNavigate();
  const gameID = useParams().gameID;
  const token = localStorage.getItem('token');
  const [currQuestionIndex, setCurrQuestionIndex] = useState(0);
  const [isCreateNew, setIsCreateNew] = useState(true);

  const [thumbnail, setThumbnail] = useState('');
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([]);

  // Fetch the questions
  async function fetchQuestions () {
    const response = await fetch(`http://localhost:5005/admin/quiz/${gameID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    setQuestions(data.questions);
    setTitle(data.name);
    setThumbnail(data.thumbnail);
  }

  async function handleDeleteQuestion (qId) {
    if (qId === questions[currQuestionIndex].questionId) {
      setIsCreateNew(true);
      navigate(`/editGame/${gameID}`);
      setCurrQuestionIndex(0);
    }
    const removedQuestion = questions.findIndex(
      (item) => item.questionId === qId
    );
    if (removedQuestion !== -1) {
      questions.splice(removedQuestion, 1);
    }
    await fetch(`http://localhost:5005/admin/quiz/${gameID}`, {
      method: 'PUT',
      body: JSON.stringify({
        questions,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    fetchQuestions();
  }

  // Load
  useEffect(() => {
    fetchQuestions();
  }, []);
  // Function to add a new question

  const QuestionList = () => {
    return (
      <List>
        {questions.map((q, index) => (
          <Toolbar key={index}>
            <Link to={`/editGame/${gameID}/${q.questionId}`}>
              <ListItem onClick={() => showEditQuestion(index)}>
                <ListItemText primary={`Question ${index + 1}`} />
              </ListItem>
            </Link>
            <IconButton
              aria-label="delete"
              onClick={() => handleDeleteQuestion(q.questionId)}
            >
              <DeleteTwoToneIcon />
            </IconButton>
          </Toolbar>
        ))}
        <ListItem>
          <Button
            sx={{
              fontSize: '15px',
            }}
            variant="contained"
            onClick={() => {
              setIsCreateNew(true);
              navigate(`/editGame/${gameID}`);
            }}
          >
            New question
          </Button>
        </ListItem>
      </List>
    );
  };

  const QuestionsNavBar = () => {
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
      setMobileOpen(!mobileOpen);
    };

    return (
      <>
        <Toolbar sx={{ alignSelf: 'flex-start' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
          >
            <MenuIcon fontSize='large' sx={{ color: 'rgb(25,118,210)' }}/>
            Questions
          </IconButton>
        </Toolbar>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
        >
          <QuestionList />
        </Drawer>
      </>
    );
  };

  const showEditQuestion = (index) => {
    setIsCreateNew(false);
    setCurrQuestionIndex(index);
  };

  const AddOrEditQuestion = () => {
    // Show Create new Question or Edit question
    return isCreateNew
      ? (
      <CreateQuestionContainer
        questionList={questions}
        gameID={gameID}
        fetchQuestions={fetchQuestions}
      />
        )
      : (
      <EditQuestionContainer
        index={currQuestionIndex}
        questionList={questions}
        gameID={gameID}
      />
        );
  };

  return (
    <GenericBox>
      <NavBar />
      <QuestionsNavBar />
      <EditGameThumbnail thumbnail={thumbnail} gameID={gameID} />
      <EditGameName title={title} gameID={gameID} />
      <AddOrEditQuestion />
    </GenericBox>
  );
};

export default EditGame;
