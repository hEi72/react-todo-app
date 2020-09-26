import React, { useState, useEffect } from 'react';
import './App.css';
import { createMuiTheme, useMediaQuery, ThemeProvider, CssBaseline, InputBase, List, makeStyles, Container, IconButton, Paper, Grid } from '@material-ui/core';
import AddBoxTwoToneIcon from '@material-ui/icons/AddBoxTwoTone';
import Todo from './Todo';
import db from './firebase';
import firebase from 'firebase';

const useStyles = makeStyles((theme) => ({
  App: {
    flexGrow: 1,
  },
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    // backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
    right: 0,
  },
  todo_list: {
      textAlign: 'center',
  },
}));

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );

  const classes = useStyles();

  const [todos, setTodos] = useState([]); // print out array
  const [input, setInput] = useState(''); // leave input in input field

  // when app loads -> listen to db -> fetch new todos as added / removed
  // fire when app.js loads
  useEffect(() => {
    // ! fire when changes in snapshot -> read from db
    db.collection('todos').orderBy('timestamp_created', 'desc').onSnapshot(snapshot => {
      // *** Read from db *** //
      // 1. dissect key info from array from objs into another array
      // 2. set everything in new array to todos array
      setTodos(snapshot.docs.map(doc => ({
        id: doc.id,
        text: doc.data().text,
        timestamp_created: doc.data().timestamp_created,
        timestamp_modified: doc.data().timestamp_modified
      })))
    })
  }, []) // listener to db: watch changes in element in []

  const addTodo = (event) => {
    event.preventDefault(); // stop refresh

    // *** Write to db *** //
    const serverTime = firebase.firestore.FieldValue.serverTimestamp();
    db.collection('todos').add({
      text: input, 
      timestamp_created: serverTime, // firebase server time (prevent time zone issue)
      timestamp_modified: serverTime
    })

    setInput(''); // clear input field
  }

  var itemId = 0;
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <div className="App">
        <h1>To Do List App <span role="img" aria-label="smiley face">📝</span></h1>
        <Container maxWidth="md">
        <Grid container direction="row" justify="center" alignItems="center">
        <Paper component="form" className={classes.root}>
            <InputBase className={classes.input} placeholder="Write something..." required autoFocus type="search" value={input} onChange={event => setInput(event.target.value)}/>

            <IconButton variant="contained" color="secondary" type="submit" onClick={addTodo} disabled={!input}>
              <AddBoxTwoToneIcon />
            </IconButton>
        </Paper>
        </Grid>

        <List className={classes.todo_list}>
          {todos.map(todo => {
            itemId += 1;

            return (
              <Todo key={todo.id} todo={todo}></Todo>
            )
          })}
        </List>
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;