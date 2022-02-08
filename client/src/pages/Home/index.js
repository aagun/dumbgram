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
  PostedImages as Feed,
  MessageModal,
} from "../../components/molecules";
import { useUserContext } from "../../context/userContext";
import { API } from "../../config/api";
import { Link } from "react-router-dom";
import Masonry from "react-masonry-css";

export default function Home() {
  // set title
  const title = "Feed";
  document.title = "DumbGram | " + title;

  let api = API();
  const [state, dispatch] = useUserContext();
  const { id } = state.user;
  const [selectedImage, setSelectedImage] = useState(null);
  const [message, setMessage] = useState(null);

  // get data feeds
  let {
    data: feeds,
    isSuccess,
    isLoading,
    refetch,
  } = useQuery("userFollowingFeedCache", async () => {
    const config = {
      method: "GET",
      headers: {
        Authorization: "Basic " + localStorage.token,
      },
    };
    const response = await api.get(`/feeds/${state?.user.id}`, config);
    return response?.data?.feed;
  });

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

  const handleDetailFeedModal = (feedId) => {
    const feed = feeds.find((item) => item.id === feedId);
    setSelectedImage({ ...feed, currentUserId: id });
  };

  // const handleLike = useMutation(async (args) => {
  //   try {
  //     const { e, feedId } = args;
  //     e.preventDefault();
  //     const config = {
  //       headers: {
  //         Authorization: "Basic " + localStorage.token,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ id: feedId }),
  //     };

  //     if (e.target.checked) {
  //       config.method = "DELETE";
  //       await api.post("/unlike", config);
  //       return refetch();
  //     }

  //     config.method = "POST";
  //     await api.post("/like", config);
  //     refetch();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // });

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
      await api.post("/unlike", config);
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
            params={state.user.username}
          />
          <SideNavbar />
        </Col>
        <Col md={9} className="container-fluid pt-4">
          <NavbarComponent />
          <h1 className="text-white fw-bold mt-3 ps-4">Feed</h1>
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
        <MessageModal message={message} setMessage={setMessage} />
      </Row>
    </Container>
  );
}
