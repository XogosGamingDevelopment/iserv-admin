// Outreach organizations: local nonprofits, parks departments, libraries and others whose public volunteer projects
// iServ lists as "community projects" (researched Nov 2026). Admins review flagged organizations (only approved ones'
// projects reach students), track outreach (contacted → joined), and see each organization's projects.
// API: GET/PATCH outreach/organizations, GET outreach/organizations/:id/projects (backend OutreachController).
import React, { useCallback, useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import { PageToolbar } from "../common";
import ContentLoader from "../common/ContentLoader";

type Org = {
  _id: string; name: string; category: string; website?: string | null; volunteer_page_url?: string | null;
  email?: string | null; email_source_url?: string | null; phone?: string | null; city?: string | null; county?: string | null;
  state: string; region: string; faith_based: boolean; signup_platform?: string | null; terms_restriction: string; terms_note?: string | null;
  review_status: "approved" | "needs_review" | "excluded"; review_note?: string | null; outreach_status: string; contacted_at?: string | null;
  notes?: string | null; ein?: string | null; ntee_code?: string | null; logo_url?: string | null;
  project_count: number; visible_project_count: number;
};
type Project = { _id: string; title: string; kind: string; date?: string | null; schedule?: string | null; city?: string | null; is_visible: boolean; source_url: string; image_url?: string | null };
type Summary = { _id: { state: string; review: string }; n: number };

const OUTREACH = ["not_contacted", "contacted", "replied", "joined", "declined", "do_not_contact"];
const label = (s: string) => s.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
const reviewBadge: Record<string, string> = { approved: "badge-light-success", needs_review: "badge-light-warning", excluded: "badge-light-danger" };
const STATES = [["", "All states"], ["MO", "Missouri"], ["FL", "Florida"], ["TX", "Texas"]];

const Organizations: React.FC = () => {
  const axiosInstance = useAxios();
  const [filters, setFilters] = useState({ state: "", review_status: "needs_review", outreach_status: "", search: "", has_email: "" });
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<Org[]>([]);
  const [total, setTotal] = useState(0);
  const [summary, setSummary] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [projects, setProjects] = useState<Record<string, Project[]>>({});
  const [noteDraft, setNoteDraft] = useState<Record<string, string>>({});
  const limit = 25;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page, limit };
      for (const [k, v] of Object.entries(filters)) if (v) params[k] = v;
      const res: any = await axiosInstance({ url: "outreach/organizations", method: "GET", params });
      setRows(res.data?.organizations ?? []);
      setTotal(res.data?.total ?? 0);
      setSummary(res.data?.summary ?? []);
    } catch (e) {
      console.error("outreach organizations", e);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page]);
  useEffect(() => { load(); }, [load]);

  const setFilter = (k: keyof typeof filters, v: string) => { setPage(1); setFilters((f) => ({ ...f, [k]: v })); };

  const save = async (org: Org, patch: Partial<Org>) => {
    try {
      const res: any = await axiosInstance({ url: `outreach/organizations/${org._id}`, method: "PATCH", data: patch });
      const updated = res.data?.organization;
      if (updated) setRows((rs) => rs.map((r) => (r._id === org._id ? { ...r, ...updated } : r)));
      if (patch.review_status) load(); // counts and the visible-project number change
    } catch (e) {
      console.error("save organization", e);
    }
  };

  const toggle = async (org: Org) => {
    if (open === org._id) { setOpen(null); return; }
    setOpen(org._id);
    if (!projects[org._id]) {
      try {
        const res: any = await axiosInstance({ url: `outreach/organizations/${org._id}/projects`, method: "GET" });
        setProjects((p) => ({ ...p, [org._id]: res.data?.projects ?? [] }));
      } catch (e) { console.error("org projects", e); }
    }
  };

  const count = (state: string, review: string) => summary.filter((s) => (!state || s._id.state === state) && s._id.review === review).reduce((a, s) => a + s.n, 0);
  const pages = Math.max(1, Math.ceil(total / limit));

  return (
    <>
      <PageToolbar title="Outreach Organizations" />
      <div id="kt_content" className="content flex-column-fluid">
        {/* Summary tiles: click to filter */}
        <div className="row g-4 mb-5">
          {[
            { key: "needs_review", title: "Awaiting your decision", cls: "text-warning", hint: "Hidden from students until approved" },
            { key: "approved", title: "Approved", cls: "text-success", hint: "Their projects are shown to students" },
            { key: "excluded", title: "Excluded", cls: "text-danger", hint: "Never shown" },
          ].map((t) => (
            <div className="col-md-4" key={t.key}>
              <div
                role="button"
                onClick={() => setFilter("review_status", t.key)}
                className={`card card-body py-5 ${filters.review_status === t.key ? "border border-primary" : ""}`}
              >
                <div className={`fs-2hx fw-bold ${t.cls}`}>{count(filters.state, t.key)}</div>
                <div className="fw-semibold fs-5">{t.title}</div>
                <div className="text-muted fs-7">{t.hint}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="card card-body mb-5 py-4">
          <div className="d-flex flex-wrap gap-3 align-items-center">
            <select className="form-select form-select-sm w-auto" value={filters.state} onChange={(e) => setFilter("state", e.target.value)}>
              {STATES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
            <select className="form-select form-select-sm w-auto" value={filters.review_status} onChange={(e) => setFilter("review_status", e.target.value)}>
              <option value="">Any review status</option>
              <option value="needs_review">Awaiting decision</option>
              <option value="approved">Approved</option>
              <option value="excluded">Excluded</option>
            </select>
            <select className="form-select form-select-sm w-auto" value={filters.outreach_status} onChange={(e) => setFilter("outreach_status", e.target.value)}>
              <option value="">Any outreach status</option>
              {OUTREACH.map((s) => <option key={s} value={s}>{label(s)}</option>)}
            </select>
            <label className="form-check form-check-sm form-check-custom mb-0">
              <input className="form-check-input" type="checkbox" checked={filters.has_email === "1"} onChange={(e) => setFilter("has_email", e.target.checked ? "1" : "")} />
              <span className="form-check-label">Has email</span>
            </label>
            <input
              className="form-control form-control-sm w-250px"
              placeholder="Search name, city or email"
              value={filters.search}
              onChange={(e) => setFilter("search", e.target.value)}
            />
            <span className="ms-auto text-muted fs-7">{total} organizations</span>
          </div>
        </div>

        <div className={`card ${loading ? "overlay overlay-block" : ""}`}>
          <div className="card-body p-0">
            {!rows.length && !loading ? (
              <div className="p-10 text-center text-muted fs-5">No organizations match.</div>
            ) : (
              rows.map((o) => (
                <div key={o._id} className="border-bottom px-6 py-5">
                  <div className="d-flex flex-wrap gap-4 align-items-start">
                    {o.logo_url ? (
                      <img src={o.logo_url} alt="" referrerPolicy="no-referrer" className="rounded border bg-white p-1" style={{ width: 56, height: 56, objectFit: "contain" }} onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />
                    ) : null}
                    <div className="flex-grow-1" style={{ minWidth: 280 }}>
                      <div className="d-flex flex-wrap gap-2 align-items-center">
                        <span className="fs-4 fw-bold">{o.name}</span>
                        <span className={`badge ${reviewBadge[o.review_status] ?? "badge-light"}`}>{label(o.review_status)}</span>
                        <span className="badge badge-light">{o.state} · {o.region.replace(/_/g, " ")}</span>
                        <span className="badge badge-light-info">{o.category}</span>
                        {o.faith_based ? <span className="badge badge-light-primary">Faith-based</span> : null}
                        {o.terms_restriction === "prohibits" ? <span className="badge badge-light-danger">Terms forbid listing</span> : null}
                      </div>
                      <div className="text-muted fs-7 mt-1">
                        {[o.city, o.county ? `${o.county} County` : null].filter(Boolean).join(" · ")}
                        {o.ein ? ` · EIN ${o.ein}` : ""}{o.ntee_code ? ` · NTEE ${o.ntee_code}` : ""}
                      </div>
                      {o.review_note ? (
                        <div className={`mt-3 p-3 rounded fs-6 ${o.review_status === "needs_review" ? "bg-light-warning" : "bg-light"}`}>
                          <span className="fw-bold">Why it was flagged: </span>{o.review_note}
                        </div>
                      ) : null}
                      {o.terms_note ? <div className="mt-2 text-muted fs-7">Terms: {o.terms_note}</div> : null}
                      <div className="d-flex flex-wrap gap-4 mt-3 fs-7">
                        {o.website ? <a href={o.website} target="_blank" rel="noopener noreferrer">Website</a> : null}
                        {o.volunteer_page_url ? <a href={o.volunteer_page_url} target="_blank" rel="noopener noreferrer">Volunteer page</a> : null}
                        {o.email ? <span>Email: <a href={`mailto:${o.email}`}>{o.email}</a>{o.email_source_url ? <> (<a href={o.email_source_url} target="_blank" rel="noopener noreferrer">source</a>)</> : null}</span> : <span className="text-muted">No email found</span>}
                        {o.phone ? <span>Phone: {o.phone}</span> : null}
                        {o.signup_platform ? <span className="text-muted">Sign-ups: {o.signup_platform}</span> : null}
                      </div>
                    </div>

                    <div className="d-flex flex-column gap-2" style={{ minWidth: 230 }}>
                      <div className="btn-group btn-group-sm">
                        <button className={`btn ${o.review_status === "approved" ? "btn-success" : "btn-light-success"}`} onClick={() => save(o, { review_status: "approved" })}>Approve</button>
                        <button className={`btn ${o.review_status === "needs_review" ? "btn-warning" : "btn-light-warning"}`} onClick={() => save(o, { review_status: "needs_review" })}>Hold</button>
                        <button className={`btn ${o.review_status === "excluded" ? "btn-danger" : "btn-light-danger"}`} onClick={() => save(o, { review_status: "excluded" })}>Exclude</button>
                      </div>
                      <select className="form-select form-select-sm" value={o.outreach_status} onChange={(e) => save(o, { outreach_status: e.target.value })}>
                        {OUTREACH.map((s) => <option key={s} value={s}>Outreach: {label(s)}</option>)}
                      </select>
                      {o.contacted_at ? <span className="text-muted fs-8">Contacted {new Date(o.contacted_at).toLocaleDateString()}</span> : null}
                      <button className="btn btn-sm btn-light" onClick={() => toggle(o)}>
                        {open === o._id ? "Hide" : "Show"} projects ({o.visible_project_count}/{o.project_count} visible)
                      </button>
                    </div>
                  </div>

                  {open === o._id ? (
                    <div className="mt-4 ms-md-15">
                      {(projects[o._id] ?? []).length === 0 ? (
                        <div className="text-muted fs-7">{projects[o._id] ? "No projects recorded for this organization." : "Loading…"}</div>
                      ) : (
                        <table className="table table-sm table-row-dashed fs-7 mb-3">
                          <thead><tr className="fw-bold text-muted"><th></th><th>Project</th><th>When</th><th>City</th><th>Shown</th><th></th></tr></thead>
                          <tbody>
                            {projects[o._id].map((p) => (
                              <tr key={p._id}>
                                <td style={{ width: 52 }}>{p.image_url ? <img src={p.image_url} alt="" referrerPolicy="no-referrer" style={{ width: 44, height: 32, objectFit: "cover" }} className="rounded" onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} /> : null}</td>
                                <td className="fw-semibold">{p.title}</td>
                                <td>{p.kind === "one_time" && p.date ? new Date(p.date).toLocaleDateString(undefined, { timeZone: "UTC" }) : p.schedule || "Ongoing"}</td>
                                <td>{p.city}</td>
                                <td>{p.is_visible ? <span className="badge badge-light-success">Yes</span> : <span className="badge badge-light">No</span>}</td>
                                <td><a href={p.source_url} target="_blank" rel="noopener noreferrer">Source</a></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                      <div className="d-flex gap-2">
                        <textarea
                          className="form-control form-control-sm"
                          rows={2}
                          placeholder="Notes (outreach history, contact person, decisions)"
                          value={noteDraft[o._id] ?? o.notes ?? ""}
                          onChange={(e) => setNoteDraft((d) => ({ ...d, [o._id]: e.target.value }))}
                        />
                        <button className="btn btn-sm btn-primary align-self-start" onClick={() => save(o, { notes: noteDraft[o._id] ?? o.notes ?? "" })}>Save notes</button>
                      </div>
                    </div>
                  ) : null}
                </div>
              ))
            )}
          </div>
          <div className="card-footer d-flex justify-content-between align-items-center py-3">
            <span className="text-muted fs-7">Page {page} of {pages}</span>
            <div className="btn-group btn-group-sm">
              <button className="btn btn-light" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
              <button className="btn btn-light" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>Next</button>
            </div>
          </div>
          {loading ? <ContentLoader /> : null}
        </div>
      </div>
    </>
  );
};

export default Organizations;
