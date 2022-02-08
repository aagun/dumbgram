import "./style.css";
import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { FormControl, InputGroup } from "react-bootstrap";
import { LikeIcon, CommentIcon, MessageIcon } from "../../atoms";
import { API } from "../../../config/api";
import { useMutation, useQuery } from "react-query";
import { io } from "socket.io-client";

let socket;
export default function DetailFeedModal(props) {
  const { selectedImage, setSelectedImage } = props;
  const [comments, setComments] = useState([]);
  const feed = { ...selectedImage };
  let api = API();

  let {
    data: userFeed,
    remove,
    refetch,
    isSuccess,
  } = useQuery(
    "userFeed",
    async () => {
      try {
        const config = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        };

        const response = await api.get(`/user-feed/${feed.id}`, config);
        return response.data;
      } catch (err) {
        console.log(err);
      }
    },
    { refetchOnWindowFocus: false }
  );

  const closeModal = () => {
    setSelectedImage(null);
    remove();
    document
      .querySelector("body")
      .classList.remove("detail-feed-modal-container");
  };

  const handleLike = useMutation(async (feedId) => {
    try {
      console.log(feedId);
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
    console.log("aku tertriger");
    socket = io("http://localhost:3030", {
      auth: {
        token: localStorage.getItem("token"),
      },
      query: {
        id: feed.currentUserId,
      },
    });

    socket.on("new comment", () => {
      socket.emit("load comments", feed?.id);
    });

    // listen error sent from server
    socket.on("connect_error", (err) => {
      console.error(err.message); // not authorized
    });
    loadComments();

    return () => {
      socket.disconnect();
    };
  }, [comments]);

  useEffect(() => {
    socket = io("http://localhost:3030", {
      auth: {
        token: localStorage.getItem("token"),
      },
      query: {
        id: feed.currentUserId,
      },
    });

    socket.emit("load comments", feed?.id);
    loadComments();
  }, []);

  const loadComments = () => {
    socket.on("comments", async (data) => {
      if (data.length > 0) {
        const dataComments = data.map((item) => ({
          username: item.user.username,
          image: "http://localhost:3030/uploads/" + item.user.profile.image,
          comment: item.comment,
        }));
        setComments(dataComments);
      }
    });
  };

  const sendComment = (e) => {
    if (e.key === "Enter") {
      const data = {
        userId: feed.currentUserId,
        feedId: feed.id,
        comment: e.target.value,
      };

      console.log(data);

      socket.emit("send comment", data);
      e.target.value = "";
    }
  };

  const navigate = useNavigate();
  return (
    <div className="detail-feed-modal-container">
      <div className="detail-feed-container">
        <div className="detail-feed-image">
          {isSuccess && <img src={userFeed?.fileName} alt="" />}
        </div>
        <div className="detail-feed-info pt-5">
          <div className="description">
            <button onClick={closeModal} className="close btn-secondary">
              X
            </button>
            <div
              className="bg-rainbow"
              onClick={() => {
                navigate("/feed/" + userFeed?.username);
              }}
              style={{ cursor: "pointer" }}
            >
              <img src={userFeed?.image} alt="" />
            </div>
            <div>
              <p
                onClick={() => {
                  navigate("/feed/" + userFeed?.username);
                }}
                style={{ cursor: "pointer" }}
              >
                {userFeed?.username}
              </p>
              <p>{userFeed?.caption}</p>
            </div>
          </div>
          <div className="comment-container">
            {comments &&
              comments.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="comment"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      navigate("/feed/" + item.username);
                    }}
                  >
                    <div className="bg-rainbow">
                      <img src={item.image} alt={item.username} />
                    </div>
                    <div>
                      <p>{item.username}</p>
                      <p>{item.comment}</p>
                    </div>
                  </div>
                );
              })}
          </div>
          <div style={{ position: "absolute", bottom: 35, width: "21%" }}>
            <div className="action d-flex justify-content-end align-items-center mb-2">
              {userFeed?.likes?.find(
                (item) => item.userId === feed.currentUserId
              ) ? (
                <label
                  htmlFor=""
                  onClick={(e) => {
                    handleUnLike.mutate(userFeed?.id);
                  }}
                >
                  <LikeIcon fill={"red"} stroke={"red"} />
                </label>
              ) : (
                <label
                  htmlFor=""
                  onClick={() => {
                    handleLike.mutate(userFeed?.id);
                  }}
                >
                  <LikeIcon fill={"none"} stroke={"#ABABAB"} />
                </label>
              )}
              <Link to="" className="mx-2">
                <CommentIcon />
              </Link>
              <Link to="/home/message" className="me-2">
                <MessageIcon />
              </Link>
            </div>
            <p
              className="text-end text-muted me-2 likes"
              style={{ fontSize: "18px" }}
            >
              {userFeed?.likes?.length}
              {userFeed?.likes?.length < 2 ? " Like" : " Likes"}
            </p>
            <InputGroup className="d-flex w-100">
              <FormControl
                placeholder="Comment ..."
                className="me-2"
                onKeyPress={sendComment}
              />
            </InputGroup>
          </div>
        </div>
      </div>
    </div>
  );
}
