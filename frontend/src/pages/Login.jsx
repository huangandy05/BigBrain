import React from 'react';
import { useNavigate } from 'react-router-dom';
import GenericBox from '../components/GenericBox';
import Alert from '@mui/material/Alert';
import GenericTextfield from '../components/GenericTextfield';
import InnerBox from '../components/InnerBox';
import IntroScreenButton from '../components/IntroScreenButton';

const Login = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [alert, setAlert] = React.useState(false);
  const [alertContent, setAlertContent] = React.useState('');

  const navigate = useNavigate();

  async function handleLogin () {
    if (!email || !password) {
      setAlertContent('Please provide an email and password.');
      setAlert(true);
    } else {
      const response = await fetch(
        new URL('admin/auth/login', 'http://localhost:5005/'),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await response.json();
      if (data.error) {
        setAlertContent('Please provide a valid email and password.');
        setAlert(true);
      } else {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      }
    }
  }

  return (
    <GenericBox>
      <InnerBox>
        <h1>Login</h1>
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
        {alert ? <Alert severity="error">{alertContent}</Alert> : <></>}
        <IntroScreenButton variant="contained" onClick={handleLogin}>
          Login
        </IntroScreenButton>
        <IntroScreenButton
          variant="outlined"
          onClick={() => {
            navigate('/register');
          }}
        >
          Sign up
        </IntroScreenButton>
      </InnerBox>
    </GenericBox>
  );
};

export default Login;
