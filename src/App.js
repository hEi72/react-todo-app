import React, { useState, useEffect } from 'react';
import './App.css';
import Button from '@material-ui/core/Button';
import { TextField, List, makeStyles } from '@material-ui/core';
import Todo from './Todo';
import db from './firebase';
import firebase from 'firebase';

const useStyles = makeStyles((theme) => ({
  todo_list: {
      textAlign: 'center',
  },
}));

function App() {
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
    <div className="App">
      <h1>My bae and me <span role="img" aria-label="smiley face">👩‍❤️‍👩</span></h1>
      <form>
        <TextField autoFocus id="todo-input" label="Write something" type="search" value={input} onChange={event => setInput(event.target.value)}/>

        <Button variant="contained" color="primary" type="submit" onClick={addTodo} disabled={!input}>Add</Button>
      </form>
      <List className={classes.todo_list}>
        {todos.map(todo => {
          itemId += 1;

          return (
            <Todo key={todo.id} todo={todo}></Todo>
          )
        })}
      </List>
    </div>
  );
}

export default App;