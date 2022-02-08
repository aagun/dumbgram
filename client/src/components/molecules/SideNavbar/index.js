import React from "react";
import { Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Icons } from "../../../assets";
import { useUserContext } from "../../../context/userContext";

export default function SideNavbar() {
  const [state, dispatch] = useUserContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({
      type: "LOGOUT",
    });

    navigate("/", { replace: true });
  };
  return (
    <div className="side-navbar">
      <Row>
        <Link className="btn" to="/feed">
          <img src={Icons.Home} alt="home_icon" /> Feed
        </Link>
        <Link className="btn" to="/explore">
          <img src={Icons.Compass} alt="explore_icon" />
          Explore
        </Link>
      </Row>
      <Row>
        <Link className="btn" to="" onClick={handleLogout}>
          <img src={Icons.Exit} alt="logout_icon" />
          Logout
        </Link>
      </Row>
    </div>
  );
}
