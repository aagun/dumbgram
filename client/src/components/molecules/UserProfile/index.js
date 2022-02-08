import "./style.css";
import React from "react";
import { Row, Col, Image, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Icons } from "../../../assets";
import { useUserContext } from "../../../context/userContext";
import { useMutation, useQuery } from "react-query";
import { API } from "../../../config/api";

export default function UserProfile(props) {
  const { params, dataUser } = props;
  const { profile, posts, follower, following } = dataUser;
  const [state, dispatch] = useUserContext();
  const currentUser = params === state.user.username;
  let api = API();

  // get user following
  let {
    data: isUserFollowing,
    refetch,
    isSuccess,
  } = useQuery(
    "checkFollowingCache",
    async () => {
      const config = {
        method: "GET",
        headers: {
          Authorization: "Basic " + localStorage.token,
          "Content-Type": "application/json",
        },
      };

      const response = await api.get(`/checkFollowing/${profile?.id}`, config);
      return response?.isUserFollowing;
    },
    {
      refetchOnWindowFocus: false,
    }
  );
  const handleFollow = useMutation(async (e) => {
    try {
      e.preventDefault();

      const config = {
        method: "POST",
        headers: {
          Authorization: "Basic " + localStorage.token,
          "Content-Type": "application/json",
        },
      };

      await api.post(`/follow/${profile?.id}`, config);
      refetch();
    } catch (error) {
      console.log(error);
    }
  });

  const handleUnFollow = useMutation(async (e) => {
    try {
      e.preventDefault();
      const config = {
        method: "DELETE",
        headers: {
          Authorization: "Basic " + localStorage.token,
          "Content-Type": "application/json",
        },
      };

      await api.delete(`/unfollow/${profile?.id}`, config);
      refetch();
    } catch (error) {
      console.log(error);
    }
  });

  console.log(isUserFollowing);

  return (
    <>
      {
        <Row className="profile mt-3">
          <div className="d-flex flex-column align-items-center mt-5">
            {currentUser && (
              <Link to="/edit-profile" className="ms-auto me-5 mb-4">
                <Image src={Icons.Edit} />
              </Link>
            )}
            <div
              className="profile-background"
              style={{ width: "150px", height: "150px" }}
            >
              <img className="profile-image" src={profile?.image} alt="" />
            </div>
            <span className="profile-name mb-1">{profile?.fullName}</span>
            <span className="profile-username mb-5">@{profile?.username}</span>
            {!currentUser && (
              <Col className="mb-5">
                <Link to="/inbox" className="btn btn-primary ms-3 fs-6">
                  Messagas
                </Link>
                {isSuccess && isUserFollowing ? (
                  <Button
                    className="btn btn-secondary ms-3 fw-bold fs-6"
                    onClick={(e) => {
                      handleUnFollow.mutate(e);
                    }}
                  >
                    Unfollow
                  </Button>
                ) : (
                  <Button
                    className="btn btn-secondary ms-3 fw-bold fs-6"
                    onClick={(e) => {
                      handleFollow.mutate(e);
                    }}
                  >
                    Follow
                  </Button>
                )}
              </Col>
            )}
            <Container fluid>
              <Row className="insight">
                <Col>
                  <p className="text-muted">Posts</p>
                  <p className="text-white">{posts?.sum}</p>
                </Col>
                <Col>
                  <p className="text-muted">Followers</p>
                  <p className="text-white">
                    {follower?.data?.followers.length}
                  </p>
                </Col>
                <Col className="me-4">
                  <p className="text-muted">Following</p>
                  <p className="text-white">{following?.length}</p>
                </Col>
              </Row>
            </Container>
            <div className="w-100 px-5">
              <p className="bio">{profile?.bio}</p>
            </div>
          </div>
        </Row>
      }
    </>
  );
}
