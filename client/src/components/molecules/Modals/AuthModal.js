import React, { useState } from "react";
import { Modal, Button, Alert } from "react-bootstrap";
import { LoginModalForm, RegisterModalForm } from "../Forms";
import "./style.css";

export default function AuthModal(props) {
  const { show, setShow, isLoginModal, setIsLoginModal } = props;
  const [message, setMessage] = useState(null);
  const handleFormModal = () => {
    setMessage(null);
    if (isLoginModal) {
      return setIsLoginModal(false);
    }
    setIsLoginModal(true);
  };

  const handleClose = () => {
    setMessage(null);
    if (isLoginModal) {
      return setShow(false);
    }
    setIsLoginModal(false);
    setShow(false);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header className="border-0">
        <Modal.Title>{isLoginModal ? "Login" : "Register"}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-white">
        {message && message}
        {isLoginModal ? (
          <LoginModalForm setMessage={setMessage} />
        ) : (
          <RegisterModalForm
            isLoginModal={isLoginModal}
            setIsloginModal={setIsLoginModal}
            setMessage={setMessage}
          />
        )}
      </Modal.Body>
      <Modal.Footer className="border-0">
        <div className="text-muted mx-auto auth">
          <span>
            {isLoginModal
              ? "Don't have an account ? "
              : "Already have an account? "}
            Klik{" "}
          </span>
          <Button className="text-muted" href="#" onClick={handleFormModal}>
            <strong>Here</strong>
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
