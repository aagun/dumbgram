import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Masonry from "react-masonry-css";
import { useQuery } from "react-query";
import { Logo } from "../../components/atoms";
import {
  DetailFeedModal,
  SideNavbar,
  UserProfile,
  NavbarComponent,
} from "../../components/molecules";
import { API } from "../../config/api";
import { useUserContext } from "../../context/userContext";

export default function Explore() {
  // set title
  const title = "Explore";
  document.title = "DumbGram | " + title;

  let api = API();
  const [state, dispatch] = useUserContext();
  const { id } = state.user;
  const [selectedImage, setSelectedImage] = useState(null);

  // get data explores
  const {
    data: explores,
    isSuccess,
    isLoading,
  } = useQuery(
    "exploreCache",
    async () => {
      const config = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await api.get("/feeds", config);
      return response?.data?.feed;
    },
    { refetchOnWindowFocus: false }
  );

  // get data users
  let { data: profile } = useQuery("profileCache", async () => {
    const config = {
      method: "GET",
      headers: {
        Authorization: "Basic " + localStorage.token,
      },
    };

    const response = await api.get("/user-profile", config);
    return response.data;
  });

  // get user posts
  let { data: posts } = useQuery("userFeedCache", async () => {
    const config = {
      method: "GET",
      headers: {
        Authorization: "Basic " + localStorage.token,
      },
    };
    const response = await api.get(`/user-feeds/${state?.user?.id}`, config);
    return response?.posts[0];
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

  const handleDetailFeedModal = (exploreId) => {
    const explore = explores.find((explore_) => explore_.id === exploreId);
    setSelectedImage({ ...explore, currentUserId: id });
  };

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
          <h1 className="text-white fw-bold mt-3 ps-4">Explore</h1>
          <Masonry
            breakpointCols={{ default: 3, 1200: 3, 1000: 2, 700: 1 }}
            className="masonry-grid"
            columnClassName="masonry-grid_column"
          >
            {isLoading && <p className="text-danger">loading...</p>}
            {isSuccess &&
              explores.map((explore, index) => {
                return (
                  <div key={index}>
                    <img
                      src={explore.image}
                      alt=""
                      onClick={() => handleDetailFeedModal(explore.id)}
                    />
                  </div>
                );
              })}
          </Masonry>
          {selectedImage && (
            <DetailFeedModal
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
}
