import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { 
  Container, Paper, Typography, TextField, Button, Select, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Tooltip, Box, CircularProgress, Snackbar, Alert
} from '@mui/material';
import { 
  Send as SendIcon, 
  ContentCopy as CopyIcon,
  Refresh as RefreshIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import logo from 'D:/SQL-Assistant-Pragnia/frontend/src/assets/ai.png';
// import { Box } from '@mui/material';

const AnimatedMessage = ({ children, isUser }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, x: isUser ? 50 : -50 }}
    animate={{ opacity: 1, y: 0, x: 0 }}
    exit={{ opacity: 0, y: 50, x: isUser ? 50 : -50 }}
    transition={{ duration: 0.5 }}
    style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '1rem',
    }}
  >
    {children}
  </motion.div>
);

const MessageBubble = ({ content, isUser }) => (
  <Paper
    elevation={3}
    sx={{
      padding: 2,
      maxWidth: '70%',
      backgroundColor: isUser ? '#6200ea' : '#f5f5f5',
      color: isUser ? 'white' : 'black',
      borderRadius: isUser ? '20px 20px 0 20px' : '20px 20px 20px 0',
    }}
  >
    <Typography>{content}</Typography>
  </Paper>
);

const CodeCell = ({ code, darkMode }) => {
  const [expanded, setExpanded] = useState(false);
  const codeRef = useRef(null);

  useEffect(() => {
    if (codeRef.current) {
      const isOverflowing = codeRef.current.scrollWidth > codeRef.current.clientWidth;
      setExpanded(!isOverflowing);
    }
  }, [code]);

  return (
    <Box sx={{ position: 'relative', marginBottom: 2 }}>
      <Box
        ref={codeRef}
        sx={{
          maxHeight: expanded ? 'none' : '200px',
          overflow: 'hidden',
          transition: 'max-height 0.3s ease-in-out',
          cursor: 'pointer',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <SyntaxHighlighter
          language="sql"
          style={darkMode ? vscDarkPlus : vs}
          customStyle={{
            margin: 0,
            borderRadius: '4px',
          }}
        >
          {code}
        </SyntaxHighlighter>
      </Box>
      <CopyToClipboard text={code}>
        <IconButton
          sx={{ position: 'absolute', top: 5, right: 5 }}
          size="small"
        >
          <CopyIcon fontSize="small" />
        </IconButton>
      </CopyToClipboard>
      {!expanded && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '50px',
            background: 'linear-gradient(transparent, rgba(0,0,0,0.1))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          onClick={() => setExpanded(true)}
        >
          <Typography variant="caption">Click to expand</Typography>
        </Box>
      )}
    </Box>
  );
};

const ResultTable = ({ data }) => {
  if (!data || data.length === 0) return null;
  const columns = Object.keys(data[0]);

  return (
    <TableContainer component={Paper} sx={{ marginBottom: 2, maxHeight: '300px', overflow: 'auto' }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column}>{column}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={column}>{row[column]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const AILogo = () => (
  <Box
    component="img"
    src={logo}
    alt="Logo"
    sx={{ width: 40, height: 40, marginRight: 1 }}
  />
);

const LoadingDots = () => (
  <motion.div
    style={{ display: 'flex', alignItems: 'center', height: 40 }}
    initial="start"
    animate="end"
    variants={{
      start: {},
      end: {},
    }}
  >
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        style={{
          width: 10,
          height: 10,
          backgroundColor: 'currentColor',
          borderRadius: '50%',
          margin: '0 4px',
        }}
        variants={{
          start: { y: 0 },
          end: {
            y: [0, -10, 0],
            transition: {
              duration: 0.6,
              repeat: Infinity,
              repeatType: 'loop',
              delay: i * 0.2,
            },
          },
        }}
      />
    ))}
  </motion.div>
);

export default function EnhancedChatInterface({ connectionInfo, setIsLoggedIn }) {
  const [messages, setMessages] = useState([]);
  const [inputQuery, setInputQuery] = useState('');
  const [selectedDatabase, setSelectedDatabase] = useState('');
  const [databases, setDatabases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const chatEndRef = useRef(null);

  useEffect(() => {
    fetchDatabases();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchDatabases = async () => {
    try {
      const response = await axios.get('http://localhost:8000/databases', {
        auth: {
          username: connectionInfo.username,
          password: connectionInfo.password
        },
        headers: {
          'X-Host': connectionInfo.host
        }
      });
      setDatabases(response.data);
    } catch (error) {
      console.error('Error fetching databases:', error);
      setSnackbar({ open: true, message: 'Error fetching databases', severity: 'error' });
    }
  };

  const handleSendMessage = async () => {
    if (!inputQuery.trim() || !selectedDatabase) return;

    const newMessages = [
      ...messages,
      { content: inputQuery, isUser: true },
    ];
    setMessages(newMessages);
    setInputQuery('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/query', {
        database: selectedDatabase,
        query: inputQuery,
      }, {
        auth: {
          username: connectionInfo.username,
          password: connectionInfo.password
        },
        headers: {
          'X-Host': connectionInfo.host
        }
      });

      setMessages([
        ...newMessages,
        {
          content: 'Here are the results of your query:',
          isUser: false,
          sql: response.data.sql_query,
          results: response.data.response,
        },
      ]);
    } catch (error) {
      console.error('Error executing query:', error);
      setMessages([
        ...newMessages,
        {
          content: 'An error occurred while executing your query. Please try again.',
          isUser: false,
        },
      ]);
      setSnackbar({ open: true, message: 'Error executing query', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Paper elevation={3} sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: darkMode ? '#333' : '#fff', color: darkMode ? '#fff' : '#000' }}>
        <Typography variant="h4" component="h1">
          AI Database Assistant
        </Typography>
        <Box>
          <Tooltip title="Refresh databases">
            <IconButton onClick={fetchDatabases}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Toggle dark mode">
            <IconButton onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Settings">
            <IconButton>
              <SettingsIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Logout">
            <IconButton onClick={() => setIsLoggedIn(false)}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      <Paper elevation={3} sx={{ p: 2, mb: 2, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', bgcolor: darkMode ? '#1e1e1e' : '#fff', color: darkMode ? '#fff' : '#000' }}>
        <Box sx={{ mb: 2 }}>
          <Select
            value={selectedDatabase}
            onChange={(e) => setSelectedDatabase(e.target.value)}
            displayEmpty
            fullWidth
            sx={{ bgcolor: darkMode ? '#333' : '#fff', color: darkMode ? '#fff' : '#000' }}
          >
            <MenuItem value="" disabled>Select a database</MenuItem>
            {databases.map((db) => (
              <MenuItem key={db} value={db}>{db}</MenuItem>
            ))}
          </Select>
        </Box>

        <Box sx={{ flex: 1, overflowY: 'auto', mb: 2 }}>
          <AnimatePresence>
            {messages.map((message, index) => (
              <AnimatedMessage key={index} isUser={message.isUser}>
                {message.isUser ? (
                  <MessageBubble content={message.content} isUser={true} />
                ) : (
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AILogo />
                      <Typography variant="body1">{message.content}</Typography>
                    </Box>
                    {message.sql && <CodeCell code={message.sql} darkMode={darkMode} />}
                    {message.results && <ResultTable data={message.results} />}
                  </Box>
                )}
              </AnimatedMessage>
            ))}
            {loading && (
              <AnimatedMessage isUser={false}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AILogo />
                  <LoadingDots />
                </Box>
              </AnimatedMessage>
            )}
          </AnimatePresence>
          <div ref={chatEndRef} />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter your query here..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            sx={{ mr: 1, bgcolor: darkMode ? '#333' : '#fff', input: { color: darkMode ? '#fff' : '#000' } }}
          />
          <Button
            variant="contained"
            color="primary"
            endIcon={<SendIcon />}
            onClick={handleSendMessage}
            disabled={loading || !inputQuery.trim() || !selectedDatabase}
          >
            Send
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
