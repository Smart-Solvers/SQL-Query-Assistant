import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import { Home, Info, ContactMail } from '@mui/icons-material';

const Navbar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#90e0ef' }}>
      <Container maxWidth="xl">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Your Website
          </Typography>
          <Button color="inherit" component={Link} to="/" startIcon={<Home />}>Home</Button>
          <Button color="inherit" component={Link} to="/about" startIcon={<Info />}>About</Button>
          <Button color="inherit" component={Link} to="/contact" startIcon={<ContactMail />}>Contact</Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
