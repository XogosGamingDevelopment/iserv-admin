import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./admin-partials/Header";
import Sidebar from "./admin-partials/Sidebar";
import Footer from "./admin-partials/Footer";

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div id="kt_body" className="header-fixed header-tablet-and-mobile-fixed">
      <div className="d-flex flex-column flex-root">
        <div className="page d-flex flex-row flex-column-fluid">
          <div
            className="wrapper d-flex flex-column flex-row-fluid"
            id="kt_wrapper"
          >
            {/*Header Section Start*/}
            <Header />
            {/*Header Section End*/}
            <div className="d-flex flex-column-fluid">
              {/*Sidebar Section Start*/}
              <Sidebar />
              {/*Sidebar Section End*/}
              <div className="d-flex flex-column flex-column-fluid container-fluid">
                {/*Content Section Start*/}
                {children || <Outlet />}
                {/*Content Section Start*/}
                {/*Footer Section Start*/}
                <Footer />
                {/*Footer Section End*/}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
