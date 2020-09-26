import React, { useState, useEffect } from 'react';
import './App.css';
import Button from '@material-ui/core/Button';
import { TextField, List } from '@material-ui/core';
import Todo from './Todo';
import db from './firebase';
import firebase from 'firebase';

function App() {
  const [todos, setTodos] = useState([]); // print out array
  const [input, setInput] = useState(''); // leave input in input field

  // when app loads -> listen to db -> fetch new todos as added / removed
  // fire when app.js loads
  useEffect(() => {
    // ! fire when changes in snapshot -> read from db
    db.collection('todos').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      // 1. dissect key info from array from objs into another array
      // 2. set everything in new array to todos array
      setTodos(snapshot.docs.map(doc => ({
        id: doc.id,
        text: doc.data().text,
        timestamp: doc.data().timestamp
      })))
    })
  }, []) // listener to db: watch changes in element in []

  const addTodo = (event) => {
    event.preventDefault(); // stop refresh

    // write to db
    db.collection('todos').add({
      text: input, 
      timestamp: firebase.firestore.FieldValue.serverTimestamp() // firebase server time (prevent time zone issue)
    })

    setInput(''); // clear input field
  }

  var itemId = 0;
  
  return (
    <div className="App">
      <h1>My bae and me <span role="img" aria-label="smiley face">👩‍❤️‍👩</span></h1>
      <form>
        <TextField id="todo-input" label="Write something" type="search" value={input} onChange={event => setInput(event.target.value)}/>

        <Button variant="contained" color="primary" type="submit" onClick={addTodo} disabled={!input}>Add</Button>
      </form>
      <List className="todo_list">
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