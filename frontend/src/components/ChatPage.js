// import React, { useState, useEffect, useMemo } from 'react';
// import axios from 'axios';
// import { 
//   AppBar, Toolbar, Typography, Button, Container, Grid, Paper, 
//   TextField, Select, MenuItem, IconButton, Drawer, List, ListItem, 
//   ListItemText, Divider, Tooltip, Snackbar, Alert, ThemeProvider, 
//   createTheme, CssBaseline, CircularProgress, Box, Table, TableBody, 
//   TableCell, TableContainer, TableHead, TableRow, Fade, Grow, Zoom,
//   Dialog, DialogTitle, DialogContent, DialogActions
// } from '@mui/material';
// import { styled } from '@mui/system';
// import { 
//   Send, Refresh, Settings, Logout, History, DarkMode, 
//   LightMode, Code, BarChart, Save, Download, Add, Warning
// } from '@mui/icons-material';
// import { motion, AnimatePresence } from 'framer-motion';


// const StyledPaper = styled(Paper)(({ theme }) => ({
//   padding: theme.spacing(3),
//   height: '100%',
//   display: 'flex',
//   flexDirection: 'column',
//   backgroundColor: theme.palette.background.paper,
// }));

// const QueryTextArea = styled(TextField)(({ theme }) => ({
//   '& .MuiInputBase-root': {
//     fontFamily: 'monospace',
//     backgroundColor: theme.palette.mode === 'dark' ? '#2d2d2d' : '#f5f5f5',
//   },
// }));

// const ResultContainer = styled(Paper)(({ theme }) => ({
//   marginTop: theme.spacing(2),
//   padding: theme.spacing(2),
//   maxHeight: '400px',
//   overflow: 'auto',
//   backgroundColor: theme.palette.mode === 'dark' ? '#2d2d2d' : '#f5f5f5',
//   color: theme.palette.text.primary,
// }));

// const ColorButton = styled(Button)(({ theme }) => ({
//   backgroundColor: theme.palette.secondary.main,
//   color: theme.palette.secondary.contrastText,
//   '&:hover': {
//     backgroundColor: theme.palette.secondary.dark,
//   },
// }));

// const AnimatedContainer = styled(motion.div)({
//   width: '100%',
// });

// const WarningBox = styled(Paper)(({ theme }) => ({
//   padding: theme.spacing(2),
//   marginTop: theme.spacing(2),
//   backgroundColor: theme.palette.warning.light,
//   color: theme.palette.warning.contrastText,
//   display: 'flex',
//   alignItems: 'center',
//   gap: theme.spacing(1),
// }));

// const StyledBox = styled(Box)(({ theme }) => ({
//   padding: theme.spacing(2),
//   backgroundColor: theme.palette.background.paper,
//   borderRadius: theme.shape.borderRadius,
//   boxShadow: theme.shadows[3],
//   marginBottom: theme.spacing(2),
// }));

