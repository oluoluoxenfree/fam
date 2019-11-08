import React, { useState } from "react";
import firebase from "./firebase";

const db = firebase.firestore();

const handleSubmit = (form, event) => {
  event.preventDefault();
  db.collection("people")
    .doc()
    .set(form)
    .then(function() {
      console.log("Document successfully written!");
    })
    .catch(function(error) {
      console.error("Error writing document: ", error);
    });
};

const user = firebase.auth().currentUser;

const AddPerson = ({ user }) => {
  const [personForm, setPersonForm] = useState({
    name: "",
    relationship: "",
    userId: user.uid
  });
  console.log(user.uid);
  return (
    <div>
      <h2>Add a person</h2>
      <form onSubmit={event => handleSubmit(personForm, event)}>
        Name:{" "}
        <input
          placeholder="Michelle Obama"
          value={personForm.name}
          onChange={event => {
            setPersonForm({ ...personForm, name: event.target.value });
          }}
          name="name"
        ></input>
        Relationship:{" "}
        <input
          placeholder="bestie"
          value={personForm.relationship}
          onChange={event => {
            setPersonForm({ ...personForm, relationship: event.target.value });
          }}
          name="relationship"
        ></input>
        <input type="submit" value="Add"></input>
      </form>
    </div>
  );
};

export default AddPerson;
