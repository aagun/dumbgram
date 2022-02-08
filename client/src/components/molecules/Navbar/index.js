import "./style.css";
import React from "react";
import {
  Navbar,
  Image,
  Nav,
  Container,
  FormControl,
  InputGroup,
  Button,
  Row,
  Col,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { Icons, ImagesForLandingPage } from "../../../assets";
import { Logo, ProfilePicture } from "../../atoms";

export default function NavbarComponent() {
  const currentClassName = ["notification", "me-2"];
  const handlerOverlay = () => {
    document.querySelector(".overlay").classList.add("on");
  };

  const handlerRemoveOverlay = () => {
    document.querySelector(".overlay").classList.remove("on");
  };

  return (
    <Navbar variant="dark" expand="lg" style={{ backgroundColor: "#0b0b0b " }}>
      <Container>
        <InputGroup className="d-flex w-40">
          <InputGroup.Text id="basic-addon1">
            <Button className="btn-secondary" type="button">
              <i className="bi bi-search"></i>
            </Button>
          </InputGroup.Text>
          <FormControl
            type="search"
            placeholder="Search"
            className="me-2"
            aria-label="Search"
          />
        </InputGroup>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="d-flex align-items-center ms-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <div className="overlay" onClick={handlerRemoveOverlay}></div>
            <>
              <OverlayTrigger
                trigger="click"
                placement="bottom"
                rootClose
                overlay={
                  <Popover id="popover-basic">
                    <Popover.Body className="text-white">
                      <Row className="ps-2">
                        <Col md={1}>
                          <ProfilePicture
                            isSmall
                            dataImage={{ image: ImagesForLandingPage[4] }}
                            style={{ width: "30px", height: "30px" }}
                          />
                        </Col>
                        <Col className="ps-4">
                          <p className="mb-0">egi_lol</p>
                          <strong>Komentar: </strong>
                          <span>Nice place</span>
                        </Col>
                      </Row>
                      <Row className="ps-2">
                        <Col md={1}>
                          <ProfilePicture
                            isSmall
                            dataImage={{ image: ImagesForLandingPage[4] }}
                            style={{ width: "30px", height: "30px" }}
                          />
                        </Col>
                        <Col className="ps-4">
                          <p className="mb-0">egi_lol</p>
                          <strong>Komentar: </strong>
                          <span>Nice place</span>
                        </Col>
                      </Row>
                      <Row className="ps-2">
                        <Col md={1}>
                          <ProfilePicture
                            isSmall
                            dataImage={{ image: ImagesForLandingPage[4] }}
                            style={{ width: "30px", height: "30px" }}
                          />
                        </Col>
                        <Col className="ps-4">
                          <p className="mb-0">egi_lol</p>
                          <strong>Komentar: </strong>
                          <span>Nice place</span>
                        </Col>
                      </Row>
                    </Popover.Body>
                  </Popover>
                }
              >
                <Image
                  src={Icons.Bell}
                  // className="notification me-2"
                  className={currentClassName.join(" ")}
                  onClick={handlerOverlay}
                />
              </OverlayTrigger>
            </>
            <Link to="/inbox" className="ms-3 me-4">
              <Image src={Icons.Send} />
            </Link>
            <Link to="/create-post" className="btn btn-primary ms-3 py-2">
              <span
                className="rounded-3 fw-bold fs-6 me-2"
                style={{
                  padding: "3px 8px",
                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                }}
              >
                +
              </span>
              Create post
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
