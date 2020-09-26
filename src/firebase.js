import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = { // config from settings
    apiKey: "AIzaSyBO1ps0eG6vtcfg6VXY8YUOOrTlzrFbIl0",
    authDomain: "jeang-todo-app.firebaseapp.com",
    databaseURL: "https://jeang-todo-app.firebaseio.com",
    projectId: "jeang-todo-app",
    storageBucket: "jeang-todo-app.appspot.com",
    messagingSenderId: "48797258169",
    appId: "1:48797258169:web:ab04fbbc63fee128d9e668",
    measurementId: "G-XE4YXC5252"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig); // init firebaseApp

const db = firebaseApp.firestore(); // use firebaseApp to connect to firestore -> store as db

export default db; // can be imported in anywhere in react app -> get access to db