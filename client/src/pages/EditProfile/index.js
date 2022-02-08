import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { Logo } from "../../components/atoms";
import {
  SideNavbar,
  UserProfile,
  NavbarComponent,
} from "../../components/molecules";
import { API } from "../../config/api";
import { useUserContext } from "../../context/userContext";

export default function EditProfile() {
  let api = API();
  const [state, dispatch] = useUserContext();
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({});

  // get data users
  let { data: profile, isSuccess } = useQuery(
    "editProfileCache",
    async () => {
      const config = {
        method: "GET",
        headers: {
          Authorization: "Basic " + localStorage.token,
        },
      };

      const response = await api.get("/user-profile", config);

      setForm({
        image: response?.data?.image,
        fullName: response?.data?.fullName,
        username: response?.data?.username,
        bio: response?.data?.bio,
      });

      return response.data;
    },
    { refetchOnWindowFocus: false, cacheTime: 1000 }
  );

  // get user feeds
  let { data: posts } = useQuery("userFeedCache", async () => {
    const config = {
      method: "GET",
      headers: {
        Authorization: "Basic " + localStorage.token,
      },
    };
    const response = await api.get(`/user-feeds/${state?.user.id}`, config);
    return response.posts[0];
  });

  // get user followers
  let { data: follower } = useQuery("userFollowerCache", async () => {
    const config = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await api.get(`/followers/${state?.user.id}`, config);
    return response;
  });

  // get user following
  let { data: following } = useQuery("userFollowingCache", async () => {
    const config = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await api.get(`/following/${state?.user.id}`, config);
    return response.data?.followings;
  });

  // set title
  const title = "Edit Profile";
  document.title = "DumbGram | " + title;

  const handleOnChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "file" ? e.target?.files : e.target.value,
    });

    if (e.target.type === "file") {
      const url = URL.createObjectURL(e.target.files[0]);
      setPreview(url);
    }
  };

  const handleOnSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();
      const formData = new FormData();

      if (typeof form.image === "object") {
        formData.set("image", form?.image[0], form?.image[0]?.name);
      }

      formData.set("username", form.username);
      formData.set("fullName", form.fullName);
      formData.set("bio", form.bio);

      const config = {
        method: "PATCH",
        headers: {
          Authorization: "Basic " + localStorage.token,
        },
        body: formData,
      };

      await api.patch(`/user/${state?.user.id}`, config);

      setPreview();
      setForm({});

      navigate("/feed", { replace: true });
    } catch (err) {
      console.log(err);
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
            <h1 className="text-white fw-bold mt-5">Edit Profile</h1>
            {isSuccess && (
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
                  Upload Photos
                </label>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Full Name"
                    name="fullName"
                    onChange={handleOnChange}
                    value={form?.fullName}
                    className="py-3"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="username"
                    placeholder="Username"
                    name="username"
                    onChange={handleOnChange}
                    value={form.username}
                    className="py-3"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="bio">
                  <Form.Control
                    as="textarea"
                    name="bio"
                    placeholder="Bio"
                    style={{ height: "200px" }}
                    onChange={handleOnChange}
                    value={form.bio}
                  />
                </Form.Group>
                <div className="ms-auto d-flex justify-content-end">
                  <Button
                    type="submit"
                    className="mt-5"
                    style={{ padding: "12px 30px" }}
                  >
                    Save
                  </Button>
                </div>
              </Form>
            )}
          </Container>
        </Col>
      </Row>
    </Container>
  );
}
