import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useAxios from "../../hooks/useAxios";

function ForgotPasswordEmailSent() {
  const axiosInstance = useAxios();
  const location = useLocation();
  const resetEmail = location.state?.reset_email; // Access the passed email
  //console.log('resetEmail', resetEmail)
  const [isSubmitting, setIsSubmitting] = useState(false);

  /*Submit Form*/
  const handleSubmit = async (): Promise<void> => {
    setIsSubmitting(true);
    var form_data = { email: resetEmail, request_type: "resend" };
    try {
      // const response: any = await axiosInstance({
      await axiosInstance({
        url: "users/forgot-password",
        method: "POST",
        data: form_data,
      });
      //console.log('resend forgot email response', response.data);
    } catch (error) {
      console.error("Error in api request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="d-flex flex-column flex-root" id="kt_app_root">
      <div className="d-flex flex-column flex-center flex-column-fluid">
        <div className="d-flex flex-column flex-center p-10">
          <div className="card card-flush w-md-650px py-5">
            <div className="card-body py-15 py-lg-20">
              <div className="text-center  mb-7">
                <a href="/" className="">
                  <img
                    alt="Logo"
                    src="/admin/mascot-logo.png"
                    className="h-40px"
                  />
                </a>
              </div>
              <h1 className="fw-bolder text-gray-900 text-center mb-5">
                Password Reset Email Sent
              </h1>
              <p className="fw-semibold fs-6 text-gray-500 mb-7">
                We've sent an email with instructions to reset your password.
                Please check your inbox and follow the steps provided.
              </p>
              <p className="fw-semibold fs-6 text-gray-500 mb-7">
                If you didn't request a password reset or want to log in to a
                different account, click{" "}
                <Link
                  to="/login"
                  className="link-primary fw-bold cursor-pointer"
                >
                  Return to Login.
                </Link>
              </p>

              <div className="text-center mb-0">
                <img
                  src="/assets/media/auth/please-verify-your-email.png"
                  className="mw-100 mh-300px theme-light-show"
                  alt=""
                />
                <img
                  src="/assets/media/auth/please-verify-your-email-dark.png"
                  className="mw-100 mh-300px theme-dark-show"
                  alt=""
                />
              </div>
              <div className="text-center mb-0">
                {!isSubmitting ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleSubmit()}
                    disabled={false}
                  >
                    <span className="indicator-label">Resend Email</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    disabled
                  >
                    <span
                      className="indicator-progress"
                      style={{ display: "block" }}
                    >
                      Please wait...
                      <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordEmailSent;
