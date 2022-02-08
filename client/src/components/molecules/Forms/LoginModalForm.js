import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { API } from "../../../config/api";
import { useUserContext } from "../../../context/userContext";

export default function LoginModalForm(props) {
  // set title
  const title = "Login";
  document.title = "DumbGram | " + title;

  const [state, dispatch] = useUserContext();

  const { setMessage } = props;
  const navigate = useNavigate();
  let api = API();

  // initial sate to store data
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // get value from input form
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
          "Content-Type": "application/json",
        },
        body,
      };

      const response = await api.post("/login", config);

      if (response.status === "failed") {
        return setMessage(
          <Alert variant="danger">{response.error.message}</Alert>
        );
      }

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: response.data.user,
      });

      navigate("/feed", { replace: true });
    } catch (err) {
      const alert = <Alert variant="danger">Failed</Alert>;
      setMessage(alert);
      console.log(err);
    }
  });

  return (
    <Form
      onSubmit={(e) => {
        handleOnSubmit.mutate(e);
      }}
      method="POST"
    >
      <Form.Group className="mb-3" controlId="email">
        <Form.Control
          type="email"
          placeholder="Email"
          name="email"
          onChange={handleOnChange}
          value={form.email}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="password">
        <Form.Control
          type="password"
          placeholder="Password"
          name="password"
          onChange={handleOnChange}
          value={form.password}
        />
      </Form.Group>
      <Button type="submit" className="w-100 mt-4 p-2">
        Login
      </Button>
    </Form>
  );
}
