import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import DashboardPage from './components/DashboardPage';
import QueryInterfacePage from './components/QueryInterfacePage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import Footer from './components/Footer';
import EnhancedChatInterface from './components/EnhancedChatInterface';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [connectionInfo, setConnectionInfo] = useState(null);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={
            isLoggedIn ? <Navigate to="/chat" /> : <HomePage />
          } />
          <Route path="/login" element={
            isLoggedIn ? <Navigate to="/chat" /> : <LoginPage setIsLoggedIn={setIsLoggedIn} setConnectionInfo={setConnectionInfo} />
          } />
          <Route path="/chat" element={
            isLoggedIn ? 
              <EnhancedChatInterface 
                connectionInfo={connectionInfo} 
                setIsLoggedIn={setIsLoggedIn}
              /> : 
              <Navigate to="/login" />
          } />
          <Route path="/dashboard" element={
            isLoggedIn ? <DashboardPage /> : <Navigate to="/login" />
          } />
          <Route path="/query" element={
            isLoggedIn ? <QueryInterfacePage /> : <Navigate to="/login" />
          } />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;