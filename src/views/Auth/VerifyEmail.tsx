import React from "react";
import { Link } from "react-router-dom";

function VerifyEmail() {
  const resendVerificationEmail = () => {
    alert("Verification email sent succeesfully please check you inbox");
  };
  return (
    <div className="d-flex flex-column flex-root" id="kt_app_root">
      <div className="d-flex flex-column flex-center flex-column-fluid">
        <div className="d-flex flex-column flex-center p-10">
          <div className="card card-flush w-lg-650px py-5">
            <div className="card-body py-15 py-lg-20">
              <div className="mb-14 text-center">
                <Link to="/" className="">
                  <img
                    alt="Logo"
                    src="/admin/mascot-logo.png"
                    className="h-40px"
                  />
                </Link>
              </div>
              <h1 className="fw-bolder text-center text-gray-900 mb-5">
                Verify your email
              </h1>
              <p className="fw-semibold fs-6 text-gray-500 mb-7">
                Your account is not verified please verify your account before
                procedding . If you didn't receive the email, make sure to check
                your spam or junk folder.{" "}
              </p>
              <div className="fs-6 mb-8">
                <span className="fw-semibold text-gray-500">
                  If you still can't find it, feel free to resend the
                  verification email{" "}
                </span>
                <span
                  onClick={() => resendVerificationEmail()}
                  className="link-primary fw-bold"
                >
                  Resend Email
                </span>
              </div>
              {/*<div className="mb-11">
								<Link to="index.html" className="btn btn-sm btn-primary">Skip for now</Link>
							</div>*/}
              <div className="mb-0 text-center">
                <img
                  src="/admin/assets/media/auth/please-verify-your-email.png"
                  className="mw-100 mh-300px theme-light-show"
                  alt=""
                />
                <img
                  src="/admin/assets/media/auth/please-verify-your-email-dark.png"
                  className="mw-100 mh-300px theme-dark-show"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
