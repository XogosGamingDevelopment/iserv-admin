import React, { useEffect, useMemo, useState } from "react";
import { PageToolbar } from "../common";
import { FeedItem, STATES, fetchFeed, fmtDay, isDated, LAST_STATE_KEY, store } from "./feed";

/**
 * /all-projects (Nov 2026): every listing students can see right now (iServ events + community projects from the
 * outreach database), split into dated events and ongoing roles. The Events page only covers events nonprofits post
 * on iServ; most listings are community projects, which were only visible inside Outreach → Organizations.
 */

type Tab = "dated" | "ongoing";
type Sort = "date" | "title" | "org" | "city";
const typeLabel: Record<string, string> = { one_time: "One-time", recurring: "Recurring", internship: "Internship", mentorship: "Mentoring" };

const AllProjects: React.FC = () => {
  const [state, setState] = useState(() => store.get(LAST_STATE_KEY) || "MO");
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("dated");
  const [source, setSource] = useState("all");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("date");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchFeed({ state }).then((r) => { if (alive) { setItems(r.items); setError(r.error || ""); setLoading(false); } });
    return () => { alive = false; };
  }, [state]);

  const dated = useMemo(() => items.filter(isDated), [items]);
  const ongoing = useMemo(() => items.filter((i) => !isDated(i)), [items]);
  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = (tab === "dated" ? dated : ongoing).filter((i) =>
      (source === "all" || i.source === source) &&
      (!needle || [i.title, i.organization, i.city, i.description].some((v) => (v || "").toLowerCase().includes(needle))));
    const by: Record<Sort, (a: FeedItem, b: FeedItem) => number> = {
      date: (a, b) => (tab === "dated" ? (a.startDate || "").localeCompare(b.startDate || "") : (a.organization || "").localeCompare(b.organization || "")),
      title: (a, b) => a.title.localeCompare(b.title),
      org: (a, b) => (a.organization || "").localeCompare(b.organization || ""),
      city: (a, b) => (a.city || "").localeCompare(b.city || ""),
    };
    return [...list].sort(by[sort]);
  }, [tab, dated, ongoing, source, q, sort]);

  return (
    <>
      <PageToolbar title="All Projects & Events" />
      <div id="kt_content" className="content flex-column-fluid">
        <p className="text-gray-700 fs-6 mb-5" style={{ maxWidth: "62rem" }}>
          Everything students can see right now in a state: events nonprofits post on iServ and community projects from
          the outreach database. Dated events have a set day; ongoing roles run on a schedule or any time.
        </p>
        <div className="d-flex flex-wrap gap-3 align-items-center mb-4">
          <div className="is-tabs" role="tablist" aria-label="Kind of listing">
            <button type="button" role="tab" aria-selected={tab === "dated"} className={`is-tab ${tab === "dated" ? "active" : ""}`} onClick={() => setTab("dated")}>
              Dated events <span className="is-tab-count">{dated.length}</span>
            </button>
            <button type="button" role="tab" aria-selected={tab === "ongoing"} className={`is-tab ${tab === "ongoing" ? "active" : ""}`} onClick={() => setTab("ongoing")}>
              Ongoing <span className="is-tab-count">{ongoing.length}</span>
            </button>
          </div>
          <select className="form-select form-select-sm w-auto" aria-label="State" value={state} onChange={(e) => { setState(e.target.value); store.set(LAST_STATE_KEY, e.target.value); }}>
            {STATES.map(([c, n]) => <option key={c} value={c}>{n}</option>)}
          </select>
          <select className="form-select form-select-sm w-auto" aria-label="Source" value={source} onChange={(e) => setSource(e.target.value)}>
            <option value="all">All sources</option>
            <option value="iserv">iServ events</option>
            <option value="community">Community projects</option>
          </select>
          <select className="form-select form-select-sm w-auto" aria-label="Sort by" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
            <option value="date">{tab === "dated" ? "Soonest first" : "By organization"}</option>
            <option value="title">Title A–Z</option>
            <option value="org">Organization A–Z</option>
            <option value="city">City A–Z</option>
          </select>
          <input type="search" className="form-control form-control-sm w-250px" placeholder="Search title, organization, city" aria-label="Search listings" value={q} onChange={(e) => setQ(e.target.value)} />
          <span className="text-muted fs-7 ms-auto">{loading ? "Loading…" : `${rows.length} shown`}</span>
        </div>
        {error ? <div className="alert alert-warning py-2">{error}</div> : null}
        <div className="card h-70vh">
          <div className="card-body pt-0 pb-0 overflow-auto">
            <table className="table table-hover table-row-bordered gy-3 align-middle w-100">
              <thead className="sticky-table-header table-active">
                <tr className="text-start fw-bold fs-7 text-uppercase">
                  <th className="min-w-125px">{tab === "dated" ? "Date" : "Schedule"}</th>
                  <th className="min-w-250px">Listing</th>
                  <th className="min-w-200px">Organization</th>
                  <th className="min-w-125px">City</th>
                  <th className="min-w-125px">Kind</th>
                  <th className="min-w-70px"></th>
                </tr>
              </thead>
              <tbody>
                {!loading && rows.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-10 text-muted">No {tab === "dated" ? "dated events" : "ongoing roles"} {q ? `match "${q}"` : "in this state right now"}.</td></tr>
                ) : rows.map((i) => (
                  <tr key={i.guid}>
                    <td className="fw-bold">{i.startDate ? fmtDay(i.startDate) : <span className="fw-normal">{i.schedule || "Ongoing"}</span>}</td>
                    <td>
                      <span className="fw-bold d-block">{i.title}</span>
                      <span className="text-muted fs-8">{i.source === "iserv" ? "iServ event" : "Community project"}{i.minAge ? ` · ages ${i.minAge}+` : ""}{i.difficulty ? ` · ${i.difficulty}` : ""}</span>
                    </td>
                    <td>{i.organization}</td>
                    <td>{i.city || "—"}</td>
                    <td><span className="badge badge-light">{typeLabel[i.type || ""] || (i.startDate ? "One-time" : "Recurring")}</span></td>
                    <td><a href={i.link} target="_blank" rel="noreferrer" className="btn btn-sm btn-light-primary">Open</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllProjects;
