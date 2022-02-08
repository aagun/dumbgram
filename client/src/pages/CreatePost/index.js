import "./style.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Logo } from "../../components/atoms";
import {
  SideNavbar,
  UserProfile,
  NavbarComponent,
} from "../../components/molecules";
import { useMutation, useQuery } from "react-query";
import { useUserContext } from "../../context/userContext";
import { API } from "../../config/api";

export default function CreatePost() {
  let api = API();
  const [state, dispatch] = useUserContext();

  // get data users
  let { data: profile } = useQuery(
    "profileCache",
    async () => {
      const config = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await api.get(`/users`, config);

      const user = await response.data?.users.find(
        (item) => item.id == state?.user.id
      );
      return user;
    },
    { refetchOnWindowFocus: "always" }
  );

  // get user feeds
  let { data: posts } = useQuery(
    "userFeedCache",
    async () => {
      const config = {
        method: "GET",
        headers: {
          Authorization: "Basic " + localStorage.token,
        },
      };
      const response = await api.get(`/user-feed/${state?.user.id}`, config);
      return response.posts[0];
    },
    { refetchOnWindowFocus: "always" }
  );

  // get user followers
  let { data: follower } = useQuery(
    "userFollowerCache",
    async () => {
      const config = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await api.get(`/followers/${state?.user.id}`, config);
      return response;
    },
    { refetchOnWindowFocus: "always" }
  );

  // get user following
  let { data: following } = useQuery(
    "userFollowingCache",
    async () => {
      const config = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await api.get(`/following/${state?.user.id}`, config);
      return response.data?.followings;
    },
    {
      refetchOnWindowFocus: "always",
    }
  );

  // set title page
  const title = "Create Post";
  document.title = "DumbGram | " + title;

  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({
    caption: "",
    image: "",
  });

  const handleOnChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "file" ? e.target.files : e.target.value,
    });

    // Create image url for preview
    if (e.target.type === "file") {
      let url = URL.createObjectURL(e.target.files[0]);
      setPreview(url);
    }
  };

  const handleOnSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      const formData = new FormData();

      formData.set("image", form?.image[0], form?.image[0]?.name);
      formData.set("caption", form.caption);

      const config = {
        method: "POST",
        headers: {
          Authorization: "Basic " + localStorage.token,
        },
        body: formData,
      };

      await api.post("/feed", config);

      navigate("/feed", { replace: true });
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <Container fluid>
      <Row className="feed min-vh-100">
        <Col md={3} className="px-0 pb-5">
          <Logo isSmall className="mt-4 mx-5" />
          <UserProfile
            dataUser={{ profile, posts, follower, following }}
            params={state.user.username}
          />
          <SideNavbar />
        </Col>
        <Col md={9} className="container-fluid pt-4">
          <NavbarComponent />
          <Container>
            <h1 className="text-white fw-bold mt-5">Create Post</h1>
            <Form
              onSubmit={(e) => {
                handleOnSubmit.mutate(e);
              }}
            >
              {preview && (
                <div>
                  <img
                    src={preview}
                    style={{
                      maxWidth: "500px",
                      maxHeight: "500px",
                      objectFit: "cover",
                    }}
                    alt="preview"
                  />
                </div>
              )}
              <Form.Control
                type="file"
                id="upload"
                name="image"
                hidden
                onChange={handleOnChange}
              />
              <label
                htmlFor="upload"
                className="mb-3 mt-5 px-4 py-3 btn btn-primary btn-file fs-6"
              >
                Upload Photos or Videos
              </label>
              <Form.Control
                as="textarea"
                name="caption"
                value={form.caption}
                placeholder="Caption"
                style={{ height: "200px" }}
                onChange={handleOnChange}
              />
              <div className="ms-auto d-flex justify-content-end">
                <Button
                  type="submit"
                  className="mt-5"
                  style={{ padding: "12px 20px" }}
                >
                  Upload
                </Button>
              </div>
            </Form>
          </Container>
        </Col>
      </Row>
    </Container>
  );
}
