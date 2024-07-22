import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { 
  Box, Container, Paper, Typography, TextField, Button, Select, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Tooltip, CircularProgress, Snackbar, Alert, Drawer, List, 
  ListItem, ListItemText, ListItemIcon, Divider, useTheme, useMediaQuery,
  AppBar, Toolbar, CssBaseline, Dialog, DialogTitle, DialogContent, DialogActions,
  Switch, FormControlLabel, Chip, Fab
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { 
  Send as SendIcon, 
  ContentCopy as CopyIcon,
  Refresh as RefreshIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Chat as ChatIcon,
  Menu as MenuIcon,
  SmartToy as AIIcon,
  Storage as DatabaseIcon,
  ArrowDownward as ArrowDownwardIcon,
  Info as InfoIcon,
  ContactMail as ContactMailIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.3s ease-in-out',
        },
      },
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#303030',
      paper: '#424242',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.3s ease-in-out',
        },
      },
    },
  },
});

const AnimatedMessage = ({ children, isUser }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, x: isUser ? 20 : -20 }}
    animate={{ opacity: 1, y: 0, x: 0 }}
    exit={{ opacity: 0, y: 20, x: isUser ? 20 : -20 }}
    transition={{ duration: 0.3 }}
    style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '1rem',
    }}
  >
    {children}
  </motion.div>
);

const MessageBubble = ({ content, isUser, theme }) => (
  <Paper
    elevation={3}
    sx={{
      padding: 2,
      maxWidth: '70%',
      backgroundColor: isUser ? theme.palette.primary.main : theme.palette.background.paper,
      color: isUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
      borderRadius: isUser ? '20px 20px 0 20px' : '20px 20px 20px 0',
    }}
  >
    <Typography>{content}</Typography>
  </Paper>
);

const CodeCell = ({ code, darkMode }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box sx={{ position: 'relative', marginY: 2 }}>
      <SyntaxHighlighter
        language="sql"
        style={darkMode ? atomDark : prism}
        customStyle={{
          margin: 0,
          borderRadius: '8px',
          padding: '16px',
        }}
      >
        {code}
      </SyntaxHighlighter>
      <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
        <IconButton
          onClick={handleCopy}
          sx={{ position: 'absolute', top: 8, right: 8 }}
          size="small"
        >
          <CopyIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

const ResultTable = ({ data, theme }) => {
  if (!data || data.length === 0) return null;
  const columns = Object.keys(data[0]);

  return (
    <TableContainer component={Paper} sx={{ marginY: 2, maxHeight: '300px', overflow: 'auto' }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column} sx={{ backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText }}>
                {column}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index} sx={{ '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover } }}>
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

const LoadingDots = () => (
  <motion.div
    style={{ display: 'flex', alignItems: 'center', height: 40, marginLeft: 8 }}
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
          width: 8,
          height: 8,
          backgroundColor: 'currentColor',
          borderRadius: '50%',
          margin: '0 4px',
        }}
        variants={{
          start: { y: 0 },
          end: {
            y: [0, -8, 0],
            transition: {
              duration: 0.6,
              repeat: Infinity,
              repeatType: 'loop',
              delay: i * 0.1,
            },
          },
        }}
      />
    ))}
  </motion.div>
);

