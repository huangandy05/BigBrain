import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

const Results = ({ sessionID }) => {
  const [results, setResults] = useState([]);
  const [questionTimeLimit, setQuestionTimeLimits] = useState([]);
  const [questionPoints, setQuestionPoints] = useState([]);
  const token = localStorage.getItem('token');
  const gameID = useParams().gameID;
  const numPlayers = results.length;

  const getResults = async () => {
    const response = await fetch(
      `http://localhost:5005/admin/session/${sessionID}/results`,
      {
        method: 'GET',
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
      setResults(data.results);
    }
  };

  // Make a fetch to get the question time limits
  const fetchTimeLimits = () => {
    fetch(`http://localhost:5005/admin/quiz/${gameID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const dummyTimeLimits = data.questions.map((q) => {
          return q.timeLimit;
        });
        const dummyQuestionPoints = data.questions.map((q) => {
          return q.points;
        });

        setQuestionTimeLimits(dummyTimeLimits);
        setQuestionPoints(dummyQuestionPoints);
      });
  };

  useEffect(() => {
    getResults();
    fetchTimeLimits();
  }, []);

  // Show top 5 players
  const displayLeaderboard = () => {
    const leaderboardData = [];

    results.forEach((person) => {
      let numCorrect = 0;
      let numPoints = 0;
      let ind = 0;
      person.answers.forEach((ans) => {
        numCorrect += ans.correct;
        if (ans.correct) {
          numPoints += Math.ceil(
            (1 -
              (new Date(ans.answeredAt) - new Date(ans.questionStartedAt)) /
                1000 /
                questionTimeLimit[ind]) *
              questionPoints[ind]
          );
        }
        ind++;
      });
      const info = {};
      info.name = person.name;
      info.numCorrect = numCorrect;
      info.points = numPoints;

      leaderboardData.push(info);
    });
    const sortedData = leaderboardData.sort((a, b) => b.points - a.points);

    return (
      <div>
        <h1>Player Results</h1>
        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: 'lightgrey',
            borderRadius: '20px',
            borderColor: 'black',
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Rank</b>
                </TableCell>
                <TableCell>
                  <b>Player</b>
                </TableCell>
                <TableCell>
                  <b># Correct</b>
                </TableCell>
                <TableCell>
                  <b>Points</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData.map((player, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{player.name}</TableCell>
                  <TableCell>{player.numCorrect}</TableCell>
                  <TableCell>{player.points}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  };

  const displayPercentageCorrectChart = () => {
    const data = [];
    // Loop through players
    let isFirst = true;
    for (const player of results) {
      let questionIndex = 1;
      // For each player, loop through their answers
      for (const ans of player.answers) {
        // We need to add a dict to data for the first person
        if (isFirst) {
          const questionInfo = {
            question: `Question ${questionIndex}`,
            numCorrect: ans.correct ? 1 : 0,
            numPlayers: 1,
            totalResponseTime:
              (new Date(ans.answeredAt) - new Date(ans.questionStartedAt)) /
              1000,
          };
          data.push(questionInfo);
        } else {
          if (ans.correct) {
            data[questionIndex - 1].numCorrect++;
          }
          data[questionIndex - 1].numPlayers++;
          data[questionIndex - 1].totalResponseTime +=
            (new Date(ans.answeredAt) - new Date(ans.questionStartedAt)) / 1000;
        }
        questionIndex++;
      }
      isFirst = false;
    }
    // Calculate percentages also
    for (const questionData of data) {
      questionData.percentageCorrect =
        questionData.numCorrect / questionData.numPlayers;
      questionData.avgResponseTime =
        questionData.totalResponseTime / questionData.numPlayers;
    }

    return (
      <>
        <h1>Player number and players correct per question</h1>
        <BarChart
          width={400}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis dataKey="question" />
          <YAxis type="number" domain={[0, numPlayers]} />
          <Tooltip />
          <Legend />
          <Bar dataKey="numPlayers" fill="#8884d8" />
          <Bar dataKey="numCorrect" fill="#82ca9d" />
        </BarChart>
        <h1>% of players correct per question</h1>
        <BarChart
          width={400}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis dataKey="question"/>
          <YAxis type="number" domain={[0, 1]} tickFormatter={tick => `${tick * 100}%`}/>
          <Tooltip />
          <Legend />
          <Bar dataKey="percentageCorrect" fill="purple" />
        </BarChart>
        <h1>Average player response time per question</h1>
        <BarChart
          width={400}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis dataKey="question" />
          <YAxis type="number" domain={[0, 10]} />
          <Tooltip />
          <Legend />
          <Bar dataKey="avgResponseTime" fill="blue" />
        </BarChart>
      </>
    );
  };

  return (
    <>
      {displayLeaderboard()}
      {displayPercentageCorrectChart()}
      <h2>
        Note: Points for a correct question are calculated as (time
        remaining/time limit) * points
      </h2>
    </>
  );
};

Results.propTypes = {
  data: PropTypes.array,
};

export default Results;
