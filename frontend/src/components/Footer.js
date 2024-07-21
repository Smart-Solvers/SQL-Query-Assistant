import React from 'react';
import { Container, Box, Typography, Link } from '@mui/material';
import { styled } from '@mui/system';

const FooterContainer = styled(Box)(({ theme }) => ({
  borderTop: '1px solid #ddd',
  padding: theme.spacing(4, 0),
  backgroundColor: '#f5f5f5',
}));

const FooterLinks = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  '& a': {
    margin: theme.spacing(0, 2),
    color: '#555',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));

const Footer = () => {
  return (
    <FooterContainer>
      <Container maxWidth="lg">
        <FooterLinks>
          <Link href="/">Home</Link>
          <Link href="/about">About Us</Link>
          <Link href="/services">Services</Link>
          <Link href="/contact">Contact Us</Link>
          <Link href="/faqs">FAQs</Link>
        </FooterLinks>
        <Box textAlign="center">
          <Typography variant="body2" color="textSecondary">
            © 2024 TeleportHQ
          </Typography>
          <FooterLinks>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-of-use">Terms of Use</Link>
            <Link href="/cookies-policy">Cookies Policy</Link>
          </FooterLinks>
        </Box>
      </Container>
    </FooterContainer>
  );
};

export default Footer;