// const ChatPage = ({ connectionInfo, setIsLoggedIn }) => {
//   const [databases, setDatabases] = useState([]);
//   const [selectedDatabase, setSelectedDatabase] = useState('');
//   const [query, setQuery] = useState('');
//   const [sqlQuery, setSqlQuery] = useState('');
//   const [result, setResult] = useState(null);
//   const [chatHistory, setChatHistory] = useState([]);
//   const [currentChatIndex, setCurrentChatIndex] = useState(0);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
//   const [loading, setLoading] = useState(false);
//   const [connectionString, setConnectionString] = useState('');
//   const [showWarning, setShowWarning] = useState(false);
//   const [openHistoryDialog, setOpenHistoryDialog] = useState(false);
//   const [savedQueries, setSavedQueries] = useState([]);
//   const [chartData, setChartData] = useState([]);

  // useEffect(() => {
  //   fetchDatabases();
  //   const savedHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
  //   if (savedHistory.length > 0) {
  //     setChatHistory(savedHistory);
  //     setCurrentChatIndex(savedHistory.length - 1);
  //     const lastChat = savedHistory[savedHistory.length - 1];
  //     setSelectedDatabase(lastChat.database);
  //   } else {
  //     newChat();
  //   }
  // }, []);

  // useEffect(() => {
  //   fetchDatabases();
  //   const savedHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
  //   if (savedHistory.length > 0) {
  //     setChatHistory(savedHistory);
  //     setCurrentChatIndex(savedHistory.length - 1);
  //     const lastChat = savedHistory[savedHistory.length - 1];
  //     setSelectedDatabase(lastChat.database);
  //   } else {
  //     newChat();
  //   }
  //   const savedQueriesData = JSON.parse(localStorage.getItem('savedQueries') || '[]');
  //   setSavedQueries(savedQueriesData);
  // }, []);

  // const fetchDatabases = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.get('http://localhost:8000/databases', {
  //       auth: {
  //         username: connectionInfo.username,
  //         password: connectionInfo.password
  //       },
  //       headers: {
  //         'X-Host': connectionInfo.host
  //       }
  //     });
  //     setDatabases(response.data);
  //   } catch (error) {
  //     console.error('Error fetching databases:', error);
  //     showSnackbar('Error fetching databases', 'error');
  //   }
  //   setLoading(false);
  // };

//   const handleSubmit = async () => {
//     if (!selectedDatabase) {
//       setShowWarning(true);
//       showSnackbar('Please select a database before executing a query', 'warning');
//       return;
//     }
//     setShowWarning(false);
//     setLoading(true);
//     try {
//       const response = await axios.post('http://localhost:8000/query', {
//         database: selectedDatabase,
//         query: query,
//       }, {
//         auth: {
//           username: connectionInfo.username,
//           password: connectionInfo.password
//         },
//         headers: {
//           'X-Host': connectionInfo.host
//         }
//       });
//       setSqlQuery(response.data.sql_query);
//       setResult(response.data.response);
      
//       const updatedHistory = [...chatHistory];
//       updatedHistory[currentChatIndex].queries.push({
//         naturalLanguage: query,
//         sql: response.data.sql_query,
//         result: response.data.response
//       });
//       setChatHistory(updatedHistory);

//       if (Array.isArray(response.data.response) && response.data.response.length > 0) {
//         const firstItem = response.data.response[0];
//         const numericKeys = Object.keys(firstItem).filter(key => typeof firstItem[key] === 'number');
//         if (numericKeys.length > 0) {
//           setChartData(response.data.response.map((item, index) => ({
//             name: index,
//             [numericKeys[0]]: item[numericKeys[0]]
//           })));
//         }
//       }
      
//       showSnackbar('Query executed successfully', 'success');
//     } catch (error) {
//       console.error('Error submitting query:', error);
//       setResult({ error: 'An error occurred while processing your query.' });
//       showSnackbar('Error executing query', 'error');
//     }
//     setLoading(false);
//   };

//   const newChat = () => {
//     setSelectedDatabase('');
//     setQuery('');
//     setSqlQuery('');
//     setResult(null);
//     const newChatObject = { database: '', queries: [] };
//     setChatHistory([...chatHistory, newChatObject]);
//     setCurrentChatIndex(chatHistory.length);
//   };

//   const selectChat = (index) => {
//     setCurrentChatIndex(index);
//     const selectedChat = chatHistory[index];
//     setSelectedDatabase(selectedChat.database);
//     setQuery('');
//     setSqlQuery('');
//     setResult(null);
//   };

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//   };

//   const toggleDrawer = () => {
//     setDrawerOpen(!drawerOpen);
//   };

//   const toggleDarkMode = () => {
//     setDarkMode(!darkMode);
//   };

//   const showSnackbar = (message, severity) => {
//     setSnackbar({ open: true, message, severity });
//   };

//   const handleCloseSnackbar = () => {
//     setSnackbar({ ...snackbar, open: false });
//   };

