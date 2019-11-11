import React, { useState } from "react";
import firebase from "./firebase";
import {
  Field,
  Label,
  Input
} from "react-bulma-components/lib/components/form";
import Button from "react-bulma-components/lib/components/button";
import Heading from "react-bulma-components/lib/components/heading";

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

const AddPerson = ({ user }) => {
  const [personForm, setPersonForm] = useState({
    name: "",
    relationship: "",
    userId: user.uid
  });

  return (
    <div>
      <Heading subtitle size={2}>
        Add a person
      </Heading>
      <form onSubmit={event => handleSubmit(personForm, event)}>
        <Field>
          <Label> Name: </Label>
          <Input
            placeholder="Michelle Obama"
            value={personForm.name}
            onChange={event => {
              setPersonForm({ ...personForm, name: event.target.value });
            }}
            name="name"
          />
        </Field>
        <Field>
          <Label>Relationship: </Label>
          <Input
            placeholder="bestie"
            value={personForm.relationship}
            onChange={event => {
              setPersonForm({
                ...personForm,
                relationship: event.target.value
              });
            }}
            name="relationship"
          />
        </Field>
        <Button type="submit" color="primary">
          Add
        </Button>
      </form>
    </div>
  );
};

export default AddPerson;
