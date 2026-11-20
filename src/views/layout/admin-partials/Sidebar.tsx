import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";

interface NavItem {
  label: string;
  to: string;
  icon: string;
  // Other paths (prefixes) that keep this item highlighted, e.g. a detail page.
  also?: string[];
  superAdminOnly?: boolean;
}

const sections: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Overview",
    items: [{ label: "Dashboard", to: "/dashboard", icon: "ki-home-2" }],
  },
  {
    heading: "Service to verify",
    items: [
      { label: "Self-Reported Service", to: "/approval-service-reports", icon: "ki-verify" },
      { label: "Volunteer Sign-ups", to: "/approval-volunteer-list", icon: "ki-profile-user" },
      { label: "Event Photos", to: "/approval-event-image-list", icon: "ki-picture" },
      { label: "Reviews", to: "/approval-review-list", icon: "ki-star" },
      { label: "Archived Reviews", to: "/archived-review-list", icon: "ki-archive-tick" },
      { label: "Reported Items", to: "/reported-list", icon: "ki-message-notif" },
    ],
  },
  {
    heading: "Outreach",
    items: [
      { label: "Organizations", to: "/outreach-organizations", icon: "ki-handcart" },
      { label: "Schools", to: "/outreach-schools", icon: "ki-teacher" },
    ],
  },
  {
    heading: "People",
    items: [
      { label: "Non-Profits", to: "/npo-list", icon: "ki-people", also: ["/npo-detail"] },
      { label: "Students", to: "/student-list", icon: "ki-people", also: ["/student-detail"] },
      { label: "Parents", to: "/parent-list", icon: "ki-people", also: ["/parent-detail"] },
      { label: "Teachers", to: "/teacher-list", icon: "ki-people", also: ["/teacher-detail"] },
    ],
  },
  {
    heading: "Events",
    items: [
      { label: "Events", to: "/event-list", icon: "ki-calendar-add", also: ["/event-detail", "/create-update-event"] },
      { label: "Event Interests", to: "/event-interest-list", icon: "ki-element-5" },
      { label: "Social Media", to: "/user-posts", icon: "ki-social-media" },
    ],
  },
  {
    heading: "Setup",
    items: [
      { label: "Admin Users", to: "/admin-list", icon: "ki-security-user", superAdminOnly: true },
      { label: "Settings", to: "/settings-list", icon: "ki-gear" },
      { label: "Waivers", to: "/waiver-management", icon: "ki-document" },
      { label: "Age Groups", to: "/age-group-management", icon: "ki-user" },
      { label: "Badges", to: "/badge-management-list", icon: "ki-badge" },
      { label: "Newsletter Emails", to: "/news-letter-email-list", icon: "ki-folder" },
    ],
  },
];

function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  // Only the Super Admin (role 1) manages admins; sub-admins (roles 2-3) don't see that item. The server enforces it too.
  const isSuperAdmin = Number((useSelector((state: RootState) => state.user.user) as any)?.role_id) === 1;

  const isActive = (item: NavItem) =>
    pathname === item.to || (item.also || []).some((p) => pathname === p || pathname.startsWith(`${p}/`));

  return (
    <div
      id="kt_aside"
      className="aside"
      data-kt-drawer="true"
      data-kt-drawer-name="aside"
      data-kt-drawer-activate="{default: true, lg: false}"
      data-kt-drawer-overlay="true"
      data-kt-drawer-width="{default:'230px', '300px': '260px'}"
      data-kt-drawer-direction="start"
      data-kt-drawer-toggle="#kt_aside_toggle"
    >
      <nav className="is-nav" aria-label="Admin sections">
        {sections.map((section) => {
          const items = section.items.filter((i) => !i.superAdminOnly || isSuperAdmin);
          if (!items.length) return null;
          return (
            <React.Fragment key={section.heading}>
              <div className="is-nav-heading">{section.heading}</div>
              {items.map((item) => (
                <button
                  key={item.to}
                  type="button"
                  className={`is-nav-link ${isActive(item) ? "active" : ""}`}
                  aria-current={isActive(item) ? "page" : undefined}
                  onClick={() => navigate(item.to)}
                >
                  <i className={`ki-outline ${item.icon}`} aria-hidden="true"></i>
                  <span>{item.label}</span>
                </button>
              ))}
            </React.Fragment>
          );
        })}
      </nav>
    </div>
  );
}

export default Sidebar;
