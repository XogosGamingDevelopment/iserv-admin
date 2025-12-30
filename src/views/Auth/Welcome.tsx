import React from "react";
import { Link } from "react-router-dom";

function Welcome() {
  const resendVerificationEmail = () => {
    alert("Verification email sent succeesfully please check you inbox");
  };
  return (
    <div className="d-flex flex-column flex-root" id="kt_app_root">
      <div className="d-flex flex-column flex-center flex-column-fluid">
        <div className="d-flex flex-column flex-center p-10">
          <div className="card card-flush w-md-650px py-5">
            <div className="card-body py-15 py-lg-20">
              <div className="mb-7 text-center">
                <a href="/" className="">
                  <img
                    alt="Logo"
                    src="/admin/mascot-logo.png"
                    className="h-40px"
                  />
                </a>
              </div>
              <h1 className="fw-bolder text-gray-900 text-center mb-5">
                Hi [User's Name],
              </h1>
              <p className="fw-semibold fs-6 text-gray-500 mb-7">
                Welcome to iServ! We're excited to have you on board.
              </p>
              <p className="fw-semibold fs-6 text-gray-500 mb-7">
                To get started, we need to verify your email address. We've sent
                a verification link to the email address you provided. Please
                check your inbox and follow the instructions to complete the
                verification process.
              </p>
              <p className="fw-semibold fs-6 text-gray-500 mb-7">
                If you didn't receive the email, make sure to check your spam or
                junk folder. If you still can't find it, feel free to{" "}
                <span
                  onClick={() => resendVerificationEmail()}
                  className="link-primary fw-bold cursor-pointer"
                >
                  resend the verification email
                </span>
                .
              </p>
              <p className="fw-semibold fs-6 text-gray-500 mb-7">
                If you have any questions or need assistance, don’t hesitate to
                reach out to our support team.
              </p>

              <div className="mb-0 text-center">
                <img
                  src="/admin/assets/media/auth/welcome.png"
                  className="mw-100 mh-300px theme-light-show"
                  alt=""
                />
                <img
                  src="/admin/assets/media/auth/welcome-dark.png"
                  className="mw-100 mh-300px theme-dark-show"
                  alt=""
                />
              </div>
              {/*<div className="mb-0">
								<a href="index.html" className="btn btn-sm btn-primary">Go To Dashboard</a>
							</div>*/}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
