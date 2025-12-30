import React from "react";
import { Link } from "react-router-dom";

function Error500() {
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
      <div className="d-flex flex-column flex-root" id="kt_app_root">
        <div className="d-flex flex-column flex-center flex-column-fluid">
          <div className="d-flex flex-column flex-center text-center p-10">
            <div className="card card-flush w-lg-650px py-5">
              <div className="card-body py-15 py-lg-20">
                <h1 className="fw-bolder fs-2qx text-gray-900 mb-4">
                  System Error
                </h1>
                <div className="fw-semibold fs-6 text-gray-500 mb-7">
                  Something went wrong! Please try again later.
                </div>
                <div className="mb-11">
                  <img
                    src="/assets/media/auth/500-error.png"
                    className="mw-100 mh-300px theme-light-show"
                    alt=""
                  />
                  <img
                    src="/assets/media/auth/500-error-dark.png"
                    className="mw-100 mh-300px theme-dark-show"
                    alt=""
                  />
                </div>
                <div className="mb-0">
                  <Link to="/" className="btn btn-sm btn-primary">
                    Return Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Error500;
