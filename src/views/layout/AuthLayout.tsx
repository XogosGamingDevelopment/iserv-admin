import React from "react";
import { Outlet } from "react-router-dom";

interface AuthLayoutProps {
  children?: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div
      id="kt_body"
      className="d-flex flex-column flex-root min-vh-100"
      style={{
        backgroundImage: `url('/assets/media/auth/bg4.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        width: "100vw",
      }}
    >
      {children || <Outlet />}
    </div>
  );
};

export default AuthLayout;
