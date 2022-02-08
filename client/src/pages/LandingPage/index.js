import React, { useState } from "react";
import { Logo } from "../../components/atoms";
import { Container, Row, Col, Button } from "react-bootstrap";
import { AuthModal } from "../../components/molecules";
import { ImagesForLandingPage as Hero } from "../../assets";
import Masonry from "react-masonry-css";

export default function LandingPage(props) {
  // set page title
  document.title = "DumbGram";

  const [show, setShow] = useState(props.show || false);
  const [isLoginModal, setIsLoginModal] = useState(props.show || false);

  // modal handler for login or register
  const handleShow = (e) => {
    const isLogin = e.target.id;
    setShow(true);
    if (isLogin === "login") {
      return setIsLoginModal(true);
    }
    return setIsLoginModal(false);
  };

  return (
    <Container>
      <Row className="landing-page d-flex justify-content-center align-items-center">
        <Col md={5}>
          <Logo isLarge className="mb-5" />
          <h1 className="title mb-4">Share your best photos or videos</h1>
          <p className="description mb-5">
            Join now, share your creations with another people and enjoy other
            creations.
          </p>
          <Button
            size="lg"
            className="px-5 btn-primary"
            id="login"
            onClick={handleShow}
          >
            Login
          </Button>
          <Button
            size="lg"
            className="px-5 btn-secondary"
            id="register"
            onClick={handleShow}
          >
            Register
          </Button>
          <AuthModal
            show={show}
            setShow={setShow}
            isLoginModal={isLoginModal}
            setIsLoginModal={setIsLoginModal}
          />
        </Col>
        <Col md={7}>
          <Masonry
            breakpointCols={{ default: 3, 1200: 3, 1000: 2, 700: 1 }}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {Hero.map((image, index) => {
              return (
                <div key={index}>
                  <img src={image} alt="" />
                </div>
              );
            })}
          </Masonry>
        </Col>
      </Row>
    </Container>
  );
}
