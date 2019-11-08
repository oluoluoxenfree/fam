import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "./firebase";
import AddPerson from "./AddPerson";
import { useCollection } from "react-firebase-hooks/firestore";
const db = firebase.firestore();

// This site has 3 pages, all of which are rendered
// dynamically in the browser (not server rendered).
//
// Although the page does not ever refresh, notice how
// React Router keeps the URL up to date as you navigate
// through the site. This preserves the browser history,
// making sure things like the back button and bookmarks
// work properly.

export default function App({ user }) {
  if (user) {
    return <AuthedApp user={user} />;
  } else {
    return <SignInScreen />;
  }
}

function AuthedApp({ user }) {
  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/add-person">Add Person</Link>
          </li>
        </ul>

        <hr />

        {/*
          A <Switch> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Switch> any time
          you have multiple routes, but you want only one
          of them to render at a time
        */}
        <Switch>
          <Route exact path="/">
            <Home user={user} />
          </Route>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

// You can think of these components as "pages"
// in your app.

function Home({ user }) {
  const [snapshot, loading, error] = useCollection(
    db.collection("people").where("userId", "==", user.uid)
  );
  return (
    <div>
      <h2>Home</h2>
      <AddPerson user={user} />
      {error && <strong>Error: {JSON.stringify(error)}</strong>}
      {loading && <span>Collection: Loading...</span>}
      {snapshot && <PeopleTable user={user} people={snapshot} />}
    </div>
  );
}

function About() {
  return (
    <div>
      <h2>About</h2>
    </div>
  );
}

function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
    </div>
  );
}

function Login() {
  return (
    <div>
      <h2>Login</h2>
    </div>
  );
}

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: "popup",
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false
  },
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ]
};

const SignInScreen = () => {
  return (
    <div>
      <p>Please sign-in:</p>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    </div>
  );
};

const PeopleTable = ({ user, people }) => {
  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Relationship</th>
          </tr>
        </thead>
        <tbody>
          {people.docs.map(person => {
            return <PeopleTableRow person={person} />;
          })}
        </tbody>
      </table>
    </>
  );
};

const PeopleTableRow = ({ person }) => {
  const [editing, setEditing] = useState(false);
  const [personForm, setPersonForm] = useState({
    name: person.data().name,
    relationship: person.data().relationship,
    userId: person.data().userId
  });

  const row = (
    <tr onClick={() => setEditing(!editing)} key={person.id}>
      <td key={person.id}>{person.data().name}</td>
      <td key={person.id}>{person.data().relationship}</td>
    </tr>
  );

  const form = (
    <tr>
      <input
        onChange={e => {
          setPersonForm({ ...personForm, name: e.target.value });
        }}
        value={personForm.name}
      ></input>
      <input
        onChange={e => {
          setPersonForm({ ...personForm, relationship: e.target.value });
        }}
        value={personForm.relationship}
      ></input>
      <input
        onClick={() => {
          setEditing(!editing);
          db.collection("people")
            .doc(person.id)
            .update({
              name: personForm.name,
              relationship: personForm.relationship
            });
        }}
        type="submit"
        value="Save"
      ></input>
    </tr>
  );

  console.log(person);

  const html = editing ? form : row;

  return html;
};
