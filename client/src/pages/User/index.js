import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import {
  CommentIcon,
  LikeIcon,
  Logo,
  MessageIcon,
} from "../../components/atoms";
import {
  DetailFeedModal,
  SideNavbar,
  UserProfile,
  NavbarComponent,
} from "../../components/molecules";
import { useUserContext } from "../../context/userContext";
import { API } from "../../config/api";
import { Link, Navigate, useParams } from "react-router-dom";
import Masonry from "react-masonry-css";

export default function User() {
  let api = API();
  const [state, dispatch] = useUserContext();
  const { id } = state.user;
  const [selectedImage, setSelectedImage] = useState(null);
  const { username } = useParams();

  // set title
  const title = username;
  document.title = "DumbGram | " + title;

  // get data profile
  let { data: profile } = useQuery("dataUsernameCache", async () => {
    try {
      const config = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await api.get(`/user-profile/${username}`, config);
      return response?.data;
    } catch (err) {
      console.log(err);
    }
  });

  // get user feeds
  let { data: posts } = useQuery(
    "userFeedByUsernameCache",
    async () => {
      const config = {
        method: "GET",
        headers: {
          Authorization: "Basic " + localStorage.token,
        },
      };
      const response = await api.get(`/user-feeds/${profile?.id}`, config);
      return response.posts[0];
    },
    {
      enabled: !!profile?.id,
    }
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

      const response = await api.get(`/followers/${profile?.id}`, config);
      return response;
    },
    {
      refetchOnWindowFocus: false,
      enabled: !!profile?.id,
    }
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

      const response = await api.get(`/following/${profile?.id}`, config);
      return response.data?.followings;
    },
    {
      refetchOnWindowFocus: false,
      enabled: !!profile?.id,
    }
  );

  // get data feeds
  let {
    data: feeds,
    isSuccess,
    isLoading,
    refetch,
  } = useQuery(
    "userFollowingFeedCache",
    async () => {
      const config = {
        method: "GET",
        headers: {
          Authorization: "Basic " + localStorage.token,
        },
      };
      const response = await api.get(`/user-posts/${username}`, config);
      return response?.data?.feed;
    },
    { refetchOnWindowFocus: false }
  );

  const handleDetailFeedModal = (feedId) => {
    const feed = feeds.find((item) => item.id === feedId);
    setSelectedImage({ ...feed, currentUserId: id });
  };

  const handleLike = useMutation(async (feedId) => {
    try {
      const config = {
        method: "POST",
        headers: {
          Authorization: "Basic " + localStorage.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: feedId }),
      };

      await api.post("/like", config);
      refetch();
    } catch (error) {
      console.log(error);
    }
  });

  const handleUnLike = useMutation(async (feedId) => {
    try {
      const config = {
        method: "DELETE",
        headers: {
          Authorization: "Basic " + localStorage.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: feedId }),
      };
      await api.delete("/unlike", config);
      refetch();
    } catch (error) {
      console.log(error);
    }
  });

  useEffect(() => {
    refetch();
  }, [selectedImage]);

  return (
    <Container fluid>
      <Row className="feed min-vh-100">
        <Col md={3} className="px-0 pb-5">
          <Logo isSmall className="mt-4 mx-5" />
          <UserProfile
            dataUser={{ profile, posts, follower, following }}
            params={username}
          />
          <SideNavbar />
        </Col>
        <Col md={9} className="container-fluid pt-4">
          <NavbarComponent />
          <h1 className="text-white fw-bold mt-3 ps-4">{username}, Feed</h1>
          <Masonry
            breakpointCols={{ default: 3, 1200: 3, 1000: 2, 700: 1 }}
            className="masonry-grid"
            columnClassName="masonry-grid_column"
          >
            {isLoading && <p className="text-danger">loading...</p>}
            {isSuccess &&
              feeds?.map((feed, index) => {
                return (
                  <div key={index}>
                    <img
                      src={feed.image}
                      alt=""
                      onClick={() => handleDetailFeedModal(feed.id)}
                    />
                    <Row className="mt-3">
                      <Col md={6}>
                        <div className="d-flex align-items-center">
                          <div
                            className="profile-background"
                            style={{ width: "30px", height: "30px" }}
                            onClick={() => handleDetailFeedModal(feed.id)}
                          >
                            <img
                              src={feed?.user?.profile?.image}
                              alt={feed.user.fullName}
                              className="profile-image-sm"
                            />
                          </div>
                          <span
                            className="profile-name-sm"
                            onClick={() => handleDetailFeedModal(feed.id)}
                          >
                            {feed.user.username}
                          </span>
                        </div>
                      </Col>
                      <Col
                        md={6}
                        className="d-flex justify-content-end align-items-center"
                      >
                        <div className="me-2">
                          {feed?.likes?.find((item) => item.userId === id) ? (
                            <label
                              htmlFor=""
                              onClick={(e) => {
                                handleUnLike.mutate(feed.id);
                              }}
                            >
                              <LikeIcon fill={"red"} stroke={"red"} />
                            </label>
                          ) : (
                            <label
                              htmlFor=""
                              onClick={() => {
                                handleLike.mutate(feed.id);
                              }}
                            >
                              <LikeIcon fill={"none"} stroke={"#ABABAB"} />
                            </label>
                          )}
                        </div>
                        <Link to="" className="me-2">
                          <CommentIcon />
                        </Link>
                        <Link to="/home/message" className="me-2">
                          <MessageIcon />
                        </Link>
                      </Col>
                      <span
                        className="text-end text-muted my-3"
                        style={{ fontSize: "18px" }}
                      >
                        {feed?.likes?.length}
                        {feed?.likes?.length < 2 ? " Like" : " Likes"}
                      </span>
                    </Row>
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
