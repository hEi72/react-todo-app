import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = { // config from settings
    apiKey: "AIzaSyBq_TnhNzJTj18OzYJP1gnyeh1Typ9rfJ8",
    authDomain: "todo-app-jeang.firebaseapp.com",
    databaseURL: "https://todo-app-jeang.firebaseio.com",
    projectId: "todo-app-jeang",
    storageBucket: "todo-app-jeang.appspot.com",
    messagingSenderId: "43249264418",
    appId: "1:43249264418:web:381623932deee925c6677b",
    measurementId: "G-BQMTVC8DL5"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig); // init firebaseApp

const db = firebaseApp.firestore(); // use firebaseApp to connect to firestore -> store as db

export default db; // can be imported in anywhere in react app -> get access to db