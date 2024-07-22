import React, { useState } from 'react';
import axios from 'axios';
import { 
  Box, 
  Button, 
  Container, 
  TextField, 
  Typography, 
  Paper, 
  InputAdornment, 
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import { styled, keyframes } from '@mui/system';
import { Visibility, VisibilityOff, Home } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const Background = styled(Box)(({ theme }) => ({
  height: '100vh',
  background: `url('/loginn.jpg') no-repeat center center`,
  backgroundSize: 'cover',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  animation: `${fadeIn} 1s ease-out`,
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(8),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(4),
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  borderRadius: theme.shape.borderRadius,
  animation: `${fadeIn} 1s ease-out`,
}));

const StyledForm = styled('form')(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(1),
  animation: `${slideUp} 1s ease-out`,
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
  backgroundColor: '#0072ff',
  color: '#ffffff',
  borderRadius: 50,
  transition: 'background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  '&:hover': {
    backgroundColor: '#005bb5',
    transform: 'scale(1.05)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
  },
  '&:active': {
    backgroundColor: '#003d7a',
    transform: 'scale(0.95)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
  },
  animation: `${pulse} 1.5s infinite`,
}));

const DefaultButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(1),
  backgroundColor: '#6c757d',
  color: '#ffffff',
  borderRadius: 50,
  transition: 'background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  '&:hover': {
    backgroundColor: '#5a6268',
    transform: 'scale(1.05)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
  },
  '&:active': {
    backgroundColor: '#4a4e54',
    transform: 'scale(0.95)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
  },
}));

const HomeButton = styled(IconButton)(({ theme }) => ({
  '&:hover': {
    color: '#005bb5',
  },
}));

const LoginPage = ({ setIsLoggedIn, setConnectionInfo }) => {
  const [host, setHost] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/login', { host, username, password });
      setIsLoggedIn(true);
      setConnectionInfo({ host, username, password });
      setSnackbarMessage('Login successful!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Login failed:', error);
      setSnackbarMessage('Login failed. Please check your credentials.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleDefaultLogin = () => {
    setHost('localhost');
    setUsername('root');
    setPassword('password');
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Background>
      <Container component="main" maxWidth="xs">
        <StyledPaper elevation={6}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            width="100%"
            mb={2}
          >
            <HomeButton onClick={() => navigate('/')} aria-label="home">
              <Home sx={{ fontSize: 40, color: '#0072ff' }} />
            </HomeButton>
          </Box>
          <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
            Database Query Tool
          </Typography>
          <StyledForm onSubmit={handleLogin}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="host"
              label="Host"
              name="host"
              autoComplete="host"
              autoFocus
              value={host}
              onChange={(e) => setHost(e.target.value)}
              sx={{ mb: 2, animation: `${slideUp} 1s ease-out` }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ mb: 2, animation: `${slideUp} 1s ease-out 0.2s` }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3, animation: `${slideUp} 1s ease-out 0.4s` }}
            />
            <SubmitButton
              type="submit"
              fullWidth
              variant="contained"
            >
              Login
            </SubmitButton>
            <DefaultButton
              fullWidth
              variant="contained"
              onClick={handleDefaultLogin}
            >
              Use Default Connection
            </DefaultButton>
          </StyledForm>
        </StyledPaper>
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%', animation: `${fadeIn} 1s ease-out` }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Background>
  );
};

export default LoginPage;
