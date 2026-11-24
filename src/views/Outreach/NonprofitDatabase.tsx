// Non-Profit Database (Nov 24, 2026): every researched nonprofit, parks department, library and other service
// organization. Click one for a pop-up with its details, projects, outreach status, campaign and contact log.
// API: GET outreach/organizations (list), GET outreach/details/organization/:id, PATCH outreach/organizations/:id,
// POST outreach/contacts, POST outreach/drip/enroll.
import React, { useCallback, useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import { PageToolbar } from "../common";
import ContentLoader from "../common/ContentLoader";
import {
  CampaignPanel, Contact, ContactLog, Drip, DripChip, Enrollment, Field, Modal, ORG_STATUSES, STATES, STATUS_HINT,
  fmtDate, fmtDay, href, label, statusBadge,
} from "./crm";

type Org = {
  _id: string; name: string; category: string; website?: string | null; volunteer_page_url?: string | null;
  email?: string | null; email_source_url?: string | null; phone?: string | null; address?: string | null; city?: string | null; county?: string | null;
  state: string; region: string; faith_based: boolean; signup_platform?: string | null; terms_restriction: string; terms_note?: string | null;
  review_status: string; review_note?: string | null; outreach_status: string; contacted_at?: string | null;
  notes?: string | null; ein?: string | null; ntee_code?: string | null; irs_status?: string | null; logo_url?: string | null;
  min_student_age?: number | null; parent_permission_under_age?: number | null; eligibility_note?: string | null; supervision_note?: string | null;
  project_count?: number; visible_project_count?: number; contact_count?: number; last_contact_at?: string | null; drip?: Drip;
};
type Project = { _id: string; title: string; kind: string; date?: string | null; schedule?: string | null; city?: string | null; is_visible: boolean; source_url: string; min_age?: number | null };

const CATEGORIES = ["food", "housing", "animals", "museum", "environment", "hospital", "library", "shelter", "tutoring", "parks", "seniors", "city", "county", "youth", "basic_needs", "volunteer_center", "military", "other"];
const reviewBadge: Record<string, string> = { approved: "badge-light-success", needs_review: "badge-light-warning", excluded: "badge-light-danger" };

/* ---------------------------------------------------------------- pop-up */

export const NonprofitPopup: React.FC<{ id: string; onClose: (changed: boolean) => void; viaSchool?: string | null }> = ({ id, onClose, viaSchool }) => {
  const axios = useAxios();
  const [org, setOrg] = useState<Org | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [people, setPeople] = useState<{ email: string; name: string | null; role: string }[]>([]);
  const [notes, setNotes] = useState("");
  const [changed, setChanged] = useState(false);

  const load = useCallback(async () => {
    try {
      const res: any = await axios({ url: `outreach/details/organization/${id}`, method: "GET" });
      const d = res?.data;
      if (!d) return;
      setOrg(d.record); setProjects(d.projects ?? []); setContacts(d.contacts ?? []); setEnrollments(d.enrollments ?? []); setPeople(d.people ?? []);
      setNotes(d.record?.notes ?? "");
    } catch (e) { console.error("nonprofit details", e); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  useEffect(() => { load(); }, [load]);

  const patch = async (data: any) => {
    try {
      const res: any = await axios({ url: `outreach/organizations/${id}`, method: "PATCH", data });
      if (res?.data?.organization) setOrg((o) => ({ ...(o as Org), ...res.data.organization }));
      setChanged(true);
      if (data.outreach_status || data.review_status) load(); // campaign emails may have stopped
    } catch (e) { console.error("save nonprofit", e); }
  };
  const close = () => onClose(changed);

  return (
    <Modal
      onClose={close}
      title={<span className="d-flex align-items-center gap-3">
        {org?.logo_url ? <img src={org.logo_url} alt="" referrerPolicy="no-referrer" className="rounded bg-white p-1" style={{ width: 40, height: 40, objectFit: "contain" }} onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} /> : null}
        {org?.name ?? "Loading…"}
      </span>}
      subtitle={org ? [label(org.category), org.city, org.county ? `${org.county} County` : null, org.state].filter(Boolean).join(" · ") : null}
    >
      {!org ? <div className="p-10 text-center text-muted">Loading…</div> : (
        <div className="row g-6">
          <div className="col-lg-5">
            <div className="d-flex flex-wrap gap-2 mb-4">
              <span className={`badge ${reviewBadge[org.review_status] ?? "badge-light"}`}>{label(org.review_status)}</span>
              <span className={`badge ${statusBadge[org.outreach_status] ?? "badge-light"}`}>{label(org.outreach_status)}</span>
              {org.faith_based ? <span className="badge badge-light-primary">Faith-based</span> : null}
              {org.terms_restriction === "prohibits" ? <span className="badge badge-light-danger">Terms forbid listing</span> : null}
            </div>
            <Field k="Email">{org.email ? <><a href={`mailto:${org.email}`}>{org.email}</a>{org.email_source_url ? <> · <a href={org.email_source_url} target="_blank" rel="noopener noreferrer" className="fs-8">source</a></> : null}</> : <span className="text-muted">No email found</span>}</Field>
            <Field k="Phone">{org.phone}</Field>
            <Field k="Address">{org.address}</Field>
            <Field k="Website">{org.website ? <a href={href(org.website)} target="_blank" rel="noopener noreferrer">{org.website}</a> : null}</Field>
            <Field k="Volunteer page">{org.volunteer_page_url ? <a href={href(org.volunteer_page_url)} target="_blank" rel="noopener noreferrer">{org.volunteer_page_url}</a> : null}</Field>
            <Field k="Volunteer sign-ups">{org.signup_platform}</Field>
            <Field k="IRS">{[org.ein ? `EIN ${org.ein}` : null, org.irs_status ? label(org.irs_status) : null, org.ntee_code ? `NTEE ${org.ntee_code}` : null].filter(Boolean).join(" · ")}</Field>
            <Field k="Youth rules">{[
              org.min_student_age ? `Ages ${org.min_student_age}+` : null,
              org.parent_permission_under_age ? `Parent permission under ${org.parent_permission_under_age}` : null,
              org.eligibility_note, org.supervision_note,
            ].filter(Boolean).join(" · ")}</Field>
            {org.review_note ? <Field k="Review note">{org.review_note}</Field> : null}
            {org.terms_note ? <Field k="Terms">{org.terms_note}</Field> : null}

            <div className="mb-4">
              <div className="text-muted fs-8 text-uppercase fw-bold mb-2">Shown to students?</div>
              <div className="btn-group btn-group-sm">
                <button className={`btn ${org.review_status === "approved" ? "btn-success" : "btn-light-success"}`} onClick={() => patch({ review_status: "approved" })}>Approve</button>
                <button className={`btn ${org.review_status === "needs_review" ? "btn-warning" : "btn-light-warning"}`} onClick={() => patch({ review_status: "needs_review" })}>Hold</button>
                <button className={`btn ${org.review_status === "excluded" ? "btn-danger" : "btn-light-danger"}`} onClick={() => patch({ review_status: "excluded" })}>Exclude</button>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-muted fs-8 text-uppercase fw-bold mb-2">Notes</div>
              <textarea className="form-control form-control-sm" rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Research notes and anything worth remembering" />
              {notes !== (org.notes ?? "") ? <button className="btn btn-sm btn-primary mt-2" onClick={() => patch({ notes })}>Save notes</button> : null}
            </div>

            <div className="text-muted fs-8 text-uppercase fw-bold mb-2">Projects ({projects.filter((p) => p.is_visible).length} of {projects.length} shown to students)</div>
            {!projects.length ? <div className="text-muted fs-7">No projects recorded.</div> : (
              <div className="d-flex flex-column gap-2">
                {projects.map((p) => (
                  <div key={p._id} className="fs-7 d-flex gap-2 align-items-start">
                    <span className={`badge ${p.is_visible ? "badge-light-success" : "badge-light"}`} style={{ minWidth: 48 }}>{p.is_visible ? "Shown" : "Hidden"}</span>
                    <div className="flex-grow-1">
                      <div className="fw-semibold">{p.title}</div>
                      <div className="text-muted fs-8">{p.kind === "one_time" && p.date ? fmtDay(p.date) : p.schedule || "Ongoing"}{p.city ? ` · ${p.city}` : ""}{p.min_age ? ` · ${p.min_age}+` : ""} · <a href={p.source_url} target="_blank" rel="noopener noreferrer">source</a></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="col-lg-7">
            <div className="d-flex flex-wrap gap-3 align-items-center mb-5">
              <label className="fw-bold">Outreach status</label>
              <select className="form-select form-select-sm w-auto" value={org.outreach_status} onChange={(e) => patch({ outreach_status: e.target.value })}>
                {ORG_STATUSES.map((s) => <option key={s} value={s}>{label(s)}</option>)}
              </select>
              {org.contacted_at ? <span className="text-muted fs-8">First contacted {fmtDate(org.contacted_at)}</span> : null}
              {STATUS_HINT[org.outreach_status] ? <span className="text-muted fs-8 w-100">{STATUS_HINT[org.outreach_status]}</span> : null}
            </div>

            <div className="fw-bold fs-5 mb-3">Nonprofit drip campaign</div>
            <div className="mb-6">
              <CampaignPanel
                axios={axios} campaign="nonprofits" targetId={org._id} enrollments={enrollments} people={people} viaSchool={viaSchool}
                blocked={["declined", "do_not_contact"].includes(org.outreach_status) ? `Marked "${label(org.outreach_status)}", so no campaign emails.` : org.review_status === "excluded" ? "Excluded organizations don't get campaign emails." : null}
                onChange={() => { setChanged(true); load(); }}
              />
            </div>

            <ContactLog
              axios={axios} targetType="organization" targetId={org._id} contacts={contacts} people={people}
              statuses={ORG_STATUSES} currentStatus={org.outreach_status}
              onChange={(next, record) => { setContacts(next); setChanged(true); if (record) { setOrg((o) => ({ ...(o as Org), ...record })); load(); } }}
            />
          </div>
        </div>
      )}
    </Modal>
  );
};

/* ---------------------------------------------------------------- page */

const NonprofitDatabase: React.FC = () => {
  const axiosInstance = useAxios();
  const [filters, setFilters] = useState({ state: "", category: "", review_status: "", outreach_status: "", search: "", has_email: "" });
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<Org[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const limit = 50;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page, limit };
      for (const [k, v] of Object.entries(filters)) if (v) params[k] = v;
      const res: any = await axiosInstance({ url: "outreach/organizations", method: "GET", params });
      setRows(res.data?.organizations ?? []);
      setTotal(res.data?.total ?? 0);
    } catch (e) {
      console.error("nonprofit database", e);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page]);
  useEffect(() => {
    const t = window.setTimeout(load, filters.search ? 300 : 0);
    return () => window.clearTimeout(t);
  }, [load, filters.search]);

  const setFilter = (k: keyof typeof filters, v: string) => { setPage(1); setFilters((f) => ({ ...f, [k]: v })); };
  const pages = Math.max(1, Math.ceil(total / limit));

  return (
    <>
      <PageToolbar title="Non-Profit Database" />
      <div id="kt_content" className="content flex-column-fluid">
        <div className="card card-body mb-5 py-4">
          <div className="d-flex flex-wrap gap-3 align-items-center">
            <select className="form-select form-select-sm w-auto" value={filters.state} onChange={(e) => setFilter("state", e.target.value)} aria-label="State">
              {STATES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
            <select className="form-select form-select-sm w-auto" value={filters.category} onChange={(e) => setFilter("category", e.target.value)} aria-label="Category">
              <option value="">Any category</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{label(c)}</option>)}
            </select>
            <select className="form-select form-select-sm w-auto" value={filters.review_status} onChange={(e) => setFilter("review_status", e.target.value)} aria-label="Review status">
              <option value="">Any review status</option>
              <option value="approved">Approved (shown)</option>
              <option value="needs_review">Awaiting decision</option>
              <option value="excluded">Excluded</option>
            </select>
            <select className="form-select form-select-sm w-auto" value={filters.outreach_status} onChange={(e) => setFilter("outreach_status", e.target.value)} aria-label="Outreach status">
              <option value="">Any outreach status</option>
              {ORG_STATUSES.map((s) => <option key={s} value={s}>{label(s)}</option>)}
            </select>
            <label className="form-check form-check-sm form-check-custom mb-0">
              <input className="form-check-input" type="checkbox" checked={filters.has_email === "1"} onChange={(e) => setFilter("has_email", e.target.checked ? "1" : "")} />
              <span className="form-check-label">Has email</span>
            </label>
            <input className="form-control form-control-sm w-250px" placeholder="Search name, city or email" value={filters.search} onChange={(e) => setFilter("search", e.target.value)} />
            <span className="ms-auto text-muted fs-7">{total.toLocaleString()} nonprofits</span>
          </div>
        </div>

        <div className={`card ${loading ? "overlay overlay-block" : ""}`}>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-row-dashed table-hover align-middle fs-6 mb-0">
                <thead>
                  <tr className="fw-bold text-muted text-uppercase fs-8">
                    <th className="ps-6">Nonprofit</th><th>Place</th><th>Email</th><th className="text-center">Projects</th><th>Outreach</th><th className="pe-6">Last contact</th>
                  </tr>
                </thead>
                <tbody>
                  {!rows.length && !loading ? (
                    <tr><td colSpan={6} className="text-center text-muted p-10">No nonprofits match.</td></tr>
                  ) : rows.map((o) => (
                    <tr key={o._id} role="button" tabIndex={0} onClick={() => setOpenId(o._id)} onKeyDown={(e) => { if (e.key === "Enter") setOpenId(o._id); }}>
                      <td className="ps-6">
                        <div className="fw-bold">{o.name}</div>
                        <div className="d-flex flex-wrap gap-1 mt-1">
                          <span className="badge badge-light-info">{label(o.category)}</span>
                          {o.review_status !== "approved" ? <span className={`badge ${reviewBadge[o.review_status] ?? "badge-light"}`}>{label(o.review_status)}</span> : null}
                        </div>
                      </td>
                      <td className="fs-7">{[o.city, o.state].filter(Boolean).join(", ")}{o.county ? <div className="text-muted fs-8">{o.county} County</div> : null}</td>
                      <td className="fs-7" style={{ maxWidth: 240, overflowWrap: "anywhere" }}>{o.email || <span className="text-muted">—</span>}</td>
                      <td className="text-center fs-7">{o.visible_project_count ?? 0}<span className="text-muted">/{o.project_count ?? 0}</span></td>
                      <td>
                        <span className={`badge ${statusBadge[o.outreach_status] ?? "badge-light"}`}>{label(o.outreach_status)}</span>
                        <div className="mt-1"><DripChip drip={o.drip ?? null} /></div>
                      </td>
                      <td className="pe-6 fs-7">{o.last_contact_at ? <>{fmtDate(o.last_contact_at)}<div className="text-muted fs-8">{o.contact_count} logged</div></> : <span className="text-muted">Never</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card-footer d-flex justify-content-between align-items-center py-3">
            <span className="text-muted fs-7">Page {page} of {pages} · click a nonprofit for details and the contact log</span>
            <div className="btn-group btn-group-sm">
              <button className="btn btn-light" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
              <button className="btn btn-light" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>Next</button>
            </div>
          </div>
          {loading ? <ContentLoader /> : null}
        </div>
      </div>
      {openId ? <NonprofitPopup id={openId} onClose={(changed) => { setOpenId(null); if (changed) load(); }} /> : null}
    </>
  );
};

export default NonprofitDatabase;