//   const saveQuery = () => {
//     const savedQueries = JSON.parse(localStorage.getItem('savedQueries') || '[]');
//     savedQueries.push({ database: selectedDatabase, query, sqlQuery });
//     localStorage.setItem('savedQueries', JSON.stringify(savedQueries));
//     showSnackbar('Query saved successfully', 'success');
//   };

//   const exportResults = () => {
//     const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result));
//     const downloadAnchorNode = document.createElement('a');
//     downloadAnchorNode.setAttribute("href", dataStr);
//     downloadAnchorNode.setAttribute("download", "query_results.json");
//     document.body.appendChild(downloadAnchorNode);
//     downloadAnchorNode.click();
//     downloadAnchorNode.remove();
//     showSnackbar('Results exported successfully', 'success');
//   };

//   const handleConnectionString = () => {
//     const connectionString = `Host=${connectionInfo.host};Username=${connectionInfo.username};Password=${connectionInfo.password};Database=${selectedDatabase}`;
//     showSnackbar('Connection string copied to clipboard', 'info');
//     navigator.clipboard.writeText(connectionString);
//   };

//   const handleQueryHistory = () => {
//     setOpenHistoryDialog(true);
//   };

//   const closeHistoryDialog = () => {
//     setOpenHistoryDialog(false);
//   };

//   const renderResultTable = (data) => {
//     if (!Array.isArray(data) || data.length === 0) {
//       return <Typography>No data to display</Typography>;
//     }

//     const columns = Object.keys(data[0]);

//     return (
//       <TableContainer component={Paper}>
//         <Table sx={{ minWidth: 650 }} aria-label="result table">
//           <TableHead>
//             <TableRow>
//               {columns.map((column) => (
//                 <TableCell key={column}>{column}</TableCell>
//               ))}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {data.map((row, index) => (
//               <TableRow key={index}>
//                 {columns.map((column) => (
//                   <TableCell key={column}>{row[column]}</TableCell>
//                 ))}
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     );
//   };

//   const theme = useMemo(() => createTheme({
//     palette: {
//       mode: darkMode ? 'dark' : 'light',
//       primary: {
//         main: '#3f51b5',
//       },
//       secondary: {
//         main: '#f50057',
//       },
//       background: {
//         default: darkMode ? '#303030' : '#f5f5f5',
//         paper: darkMode ? '#424242' : '#ffffff',
//       },
//     },
//   }), [darkMode]);

//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <div>
//         <AppBar position="static" color="primary">
//           <Toolbar>
//             <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
//               Advanced Database Query Tool
//             </Typography>
//             <Tooltip title="Toggle dark mode">
//               <IconButton color="inherit" onClick={toggleDarkMode}>
//                 {darkMode ? <LightMode /> : <DarkMode />}
//               </IconButton>
//             </Tooltip>
//             <Tooltip title="Query History">
//               <IconButton color="inherit" onClick={handleQueryHistory}>
//                 <History />
//               </IconButton>
//             </Tooltip>
//             <Tooltip title="Settings">
//               <IconButton color="inherit" onClick={toggleDrawer}>
//                 <Settings />
//               </IconButton>
//             </Tooltip>
//             <Button color="inherit" onClick={handleLogout} startIcon={<Logout />}>
//               Logout
//             </Button>
//           </Toolbar>
//         </AppBar>

