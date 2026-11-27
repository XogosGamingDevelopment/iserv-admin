import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import useAxios from "../../../hooks/useAxios";

interface NavItem {
  label: string;
  to: string;
  icon: string;
  // Other paths (prefixes) that keep this item highlighted, e.g. a detail page.
  also?: string[];
  superAdminOnly?: boolean;
  // Shows the number of self-reported service reports that need an admin (new + flagged).
  badge?: "selfReports";
}

const sections: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Overview",
    items: [
      { label: "Dashboard", to: "/dashboard", icon: "ki-home-2" },
      { label: "Projects Map", to: "/projects-map", icon: "ki-geolocation" },
      { label: "All Projects & Events", to: "/all-projects", icon: "ki-calendar-8" },
    ],
  },
  {
    heading: "Service to verify",
    items: [
      { label: "Self-Reported Service", to: "/approval-service-reports", icon: "ki-verify", badge: "selfReports" },
      { label: "Volunteer Sign-ups", to: "/approval-volunteer-list", icon: "ki-profile-user" },
      { label: "Photo Gallery", to: "/photo-gallery", icon: "ki-picture", also: ["/approval-event-image-list"] },
      { label: "Reviews", to: "/approval-review-list", icon: "ki-star" },
      { label: "Archived Reviews", to: "/archived-review-list", icon: "ki-archive-tick" },
      { label: "Reported Items", to: "/reported-list", icon: "ki-message-notif" },
    ],
  },
  {
    heading: "Outreach",
    items: [
      { label: "Non-Profit Database", to: "/nonprofit-database", icon: "ki-handcart" },
      { label: "Schools Database", to: "/schools-database", icon: "ki-teacher", also: ["/outreach-schools"] },
      { label: "Cities Database", to: "/cities-database", icon: "ki-tree" },
      { label: "Churches Database", to: "/churches-database", icon: "ki-home-2" },
      { label: "Drip Campaigns", to: "/drip-campaigns", icon: "ki-sms" },
      // The approve / hold / exclude queue for researched organizations (e.g. the 170 held from the Nov 23 import).
      { label: "Review Organizations", to: "/outreach-organizations", icon: "ki-shield-tick" },
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

  // New + flagged self-reports, refreshed every two minutes and whenever the Self-Reported Service page changes one.
  const axiosInstance = useAxios();
  const [selfReports, setSelfReports] = useState<{ new: number; flagged: number } | null>(null);
  useEffect(() => {
    let alive = true;
    const load = () => axiosInstance({ url: "independent-projects/admin-counts", method: "GET" }).then((r: any) => { if (alive && r?.data) setSelfReports(r.data); }).catch(() => undefined);
    load();
    const t = window.setInterval(load, 120000);
    window.addEventListener("iserv:self-report-counts", load);
    return () => { alive = false; window.clearInterval(t); window.removeEventListener("iserv:self-report-counts", load); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const badgeOf = (item: NavItem) => (item.badge === "selfReports" && selfReports ? selfReports.new + selfReports.flagged : 0);

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
                  {badgeOf(item) > 0 ? (
                    <span className="is-nav-badge" aria-label={`${badgeOf(item)} need review`} title={selfReports?.flagged ? `${selfReports.new} new · ${selfReports.flagged} flagged` : undefined}>{badgeOf(item)}</span>
                  ) : null}
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
