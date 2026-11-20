//For private/admin pages (Checks: user is logged in and has required role(s))

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState } from "../redux/store"; // Adjust the path to your store
import { checkUserLoggedIn } from "../_helpers/checkUserLoggedIn";
import { setUser } from "../redux/userSlice";

const ADMIN_ROLES = ["super_admin", "npo_admin", "student_admin"];

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

  // Restore user from localStorage if Redux state is empty. The role check below uses the restored account
  // straight away; it used to read the still-empty Redux state, so reloading any page bounced to the dashboard.
  let current: any = user;
  if (!current) {
    const localUser = localStorage.getItem("user");
    if (localUser) {
      const parsedUser = JSON.parse(localUser);
      dispatch(setUser(parsedUser)); // Update Redux state
      current = parsedUser;
    } else {
      console.error("User not found in Redux or localStorage!");
      return <Navigate to="/login" replace />;
    }
  }

  let userRole = current?.rolename || "";
  //console.log('ProtectedRoute userRole', userRole);
  //console.log('ProtectedRoute allowedRoles', allowedRoles);
  if (!allowedRoles.includes(userRole)) {
    // A signed-in admin without access to this page goes to the dashboard; anyone else to sign-in.
    return <Navigate to={ADMIN_ROLES.includes(userRole) ? "/dashboard" : "/login"} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
