import React from "react";

/* Same wording as the website's footer bar. */
function Footer() {
  return (
    <div className="footer py-4 d-flex flex-column flex-md-row flex-stack gap-2" id="kt_footer">
      <span>
        © {new Date().getFullYear()} Innovate the Future · iServ Admin
      </span>
      <span>
        <a href="https://www.iservapp.org" target="_blank" rel="noreferrer">iservapp.org</a>
        {" · "}
        <a href="https://www.iservapp.org/privacy-policy" target="_blank" rel="noreferrer">Privacy</a>
        {" · "}
        <a href="https://www.iservapp.org/term-and-conditions" target="_blank" rel="noreferrer">Terms</a>
      </span>
    </div>
  );
}

export default Footer;
