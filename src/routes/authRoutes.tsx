// src/routes/authRoutes.tsx
import { Route, Navigate } from "react-router-dom";
import AuthLayout from "../views/layout/AuthLayout";
import AdminLogin from "../views/Auth/Login";
import ForgotPassword from "../views/Auth/ForgotPassword";
import ForgotPasswordEmailSent from "../views/Auth/ForgotPasswordEmailSent";
import ResetPassword from "../views/Auth/ResetPassword";
import PublicRoute from "../views/PublicRoute";

const AuthRoutes = () => {
  return (
    <Route element={<AuthLayout />}>
      <Route path="/" element={<Navigate to="login" replace />} />

      <Route element={<PublicRoute />}>
        <Route path="login" element={<AdminLogin />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route
          path="forgot-password-email-sent"
          element={<ForgotPasswordEmailSent />}
        />
        <Route path="reset-password/:token" element={<ResetPassword />} />
      </Route>
      
    </Route>
  );
};

export default AuthRoutes;
