import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { API } from "../../../config/api";
import { useMutation } from "react-query";

export default function RegisterModalForm(props) {
  // set title
  const title = "Register";
  document.title = "DumGram | " + title;
  let api = API();
  const { setMessage, setIsloginModal } = props;
  const [form, setForm] = useState({
    email: "",
    fullName: "",
    username: "",
    password: "",
  });

  const handleOnChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      const body = JSON.stringify(form);

      const config = {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: body,
      };

      const response = await api.post("/register", config);

      if (response.status === "failed") {
        return setMessage(
          <Alert variant="danger">{response.error.message}</Alert>
        );
      }

      setMessage(<Alert variant="success">Registered success</Alert>);
      setForm({
        email: "",
        fullName: "",
        username: "",
        password: "",
      });
      setIsloginModal(true);
    } catch (error) {
      console.log(error);
      setMessage(<Alert variant="dager">Failed</Alert>);
    }
  });
  return (
    <Form
      onSubmit={(e) => {
        handleOnSubmit.mutate(e);
      }}
      method="POST"
    >
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Control
          type="email"
          placeholder="Email"
          name="email"
          onChange={handleOnChange}
          value={form.email}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicName">
        <Form.Control
          type="text"
          placeholder="Name"
          name="fullName"
          onChange={handleOnChange}
          value={form.fullName}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicUserName">
        <Form.Control
          type="text"
          placeholder="Username"
          name="username"
          onChange={handleOnChange}
          value={form.username}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Control
          type="password"
          placeholder="Password"
          name="password"
          onChange={handleOnChange}
          value={form.password}
        />
      </Form.Group>
      <Button className="w-100 mt-4 p-2" type="submit">
        Submit
      </Button>
    </Form>
  );
}
