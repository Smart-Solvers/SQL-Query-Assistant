import React from 'react';
import { Container, Typography, Button, Grid, Paper, Box } from '@mui/material';
import { styled, keyframes } from '@mui/system';

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
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(245, 245, 245, 0.8)',
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
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    borderRadius: 50,
    color: '#ffffff',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    transition: 'background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      background: 'linear-gradient(45deg, #FE6B8B 20%, #FF8E53 80%)',
      transform: 'scale(1.05)',
      boxShadow: '0 6px 10px rgba(255, 105, 135, .3)',
    },
  }));
  

const ImageBox = styled(Box)(({ theme }) => ({
  height: '100vh',
  background: `url('/sqll.jpg') no-repeat center center`,
  backgroundSize: 'cover',
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

const HomePage = () => {
  return (
    <ImageBox>
      <StyledContainer maxWidth="lg">
        <Grid container spacing={2}>
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
                  Get Started
                </StyledButton>
                <StyledButton variant="contained" size="large" onClick={() => window.location.href = '/about'}>
                  About
                </StyledButton>
                <StyledButton variant="contained" size="large" onClick={() => window.location.href = '/contact'}>
                  Contact Us
                </StyledButton>
              </Box>
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box mt={4}>
              <StepCard color="#ffffff" degree={-5}>
                <Typography variant="h5">01</Typography>
                <Typography variant="h6">Submit Query</Typography>
                <Typography>Enter your query parameters and submit the request.</Typography>
              </StepCard>
              <StepCard color="#ffe0b2" degree={5}>
                <Typography variant="h5">02</Typography>
                <Typography variant="h6">Data Retrieval</Typography>
                <Typography>The system retrieves relevant data from the database based on your query.</Typography>
              </StepCard>
              <StepCard color="#ffffff" degree={-5}>
                <Typography variant="h5">03</Typography>
                <Typography variant="h6">Generate Insights</Typography>
                <Typography>Receive timely and accurate insights generated from the retrieved data.</Typography>
              </StepCard>
              <StepCard color="#ffe0b2" degree={5}>
                <Typography variant="h5">04</Typography>
                <Typography variant="h6">Decision-Making</Typography>
                <Typography>Make informed decisions and enhance client management based on the insights.</Typography>
              </StepCard>
            </Box>
          </Grid>
        </Grid>
      </StyledContainer>
    </ImageBox>
  );
};

export default HomePage;