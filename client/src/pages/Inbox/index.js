import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Logo } from "../../components/atoms";
import { NavbarComponent } from "../../components/molecules";
import { Contact, Chat } from "../../components/molecules/Messages";
import { dataContact } from "../../fakeData";

export default function Inbox() {
  const [contact, setContact] = useState(null);
  return (
    <Container fluid>
      <Row className="message min-vh-100">
        <Col md={3} className="px-0">
          <Logo isSmall className="mt-4 mx-5" />
          <div className="contact-container">
            <Contact dataContact={dataContact} setContact={setContact} />
          </div>
        </Col>
        <Col md={9} className="container-fluid pt-4 min-vh-100">
          <NavbarComponent />
          <Chat contact={contact} />
        </Col>
      </Row>
    </Container>
  );
}
