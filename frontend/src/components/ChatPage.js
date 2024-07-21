import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  AppBar, Toolbar, Typography, Button, Container, Grid, Paper, 
  TextField, Select, MenuItem, IconButton, Drawer, List, ListItem, 
  ListItemText, Divider, Tooltip, Snackbar, Alert, ThemeProvider, 
  createTheme, CssBaseline, CircularProgress, Box, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import { styled } from '@mui/system';
import { 
  Send, Refresh, Settings, Logout, History, DarkMode, 
  LightMode, Code, BarChart, Save, Download, Add
} from '@mui/icons-material';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.paper,
}));

const QueryTextArea = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    fontFamily: 'monospace',
    backgroundColor: theme.palette.mode === 'dark' ? '#2d2d2d' : '#f5f5f5',
  },
}));

const ResultContainer = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),
  maxHeight: '400px',
  overflow: 'auto',
  backgroundColor: theme.palette.mode === 'dark' ? '#2d2d2d' : '#f5f5f5',
  color: theme.palette.text.primary,
}));

const ColorButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
  },
}));

const ChatPage = ({ connectionInfo, setIsLoggedIn }) => {
  const [databases, setDatabases] = useState([]);
  const [selectedDatabase, setSelectedDatabase] = useState('');
  const [query, setQuery] = useState('');
  const [sqlQuery, setSqlQuery] = useState('');
  const [result, setResult] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatIndex, setCurrentChatIndex] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [loading, setLoading] = useState(false);
  const [connectionString, setConnectionString] = useState('');

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#3f51b5',
      },
      secondary: {
        main: '#f50057',
      },
      background: {
        default: darkMode ? '#303030' : '#f5f5f5',
        paper: darkMode ? '#424242' : '#ffffff',
      },
    },
  });

  useEffect(() => {
    fetchDatabases();
    const savedHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    if (savedHistory.length > 0) {
      setChatHistory(savedHistory);
      setCurrentChatIndex(savedHistory.length - 1);
      const lastChat = savedHistory[savedHistory.length - 1];
      setSelectedDatabase(lastChat.database);
    } else {
      newChat();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  }, [chatHistory]);

  const fetchDatabases = async () => {
    setLoading(true);
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
      showSnackbar('Error fetching databases', 'error');
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const startTime = Date.now();
      const response = await axios.post('http://localhost:8000/query', {
        database: selectedDatabase,
        query: query,
      }, {
        auth: {
          username: connectionInfo.username,
          password: connectionInfo.password
        },
        headers: {
          'X-Host': connectionInfo.host
        }
      });
      
      // Ensure the loading state lasts for at least 1 second
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < 1000) {
        await new Promise(resolve => setTimeout(resolve, 1000 - elapsedTime));
      }
      
      setSqlQuery(response.data.sql_query);
      setResult(response.data.response);
      
      const updatedHistory = [...chatHistory];
      updatedHistory[currentChatIndex].queries.push({
        naturalLanguage: query,
        sql: response.data.sql_query,
        result: response.data.response
      });
      setChatHistory(updatedHistory);
      
      showSnackbar('Query executed successfully', 'success');
    } catch (error) {
      console.error('Error submitting query:', error);
      setResult({ error: 'An error occurred while processing your query.' });
      showSnackbar('Error executing query', 'error');
    }
    setLoading(false);
  };

  const newChat = () => {
    setSelectedDatabase('');
    setQuery('');
    setSqlQuery('');
    setResult(null);
    const newChatObject = { database: '', queries: [] };
    setChatHistory([...chatHistory, newChatObject]);
    setCurrentChatIndex(chatHistory.length);
  };

  const selectChat = (index) => {
    setCurrentChatIndex(index);
    const selectedChat = chatHistory[index];
    setSelectedDatabase(selectedChat.database);
    setQuery('');
    setSqlQuery('');
    setResult(null);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const saveQuery = () => {
    const savedQueries = JSON.parse(localStorage.getItem('savedQueries') || '[]');
    savedQueries.push({ database: selectedDatabase, query, sqlQuery });
    localStorage.setItem('savedQueries', JSON.stringify(savedQueries));
    showSnackbar('Query saved successfully', 'success');
  };

  const exportResults = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "query_results.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    showSnackbar('Results exported successfully', 'success');
  };

  const handleConnectionString = () => {
    setConnectionString(`Host=${connectionInfo.host};Username=${connectionInfo.username};Password=${connectionInfo.password};Database=${selectedDatabase}`);
    showSnackbar('Connection string generated', 'info');
  };

  const handleQueryHistory = () => {
    const savedQueries = JSON.parse(localStorage.getItem('savedQueries') || '[]');
    showSnackbar('Query history loaded', 'info');
  };
  const LoadingOverlay = styled(Box)(({ theme }) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    color: theme.palette.common.white,
  }));

  const renderResultTable = (data) => {
    if (!Array.isArray(data) || data.length === 0) {
      return <Typography>No data to display</Typography>;
    }

    const columns = Object.keys(data[0]);

    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="result table">
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Advanced Database Query Tool
            </Typography>
            <Tooltip title="Toggle dark mode">
              <IconButton color="inherit" onClick={toggleDarkMode}>
                {darkMode ? <LightMode /> : <DarkMode />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Settings">
              <IconButton color="inherit" onClick={toggleDrawer}>
                <Settings />
              </IconButton>
            </Tooltip>
            <Button color="inherit" onClick={handleLogout} startIcon={<Logout />}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ mt: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <StyledPaper>
                <Typography variant="h6" gutterBottom>
                  Chat History
                </Typography>
                <List>
                  {chatHistory.map((chat, index) => (
                    <ListItem 
                      key={index} 
                      button 
                      onClick={() => selectChat(index)}
                      selected={index === currentChatIndex}
                    >
                      <ListItemText 
                        primary={`Chat ${index + 1}`} 
                        secondary={chat.database || 'No database selected'}
                      />
                    </ListItem>
                  ))}
                </List>
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  startIcon={<Add />}
                  onClick={newChat}
                  sx={{ mt: 2 }}
                >
                  New Chat
                </Button>
              </StyledPaper>
            </Grid>
            <Grid item xs={12} md={9}>
              <StyledPaper>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={6}>
                    <Select
                      fullWidth
                      value={selectedDatabase}
                      onChange={(e) => {
                        setSelectedDatabase(e.target.value);
                        const updatedHistory = [...chatHistory];
                        updatedHistory[currentChatIndex].database = e.target.value;
                        setChatHistory(updatedHistory);
                      }}
                      displayEmpty
                    >
                      <MenuItem value="" disabled>Select a database</MenuItem>
                      {databases.map((db) => (
                        <MenuItem key={db} value={db}>{db}</MenuItem>
                      ))}
                    </Select>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <ColorButton
                      variant="contained"
                      startIcon={<Refresh />}
                      onClick={fetchDatabases}
                      disabled={loading}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Refresh Databases'}
                    </ColorButton>
                  </Grid>
                </Grid>
                <QueryTextArea
                  fullWidth
                  multiline
                  rows={6}
                  variant="outlined"
                  margin="normal"
                  placeholder="Enter your natural language query here..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <Grid container spacing={2} justifyContent="space-between">
                  <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    endIcon={loading ? <CircularProgress size={24} color="inherit" /> : <Send />}
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? 'Executing...' : 'Execute Query'}
                  </Button>
                  </Grid>
                  <Grid item>
                    <Tooltip title="Save query">
                      <IconButton onClick={saveQuery}>
                        <Save />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Export results">
                      <IconButton onClick={exportResults}>
                        <Download />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="New query">
                      <IconButton onClick={newChat}>
                        <Refresh />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
                {sqlQuery && (
                  <ResultContainer>
                    <Typography variant="h6" gutterBottom>
                      SQL Query
                    </Typography>
                    <pre>{sqlQuery}</pre>
                  </ResultContainer>
                )}
                {result && (
                  <ResultContainer>
                    <Typography variant="h6" gutterBottom>
                      Query Results
                    </Typography>
                    {renderResultTable(result)}
                  </ResultContainer>
                )}
              </StyledPaper>
            </Grid>
          </Grid>
        </Container>

        <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
          <List sx={{ width: 250 }}>
            <ListItem>
              <Typography variant="h6">Settings</Typography>
            </ListItem>
            <Divider />
            <ListItem button onClick={handleConnectionString}>
              <ListItemText primary="Connection String" />
            </ListItem>
            <ListItem button onClick={handleQueryHistory}>
              <ListItemText primary="Query History" />
            </ListItem>
            <ListItem button onClick={exportResults}>
              <ListItemText primary="Export Results" />
            </ListItem>
          </List>
        </Drawer>

        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
      {loading && (
        <LoadingOverlay>
          <CircularProgress size={60} color="inherit" />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Executing Query...
          </Typography>
        </LoadingOverlay>
      )}
    </ThemeProvider>
  );
};

export default ChatPage;