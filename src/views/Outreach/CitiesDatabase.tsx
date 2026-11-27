// Cities Database (Nov 25, 2026): cities with a Parks & Recreation department (Missouri first), each with one
// researched contact for whoever oversees volunteers. Click a city for a pop-up with its details, the main contact,
// a second email you can add, the schools that signed up within 5 miles, the cities campaign, notes and contact log.
// API: GET outreach/cities, GET outreach/details/city/:id, PATCH outreach/cities/:id, POST outreach/contacts,
// POST outreach/drip/enroll.
import React, { useCallback, useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import { PageToolbar } from "../common";
import ContentLoader from "../common/ContentLoader";
import {
  CampaignPanel, CITY_STATUSES, Contact, ContactLog, Drip, DripChip, Enrollment, Field, Modal, STATES, STATUS_HINT,
  fmtDate, href, label, statusBadge,
} from "./crm";

type City = {
  _id: string; name: string; state: string; county?: string | null; population?: number | null;
  has_department: string; department_name?: string | null; website?: string | null; volunteer_page_url?: string | null;
  contact_page_url?: string | null; contact_page_form?: boolean | null;
  contact_name?: string | null; contact_title?: string | null; email?: string | null; email_role?: string | null; email_source_url?: string | null;
  phone?: string | null; address?: string | null;
  email2?: string | null; email2_name?: string | null; email2_title?: string | null; contact_locked?: boolean;
  research_note?: string | null; outreach_status: string; contacted_at?: string | null; notes?: string | null;
  contact_count?: number; last_contact_at?: string | null; drip?: Drip;
  nearest_signed_up_school?: { _id: string; name: string; miles: number } | null; signed_up_schools_near?: number;
};
type NearSchool = { _id: string; name: string; district?: string | null; city?: string | null; outreach_status: string; miles: number };

const DEPT: Record<string, [string, string]> = {
  true: ["Parks & Rec department", "badge-light-success"],
  other: ["Served by county / district parks", "badge-light-info"],
  false: ["No parks department found", "badge-light"],
  unknown: ["Not checked yet", "badge-light-warning"],
};
const ROLE: Record<string, string> = {
  volunteer_coordinator: "Volunteer coordinator", recreation: "Recreation / programs", director: "Parks director",
  department: "Parks department email", city_hall: "City hall / clerk (no parks email posted)",
};
const miles = (m: number) => (m === 0 ? "in the city" : `${m} mi`);

/* ---------------------------------------------------------------- contact editor */

const ContactEditor: React.FC<{ city: City; save: (data: any) => Promise<boolean> }> = ({ city, save }) => {
  const [editMain, setEditMain] = useState(false);
  const [main, setMain] = useState({ contact_name: city.contact_name ?? "", contact_title: city.contact_title ?? "", email: city.email ?? "", phone: city.phone ?? "" });
  const [second, setSecond] = useState({ email2: city.email2 ?? "", email2_name: city.email2_name ?? "", email2_title: city.email2_title ?? "" });
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    setMain({ contact_name: city.contact_name ?? "", contact_title: city.contact_title ?? "", email: city.email ?? "", phone: city.phone ?? "" });
    setSecond({ email2: city.email2 ?? "", email2_name: city.email2_name ?? "", email2_title: city.email2_title ?? "" });
  }, [city]);
  const secondDirty = second.email2 !== (city.email2 ?? "") || second.email2_name !== (city.email2_name ?? "") || second.email2_title !== (city.email2_title ?? "");
  const run = async (data: any, after?: () => void) => { setBusy(true); const ok = await save(data); setBusy(false); if (ok && after) after(); };

  return (
    <div>
      <div className="rounded p-3 mb-4" style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)" }}>
        <div className="d-flex align-items-center mb-2">
          <div className="text-muted fs-8 text-uppercase fw-bold">Main contact{city.email_role ? ` · ${ROLE[city.email_role] ?? label(city.email_role)}` : ""}</div>
          {!editMain ? <button className="btn btn-sm btn-link p-0 ms-auto fs-8" onClick={() => setEditMain(true)}>Edit</button> : null}
        </div>
        {!editMain ? (
          <>
            <div className="fw-semibold">{city.contact_name || "—"}{city.contact_title ? <span className="text-muted fw-normal">, {city.contact_title}</span> : null}</div>
            {city.email ? <a href={`mailto:${city.email}`} className="fs-7">{city.email}</a> : <span className="text-muted fs-7">No email found yet</span>}
            {city.email_source_url ? <> · <a href={city.email_source_url} target="_blank" rel="noopener noreferrer" className="fs-8">source</a></> : null}
            {city.phone ? <div className="fs-7 mt-1"><a href={`tel:${city.phone}`}>{city.phone}</a></div> : null}
            {city.contact_locked ? <div className="text-muted fs-8 mt-1">Edited by an admin, so a re-import keeps it.</div> : null}
          </>
        ) : (
          <div className="row g-2">
            <div className="col-6"><input className="form-control form-control-sm" placeholder="Name" value={main.contact_name} onChange={(e) => setMain({ ...main, contact_name: e.target.value })} /></div>
            <div className="col-6"><input className="form-control form-control-sm" placeholder="Title" value={main.contact_title} onChange={(e) => setMain({ ...main, contact_title: e.target.value })} /></div>
            <div className="col-7"><input type="email" className="form-control form-control-sm" placeholder="Email" value={main.email} onChange={(e) => setMain({ ...main, email: e.target.value })} /></div>
            <div className="col-5"><input className="form-control form-control-sm" placeholder="Phone" value={main.phone} onChange={(e) => setMain({ ...main, phone: e.target.value })} /></div>
            <div className="col-12 d-flex gap-2">
              <button className="btn btn-sm btn-primary" disabled={busy} onClick={() => run(main, () => setEditMain(false))}>Save</button>
              <button className="btn btn-sm btn-light" onClick={() => setEditMain(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>

      <div className="rounded p-3" style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)" }}>
        <div className="text-muted fs-8 text-uppercase fw-bold mb-2">Second email (optional)</div>
        <div className="row g-2">
          <div className="col-12"><input type="email" className="form-control form-control-sm" placeholder="e.g. volunteer coordinator you were referred to" value={second.email2} onChange={(e) => setSecond({ ...second, email2: e.target.value })} /></div>
          <div className="col-6"><input className="form-control form-control-sm" placeholder="Name" value={second.email2_name} onChange={(e) => setSecond({ ...second, email2_name: e.target.value })} /></div>
          <div className="col-6"><input className="form-control form-control-sm" placeholder="Title" value={second.email2_title} onChange={(e) => setSecond({ ...second, email2_title: e.target.value })} /></div>
        </div>
        {secondDirty ? <button className="btn btn-sm btn-primary mt-2" disabled={busy} onClick={() => run(second)}>Save second email</button> : null}
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------- pop-up */

export const CityPopup: React.FC<{ id: string; onClose: (changed: boolean) => void; viaSchool?: string | null }> = ({ id, onClose, viaSchool }) => {
  const axios = useAxios();
  const [city, setCity] = useState<City | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [people, setPeople] = useState<{ email: string; name: string | null; role: string }[]>([]);
  const [schools, setSchools] = useState<NearSchool[]>([]);
  const [org, setOrg] = useState<any>(null);
  const [notes, setNotes] = useState("");
  const [changed, setChanged] = useState(false);

  const load = useCallback(async () => {
    try {
      const res: any = await axios({ url: `outreach/details/city/${id}`, method: "GET" });
      const d = res?.data;
      if (!d) return;
      setCity(d.record); setContacts(d.contacts ?? []); setEnrollments(d.enrollments ?? []); setPeople(d.people ?? []);
      setSchools(d.signed_up_schools ?? []); setOrg(d.organization ?? null); setNotes(d.record?.notes ?? "");
    } catch (e) { console.error("city details", e); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  useEffect(() => { load(); }, [load]);

  const patch = async (data: any): Promise<boolean> => {
    try {
      const res: any = await axios({ url: `outreach/cities/${id}`, method: "PATCH", data });
      if (res?.data?.city) { setCity((c) => ({ ...(c as City), ...res.data.city })); setChanged(true); load(); return true; }
    } catch (e) { console.error("save city", e); }
    return false;
  };

  const dept = city ? DEPT[city.has_department] ?? DEPT.unknown : null;
  return (
    <Modal
      onClose={() => onClose(changed)}
      title={city ? city.department_name || `${city.name} Parks & Recreation` : "Loading…"}
      subtitle={city ? [`City of ${city.name}`, city.county ? `${city.county}${/county|city$/i.test(city.county) ? "" : " County"}` : null, city.state].filter(Boolean).join(" · ") : null}
    >
      {!city ? <div className="p-10 text-center text-muted">Loading…</div> : (
        <div className="row g-6">
          <div className="col-lg-5">
            <div className="d-flex flex-wrap gap-2 mb-4">
              <span className={`badge ${statusBadge[city.outreach_status] ?? "badge-light"}`}>{label(city.outreach_status)}</span>
              {dept ? <span className={`badge ${dept[1]}`}>{dept[0]}</span> : null}
              {city.population ? <span className="badge badge-light">Population {city.population.toLocaleString()}</span> : null}
            </div>
            <Field k="Parks website">{city.website ? <a href={href(city.website)} target="_blank" rel="noopener noreferrer">{city.website}</a> : null}</Field>
            <Field k="Volunteer page">{city.volunteer_page_url ? <a href={href(city.volunteer_page_url)} target="_blank" rel="noopener noreferrer">{city.volunteer_page_url}</a> : null}</Field>
            <Field k="Contact page">{city.contact_page_url ? <><a href={href(city.contact_page_url)} target="_blank" rel="noopener noreferrer">{city.contact_page_url}</a>{city.contact_page_form ? <span className="badge badge-light ms-2">Message form</span> : null}</> : null}</Field>
            <Field k="Address">{city.address}</Field>
            <Field k="Also in the Non-Profit Database">{org ? <>{org.name} <span className="text-muted fs-8">({label(org.outreach_status)})</span></> : null}</Field>
            <div className="mb-4"><ContactEditor city={city} save={patch} /></div>
            <div className="mb-3">
              <label className="text-muted fs-8 text-uppercase fw-bold me-2">Parks department</label>
              <select className="form-select form-select-sm w-auto d-inline-block" value={city.has_department} onChange={(e) => patch({ has_department: e.target.value })}>
                {Object.entries(DEPT).map(([v, [l]]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            {city.research_note ? <div className="text-muted fs-7 mb-4">Research: {city.research_note}</div> : null}
            <div className="text-muted fs-8 text-uppercase fw-bold mb-2">Notes</div>
            <textarea className="form-control form-control-sm" rows={5} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes about this city" />
            {notes !== (city.notes ?? "") ? <button className="btn btn-sm btn-primary mt-2" onClick={() => patch({ notes })}>Save notes</button> : null}
          </div>

          <div className="col-lg-7">
            <div className="d-flex flex-wrap gap-3 align-items-center mb-5">
              <label className="fw-bold">Outreach status</label>
              <select className="form-select form-select-sm w-auto" value={city.outreach_status} onChange={(e) => patch({ outreach_status: e.target.value })}>
                {CITY_STATUSES.map((s) => <option key={s} value={s}>{label(s)}</option>)}
              </select>
              {city.contacted_at ? <span className="text-muted fs-8">First contacted {fmtDate(city.contacted_at)}</span> : null}
              {city.outreach_status === "joined" ? <span className="text-muted fs-8 w-100">Joined: the city is posting projects on iServ. Campaign emails stop.</span>
                : STATUS_HINT[city.outreach_status] ? <span className="text-muted fs-8 w-100">{STATUS_HINT[city.outreach_status]}</span> : null}
            </div>

            <div className="rounded p-4 mb-6" style={{ background: "rgba(245,158,11,.08)", border: "1px solid rgba(251,191,36,.35)" }}>
              <div className="fw-bold fs-5 mb-1">Signed-up schools within 5 miles</div>
              {schools.length ? (
                <ul className="mb-0 ps-4 fs-7">
                  {schools.map((s) => <li key={s._id}><span className="fw-semibold">{s.name}</span> <span className="text-muted">· {miles(s.miles)} · {label(s.outreach_status)}</span></li>)}
                </ul>
              ) : <div className="text-muted fs-7">None yet. The cities campaign starts once a school within 5 miles is marked Interested or Partnered in the Schools Database.</div>}
            </div>

            <div className="fw-bold fs-5 mb-3">Cities drip campaign</div>
            <div className="mb-6">
              <CampaignPanel
                axios={axios} campaign="cities" targetId={city._id} enrollments={enrollments} people={people} viaSchool={viaSchool || schools[0]?._id || null}
                blocked={["declined", "do_not_contact"].includes(city.outreach_status) ? `Marked "${label(city.outreach_status)}", so no campaign emails.`
                  : !schools.length && !enrollments.length ? "Waiting for a school within 5 miles to sign up: the emails name that school." : null}
                onChange={() => { setChanged(true); load(); }}
              />
            </div>

            <ContactLog
              axios={axios} targetType="city" targetId={city._id} contacts={contacts} people={people}
              statuses={CITY_STATUSES} currentStatus={city.outreach_status}
              onChange={(next, record) => { setContacts(next); setChanged(true); if (record) { setCity((c) => ({ ...(c as City), ...record })); load(); } }}
            />
          </div>
        </div>
      )}
    </Modal>
  );
};

/* ---------------------------------------------------------------- page */

const CitiesDatabase: React.FC = () => {
  const axiosInstance = useAxios();
  const [filters, setFilters] = useState({ state: "MO", department: "any", outreach_status: "", search: "", has_email: "", has_contact_page: "", near_signed_up: "" });
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<City[]>([]);
  const [total, setTotal] = useState(0);
  const [summary, setSummary] = useState<{ _id: string; n: number; with_department: number; with_email: number; with_contact_page?: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const limit = 50;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page, limit };
      for (const [k, v] of Object.entries(filters)) if (v) params[k] = v;
      const res: any = await axiosInstance({ url: "outreach/cities", method: "GET", params });
      setRows(res.data?.cities ?? []);
      setTotal(res.data?.total ?? 0);
      setSummary(res.data?.summary ?? []);
    } catch (e) {
      console.error("cities database", e);
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
  const st = summary.find((s) => s._id === filters.state) || (filters.state ? null : summary.reduce((a, s) => ({ _id: "", n: a.n + s.n, with_department: a.with_department + s.with_department, with_email: a.with_email + s.with_email, with_contact_page: (a.with_contact_page ?? 0) + (s.with_contact_page ?? 0) }), { _id: "", n: 0, with_department: 0, with_email: 0, with_contact_page: 0 }));

  return (
    <>
      <PageToolbar title="Cities Database" />
      <div id="kt_content" className="content flex-column-fluid">
        {st ? (
          <div className="is-stat-grid mb-5">
            <div className="is-stat"><div className="is-stat-value">{st.n.toLocaleString()}</div><div className="is-stat-label">Cities checked</div></div>
            <div className="is-stat"><div className="is-stat-value">{st.with_department.toLocaleString()}</div><div className="is-stat-label">With a parks department</div></div>
            <div className="is-stat"><div className="is-stat-value">{st.with_email.toLocaleString()}</div><div className="is-stat-label">With a contact email</div></div>
            {st.with_contact_page ? <div className="is-stat"><div className="is-stat-value">{st.with_contact_page.toLocaleString()}</div><div className="is-stat-label">With a contact page</div></div> : null}
          </div>
        ) : null}
        <div className="card card-body mb-5 py-4">
          <div className="d-flex flex-wrap gap-3 align-items-center">
            <select className="form-select form-select-sm w-auto" value={filters.state} onChange={(e) => setFilter("state", e.target.value)} aria-label="State">
              {STATES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
            <select className="form-select form-select-sm w-auto" value={filters.department} onChange={(e) => setFilter("department", e.target.value)} aria-label="Parks department">
              <option value="any">Has a parks department</option>
              <option value="yes">City Parks & Rec only</option>
              <option value="other">Served by county / district</option>
              <option value="unknown">Not checked yet</option>
              <option value="none">No department found</option>
              <option value="">Every city</option>
            </select>
            <select className="form-select form-select-sm w-auto" value={filters.outreach_status} onChange={(e) => setFilter("outreach_status", e.target.value)} aria-label="Outreach status">
              <option value="">Any outreach status</option>
              {CITY_STATUSES.map((s) => <option key={s} value={s}>{label(s)}</option>)}
            </select>
            <label className="form-check form-check-sm form-check-custom mb-0">
              <input className="form-check-input" type="checkbox" checked={filters.has_email === "1"} onChange={(e) => setFilter("has_email", e.target.checked ? "1" : "")} />
              <span className="form-check-label">Has an email</span>
            </label>
            <label className="form-check form-check-sm form-check-custom mb-0">
              <input className="form-check-input" type="checkbox" checked={filters.has_contact_page === "1"} onChange={(e) => setFilter("has_contact_page", e.target.checked ? "1" : "")} />
              <span className="form-check-label">Has a contact page</span>
            </label>
            <label className="form-check form-check-sm form-check-custom mb-0">
              <input className="form-check-input" type="checkbox" checked={filters.near_signed_up === "1"} onChange={(e) => setFilter("near_signed_up", e.target.checked ? "1" : "")} />
              <span className="form-check-label">Signed-up school within 5 mi</span>
            </label>
            <input className="form-control form-control-sm w-250px" placeholder="Search city, county, contact or email" value={filters.search} onChange={(e) => setFilter("search", e.target.value)} />
            <span className="ms-auto text-muted fs-7">{total.toLocaleString()} cities</span>
          </div>
        </div>

        <div className={`card ${loading ? "overlay overlay-block" : ""}`}>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-row-dashed table-hover align-middle fs-6 mb-0">
                <thead>
                  <tr className="fw-bold text-muted text-uppercase fs-8">
                    <th className="ps-6">City</th><th>County</th><th className="text-end">Population</th><th>Volunteer contact</th><th>Signed-up school nearby</th><th>Outreach</th><th className="pe-6">Last contact</th>
                  </tr>
                </thead>
                <tbody>
                  {!rows.length && !loading ? (
                    <tr><td colSpan={7} className="text-center text-muted p-10">No cities match.</td></tr>
                  ) : rows.map((c) => (
                    <tr key={c._id} role="button" tabIndex={0} onClick={() => setOpenId(c._id)} onKeyDown={(e) => { if (e.key === "Enter") setOpenId(c._id); }}>
                      <td className="ps-6"><div className="fw-bold">{c.name}</div><div className="text-muted fs-8">{c.department_name || (DEPT[c.has_department] ?? DEPT.unknown)[0]}</div></td>
                      <td className="fs-7">{c.county}</td>
                      <td className="text-end fs-7">{c.population ? c.population.toLocaleString() : ""}</td>
                      <td className="fs-7">
                        {c.email ? <><div>{c.contact_name || ROLE[c.email_role || ""] || "Email"}</div><div className="text-muted fs-8">{c.email}</div></> : (c.contact_page_url ? <><span className="text-muted">No email</span><div className="text-muted fs-8">Contact page{c.contact_page_form ? " (form)" : ""}</div></> : <span className="text-muted">No email yet</span>)}
                        {c.email2 ? <div className="text-muted fs-8">+ {c.email2}</div> : null}
                      </td>
                      <td className="fs-7">{c.nearest_signed_up_school ? <>{c.nearest_signed_up_school.name}<div className="text-muted fs-8">{miles(c.nearest_signed_up_school.miles)}{(c.signed_up_schools_near ?? 0) > 1 ? ` · ${c.signed_up_schools_near} schools` : ""}</div></> : <span className="text-muted">—</span>}</td>
                      <td>
                        <span className={`badge ${statusBadge[c.outreach_status] ?? "badge-light"}`}>{label(c.outreach_status)}</span>
                        <div className="mt-1"><DripChip drip={c.drip ?? null} /></div>
                      </td>
                      <td className="pe-6 fs-7">{c.last_contact_at ? <>{fmtDate(c.last_contact_at)}<div className="text-muted fs-8">{c.contact_count} logged</div></> : <span className="text-muted">Never</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card-footer d-flex justify-content-between align-items-center py-3">
            <span className="text-muted fs-7">Page {page} of {pages} · click a city for details, a second email and the contact log</span>
            <div className="btn-group btn-group-sm">
              <button className="btn btn-light" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
              <button className="btn btn-light" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>Next</button>
            </div>
          </div>
          {loading ? <ContentLoader /> : null}
        </div>
      </div>
      {openId ? <CityPopup id={openId} onClose={(changed) => { setOpenId(null); if (changed) load(); }} /> : null}
    </>
  );
};

export default CitiesDatabase;
