import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { Home, Info, ContactMail } from '@mui/icons-material';

const Navbar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#90e0ef' }}>
      <Container maxWidth="xl">
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <img 
              src="/icon.jpg" 
              alt="SmartQuery Icon" 
              style={{ 
                height: '30px', 
                marginRight: '10px'
              }} 
            />
            <Typography variant="h6">
              SmartQuery
            </Typography>
          </Box>
          <Button color="inherit" component={Link} to="/" startIcon={<Home />}>Home</Button>
          <Button color="inherit" component={Link} to="/about" startIcon={<Info />}>About</Button>
          <Button color="inherit" component={Link} to="/contact" startIcon={<ContactMail />}>Contact</Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;