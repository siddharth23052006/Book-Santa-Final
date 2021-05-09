import firebase from 'firebase';
require('@firebase/firestore')

var firebaseConfig = {
    apiKey: "AIzaSyCH0kZgtREj_CgyD4YwdM2VnxPZLS_JT3A",
    authDomain: "book-santa-a5303.firebaseapp.com",
    projectId: "book-santa-a5303",
    storageBucket: "book-santa-a5303.appspot.com",
    messagingSenderId: "730254294043",
    appId: "1:730254294043:web:c436aba25dc97788d74cbe"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

export default firebase.firestore();