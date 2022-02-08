import React from "react";
import { Outlet } from "react-router-dom";
import { useUserContext } from "../../../context/userContext";

export default function PrivateRoute() {
  const [state, dispatch] = useUserContext();
  return <div>{state.isLogin && <Outlet />}</div>;
}
