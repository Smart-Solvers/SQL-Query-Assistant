import React from 'react';
import { Container, Typography, Button, Grid, Paper, Box } from '@mui/material';
import { styled, keyframes } from '@mui/system';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Define keyframes for animations
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideInFromLeft = keyframes`
  from {
    transform: translateX(-50%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideInFromRight = keyframes`
  from {
    transform: translateX(50%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: 'calc(100vh - 60px)', // Adjust 60px based on your footer height
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
  paddingBottom: theme.spacing(8), // Add extra padding at the bottom
  animation: `${fadeIn} 1s ease-out`,
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  textAlign: 'left',
  backgroundColor: '#ffffff',
  boxShadow: '0 3px 5px rgba(0, 0, 0, 0.1)',
  animation: `${slideInFromLeft} 1s ease-out`,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginRight: theme.spacing(2),
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  borderRadius: 50,
  color: '#ffffff',
  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
  transition: 'background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(45deg, #2196F3 20%, #21CBF3 80%)',
    transform: 'scale(1.05)',
    boxShadow: '0 6px 10px rgba(33, 203, 243, .3)',
  },
}));

const ImageBox = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: `url('/sqll.jpg') no-repeat center center`,
  backgroundSize: 'cover',
  zIndex: -1,
}));

const StepCard = styled(Paper)(({ theme, color, degree }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  backgroundColor: color || '#f5f5f5',
  textAlign: 'center',
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  transform: `rotate(${degree}deg)`,
  animation: `${slideInFromRight} 1s ease-out`,
}));

const Footer = styled('footer')(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(2),
  backgroundColor: '#ffffff',
  textAlign: 'center',
  position: 'fixed',
  bottom: 0,
  left: 0,
}));

const HomePage = () => {
  return (
    <>
      <ImageBox />
      <StyledContainer>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <StyledPaper elevation={6}>
              <Typography variant="h3" component="h1" gutterBottom>
                Welcome to SmartQuery
              </Typography>
              <Typography variant="h6" component="p" gutterBottom>
                Effortlessly access and understand client data with our AI-driven chat interface for real-time, accurate insights.
              </Typography>
              <Box>
                <StyledButton variant="contained" size="large" onClick={() => window.location.href = '/login'}>
                  Get Started <ArrowForwardIcon />
                </StyledButton>
                <StyledButton variant="contained" size="large" onClick={() => window.location.href = '/about'}>
                  About <ArrowForwardIcon />
                </StyledButton>
                <StyledButton variant="contained" size="large" onClick={() => window.location.href = '/contact'}>
                  Contact Us <ArrowForwardIcon />
                </StyledButton>
              </Box>
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box>
              <StepCard color="#ffffff" degree={-5}>
                <Typography variant="h5">01</Typography>
                <Typography variant="h6">Submit Query</Typography>
                <Typography>Enter your query parameters and submit the request.</Typography>
              </StepCard>
              <StepCard color="#e3f2fd" degree={5}>
                <Typography variant="h5">02</Typography>
                <Typography variant="h6">Data Retrieval</Typography>
                <Typography>The system retrieves relevant data from the database based on your query.</Typography>
              </StepCard>
              <StepCard color="#ffffff" degree={-5}>
                <Typography variant="h5">03</Typography>
                <Typography variant="h6">Generate Insights</Typography>
                <Typography>Receive timely and accurate insights generated from the retrieved data.</Typography>
              </StepCard>
              <StepCard color="#e3f2fd" degree={5}>
                <Typography variant="h5">04</Typography>
                <Typography variant="h6">Decision-Making</Typography>
                <Typography>Make informed decisions and enhance client management based on the insights.</Typography>
              </StepCard>
            </Box>
          </Grid>
        </Grid>
      </StyledContainer>
    </>
  );
};

export default HomePage;