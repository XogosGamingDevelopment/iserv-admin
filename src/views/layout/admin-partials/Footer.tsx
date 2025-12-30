import React from "react";

function Footer() {
  return (
    <div
      className="footer py-3 d-flex flex-column flex-md-row flex-stack "
      id="kt_footer"
    >
      <div className="text-gray-900 order-2 order-md-1">
        <span className="text-muted fw-semibold me-1">2025©</span>
        <a
          href="https://iservapp.org"
          target="_blank"
          rel="noreferrer"
          className="text-gray-800 text-hover-primary"
        >
          iServ
        </a>
      </div>
    </div>
  );
}

export default Footer;
