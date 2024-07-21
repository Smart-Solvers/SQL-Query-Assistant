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
import Navbar from './components/Navbar';  // Import Navbar

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [connectionInfo, setConnectionInfo] = useState(null);

  return (
    <Router>
      <div className="App">
        <Navbar />  {/* Add Navbar here */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={
            isLoggedIn ? <Navigate to="/chat" /> : <LoginPage setIsLoggedIn={setIsLoggedIn} setConnectionInfo={setConnectionInfo} />
          } />
          <Route path="/chat" element={
            isLoggedIn ? <ChatPage connectionInfo={connectionInfo} setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/" />
          } />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/dashboard" element={isLoggedIn ? <DashboardPage /> : <Navigate to="/login" />} />
          <Route path="/database-selector" element={<DatabaseSelector />} />
          <Route path="/query-input" element={<QueryInput />} />
          <Route path="/query-interface" element={<QueryInterfacePage />} />
          <Route path="/recent-chats" element={<RecentChats />} />
          <Route path="/result-display" element={<ResultDisplay />} />
        </Routes>
        <Footer /> {/* Ensure Footer is rendered inside the App component */}
      </div>
    </Router>
  );
}

export default App;
