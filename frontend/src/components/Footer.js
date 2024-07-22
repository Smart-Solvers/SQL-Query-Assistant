import React from 'react';
import { Box, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/system';

const FooterContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(2),
  backgroundColor: '#ffffff',
  textAlign: 'center',
  position: 'static',
  bottom: 0,
  left: 0,
  borderTop: '1px solid #ddd',
}));

const FooterLinks = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: theme.spacing(1),
}));

const StyledLink = styled(RouterLink)(({ theme }) => ({
  margin: theme.spacing(0, 2),
  color: '#555',
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

const Footer = () => {
  return (
    <FooterContainer>
      <FooterLinks>
        <StyledLink to="/">Home</StyledLink>
        <StyledLink to="/about">About Us</StyledLink>
        <StyledLink to="/contact">Contact Us</StyledLink>
        <StyledLink to="/faqs">FAQs</StyledLink>
      </FooterLinks>
      <Typography variant="body2" color="textSecondary">
        © 2024 SmartQuery
      </Typography>
    </FooterContainer>
  );
};

export default Footer;