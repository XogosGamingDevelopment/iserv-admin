// Schools Database (Nov 24, 2026): every researched public high school. Click one for a pop-up with its details and
// contacts (principal, second contact, NHS advisor), outreach status, the schools campaign, notes and contact log.
// When a school is "Interested" or "Partnered", the pop-up lists the nonprofits in its county so the nonprofit
// campaign can be started for them (more service projects near that school).
// API: GET outreach/schools, GET outreach/details/school/:id, PATCH outreach/schools/:id, POST outreach/contacts,
// GET outreach/schools/:id/nearby-nonprofits, POST outreach/drip/enroll.
import React, { useCallback, useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import { PageToolbar } from "../common";
import ContentLoader from "../common/ContentLoader";
import {
  CampaignPanel, Contact, ContactLog, Drip, DripChip, Enrollment, Field, Modal, SCHOOL_STATUSES, STATES, STATUS_HINT,
  fmtDate, href, label, statusBadge,
} from "./crm";
import { NonprofitPopup } from "./NonprofitDatabase";

type School = {
  _id: string; name: string; district?: string | null; type?: string; address?: string | null; city?: string | null; county?: string | null; state: string; region: string;
  phone?: string | null; website?: string | null; grades?: string | null;
  principal_name?: string | null; principal_email?: string | null; principal_source_url?: string | null;
  admin2_name?: string | null; admin2_title?: string | null; admin2_email?: string | null; admin2_source_url?: string | null;
  nhs_advisor_name?: string | null; nhs_advisor_email?: string | null; nhs_source_url?: string | null;
  outreach_status: string; contacted_at?: string | null; notes?: string | null;
  contact_count?: number; last_contact_at?: string | null; drip?: Drip;
};
type NearbyOrg = {
  _id: string; name: string; category: string; city?: string | null; email?: string | null; outreach_status: string;
  visible_project_count: number; drip?: Drip; last_contact_at?: string | null;
};
const INTERESTED = ["interested", "partnered"];

const Person = ({ role, name, email, source }: { role: string; name?: string | null; email?: string | null; source?: string | null }) =>
  name || email ? (
    <div className="mb-3">
      <div className="text-muted fs-8 text-uppercase fw-bold">{role}</div>
      <div className="fw-semibold">{name || "—"}</div>
      {email ? <a href={`mailto:${email}`} className="fs-7">{email}</a> : <span className="text-muted fs-7">No email posted</span>}
      {source ? <> · <a href={source} target="_blank" rel="noopener noreferrer" className="fs-8">source</a></> : null}
    </div>
  ) : null;

/* ---------------------------------------------------------------- nonprofits near an interested school */

const NearbyNonprofits: React.FC<{ axios: any; school: School; onOpen: (id: string) => void; refreshKey: number }> = ({ axios, school, onOpen, refreshKey }) => {
  const [rows, setRows] = useState<NearbyOrg[] | null>(null);
  const [area, setArea] = useState("");
  const [busy, setBusy] = useState(false);
  const load = useCallback(async () => {
    try {
      const res: any = await axios({ url: `outreach/schools/${school._id}/nearby-nonprofits`, method: "GET" });
      setRows(res?.data?.organizations ?? []);
      setArea(res?.data?.area ?? "");
    } catch (e) { console.error("nearby nonprofits", e); setRows([]); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [school._id]);
  useEffect(() => { load(); }, [load, refreshKey]);

  const eligible = (rows ?? []).filter((o) => o.email && ["not_contacted", "contacted"].includes(o.outreach_status) && !o.drip);
  const enrollAll = async () => {
    if (!window.confirm(`Start the nonprofit campaign for ${eligible.length} nonprofit${eligible.length === 1 ? "" : "s"} near ${school.name}?`)) return;
    setBusy(true);
    try {
      await axios({ url: "outreach/drip/enroll", method: "POST", data: { campaign: "nonprofits", via_school: school._id } });
      load();
    } catch (e) { console.error("enroll nearby", e); } finally { setBusy(false); }
  };

  if (!rows) return <div className="text-muted fs-7">Finding nonprofits nearby…</div>;
  return (
    <div>
      <div className="d-flex flex-wrap gap-3 align-items-center mb-3">
        <div className="text-muted fs-7">{rows.length} approved nonprofit{rows.length === 1 ? "" : "s"} in {area} (or running projects there).</div>
        {eligible.length ? (
          <button className="btn btn-sm btn-primary ms-auto" disabled={busy} onClick={enrollAll}>Start nonprofit campaign for {eligible.length}</button>
        ) : <span className="ms-auto text-muted fs-8">{rows.length ? "Everyone with an email is already in a campaign or has answered." : ""}</span>}
      </div>
      {rows.length ? (
        <div className="table-responsive" style={{ maxHeight: 320, overflowY: "auto" }}>
          <table className="table table-sm table-row-dashed table-hover fs-7 mb-0">
            <thead><tr className="fw-bold text-muted"><th>Nonprofit</th><th>City</th><th className="text-center">Projects</th><th>Status</th></tr></thead>
            <tbody>
              {rows.map((o) => (
                <tr key={o._id} role="button" onClick={() => onOpen(o._id)}>
                  <td><div className="fw-semibold">{o.name}</div><div className="text-muted fs-8">{label(o.category)}{o.email ? "" : " · no email"}</div></td>
                  <td>{o.city}</td>
                  <td className="text-center">{o.visible_project_count}</td>
                  <td><span className={`badge ${statusBadge[o.outreach_status] ?? "badge-light"}`}>{label(o.outreach_status)}</span> <DripChip drip={o.drip ?? null} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
};

/* ---------------------------------------------------------------- pop-up */

const SchoolPopup: React.FC<{ id: string; onClose: (changed: boolean) => void }> = ({ id, onClose }) => {
  const axios = useAxios();
  const [school, setSchool] = useState<School | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [people, setPeople] = useState<{ email: string; name: string | null; role: string }[]>([]);
  const [notes, setNotes] = useState("");
  const [changed, setChanged] = useState(false);
  const [orgOpen, setOrgOpen] = useState<string | null>(null);
  const [nearbyKey, setNearbyKey] = useState(0);

  const load = useCallback(async () => {
    try {
      const res: any = await axios({ url: `outreach/details/school/${id}`, method: "GET" });
      const d = res?.data;
      if (!d) return;
      setSchool(d.record); setContacts(d.contacts ?? []); setEnrollments(d.enrollments ?? []); setPeople(d.people ?? []);
      setNotes(d.record?.notes ?? "");
    } catch (e) { console.error("school details", e); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  useEffect(() => { load(); }, [load]);

  const patch = async (data: any) => {
    try {
      const res: any = await axios({ url: `outreach/schools/${id}`, method: "PATCH", data });
      if (res?.data?.school) setSchool((s) => ({ ...(s as School), ...res.data.school }));
      setChanged(true);
      if (data.outreach_status) load();
    } catch (e) { console.error("save school", e); }
  };

  return (
    <>
      <Modal
        onClose={() => onClose(changed)}
        title={school?.name ?? "Loading…"}
        subtitle={school ? [school.district, school.city, school.county ? `${school.county} County` : null, school.state].filter(Boolean).join(" · ") : null}
      >
        {!school ? <div className="p-10 text-center text-muted">Loading…</div> : (
          <div className="row g-6">
            <div className="col-lg-5">
              <div className="d-flex flex-wrap gap-2 mb-4">
                <span className={`badge ${statusBadge[school.outreach_status] ?? "badge-light"}`}>{label(school.outreach_status)}</span>
                {school.type ? <span className="badge badge-light">{label(school.type)}</span> : null}
                {school.grades ? <span className="badge badge-light">Grades {school.grades}</span> : null}
              </div>
              <Field k="Address">{[school.address, school.city, school.state].filter(Boolean).join(", ")}</Field>
              <Field k="Phone">{school.phone ? <a href={`tel:${school.phone}`}>{school.phone}</a> : null}</Field>
              <Field k="Website">{school.website ? <a href={href(school.website)} target="_blank" rel="noopener noreferrer">{school.website}</a> : null}</Field>
              <div className="mt-4">
                <Person role="Principal" name={school.principal_name} email={school.principal_email} source={school.principal_source_url} />
                <Person role={school.admin2_title || "Second contact"} name={school.admin2_name} email={school.admin2_email} source={school.admin2_source_url} />
                <Person role="NHS advisor" name={school.nhs_advisor_name} email={school.nhs_advisor_email} source={school.nhs_source_url} />
              </div>
              <div className="mt-4">
                <div className="text-muted fs-8 text-uppercase fw-bold mb-2">Notes</div>
                <textarea className="form-control form-control-sm" rows={6} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes about this school" />
                {notes !== (school.notes ?? "") ? <button className="btn btn-sm btn-primary mt-2" onClick={() => patch({ notes })}>Save notes</button> : null}
                <div className="text-muted fs-8 mt-1">Research notes say where each contact came from and what to double-check.</div>
              </div>
            </div>

            <div className="col-lg-7">
              <div className="d-flex flex-wrap gap-3 align-items-center mb-5">
                <label className="fw-bold">Outreach status</label>
                <select className="form-select form-select-sm w-auto" value={school.outreach_status} onChange={(e) => patch({ outreach_status: e.target.value })}>
                  {SCHOOL_STATUSES.map((s) => <option key={s} value={s}>{label(s)}</option>)}
                </select>
                {school.contacted_at ? <span className="text-muted fs-8">First contacted {fmtDate(school.contacted_at)}</span> : null}
                {STATUS_HINT[school.outreach_status] ? <span className="text-muted fs-8 w-100">{STATUS_HINT[school.outreach_status]}</span> : null}
              </div>

              {INTERESTED.includes(school.outreach_status) ? (
                <div className="rounded p-4 mb-6" style={{ background: "rgba(245,158,11,.08)", border: "1px solid rgba(251,191,36,.35)" }}>
                  <div className="fw-bold fs-5 mb-1">Nonprofits near this school</div>
                  <div className="text-muted fs-7 mb-3">{school.name} wants to use iServ. Invite the nonprofits around it to post more projects for its students.</div>
                  <NearbyNonprofits axios={axios} school={school} onOpen={setOrgOpen} refreshKey={nearbyKey} />
                </div>
              ) : null}

              <div className="fw-bold fs-5 mb-3">Schools drip campaign</div>
              <div className="mb-6">
                <CampaignPanel
                  axios={axios} campaign="schools" targetId={school._id} enrollments={enrollments} people={people}
                  blocked={["declined", "do_not_contact"].includes(school.outreach_status) ? `Marked "${label(school.outreach_status)}", so no campaign emails.`
                    : ["replied", "interested", "partnered"].includes(school.outreach_status) && !enrollments.length ? "They've already answered, so the introduction campaign isn't needed." : null}
                  onChange={() => { setChanged(true); load(); }}
                />
              </div>

              <ContactLog
                axios={axios} targetType="school" targetId={school._id} contacts={contacts} people={people}
                statuses={SCHOOL_STATUSES} currentStatus={school.outreach_status}
                onChange={(next, record) => { setContacts(next); setChanged(true); if (record) { setSchool((s) => ({ ...(s as School), ...record })); load(); } }}
              />
            </div>
          </div>
        )}
      </Modal>
      {orgOpen ? <NonprofitPopup id={orgOpen} viaSchool={id} onClose={(c) => { setOrgOpen(null); if (c) setNearbyKey((k) => k + 1); }} /> : null}
    </>
  );
};

/* ---------------------------------------------------------------- page */

const SchoolsDatabase: React.FC = () => {
  const axiosInstance = useAxios();
  const [filters, setFilters] = useState({ state: "", outreach_status: "", search: "", has_email: "", has_nhs: "" });
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<School[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const limit = 50;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page, limit };
      for (const [k, v] of Object.entries(filters)) if (v) params[k] = v;
      const res: any = await axiosInstance({ url: "outreach/schools", method: "GET", params });
      setRows(res.data?.schools ?? []);
      setTotal(res.data?.total ?? 0);
    } catch (e) {
      console.error("schools database", e);
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
  const emails = (s: School) => [s.principal_email, s.admin2_email, s.nhs_advisor_email].filter(Boolean).length;

  return (
    <>
      <PageToolbar title="Schools Database" />
      <div id="kt_content" className="content flex-column-fluid">
        <div className="card card-body mb-5 py-4">
          <div className="d-flex flex-wrap gap-3 align-items-center">
            <select className="form-select form-select-sm w-auto" value={filters.state} onChange={(e) => setFilter("state", e.target.value)} aria-label="State">
              {STATES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
            <select className="form-select form-select-sm w-auto" value={filters.outreach_status} onChange={(e) => setFilter("outreach_status", e.target.value)} aria-label="Outreach status">
              <option value="">Any outreach status</option>
              {SCHOOL_STATUSES.map((s) => <option key={s} value={s}>{label(s)}</option>)}
            </select>
            <label className="form-check form-check-sm form-check-custom mb-0">
              <input className="form-check-input" type="checkbox" checked={filters.has_email === "1"} onChange={(e) => setFilter("has_email", e.target.checked ? "1" : "")} />
              <span className="form-check-label">Has an email</span>
            </label>
            <label className="form-check form-check-sm form-check-custom mb-0">
              <input className="form-check-input" type="checkbox" checked={filters.has_nhs === "1"} onChange={(e) => setFilter("has_nhs", e.target.checked ? "1" : "")} />
              <span className="form-check-label">Has NHS advisor</span>
            </label>
            <input className="form-control form-control-sm w-275px" placeholder="Search school, district, city or principal" value={filters.search} onChange={(e) => setFilter("search", e.target.value)} />
            <span className="ms-auto text-muted fs-7">{total.toLocaleString()} schools</span>
          </div>
        </div>

        <div className={`card ${loading ? "overlay overlay-block" : ""}`}>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-row-dashed table-hover align-middle fs-6 mb-0">
                <thead>
                  <tr className="fw-bold text-muted text-uppercase fs-8">
                    <th className="ps-6">School</th><th>Place</th><th>Principal</th><th className="text-center">Emails</th><th>Outreach</th><th className="pe-6">Last contact</th>
                  </tr>
                </thead>
                <tbody>
                  {!rows.length && !loading ? (
                    <tr><td colSpan={6} className="text-center text-muted p-10">No schools match.</td></tr>
                  ) : rows.map((s) => (
                    <tr key={s._id} role="button" tabIndex={0} onClick={() => setOpenId(s._id)} onKeyDown={(e) => { if (e.key === "Enter") setOpenId(s._id); }}>
                      <td className="ps-6"><div className="fw-bold">{s.name}</div><div className="text-muted fs-8">{s.district}</div></td>
                      <td className="fs-7">{[s.city, s.state].filter(Boolean).join(", ")}{s.county ? <div className="text-muted fs-8">{s.county} County</div> : null}</td>
                      <td className="fs-7">{s.principal_name || <span className="text-muted">—</span>}</td>
                      <td className="text-center fs-7">{emails(s) || <span className="text-muted">0</span>}</td>
                      <td>
                        <span className={`badge ${statusBadge[s.outreach_status] ?? "badge-light"}`}>{label(s.outreach_status)}</span>
                        <div className="mt-1"><DripChip drip={s.drip ?? null} /></div>
                      </td>
                      <td className="pe-6 fs-7">{s.last_contact_at ? <>{fmtDate(s.last_contact_at)}<div className="text-muted fs-8">{s.contact_count} logged</div></> : <span className="text-muted">Never</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card-footer d-flex justify-content-between align-items-center py-3">
            <span className="text-muted fs-7">Page {page} of {pages} · click a school for details and the contact log</span>
            <div className="btn-group btn-group-sm">
              <button className="btn btn-light" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
              <button className="btn btn-light" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>Next</button>
            </div>
          </div>
          {loading ? <ContentLoader /> : null}
        </div>
      </div>
      {openId ? <SchoolPopup id={openId} onClose={(changed) => { setOpenId(null); if (changed) load(); }} /> : null}
    </>
  );
};

export default SchoolsDatabase;
