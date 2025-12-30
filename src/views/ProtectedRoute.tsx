//For private/admin pages (Checks: user is logged in and has required role(s))

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState } from "../redux/store"; // Adjust the path to your store
import { checkUserLoggedIn } from "../_helpers/checkUserLoggedIn";
import { setUser } from "../redux/userSlice";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[]; // List of roles allowed to access the route
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const loggedIn = checkUserLoggedIn();

  if (!loggedIn) {
    // Redirect to the login page if the user is not logged in
    return <Navigate to="/login" replace />;
  }

  // Restore user from localStorage if Redux state is empty
  if (!user) {
    const localUser = localStorage.getItem("user");
    if (localUser) {
      const parsedUser = JSON.parse(localUser);
      dispatch(setUser(parsedUser)); // Update Redux state
    } else {
      console.error("User not found in Redux or localStorage!");
      return <Navigate to="/login" replace />;
    }
  }

  let userRole = user?.rolename || "";
  //console.log('ProtectedRoute userRole', userRole);
  //console.log('ProtectedRoute allowedRoles', allowedRoles);
  if (!allowedRoles.includes(userRole)) {
    // Redirect to home if the user doesn't have the right role
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
