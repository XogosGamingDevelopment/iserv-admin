import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  //console.log('pathname', pathname);
  // Enhanced path checking function
  const checkActivePath = (path_string: string, regexp: boolean) => {
    if (!regexp) {
      // Exact match for static paths
      return pathname === path_string ? "active" : "";
    } else {
      // Regex match for dynamic segments
      const basePath = path_string.replace("/*", ""); // Remove wildcard for comparison
      const pathParts = pathname.split("/").filter(Boolean); // Split and clean path
      const baseParts = basePath.split("/").filter(Boolean);

      // Check if the base parts match the beginning of the current path
      const isMatch = baseParts.every(
        (part, index) => part === pathParts[index]
      );

      return isMatch ? "active" : "";
    }
  };

  return (
    <div
      id="kt_aside"
      className="aside card"
      data-kt-drawer="true"
      data-kt-drawer-name="aside"
      data-kt-drawer-activate="{default: true, lg: false}"
      data-kt-drawer-overlay="true"
      data-kt-drawer-width="{default:'200px', '300px': '250px'}"
      data-kt-drawer-direction="start"
      data-kt-drawer-toggle="#kt_aside_toggle"
    >
      <div className="aside-menu flex-column-fluid px-4">
        <div
          className="hover-scroll-overlay-y mh-100 my-5"
          id="kt_aside_menu_wrapper"
          data-kt-scroll="true"
          data-kt-scroll-activate="true"
          data-kt-scroll-height="auto"
          data-kt-scroll-dependencies="{default: '#kt_aside_footer', lg: '#kt_header, #kt_aside_footer'}"
          data-kt-scroll-wrappers="#kt_aside, #kt_aside_menu"
          data-kt-scroll-offset="{default: '5px', lg: '75px'}"
          style={{ height: "315px" }}
        >
          <div
            className="menu menu-column menu-rounded menu-sub-indention fw-semibold fs-6"
            id="#kt_aside_menu"
            data-kt-menu="true"
          >
            <div className="menu-item" onClick={() => navigate("/dashboard")}>
              <span
                className={`menu-link ${checkActivePath("/dashboard", false)}`}
              >
                <span className="menu-icon">
                  <i className="ki-outline ki-home-2 text-info fs-2"></i>
                </span>
                <span className="menu-title">Dashboards</span>
              </span>
            </div>
            <div className="mx-4 mt-1 mb-1"></div>
            <div className="menu-item" onClick={() => navigate("/admin-list")}>
              <span
                className={`menu-link ${
                  checkActivePath("/admin-list", false) ||
                  checkActivePath("/admin-list/*", true)
                }`}
              >
                <span className="menu-icon">
                  <i className="ki-outline ki-security-user text-info fs-2"></i>
                </span>
                <span className="menu-title">Admin Users List</span>
              </span>
            </div>
            <div className="mx-4 mt-1 mb-1"></div>
            <div
              className="menu-item"
              onClick={() => navigate("/settings-list")}
            >
              <span
                className={`menu-link ${
                  checkActivePath("/settings-list", false) ||
                  checkActivePath("/settings-list/*", true)
                }`}
              >
                <span className="menu-icon">
                  <i className="ki-outline ki-gear text-info fs-2"></i>
                </span>
                <span className="menu-title">Settings</span>
              </span>
            </div>
            <div className="mx-4 mt-1 mb-1"></div>
            <div className="menu-item" onClick={() => navigate("/npo-list")}>
              <span
                className={`menu-link ${
                  checkActivePath("/npo-list", false) ||
                  checkActivePath("/npo-detail/*", true)
                }`}
              >
                <span className="menu-icon">
                  <i className="ki-outline ki-people text-info fs-2"></i>
                </span>
                <span className="menu-title">NPO List</span>
              </span>
            </div>
            <div className="mx-4 mt-1 mb-1"></div>
            <div
              className="menu-item"
              onClick={() => navigate("/student-list")}
            >
              <span
                className={`menu-link ${
                  checkActivePath("/student-list", false) ||
                  checkActivePath("/student-detail/*", true)
                }`}
              >
                <span className="menu-icon">
                  <i className="ki-outline ki-people text-info fs-2"></i>
                </span>
                <span className="menu-title">Student List</span>
              </span>
            </div>
            <div className="mx-4 mt-1 mb-1"></div>
            <div className="menu-item" onClick={() => navigate("/parent-list")}>
              <span
                className={`menu-link ${
                  checkActivePath("/parent-list", false) ||
                  checkActivePath("/parent-detail/*", true)
                }`}
              >
                <span className="menu-icon">
                  <i className="ki-outline ki-people text-info fs-2"></i>
                </span>
                <span className="menu-title">Parent List</span>
              </span>
            </div>
            <div className="mx-4 mt-1 mb-1"></div>
            <div
              className="menu-item"
              onClick={() => navigate("/teacher-list")}
            >
              <span
                className={`menu-link ${
                  checkActivePath("/teacher-list", false) ||
                  checkActivePath("/teacher-detail/*", true)
                }`}
              >
                <span className="menu-icon">
                  <i className="ki-outline ki-people text-info fs-2"></i>
                </span>
                <span className="menu-title">Teacher List</span>
              </span>
            </div>
            <div className="mx-4 mt-1 mb-1"></div>
            <div
              className="menu-item"
              onClick={() => navigate("/event-interest-list")}
            >
              <span
                className={`menu-link ${checkActivePath(
                  "/event-interest-list",
                  false
                )}`}
              >
                <span className="menu-icon">
                  <i className="ki-outline ki-element-5 text-info fs-2"></i>
                </span>
                <span className="menu-title">Event Interest List</span>
              </span>
            </div>
            <div className="mx-4 mt-1 mb-1"></div>
            <div className="menu-item" onClick={() => navigate("/event-list")}>
              <span
                className={`menu-link ${
                  checkActivePath("/event-list", false) ||
                  checkActivePath("/event-detail/*", true)
                }`}
              >
                <span className="menu-icon">
                  <i className="ki-outline ki-calendar-add text-info fs-2"></i>
                </span>
                <span className="menu-title">Event List</span>
              </span>
            </div>
            <div className="mx-4 mt-1 mb-1"></div>
            <div
              className="menu-item"
              onClick={() => navigate("/reported-list")}
            >
              <span
                className={`menu-link ${checkActivePath(
                  "/reported-list",
                  false
                )}`}
              >
                <span className="menu-icon">
                  <i className="ki-outline ki-message-notif text-info fs-2"></i>
                </span>
                <span className="menu-title">Reported</span>
              </span>
            </div>
            <div className="mx-4 mt-1 mb-1"></div>
            <div
              data-kt-menu-trigger="click"
              className="menu-item menu-accordion"
            >
              <span className="menu-link">
                <span className="menu-icon">
                  <i className="ki-outline ki-color-swatch text-info fs-2"></i>
                </span>
                <span className="menu-title">Approval List</span>
                <span className="menu-arrow"></span>
              </span>
              <div
                className="menu-sub menu-sub-accordion"
                kt-hidden-height="50"
              >
                <div
                  className="menu-item"
                  onClick={() => navigate("/approval-review-list")}
                >
                  <span
                    className={`menu-link ${checkActivePath(
                      "/approval-review-list",
                      false
                    )}`}
                  >
                    <span className="menu-bullet">
                      <span className="bullet bullet-dot"></span>
                    </span>
                    <span className="menu-title">Review List</span>
                  </span>
                </div>
                <div
                  className="menu-item"
                  onClick={() => navigate("/approval-event-image-list")}
                >
                  <span
                    className={`menu-link ${checkActivePath(
                      "/approval-event-image-list",
                      false
                    )}`}
                  >
                    <span className="menu-bullet">
                      <span className="bullet bullet-dot"></span>
                    </span>
                    <span className="menu-title">Image List</span>
                  </span>
                </div>
                <div
                  className="menu-item"
                  onClick={() => navigate("/approval-volunteer-list")}
                >
                  <span
                    className={`menu-link ${checkActivePath(
                      "/approval-volunteer-list",
                      false
                    )}`}
                  >
                    <span className="menu-bullet">
                      <span className="bullet bullet-dot"></span>
                    </span>
                    <span className="menu-title">Volunteer List</span>
                  </span>
                </div>
              </div>
            </div>
			<div className="mx-4 mt-1 mb-1"></div>
            <div
              className="menu-item"
              onClick={() => navigate("/archived-review-list")}
            >
              <span
                className={`menu-link ${checkActivePath(
                  "/archived-review-list",
                  false
                )}`}
              >
                <span className="menu-icon">
                  <i className="ki-outline ki-archive-tick text-info fs-2"></i>
                </span>
                <span className="menu-title">Archived Review List</span>
              </span>
            </div>
            <div className="mx-4 mt-1 mb-1"></div>
            {/*<div className="menu-item">
					  <span className={`menu-link ${checkActivePath('/flag-list', false)}`}>
						<span className="menu-icon">
						  <i className="ki-outline ki-flag text-info fs-2"></i>
						</span>
						<span className="menu-title">Flaged List</span>
					  </span>
					</div>*/}
            <div
              className="menu-item"
              onClick={() => navigate("/age-group-management")}
            >
              <span
                className={`menu-link ${checkActivePath(
                  "/age-group-management",
                  false
                )}`}
              >
                <span className="menu-icon">
                  <i className="ki-outline ki-user text-info fs-2"></i>
                </span>
                <span className="menu-title">Age Group List</span>
              </span>
            </div>
            <div className="mx-4 mt-1 mb-1"></div>
            <div
              className="menu-item"
              onClick={() => navigate("/badge-management-list")}
            >
              <span
                className={`menu-link ${checkActivePath(
                  "/badge-management-list",
                  false
                )}`}
              >
                <span className="menu-icon">
                  <i className="ki-outline ki-badge text-info fs-2"></i>
                </span>
                <span className="menu-title">Badge Management List</span>
              </span>
            </div>
            <div className="mx-4 mt-1 mb-1"></div>
            <div
              className="menu-item"
              onClick={() => navigate("/news-letter-email-list")}
            >
              <span
                className={`menu-link ${checkActivePath(
                  "/news-letter-email-list",
                  false
                )}`}
              >
                <span className="menu-icon">
                  <i className="ki-outline ki-folder text-info fs-2"></i>
                </span>
                <span className="menu-title">News Letter Email List</span>
              </span>
            </div>
            <div className="mx-4 mt-1 mb-1"></div>
            <div className="menu-item" onClick={() => navigate("/user-posts")}>
              <span
                className={`menu-link ${checkActivePath("/user-posts", false)}`}
              >
                <span className="menu-icon">
                  <i className="ki-outline ki-social-media text-info fs-2"></i>
                </span>
                <span className="menu-title">Social Media</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