//         <Container maxWidth="xl" sx={{ mt: 4 }}>
//           <Grid container spacing={3}>
//             <Grow in={true} timeout={1000}>
//             <Grid item xs={12} md={3}>
//               <StyledPaper>
//                 <Typography variant="h6" gutterBottom>
//                   Chat History
//                 </Typography>
//                 <List>
//                   {chatHistory.map((chat, index) => (
//                     <ListItem 
//                       key={index} 
//                       button 
//                       onClick={() => selectChat(index)}
//                       selected={index === currentChatIndex}
//                     >
//                       <ListItemText 
//                         primary={`Chat ${index + 1}`} 
//                         secondary={chat.database || 'No database selected'}
//                       />
//                     </ListItem>
//                   ))}
//                 </List>
//                 <Button
//                   fullWidth
//                   variant="contained"
//                   color="secondary"
//                   startIcon={<Add />}
//                   onClick={newChat}
//                   sx={{ mt: 2 }}
//                 >
//                   New Chat
//                 </Button>
//               </StyledPaper>
//             </Grid>
//             </Grow>
//             <Fade in={true} timeout={1500}>
//             <Grid item xs={12} md={9}>
//               <StyledPaper>
//                 <Grid container spacing={2} alignItems="center">
//                   <Grid item xs={12} md={6}>
//                     <Select
//                       fullWidth
//                       value={selectedDatabase}
//                       onChange={(e) => {
//                         setSelectedDatabase(e.target.value);
//                         const updatedHistory = [...chatHistory];
//                         updatedHistory[currentChatIndex].database = e.target.value;
//                         setChatHistory(updatedHistory);
//                       }}
//                       displayEmpty
//                     >
//                       <MenuItem value="" disabled>Select a database</MenuItem>
//                       {databases.map((db) => (
//                         <MenuItem key={db} value={db}>{db}</MenuItem>
//                       ))}
//                     </Select>
//                   </Grid>
//                   <Grid item xs={12} md={6}>
//                     <ColorButton
//                       variant="contained"
//                       startIcon={<Refresh />}
//                       onClick={fetchDatabases}
//                       disabled={loading}
//                     >
//                       {loading ? <CircularProgress size={24} /> : 'Refresh Databases'}
//                     </ColorButton>
//                   </Grid>
//                 </Grid>
//                 <AnimatePresence>
//                     {showWarning && (
//                       <motion.div
//                         initial={{ opacity: 0, y: -20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -20 }}
//                         transition={{ duration: 0.3 }}
//                       >
//                         <WarningBox>
//                           <Warning color="warning" />
//                           <Typography>Please select a database before executing a query.</Typography>
//                         </WarningBox>
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                   <QueryTextArea
//                     fullWidth
//                     multiline
//                     rows={6}
//                     variant="outlined"
//                     margin="normal"
//                     placeholder="Enter your natural language query here..."
//                     value={query}
//                     onChange={(e) => setQuery(e.target.value)}
//                   />
//                   <Grid container spacing={2} justifyContent="space-between">
//                     <Grid item>
//                       <Button
//                         variant="contained"
//                         color="primary"
//                         endIcon={loading ? <CircularProgress size={24} /> : <Send />}
//                         onClick={handleSubmit}
//                         disabled={loading}
//                       >
//                         Execute Query
//                       </Button>
//                     </Grid>
//                     <Grid item>
//                       <Tooltip title="Save query">
//                         <IconButton onClick={saveQuery}>
//                           <Save />
//                         </IconButton>
//                       </Tooltip>
//                       <Tooltip title="Export results">
//                         <IconButton onClick={exportResults}>
//                           <Download />
//                         </IconButton>
//                       </Tooltip>
//                       <Tooltip title="New query">
//                         <IconButton onClick={newChat}>
//                           <Refresh />
//                         </IconButton>
//                       </Tooltip>
//                     </Grid>
//                   </Grid>
//                   <AnimatedContainer>
//                     {sqlQuery && (
//                       <Zoom in={true} timeout={500}>
//                         <ResultContainer>
//                           <Typography variant="h6" gutterBottom>
//                             SQL Query
//                           </Typography>
//                           <pre>{sqlQuery}</pre>
//                         </ResultContainer>
//                       </Zoom>
//                     )}
//                     {result && (
//                       <Zoom in={true} timeout={500}>
//                         <ResultContainer>
//                           <Typography variant="h6" gutterBottom>
//                             Query Results
//                           </Typography>
//                           {renderResultTable(result)}
//                         </ResultContainer>
//                       </Zoom>
//                     )}
//                   </AnimatedContainer>
//                 </StyledPaper>
//               </Grid>
//             </Fade>
//           </Grid>
//         </Container>

