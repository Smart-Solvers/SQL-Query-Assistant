import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import LoginPage from './components/LoginPage';
import ChatPage from './components/ChatPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [connectionInfo, setConnectionInfo] = useState(null);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={
            isLoggedIn ? <Navigate to="/chat" /> : <LoginPage setIsLoggedIn={setIsLoggedIn} setConnectionInfo={setConnectionInfo} />
          } />
          <Route path="/chat" element={
            isLoggedIn ? <ChatPage connectionInfo={connectionInfo} setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/" />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;