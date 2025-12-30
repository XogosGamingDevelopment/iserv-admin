//For public/auth pages (Checks: if user is already logged in, redirect to dashboard)

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "../redux/store";
import { checkUserLoggedIn } from "../_helpers/checkUserLoggedIn";
import { setUser } from "../redux/userSlice";

const PublicRoute: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const loggedIn = checkUserLoggedIn();

  // Restore user from localStorage if Redux state is empty
  if (loggedIn && !user) {
    const localUser = localStorage.getItem("user");
    if (localUser) {
      const parsedUser = JSON.parse(localUser);
      dispatch(setUser(parsedUser));
    }
  }

  // If user is logged in, redirect to dashboard
  if (loggedIn && user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Use Outlet to render child routes automatically
  return <Outlet />;
};

export default PublicRoute;
