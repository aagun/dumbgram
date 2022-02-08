import React from "react";
import { Col } from "react-bootstrap";
import { ProfilePicture } from "../../atoms";

export default function Contact(props) {
  const { setContact, dataContact } = props;

  const handleOnClick = (id) => {
    setContact(id);
  };
  return (
    <>
      {dataContact.map((item, index) => (
        <div
          key={index}
          className="d-flex align-items-center justify-content-center mb-5 ps-5"
          style={{ cursor: "pointer" }}
          onClick={() => {
            handleOnClick(item.id);
          }}
        >
          <ProfilePicture
            isMedium
            dataImage={{ src: item.image, alt: item.username }}
            style={{ marginBottom: "0 !important" }}
          />
          <Col className="ms-3">
            <p className="profile-username-md">{item.username}</p>
            <p className="profile-message-md">{item.chat}</p>
          </Col>
        </div>
      ))}
    </>
  );
}