export default function ProfessionalAIDatabaseAssistant({ connectionInfo, setIsLoggedIn }) {
  const [darkMode, setDarkMode] = useState(false);
  const theme = darkMode ? darkTheme : lightTheme;
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [messages, setMessages] = useState([]);
  const [inputQuery, setInputQuery] = useState('');
  const [selectedDatabase, setSelectedDatabase] = useState('');
  const [databases, setDatabases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [autoSuggest, setAutoSuggest] = useState(true);
  const [keyboardShortcuts, setKeyboardShortcuts] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const chatEndRef = useRef(null);
  const queryWorkspaceRef = useRef(null);
  const navigate = useNavigate();

  const [selectWidth, setSelectWidth] = useState(200);

  useEffect(() => {
    // Calculate the width based on the selected database name
    if (selectedDatabase) {
      const width = selectedDatabase.length * 10 + 80; // Adjust multiplier and base width as needed
      setSelectWidth(Math.max(200, Math.min(400, width))); // Min 200px, max 400px
    } else {
      setSelectWidth(200); // Default width
    }
  }, [selectedDatabase]);

  useEffect(() => {
    fetchDatabases();
    loadChats();
  }, []);

  useEffect(() => {
    const workspace = queryWorkspaceRef.current;
    if (workspace) {
      const handleScroll = () => {
        const isScrolledToBottom = workspace.scrollHeight - workspace.clientHeight <= workspace.scrollTop + 1;
        setShowScrollButton(!isScrolledToBottom);
      };
      workspace.addEventListener('scroll', handleScroll);
      return () => workspace.removeEventListener('scroll', handleScroll);
    }
  }, []);

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

  const loadChats = () => {
    const savedChats = JSON.parse(localStorage.getItem('aiDatabaseChats')) || [];
    setChats(savedChats);
    if (savedChats.length > 0) {
      setCurrentChatId(savedChats[0].id);
      setMessages(savedChats[0].messages);
    } else {
      startNewChat();
    }
  };

  const saveChats = (updatedChats) => {
    localStorage.setItem('aiDatabaseChats', JSON.stringify(updatedChats));
    setChats(updatedChats);
  };

  const handleSendMessage = async () => {
    if (!inputQuery.trim() || !selectedDatabase) return;

    const newMessage = { content: inputQuery, isUser: true };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
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

      const aiResponse = {
        content: 'Here are the results of your query:',
        isUser: false,
        sql: response.data.sql_query,
        results: response.data.response,
      };

      const newMessages = [...updatedMessages, aiResponse];
      setMessages(newMessages);

      const updatedChats = chats.map(chat => 
        chat.id === currentChatId ? { ...chat, messages: newMessages, database: selectedDatabase } : chat
      );
      saveChats(updatedChats);

      setTimeout(() => {
        scrollToBottom();
      }, 100);

    } catch (error) {
      console.error('Error executing query:', error);
      setMessages([
        ...updatedMessages,
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

  const startNewChat = () => {
    const newChatId = uuidv4();
    const newChat = {
      id: newChatId,
      name: selectedDatabase || `Chat ${chats.length + 1}`,
      messages: [],
      database: selectedDatabase,
    };
    const updatedChats = [newChat, ...chats];
    saveChats(updatedChats);
    setCurrentChatId(newChatId);
    setMessages([]);
    if (isMobile) setDrawerOpen(false);
  };

  const openChat = (chatId) => {
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setCurrentChatId(chatId);
      setMessages(chat.messages);
      setSelectedDatabase(chat.database);
      if (isMobile) setDrawerOpen(false);
    }
  };

  const deleteChat = (chatId) => {
    const updatedChats = chats.filter(chat => chat.id !== chatId);
    saveChats(updatedChats);
    if (currentChatId === chatId) {
      if (updatedChats.length > 0) {
        setCurrentChatId(updatedChats[0].id);
        setMessages(updatedChats[0].messages);
        setSelectedDatabase(updatedChats[0].database);
      } else {
        startNewChat();
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/');
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const downloadChat = () => {
    const currentChat = chats.find(chat => chat.id === currentChatId);
    if (!currentChat) return;

    const chatContent = currentChat.messages.map(msg => {
      let content = `${msg.isUser ? 'User' : 'AI'}: ${msg.content}\n`;
      if (msg.sql) content += `SQL Query: ${msg.sql}\n`;
      if (msg.results) content += `Results: ${JSON.stringify(msg.results, null, 2)}\n`;
      return content;
    }).join('\n');

    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat_${currentChatId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const drawer = (
    <Box>
      <Toolbar />
      <Divider />
      <List>
        <ListItem button onClick={startNewChat}>
          <ListItemIcon><AddIcon /></ListItemIcon>
          <ListItemText primary="New Chat" />
        </ListItem>
      </List>
      <Divider />
      <List>
        {chats.map((chat) => (
          <ListItem 
            button 
            key={chat.id} 
            onClick={() => openChat(chat.id)}
            selected={chat.id === currentChatId}
            sx={{
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
                transform: 'translateX(8px)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <ListItemIcon><ChatIcon /></ListItemIcon>
            <ListItemText primary={chat.name} />
            <IconButton edge="end" onClick={(e) => { e.stopPropagation(); deleteChat(chat.id); }}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerOpen ? drawerWidth : 0}px)` },
            ml: { sm: `${drawerOpen ? drawerWidth : 0}px` },
            transition: theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="toggle drawer"
              edge="start"
              onClick={toggleDrawer}
              sx={{ mr: 2 }}
            >
              {drawerOpen ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              AI Database Assistant
            </Typography>
            <Tooltip title="Refresh databases">
              <IconButton color="inherit" onClick={fetchDatabases}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Toggle dark mode">
              <IconButton color="inherit" onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Settings">
              <IconButton color="inherit" onClick={() => setSettingsOpen(true)}>
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Download chat">
              <IconButton color="inherit" onClick={downloadChat}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Logout">
              <IconButton color="inherit" onClick={handleLogout}>
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="persistent"
          anchor="left"
          open={drawerOpen}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            height: '100vh',
            overflow: 'hidden',
            transition: theme.transitions.create('margin', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: `-${drawerWidth}px`,
            ...(drawerOpen && {
              transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
              }),
              marginLeft: 0,
            }),
          }}
        >
          <Toolbar />
          <Box 
            sx={{ 
              height: 'calc(100vh - 64px)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <Box 
              sx={{ 
                p: 2, 
                flex: '0 0 auto', 
                position: 'sticky', 
                top: 64,
                zIndex: 1,
                backgroundColor: theme.palette.background.default,
                borderBottom: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Select
                value={selectedDatabase}
                onChange={(e) => {
                  setSelectedDatabase(e.target.value);
                  const currentChat = chats.find(c => c.id === currentChatId);
                  if (currentChat) {
                    const updatedChats = chats.map(chat => 
                      chat.id === currentChatId ? { ...chat, name: e.target.value, database: e.target.value } : chat
                    );
                    saveChats(updatedChats);
                  }
                }}
                displayEmpty
                sx={{ 
                  width: selectWidth,
                  backgroundColor: theme.palette.background.paper,
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                  transition: 'all 0.3s',
                }}
              >
                <MenuItem value="" disabled>Select a database</MenuItem>
                {databases.map((db) => (
                  <MenuItem key={db} value={db}>{db}</MenuItem>
                ))}
              </Select>
            </Box>
            <Box 
              ref={queryWorkspaceRef}
              sx={{ 
                flex: '1 1 auto',
                overflowY: 'auto',
                overflowX: 'hidden',
                p: 2,
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: theme.palette.background.default,
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: '4px',
                },
                scrollBehavior: 'smooth',             
              }}
            >
              <AnimatePresence>
                {messages.map((message, index) => (
                  <AnimatedMessage key={index} isUser={message.isUser}>
                    {message.isUser ? (
                      <MessageBubble content={message.content} isUser={true} theme={theme} />
                    ) : (
                      <Box>
                        <MessageBubble content={message.content} isUser={false} theme={theme} />
                        {message.sql && (
                          <Box sx={{ overflowX: 'auto', my: 2 }}>
                            <CodeCell code={message.sql} darkMode={darkMode} />
                          </Box>
                        )}
                        {message.results && (
                          <Box sx={{ overflowX: 'auto', my: 2 }}>
                            <ResultTable data={message.results} theme={theme} />
                          </Box>
                        )}
                        <div ref={chatEndRef} />
                      </Box>
                    )}
                  </AnimatedMessage>
                ))}
                {loading && (
                  <AnimatedMessage isUser={false}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AIIcon sx={{ marginRight: 1 }} />
                      <Typography variant="body1">AI is thinking</Typography>
                      <LoadingDots />
                    </Box>
                  </AnimatedMessage>
                )}
              </AnimatePresence>
              <div ref={chatEndRef} />
            </Box>
          </Box>
          <Box 
            sx={{ 
              p: 2, 
              backgroundColor: theme.palette.background.paper,
              borderTop: `1px solid ${theme.palette.divider}`,
              position: 'fixed',
              bottom: 0,
              left: drawerOpen ? drawerWidth : 0,
              right: 0,
              transition: theme.transitions.create('left', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
            }}
          >
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
                sx={{ mr: 1,
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                 }}
              />
              <Button
                variant="contained"
                color="primary"
                endIcon={<SendIcon />}
                onClick={handleSendMessage}
                disabled={loading || !inputQuery.trim() || !selectedDatabase}
                sx={{
                  transition: 'background-color 0.3s, transform 0.1s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                  '&:active': {
                    transform: 'scale(0.95)',
                  },
                }}
              >
                Send
              </Button>
            </Box>
          </Box>
          {showScrollButton && (
            <Fab
              color="primary"
              size="small"
              onClick={scrollToBottom}
              sx={{ 
                position: 'fixed', 
                bottom: 90, 
                right: 16,
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              }}
            >
              <ArrowDownwardIcon />
            </Fab>
          )}
        </Box>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)}>
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={
              <Switch
                checked={autoSuggest}
                onChange={(e) => setAutoSuggest(e.target.checked)}
              />
            }
            label="Enable Auto-Suggest"
          />
          <FormControlLabel
            control={
              <Switch
                checked={keyboardShortcuts}
                onChange={(e) => setKeyboardShortcuts(e.target.checked)}
              />
            }
            label="Enable Keyboard Shortcuts"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}