import React from "react";
import { Modal } from "react-bootstrap";

export default function MessageModal(props) {
  const { message, setMessage } = props;
  const handleClose = () => {
    setMessage(null);
  };

  return (
    <Modal className="message" show={!!message} onHide={handleClose} centered>
      <Modal.Header className="border-0 p-0" closeButton></Modal.Header>
      <Modal.Body className="text-white text-center pt-0">{message}</Modal.Body>
    </Modal>
  );
}
