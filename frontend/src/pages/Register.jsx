import React from 'react';
import { useNavigate } from 'react-router-dom';
import GenericBox from '../components/GenericBox';
import Alert from '@mui/material/Alert';
import GenericTextfield from '../components/GenericTextfield';
import IntroScreenButton from '../components/IntroScreenButton';
import InnerBox from '../components/InnerBox';

const Register = () => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [alert, setAlert] = React.useState(false);
  const [alertContent, setAlertContent] = React.useState('');

  const navigate = useNavigate();

  async function handleRegister () {
    if (!email || !password) {
      setAlertContent('Please provide an email and password.');
      setAlert(true);
    } else if (!/^[a-zA-Z\s]+$/.test(name)) {
      setAlertContent('Please provide a valid name (only letters).');
      setAlert(true);
    } else if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email)) {
      setAlertContent('Please provide a valid email address.');
      setAlert(true);
    } else {
      const response = await fetch(
        new URL('admin/auth/register', 'http://localhost:5005/'),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, name, password }),
        }
      );
      const data = await response.json();
      if (data.error) {
        setAlertContent('Email already in use');
        setAlert(true);
      } else {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      }
    }
  }

  return (
    <div>
      <GenericBox>
        <InnerBox>
          <h1>Register</h1>
          <GenericTextfield
            label="Name"
            variant="outlined"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <GenericTextfield
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <GenericTextfield
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <IntroScreenButton variant="contained" onClick={handleRegister}>
            Register
          </IntroScreenButton>
          <IntroScreenButton
            variant="outlined"
            onClick={() => {
              navigate('/login');
            }}
          >
            Log in
          </IntroScreenButton>
          {alert ? <Alert severity="error">{alertContent}</Alert> : <></>}
        </InnerBox>
      </GenericBox>
    </div>
  );
};

export default Register;
