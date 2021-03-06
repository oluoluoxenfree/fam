import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "./firebase";
import AddPerson from "./AddPerson";
import { useCollection } from "react-firebase-hooks/firestore";
import { Field, Input } from "react-bulma-components/lib/components/form";
import Button from "react-bulma-components/lib/components/button";
import Table from "react-bulma-components/lib/components/table";
import Container from "react-bulma-components/lib/components/container";
import Section from "react-bulma-components/lib/components/section";
import Tile from "react-bulma-components/lib/components/tile";
import { Box } from "react-bulma-components";
import Heading from "react-bulma-components/lib/components/heading";
import Image from "react-bulma-components/lib/components/image";
import "react-bulma-components/dist/react-bulma-components.min.css";
import Navbar from "react-bulma-components/lib/components/navbar";

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
      <Navbar transparent>
        <Navbar.Brand>
          <Navbar.Item renderAs={Link} to="/">
            fam
          </Navbar.Item>
          <Navbar.Burger />
        </Navbar.Brand>
        <Navbar.Menu>
          <Navbar.Container>
            <Navbar.Item renderAs={Link} to="/about">
              About
            </Navbar.Item>
          </Navbar.Container>
        </Navbar.Menu>
      </Navbar>

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
      </Switch>
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
      <Tile size={8} kind="ancestor" vertical>
        <Section>
          <Box>
            <Tile kind="child">
              <AddPerson user={user} />
            </Tile>
          </Box>
        </Section>
        <Section>
          <Box>
            <Tile kind="child" color="primary">
              {error && <strong>Error: {JSON.stringify(error)}</strong>}
              {loading && <span>Collection: Loading...</span>}
              {snapshot && <PeopleTable user={user} people={snapshot} />}
            </Tile>
          </Box>
        </Section>
      </Tile>
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
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Relationship</th>
            <th> </th>
            <th> </th>
          </tr>
        </thead>
        <tbody>
          {people.docs.map(person => {
            return <PeopleTableRow person={person} />;
          })}
        </tbody>
      </Table>
    </>
  );
};

const PeopleTableRow = ({ person }) => {
  const [editing, setEditing] = useState(false);
  const [personForm, setPersonForm] = useState({
    name: person.data().name,
    relationship: person.data().relationship,
    userId: person.data().userId,
    archived: false
  });
  if (person.data().archived !== true) {
    const row = (
      <tr onClick={() => setEditing(!editing)} key={person.id}>
        <td key={person.id}>{person.data().name}</td>
        <td key={person.id}>{person.data().relationship}</td>
      </tr>
    );

    const form = (
      <tr>
        <td>
          <Field>
            <Input
              onChange={e => {
                setPersonForm({ ...personForm, name: e.target.value });
              }}
              value={personForm.name}
            />
          </Field>
        </td>
        <td>
          <Field>
            <Input
              onChange={e => {
                setPersonForm({ ...personForm, relationship: e.target.value });
              }}
              value={personForm.relationship}
            />
          </Field>
        </td>
        <td>
          <Button
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
            value="save"
            color="primary"
          >
            Save
          </Button>
        </td>
        <td>
          <Button
            onClick={() => {
              setPersonForm({
                ...personForm,
                archived: (personForm.archived = true)
              });
              db.collection("people")
                .doc(person.id)
                .update({ archived: (personForm.archived = true) });
            }}
            type="submit"
            value="archive"
            color="danger"
          >
            Archive
          </Button>
        </td>
      </tr>
    );

    const html = editing ? form : row;

    return html;
  }
  return null;
};