//         <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
//           <List sx={{ width: 250 }}>
//             <ListItem>
//               <Typography variant="h6">Settings</Typography>
//             </ListItem>
//             <Divider />
//             <ListItem button onClick={handleConnectionString}>
//               <ListItemText primary="Connection String" />
//             </ListItem>
//             <ListItem button onClick={handleQueryHistory}>
//               <ListItemText primary="Query History" />
//             </ListItem>
//             <ListItem button onClick={exportResults}>
//               <ListItemText primary="Export Results" />
//             </ListItem>
//           </List>
//         </Drawer>

//         <Dialog open={openHistoryDialog} onClose={closeHistoryDialog}>
//           <DialogTitle>Query History</DialogTitle>
//           <DialogContent>
//             <List>
//               {savedQueries.map((query, index) => (
//                 <ListItem key={index}>
//                   <ListItemText
//                     primary={query.query}
//                     secondary={`Database: ${query.database}`}
//                   />
//                   <IconButton onClick={() => {
//                     setSelectedDatabase(query.database);
//                     setQuery(query.query);
//                     closeHistoryDialog();
//                   }}>
//                     <Code />
//                   </IconButton>
//                 </ListItem>
//               ))}
//             </List>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={closeHistoryDialog}>Close</Button>
//           </DialogActions>
//         </Dialog>

//         <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
//           <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
//             {snackbar.message}
//           </Alert>
//         </Snackbar>
//       </div>
//     </ThemeProvider>
//   );
// };

// export default ChatPage;


// import React, { useState, useEffect, useMemo, useRef } from 'react';
// import axios from 'axios';
// import { 
//   AppBar, Toolbar, Typography, Button, Container, Grid, Paper, 
//   TextField, Select, MenuItem, IconButton, Drawer, List, ListItem, 
//   ListItemText, Divider, Tooltip, Snackbar, Alert, ThemeProvider, 
//   createTheme, CssBaseline, CircularProgress, Box
// } from '@mui/material';
// import { styled } from '@mui/system';
// import { 
//   Send, Refresh, Settings, Logout, History, DarkMode, 
//   LightMode, Add
// } from '@mui/icons-material';


// const StyledPaper = styled(Paper)(({ theme }) => ({
//   padding: theme.spacing(3),
//   height: '100%',
//   display: 'flex',
//   flexDirection: 'column',
//   backgroundColor: theme.palette.background.paper,
// }));

// const ChatBox = styled(Box)(({ theme }) => ({
//   flex: 1,
//   overflowY: 'auto',
//   padding: theme.spacing(2),
//   marginBottom: theme.spacing(2),
//   border: `1px solid ${theme.palette.divider}`,
//   borderRadius: theme.shape.borderRadius,
//   backgroundColor: theme.palette.background.default,
// }));

// const MessageBubble = styled(Paper)(({ theme, isUser }) => ({
//   padding: theme.spacing(1, 2),
//   marginBottom: theme.spacing(1),
//   maxWidth: '70%',
//   alignSelf: isUser ? 'flex-end' : 'flex-start',
//   backgroundColor: isUser ? theme.palette.primary.main : theme.palette.secondary.main,
//   color: theme.palette.getContrastText(isUser ? theme.palette.primary.main : theme.palette.secondary.main),
// }));

// const QueryInput = styled(TextField)(({ theme }) => ({
//   marginTop: theme.spacing(2),
// }));

// const ChatPage = ({ connectionInfo, setIsLoggedIn }) => {
//   const [databases, setDatabases] = useState([]);
//   const [selectedDatabase, setSelectedDatabase] = useState('');
//   const [chats, setChats] = useState([{ id: 0, messages: [], database: '' }]);
//   const [currentChatIndex, setCurrentChatIndex] = useState(0);
//   const [inputQuery, setInputQuery] = useState('');
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
//   const [loading, setLoading] = useState(false);
//   const chatBoxRef = useRef(null);

