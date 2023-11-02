import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EditGame from './pages/EditGame';
// import Helmet from 'react-helmet';
import PlayJoin from './pages/PlayJoin';
import GameControl from './pages/GameControl';
import Results from './components/Results';
import PlayGame from './pages/PlayGame';

function App () {
  return (
    <BrowserRouter>
      {/* <Helmet bodyAttributes={{ style: 'background-color : #F9F6EE' }} /> */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/GameControl/:gameID/:sessionID"
          element={<GameControl />}
        />
        <Route path="/editGame/:gameID" element={<EditGame />} />
        <Route path="/editGame/:gameID/:qID" element={<EditGame />} />
        <Route path="/playGame/:sessionID/:playerID" element={<PlayGame />} />
        <Route path="/playjoin/:sessionID" element={<PlayJoin />} />
        <Route path="/playjoin" element={<PlayJoin />} />

        <Route path="/" element={<Login />} />

        <Route path="/Results" element={<Results />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
