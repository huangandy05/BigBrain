import React, { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import './Bubbles.css'; // Import the CSS styles for Bubbles

// Coded with ChatGPT and https://codepen.io/theunnamedrd/pen/dyRqqej
const LoadingComponent = () => {
  const [bubbles, setBubbles] = useState([]);

  // Function to generate a random number between min and max (inclusive)
  const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  // Function to create a new bubble object
  const createBubble = () => {
    const bubble = {
      id: new Date().getTime(), // Use a unique identifier as the ID
      left: `${getRandomNumber(0, 100)}%`, // Random left position
      animationDuration: `${getRandomNumber(5, 10)}s`, // Random animation duration
    };
    return bubble;
  };

  // Function to add a new bubble to the array of bubbles
  const addBubble = () => {
    if (bubbles.length < 8) { // Limit to 7 bubbles on the screen
      const newBubble = createBubble();
      setBubbles([...bubbles, newBubble]);
    }
  };

  // Function to remove a bubble from the array of bubbles
  const removeBubble = (id) => {
    const updatedBubbles = bubbles.filter(bubble => bubble.id !== id);
    setBubbles(updatedBubbles);
  };

  // Effect to continuously spawn bubbles every 3 seconds
  useEffect(() => {
    const intervalId = setInterval(addBubble, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [bubbles]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
      <h1>Waiting for quiz to start!</h1>
      {bubbles.map(bubble => (
        <div
          key={bubble.id}
          className="bubble"
          style={{ left: bubble.left, animationDuration: bubble.animationDuration }}
          onClick={() => removeBubble(bubble.id)}
        >
          <div className="pop-animation" />
        </div>
      ))}
    </div>
  );
};

export default LoadingComponent;
