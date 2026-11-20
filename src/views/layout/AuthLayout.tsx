import React from "react";
import { Outlet } from "react-router-dom";

interface AuthLayoutProps {
  children?: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div
      id="kt_body"
      className="is-auth d-flex flex-column flex-root"
    >
      {children || <Outlet />}
    </div>
  );
};

export default AuthLayout;
