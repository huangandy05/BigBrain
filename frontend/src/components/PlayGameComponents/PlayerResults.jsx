import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import GenericBox from '../GenericBox';
import InnerBox from '../InnerBox';

const PlayerResults = () => {
  const playerID = useParams().playerID;
  const [results, setResults] = useState([]);

  // When game has ended, fetch final results
  useEffect(() => {
    fetch(`http://localhost:5005/play/${playerID}/results`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setResults(data);
      });
  }, []);

  return (
    <GenericBox>
      <InnerBox>
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
                  <b>Question #</b>
                </TableCell>
                <TableCell>
                  <b>Result</b>
                </TableCell>
                <TableCell>
                  <b>Time Taken</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((result, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {result.correct ? 'Correct' : 'Incorrect'}
                  </TableCell>
                  <TableCell>
                    {!result.answeredAt
                      ? (
                      <>Ran out of time</>
                        )
                      : (
                      <>
                        {' '}
                        {(
                          (new Date(result.answeredAt) -
                            new Date(result.questionStartedAt)) /
                          1000
                        ).toFixed(2)}{' '}
                        sec
                      </>
                        )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <h2>
          Note: Points for a correct question are calculated as (time
          remaining/time limit) * points
        </h2>
      </InnerBox>
    </GenericBox>
  );
};

export default PlayerResults;
