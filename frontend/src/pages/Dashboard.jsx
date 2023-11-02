import React from 'react';
import { useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import GenericBox from '../components/GenericBox';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import QuizIcon from '@mui/icons-material/Quiz';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { styled } from '@mui/material/styles';
import { Button, Container, IconButton, InputLabel } from '@mui/material';
import ActiveButton from '../components/ActiveButton';
import SessionPopup from '../components/SessionPopup';
import QuizCard from '../components/QuizCard';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import PlayCircleFilledWhiteTwoToneIcon from '@mui/icons-material/PlayCircleFilledWhiteTwoTone';
import StopCircleTwoToneIcon from '@mui/icons-material/StopCircleTwoTone';
import UploadFileTwoToneIcon from '@mui/icons-material/UploadFileTwoTone';

// image from https://www.freepik.com/free-vector/question-mark-sign-brush-stroke-trash-style-typography-vector_
// 18722294.htm#query=question%20mark&position=2&from_view=keyword&track=ais
import defaultThumbnail from '../assets/defaultThumbnail.jpg';
import NavBar from '../components/NavBar';
import InnerBox from '../components/InnerBox';
import GenericTextfield from '../components/GenericTextfield';
import StopButtonPopup from '../components/StopButtonPopup';

const Dashboard = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const [games, setGames] = React.useState([]);
  const [newGameName, setNewGameName] = React.useState('');
  const [isSessionPopupOpen, setIsSessionPopupOpen] = React.useState(false); // State to manage the visibility of the popup
  const [popupSessionId, setPopupSessionId] = React.useState('');
  const [currQuizID, setCurrQuizID] = React.useState('');
  const [isStopPopupOpen, setIsStopPopupOpen] = React.useState(false);

  // Function to handle opening the popup
  async function handleOpenPopup (gameId) {
    const response = await fetch(`http://localhost:5005/admin/quiz/${gameId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setPopupSessionId(data.active);
    setCurrQuizID(gameId);
    setIsSessionPopupOpen(true);
  }

  const handleCloseStopPopup = () => {
    setPopupSessionId('');
    setCurrQuizID('');
    setIsStopPopupOpen(false);
  };

  // Function to handle closing the popup
  const handleCloseSessionPopup = () => {
    setPopupSessionId('');
    setCurrQuizID('');
    setIsSessionPopupOpen(false);
  };

  // Taken from our LurkforWork changes iso date to DD/MM form
  function isoToNormalDate (date) {
    return `${date.substring(8, 10)}/${date.substring(5, 7)}`;
  }

  // Function to fetch all required game information
  async function fetchGames () {
    const response = await fetch('http://localhost:5005/admin/quiz', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    // Put all the games data into games
    const quizzes = data.quizzes;

    Promise.all(quizzes.map((q) => getGameData(q.id))).then((response) => {
      const newGames = response.map((g) => {
        return {
          id: g.id,
          thumbnail: g.thumbnail,
          title: g.name,
          createdAt: g.createdAt,
          numQuestions: g.questions.length,
          totalTime: getTotalGameTime(g.questions),
          active: g.active,
        };
      });
      setGames(newGames);
    });
  }

  // Helper function to get cumulative game time
  const getTotalGameTime = (questions) => {
    let cumTime = 0;
    questions.map((q) => (cumTime += parseInt(q.timeLimit)));
    return cumTime;
  };

  // Function to fetch single game data, returns a promise
  async function getGameData (qId) {
    const response = await fetch(`http://localhost:5005/admin/quiz/${qId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    data.id = qId;
    return data;
  }

  const QuizStatStack = styled(Stack)(() => ({
    flexDirection: 'row',
    alignItems: 'center',
    wordBreak: 'break-word',
    maxWidth: '105px',
  }));

  // Function to display games
  function DisplayGames () {
    const sortedGames = [...games].sort((a, b) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
    const gameContainers = sortedGames.map((g) => {
      const [startStopButton, setStartStopButton] = React.useState(
        g.active ? 'Stop' : 'Start'
      );

      async function handleStartStopButton (quizId) {
        if (startStopButton === 'Start') {
          setStartStopButton('Stop');
          const response = await fetch(
            `http://localhost:5005/admin/quiz/${quizId}/start`,
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
            alert('Invalid quiz id');
          } else {
            handleOpenPopup(quizId);
          }
        } else {
          setStartStopButton('Start');
          const response = await fetch(
            `http://localhost:5005/admin/quiz/${quizId}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await response.json();
          setPopupSessionId(data.active);
          setCurrQuizID(quizId);
          setIsStopPopupOpen(true);

          await fetch(`http://localhost:5005/admin/quiz/${quizId}/end`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
        }
      }

      let thumbnail;
      g.thumbnail ? (thumbnail = g.thumbnail) : (thumbnail = defaultThumbnail);
      return (
        <QuizCard key={g.id}>
          <img src={thumbnail} width={80} height={80}></img>
          <Container sx={{ flex: '1', wordBreak: 'break-word' }}>
            <h1>{g.title}</h1>
            <IconButton
              onClick={() => {
                navigate(`/editGame/${g.id}`);
              }}
            >
              <EditTwoToneIcon sx={{ color: 'rgb(25,118,210)' }} />
            </IconButton>
            <IconButton sx={{ marginTop: '5px' }}>
              <InputLabel>
                <UploadFileTwoToneIcon
                  sx={{ color: 'rgb(25,118,210)', cursor: 'pointer' }}
                />
                <input
                  accept=".json"
                  type="file"
                  onChange={(e) => handleJsonUpload(e, g.id)}
                  style={{ display: 'none' }}
                />
              </InputLabel>
            </IconButton>
            <IconButton
              onClick={() => {
                handleStartStopButton(g.id);
              }}
            >
              {startStopButton === 'Stop'
                ? (
                <StopCircleTwoToneIcon sx={{ color: 'red' }} />
                  )
                : (
                <PlayCircleFilledWhiteTwoToneIcon
                  sx={{ color: 'rgb(25,118,210)' }}
                />
                  )}
            </IconButton>
            <IconButton
              onClick={() => {
                handleDeleteGame(g.id);
              }}
            >
              <DeleteTwoToneIcon sx={{ color: 'rgb(25,118,210)' }} />
            </IconButton>

            {startStopButton === 'Stop'
              ? (
              <div onClick={() => handleOpenPopup(g.id)}>
                {' '}
                <ActiveButton />{' '}
              </div>
                )
              : (
              <></>
                )}
          </Container>
          <Stack textAlign={'left'} gap={2}>
            <QuizStatStack gap={0.5}>
              <EditCalendarIcon />
              {isoToNormalDate(g.createdAt)}
            </QuizStatStack>
            <QuizStatStack gap={0.5}>
              <QuizIcon />
              {g.numQuestions}
            </QuizStatStack>
            <QuizStatStack gap={0.5}>
              <AccessTimeIcon />
              {g.totalTime} sec
            </QuizStatStack>
          </Stack>
        </QuizCard>
      );
    });
    return (
      <Stack alignItems="center" spacing={3}>
        {gameContainers}
      </Stack>
    );
  }

  // Function to handle deleting a game
  async function handleDeleteGame (gameID) {
    const response = await fetch(`http://localhost:5005/admin/quiz/${gameID}`, {
      method: 'DELETE',
      body: JSON.stringify({
        quizid: gameID,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else {
      fetchGames();
    }
  }

  // Function to handle creating a new game
  async function handleCreateGame () {
    // Check if there is a file attached

    if (newGameName.trim() !== '') {
      const response = await fetch('http://localhost:5005/admin/quiz/new', {
        method: 'POST',
        body: JSON.stringify({
          name: newGameName,
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.error) {
        alert(data.error);
      }
      setNewGameName('');
    }
  }

  const handleJsonUpload = (event, gId) => {
    const jsonFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const json = JSON.parse(e.target.result);
        const response = await fetch(
          `http://localhost:5005/admin/quiz/${gId}`,
          {
            method: 'PUT',
            body: JSON.stringify({
              name: json.name,
              questions: json.questions,
              thumbnail: json.thumbnail,
            }),
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.json();
        if (data.error) {
          alert(data.error);
        }
      } catch (error) {
        alert('Cannot read json file');
      }
    };
    reader.readAsText(jsonFile);
    fetchGames();
  };

  // Update games when created
  React.useEffect(() => {
    fetchGames();
  }, [newGameName, isSessionPopupOpen, isStopPopupOpen]);

  return (
    <GenericBox>
      <NavBar />
      <StopButtonPopup
        currQuizID={currQuizID}
        sessionID={popupSessionId}
        open={isStopPopupOpen} // Pass the visibility state as a prop to the Popup component
        onClose={handleCloseStopPopup}
      />
      <SessionPopup
        currQuizID={currQuizID}
        sessionID={popupSessionId} // Pass the sessionID as a prop to the Popup component
        open={isSessionPopupOpen} // Pass the visibility state as a prop to the Popup component
        onClose={handleCloseSessionPopup} // Pass the closing function as a prop to the Popup component
      />
      <h1>Dashboard</h1>
      <InnerBox sx={{ paddingTop: '30px', marginTop: '0' }}>
        <GenericTextfield
          label="Enter game name"
          value={newGameName}
          onChange={(e) => setNewGameName(e.target.value)}
        />
        <Button onClick={handleCreateGame}>Create Game</Button>
      </InnerBox>
      <DisplayGames />
    </GenericBox>
  );
};

export default Dashboard;