//   useEffect(() => {
//     fetchDatabases();
//     const savedChats = JSON.parse(localStorage.getItem('chats') || '[]');
//     if (savedChats.length > 0) {
//       setChats(savedChats);
//       setCurrentChatIndex(savedChats.length - 1);
//       setSelectedDatabase(savedChats[savedChats.length - 1].database);
//     }
//   }, []);

//   useEffect(() => {
//     localStorage.setItem('chats', JSON.stringify(chats));
//   }, [chats]);

//   useEffect(() => {
//     if (chatBoxRef.current) {
//       chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
//     }
//   }, [chats]);

//   const fetchDatabases = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get('http://localhost:8000/databases', {
//         auth: {
//           username: connectionInfo.username,
//           password: connectionInfo.password
//         },
//         headers: {
//           'X-Host': connectionInfo.host
//         }
//       });
//       setDatabases(response.data);
//     } catch (error) {
//       console.error('Error fetching databases:', error);
//       showSnackbar('Error fetching databases', 'error');
//     }
//     setLoading(false);
//   };

//   const handleSendMessage = async () => {
//     if (!selectedDatabase) {
//       showSnackbar('Please select a database before sending a query', 'warning');
//       return;
//     }
//     if (!inputQuery.trim()) return;

//     const newMessage = { content: inputQuery, isUser: true };
//     const updatedChats = [...chats];
//     updatedChats[currentChatIndex].messages.push(newMessage);
//     setChats(updatedChats);
//     setInputQuery('');

//     setLoading(true);
//     try {
//       const response = await axios.post('http://localhost:8000/query', {
//         database: selectedDatabase,
//         query: inputQuery,
//       }, {
//         auth: {
//           username: connectionInfo.username,
//           password: connectionInfo.password
//         },
//         headers: {
//           'X-Host': connectionInfo.host
//         }
//       });

//       const assistantMessage = {
//         content: `SQL Query: ${response.data.sql_query}\n\nResults: ${JSON.stringify(response.data.response, null, 2)}`,
//         isUser: false
//       };
//       updatedChats[currentChatIndex].messages.push(assistantMessage);
//       setChats(updatedChats);
//     } catch (error) {
//       console.error('Error submitting query:', error);
//       const errorMessage = { content: 'An error occurred while processing your query.', isUser: false };
//       updatedChats[currentChatIndex].messages.push(errorMessage);
//       setChats(updatedChats);
//       showSnackbar('Error executing query', 'error');
//     }
//     setLoading(false);
//   };

//   const newChat = () => {
//     const newChatObject = { id: chats.length, messages: [], database: '' };
//     setChats([...chats, newChatObject]);
//     setCurrentChatIndex(chats.length);
//     setSelectedDatabase('');
//   };

//   const selectChat = (index) => {
//     setCurrentChatIndex(index);
//     setSelectedDatabase(chats[index].database);
//   };

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//   };

//   const toggleDrawer = () => {
//     setDrawerOpen(!drawerOpen);
//   };

//   const toggleDarkMode = () => {
//     setDarkMode(!darkMode);
//   };

//   const showSnackbar = (message, severity) => {
//     setSnackbar({ open: true, message, severity });
//   };

//   const handleCloseSnackbar = () => {
//     setSnackbar({ ...snackbar, open: false });
//   };

//   const theme = useMemo(() => createTheme({
//     palette: {
//       mode: darkMode ? 'dark' : 'light',
//     },
//   }), [darkMode]);

