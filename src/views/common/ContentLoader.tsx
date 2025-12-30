import React from "react";

const ContentLoader: React.FC = () => {
  return (
    <div
      className="overlay-layer bg-dark"
      style={{
        backgroundColor: "rgb(163 163 163 / 44%)",
        opacity: 0.3,
        borderRadius: "0.85rem",
      }}
    >
      <div className="d-flex align-items-center">
        <div className="spinner-border text-white me-2" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <span className="text-white">Wait Loading...</span>
      </div>
    </div>
  );
};

export default ContentLoader;
