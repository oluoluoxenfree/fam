import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDUzThILrKQw_jm9EWr0cyenTLUdBu0GM4",
  authDomain: "fam-75682.firebaseapp.com",
  databaseURL: "https://fam-75682.firebaseio.com",
  projectId: "fam-75682",
  storageBucket: "fam-75682.appspot.com",
  messagingSenderId: "871983368411",
  appId: "1:871983368411:web:8f51e60141ab3740dbe4fe",
  measurementId: "G-J9719VQJVV"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