//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
//         <AppBar position="static">
//           <Toolbar>
//             <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
//               AI Database Assistant
//             </Typography>
//             <Tooltip title="Toggle dark mode">
//               <IconButton color="inherit" onClick={toggleDarkMode}>
//                 {darkMode ? <LightMode /> : <DarkMode />}
//               </IconButton>
//             </Tooltip>
//             <Tooltip title="Settings">
//               <IconButton color="inherit" onClick={toggleDrawer}>
//                 <Settings />
//               </IconButton>
//             </Tooltip>
//             <Button color="inherit" onClick={handleLogout}>
//               Logout
//             </Button>
//           </Toolbar>
//         </AppBar>

//         <Container maxWidth="xl" sx={{ mt: 4, flex: 1, display: 'flex' }}>
//           <Grid container spacing={3} sx={{ flex: 1 }}>
//             <Grid item xs={12} md={3}>
//               <StyledPaper>
//                 <Typography variant="h6" gutterBottom>
//                   Chats
//                 </Typography>
//                 <List>
//                   {chats.map((chat, index) => (
//                     <ListItem 
//                       key={chat.id} 
//                       button 
//                       onClick={() => selectChat(index)}
//                       selected={index === currentChatIndex}
//                     >
//                       <ListItemText 
//                         primary={`Chat ${index + 1}`} 
//                         secondary={chat.database || 'No database selected'}
//                       />
//                     </ListItem>
//                   ))}
//                 </List>
//                 <Button
//                   fullWidth
//                   variant="contained"
//                   color="primary"
//                   startIcon={<Add />}
//                   onClick={newChat}
//                   sx={{ mt: 2 }}
//                 >
//                   New Chat
//                 </Button>
//               </StyledPaper>
//             </Grid>
//             <Grid item xs={12} md={9} sx={{ display: 'flex', flexDirection: 'column' }}>
//               <StyledPaper sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
//                 <Select
//                   value={selectedDatabase}
//                   onChange={(e) => {
//                     setSelectedDatabase(e.target.value);
//                     const updatedChats = [...chats];
//                     updatedChats[currentChatIndex].database = e.target.value;
//                     setChats(updatedChats);
//                   }}
//                   displayEmpty
//                   fullWidth
//                   sx={{ mb: 2 }}
//                 >
//                   <MenuItem value="" disabled>Select a database</MenuItem>
//                   {databases.map((db) => (
//                     <MenuItem key={db} value={db}>{db}</MenuItem>
//                   ))}
//                 </Select>
//                 <ChatBox ref={chatBoxRef}>
//                   {chats[currentChatIndex].messages.map((message, index) => (
//                     <MessageBubble key={index} isUser={message.isUser}>
//                       <Typography>{message.content}</Typography>
//                     </MessageBubble>
//                   ))}
//                 </ChatBox>
//                 <QueryInput
//                   fullWidth
//                   variant="outlined"
//                   placeholder="Enter your query here..."
//                   value={inputQuery}
//                   onChange={(e) => setInputQuery(e.target.value)}
//                   onKeyPress={(e) => {
//                     if (e.key === 'Enter' && !e.shiftKey) {
//                       e.preventDefault();
//                       handleSendMessage();
//                     }
//                   }}
//                   multiline
//                   rows={2}
//                   InputProps={{
//                     endAdornment: (
//                       <IconButton
//                         onClick={handleSendMessage}
//                         disabled={loading || !inputQuery.trim()}
//                       >
//                         {loading ? <CircularProgress size={24} /> : <Send />}
//                       </IconButton>
//                     ),
//                   }}
//                 />
//               </StyledPaper>
//             </Grid>
//           </Grid>
//         </Container>

//         <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
//           <List sx={{ width: 250 }}>
//             <ListItem>
//               <Typography variant="h6">Settings</Typography>
//             </ListItem>
//             <Divider />
//             <ListItem button onClick={fetchDatabases}>
//               <ListItemText primary="Refresh Databases" />
//             </ListItem>
//           </List>
//         </Drawer>

//         <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
//           <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
//             {snackbar.message}
//           </Alert>
//         </Snackbar>
//       </div>
//     </ThemeProvider>
//   );
// };

// export default ChatPage;