import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import AboutPage from './components/AboutPage';
import ChatPage from './components/ChatPage';
import ContactPage from './components/ContactPage';
import DashboardPage from './components/DashboardPage';
import DatabaseSelector from './components/DatabaseSelector';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import QueryInput from './components/QueryInput';
import QueryInterfacePage from './components/QueryInterfacePage';
import RecentChats from './components/RecentChats';
import ResultDisplay from './components/ResultDisplay';
import Navbar from './components/Navbar';
import FAQsPage from './components/FAQsPage';
import ProfessionalAIDatabaseAssistant from './components/EnhancedChatInterface';
import { Box } from '@mui/material';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [connectionInfo, setConnectionInfo] = useState(null);


  return (
    <Router>
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Navbar />
        <Box flexGrow={1}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={
              isLoggedIn ? <Navigate to="/chat" /> : <LoginPage setIsLoggedIn={setIsLoggedIn} setConnectionInfo={setConnectionInfo} />
            } />
            <Route path="/chat" element={
              isLoggedIn ? 
                <ProfessionalAIDatabaseAssistant 
                  connectionInfo={connectionInfo} 
                  setIsLoggedIn={setIsLoggedIn}
                /> : 
                <Navigate to="/login" />
            } />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/dashboard" element={isLoggedIn ? <DashboardPage /> : <Navigate to="/login" />} />
            <Route path="/database-selector" element={<DatabaseSelector />} />
            <Route path="/query-input" element={<QueryInput />} />
            <Route path="/query-interface" element={<QueryInterfacePage />} />
            <Route path="/recent-chats" element={<RecentChats />} />
            <Route path="/result-display" element={<ResultDisplay />} />
            <Route path="/faqs" element={<FAQsPage />} />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </Router>
  );
}

export default App;
