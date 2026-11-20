import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import useAxios from "../hooks/useAxios";
import { User, IDashboard } from "../types/interfaces";
import { Link } from "react-router-dom";

/* Dashboard in the website's style: a hero with a kicker and gradient name, then stat tiles grouped
   into "needs you" (amber), people and events. Every tile links to the list behind the number. */

type Tile = { key: keyof IDashboard; label: string; to: string; icon: string; tone?: "amber" | "coral" };

const attention: Tile[] = [
  { key: "volunteer_approval_count", label: "Volunteer sign-ups to approve", to: "/approval-volunteer-list", icon: "ki-people", tone: "amber" },
  { key: "image_approval_count", label: "Event photos to approve", to: "/approval-event-image-list", icon: "ki-picture", tone: "amber" },
  { key: "review_approval_count", label: "Feedback to review", to: "/approval-review-list", icon: "ki-messages", tone: "amber" },
  { key: "complaint_count", label: "Complaints and issues", to: "/reported-list", icon: "ki-message-notif", tone: "coral" },
];
const people: Tile[] = [
  { key: "student_count", label: "Students", to: "/student-list", icon: "ki-profile-user" },
  { key: "parent_count", label: "Parents", to: "/parent-list", icon: "ki-people" },
  { key: "teacher_count", label: "Teachers", to: "/teacher-list", icon: "ki-teacher" },
  { key: "npo_count", label: "Non-profits", to: "/npo-list", icon: "ki-bank" },
];
const events: Tile[] = [
  { key: "event_count", label: "Total events", to: "/event-list", icon: "ki-calendar-tick" },
  { key: "completed_event_count", label: "Completed events", to: "/event-list?event_status=2", icon: "ki-verify" },
  { key: "cancelled_event_count", label: "Cancelled events", to: "/event-list?event_status=3", icon: "ki-cross-circle", tone: "coral" },
];

function Dashboard() {
  const axiosInstance = useAxios();
  const user = useSelector((state: RootState) => state.user.user);
  const [dashboarddata, setDashboardData] = useState<IDashboard>({
    event_count: 0,
    npo_count: 0,
    student_count: 0,
    parent_count: 0,
    teacher_count: 0,
    complaint_count: 0,
    image_approval_count: 0,
    volunteer_approval_count: 0,
    review_approval_count: 0,
    cancelled_event_count: 0,
    completed_event_count: 0,
  });
  const [currentuser, setCurrentUser] = useState<User | null>(null);
  const isInitialRender = useRef(false);

  useEffect(() => {
    if (user) {
      setCurrentUser(user);
    }
  }, [user]);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    getDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDashboardData = async () => {
    try {
      const response: any = await axiosInstance({
        url: "dashboard/dashboard-data",
        method: "GET",
      });
      setDashboardData({
        ...dashboarddata,
        event_count: response.data.event_count,
        npo_count: response.data.npo_count,
        student_count: response.data.student_count,
        parent_count: response.data.parent_count,
        teacher_count: response.data.teacher_count,
        complaint_count: response.data.complaint_count,
        image_approval_count: response.data.image_approval_count,
        volunteer_approval_count: response.data.volunteer_approval_count,
        review_approval_count: response.data.review_approval_count,
        cancelled_event_count: response.data.cancelled_event_count,
        completed_event_count: response.data.completed_event_count,
      });
    } catch (error: any) {
      console.error("Error in api request:", error);
    }
  };

  const firstName = (currentuser?.fullname || "").trim().split(/\s+/)[0] || "there";
  const waiting = attention.reduce((n, t) => n + (Number(dashboarddata[t.key]) || 0), 0);

  const renderTiles = (tiles: Tile[]) => (
    <div className="is-stat-grid">
      {tiles.map((t) => (
        <Link key={t.key} to={t.to} className={`is-stat ${t.tone ? `is-${t.tone}` : ""}`}>
          <span className="is-stat-icon" aria-hidden="true">
            <i className={`ki-outline ${t.icon}`}></i>
          </span>
          <span className="is-stat-value">{Number(dashboarddata[t.key] || 0).toLocaleString()}</span>
          <span className="is-stat-label">{t.label}</span>
        </Link>
      ))}
    </div>
  );

  return (
    <div id="kt_content" className="content flex-column-fluid pb-5">
      <section className="is-hero mb-2">
        <span className="is-kicker">iServ Admin</span>
        <h1 className="is-hero-title">
          Welcome back, <span className="is-grad">{firstName}</span>.
        </h1>
        <p className="is-hero-sub">
          {waiting > 0
            ? `${waiting.toLocaleString()} item${waiting === 1 ? " is" : "s are"} waiting on an admin.`
            : "Nothing is waiting on an admin right now."}
        </p>
        <div className="is-hero-actions">
          <Link to="/approval-service-reports" className="is-btn-teal">
            Review self-reported service <i className="ki-outline ki-arrow-right fs-4 text-inherit"></i>
          </Link>
          <Link to="/outreach-organizations" className="is-btn-ghost">
            Outreach organizations
          </Link>
        </div>
      </section>

      <p className="is-section-label">Needs your attention</p>
      {renderTiles(attention)}

      <p className="is-section-label">People</p>
      {renderTiles(people)}

      <p className="is-section-label">Events</p>
      {renderTiles(events)}
    </div>
  );
}

export default Dashboard;
