// Churches Database (Nov 25, 2026): Christian and Jewish congregations (Missouri first), from OpenStreetMap places of
// worship merged with the IRS list of churches. Most have no published email: add one (and a second) in the pop-up,
// along with notes and the contact log.
// API: GET outreach/churches, GET outreach/churches/facets, GET outreach/details/church/:id, PATCH outreach/churches/:id,
// POST outreach/contacts.
import React, { useCallback, useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import { PageToolbar } from "../common";
import ContentLoader from "../common/ContentLoader";
import { CHURCH_STATUSES, Contact, ContactLog, Field, Modal, STATES, STATUS_HINT, fmtDate, href, label, statusBadge } from "./crm";

type Church = {
  _id: string; name: string; religion: string; denomination?: string | null; address?: string | null; city?: string | null; county?: string | null;
  state: string; zip?: string | null; lat?: number | null; lng?: number | null; phone?: string | null; website?: string | null;
  contact_page_url?: string | null; contact_page_form?: boolean | null;
  email?: string | null; contact_name?: string | null; contact_title?: string | null; email2?: string | null; email2_name?: string | null;
  contact_locked?: boolean; ein?: string | null; osm_id?: string | null; sources?: string[];
  outreach_status: string; contacted_at?: string | null; notes?: string | null; contact_count?: number; last_contact_at?: string | null;
};
type Facets = { religion: { _id: string; n: number }[]; denomination: { _id: string | null; n: number }[]; county: { _id: string | null; n: number }[]; totals: { n: number; with_email: number; with_website: number; with_phone: number; with_contact_page?: number } };

const SOURCE: Record<string, string> = { osm: "OpenStreetMap", irs: "IRS exempt-organization list" };
const countyLabel = (c?: string | null) => (!c ? "" : /county|city$/i.test(c) ? c : `${c} County`);

/* ---------------------------------------------------------------- pop-up */

const ChurchPopup: React.FC<{ id: string; onClose: (changed: boolean) => void }> = ({ id, onClose }) => {
  const axios = useAxios();
  const [church, setChurch] = useState<Church | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [people, setPeople] = useState<{ email: string; name: string | null; role: string }[]>([]);
  const [form, setForm] = useState<any>({});
  const [notes, setNotes] = useState("");
  const [changed, setChanged] = useState(false);
  const [busy, setBusy] = useState(false);

  const fill = (r: Church) => {
    setForm({ contact_name: r.contact_name ?? "", contact_title: r.contact_title ?? "", email: r.email ?? "", phone: r.phone ?? "", website: r.website ?? "", contact_page_url: r.contact_page_url ?? "", email2: r.email2 ?? "", email2_name: r.email2_name ?? "" });
    setNotes(r.notes ?? "");
  };
  const load = useCallback(async () => {
    try {
      const res: any = await axios({ url: `outreach/details/church/${id}`, method: "GET" });
      const d = res?.data;
      if (!d) return;
      setChurch(d.record); setContacts(d.contacts ?? []); setPeople(d.people ?? []); fill(d.record);
    } catch (e) { console.error("church details", e); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  useEffect(() => { load(); }, [load]);

  const patch = async (data: any) => {
    setBusy(true);
    try {
      const res: any = await axios({ url: `outreach/churches/${id}`, method: "PATCH", data });
      if (res?.data?.church) { setChurch(res.data.church); fill(res.data.church); setChanged(true); load(); }
    } catch (e) { console.error("save church", e); } finally { setBusy(false); }
  };
  const dirty = church ? Object.keys(form).some((k) => (form[k] ?? "") !== ((church as any)[k] ?? "")) : false;
  const input = (k: string, ph: string, type = "text", cls = "col-6") => (
    <div className={cls}><input type={type} className="form-control form-control-sm" placeholder={ph} value={form[k] ?? ""} onChange={(e) => setForm({ ...form, [k]: e.target.value })} /></div>
  );
  const map = church && church.lat != null && church.lng != null ? `https://www.google.com/maps/search/?api=1&query=${church.lat},${church.lng}` : null;

  return (
    <Modal
      onClose={() => onClose(changed)}
      title={church?.name ?? "Loading…"}
      subtitle={church ? [church.denomination, church.city, countyLabel(church.county), church.state].filter(Boolean).join(" · ") : null}
    >
      {!church ? <div className="p-10 text-center text-muted">Loading…</div> : (
        <div className="row g-6">
          <div className="col-lg-5">
            <div className="d-flex flex-wrap gap-2 mb-4">
              <span className={`badge ${statusBadge[church.outreach_status] ?? "badge-light"}`}>{label(church.outreach_status)}</span>
              <span className="badge badge-light">{label(church.religion)}</span>
              {church.denomination ? <span className="badge badge-light">{church.denomination}</span> : null}
            </div>
            <Field k="Address">{[church.address, church.city, church.state, church.zip].filter(Boolean).join(", ") || null}</Field>
            <Field k="Map">{map ? <a href={map} target="_blank" rel="noopener noreferrer">Open in Google Maps</a> : null}</Field>
            <Field k="Found in">{(church.sources ?? []).map((s) => SOURCE[s] ?? s).join(" and ")}{church.ein ? ` · EIN ${church.ein}` : ""}</Field>

            <div className="rounded p-3 mb-4" style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)" }}>
              <div className="text-muted fs-8 text-uppercase fw-bold mb-2">Contact</div>
              <div className="row g-2">
                {input("contact_name", "Pastor / rabbi / office contact")}
                {input("contact_title", "Title")}
                {input("email", "Email", "email", "col-7")}
                {input("phone", "Phone", "text", "col-5")}
                {input("website", "Website", "url", "col-12")}
                {input("contact_page_url", "Contact page (when there is no email)", "url", "col-12")}
              </div>
              <div className="text-muted fs-8 text-uppercase fw-bold mt-3 mb-2">Second email (optional)</div>
              <div className="row g-2">
                {input("email2", "Second email", "email", "col-7")}
                {input("email2_name", "Name", "text", "col-5")}
              </div>
              <div className="d-flex flex-wrap gap-3 align-items-center mt-3">
                {dirty ? <button className="btn btn-sm btn-primary" disabled={busy} onClick={() => patch(form)}>Save contact</button> : null}
                {church.website ? <a href={href(church.website)} target="_blank" rel="noopener noreferrer" className="fs-7">Visit website</a> : null}
                {church.contact_page_url ? <a href={href(church.contact_page_url)} target="_blank" rel="noopener noreferrer" className="fs-7">Open contact page{church.contact_page_form ? " (message form)" : ""}</a> : null}
                {church.phone ? <a href={`tel:${church.phone}`} className="fs-7">Call</a> : null}
              </div>
            </div>

            <div className="text-muted fs-8 text-uppercase fw-bold mb-2">Notes</div>
            <textarea className="form-control form-control-sm" rows={5} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes about this congregation (youth group, service days, who to ask)" />
            {notes !== (church.notes ?? "") ? <button className="btn btn-sm btn-primary mt-2" disabled={busy} onClick={() => patch({ notes })}>Save notes</button> : null}
          </div>

          <div className="col-lg-7">
            <div className="d-flex flex-wrap gap-3 align-items-center mb-5">
              <label className="fw-bold">Outreach status</label>
              <select className="form-select form-select-sm w-auto" value={church.outreach_status} onChange={(e) => patch({ outreach_status: e.target.value })}>
                {CHURCH_STATUSES.map((s) => <option key={s} value={s}>{label(s)}</option>)}
              </select>
              {church.contacted_at ? <span className="text-muted fs-8">First contacted {fmtDate(church.contacted_at)}</span> : null}
              {church.outreach_status === "joined" ? <span className="text-muted fs-8 w-100">Joined: the congregation is posting service projects on iServ.</span>
                : STATUS_HINT[church.outreach_status] ? <span className="text-muted fs-8 w-100">{STATUS_HINT[church.outreach_status]}</span> : null}
            </div>
            <ContactLog
              axios={axios} targetType="church" targetId={church._id} contacts={contacts} people={people}
              statuses={CHURCH_STATUSES} currentStatus={church.outreach_status}
              onChange={(next, record) => { setContacts(next); setChanged(true); if (record) { setChurch((c) => ({ ...(c as Church), ...record })); load(); } }}
            />
          </div>
        </div>
      )}
    </Modal>
  );
};

/* ---------------------------------------------------------------- page */

const ChurchesDatabase: React.FC = () => {
  const axiosInstance = useAxios();
  const [filters, setFilters] = useState({ state: "MO", religion: "", denomination: "", county: "", outreach_status: "", has_email: "", has_website: "", has_contact_page: "", search: "" });
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<Church[]>([]);
  const [total, setTotal] = useState(0);
  const [facets, setFacets] = useState<Facets | null>(null);
  const [loading, setLoading] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const limit = 50;

  useEffect(() => {
    (async () => {
      try {
        const res: any = await axiosInstance({ url: "outreach/churches/facets", method: "GET", params: filters.state ? { state: filters.state } : {} });
        setFacets(res.data ?? null);
      } catch (e) { console.error("church facets", e); }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.state]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page, limit };
      for (const [k, v] of Object.entries(filters)) if (v) params[k] = v;
      const res: any = await axiosInstance({ url: "outreach/churches", method: "GET", params });
      setRows(res.data?.churches ?? []);
      setTotal(res.data?.total ?? 0);
    } catch (e) {
      console.error("churches database", e);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page]);
  useEffect(() => {
    const t = window.setTimeout(load, filters.search ? 300 : 0);
    return () => window.clearTimeout(t);
  }, [load, filters.search]);

  const setFilter = (k: keyof typeof filters, v: string) => { setPage(1); setFilters((f) => ({ ...f, [k]: v, ...(k === "state" ? { county: "" } : {}) })); };
  const pages = Math.max(1, Math.ceil(total / limit));
  const t = facets?.totals;

  return (
    <>
      <PageToolbar title="Churches Database" />
      <div id="kt_content" className="content flex-column-fluid">
        {t ? (
          <div className="is-stat-grid mb-5">
            <div className="is-stat"><div className="is-stat-value">{t.n.toLocaleString()}</div><div className="is-stat-label">Congregations</div></div>
            {(facets?.religion ?? []).map((r) => <div key={r._id} className="is-stat"><div className="is-stat-value">{r.n.toLocaleString()}</div><div className="is-stat-label">{label(r._id)}</div></div>)}
            <div className="is-stat"><div className="is-stat-value">{t.with_website.toLocaleString()}</div><div className="is-stat-label">With a website</div></div>
            <div className="is-stat"><div className="is-stat-value">{t.with_email.toLocaleString()}</div><div className="is-stat-label">With an email</div></div>
            {t.with_contact_page ? <div className="is-stat"><div className="is-stat-value">{t.with_contact_page.toLocaleString()}</div><div className="is-stat-label">With a contact page</div></div> : null}
          </div>
        ) : null}
        <div className="card card-body mb-5 py-4">
          <div className="d-flex flex-wrap gap-3 align-items-center">
            <select className="form-select form-select-sm w-auto" value={filters.state} onChange={(e) => setFilter("state", e.target.value)} aria-label="State">
              {STATES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
            <select className="form-select form-select-sm w-auto" value={filters.religion} onChange={(e) => setFilter("religion", e.target.value)} aria-label="Religion">
              <option value="">Christian and Jewish</option>
              <option value="christian">Christian</option>
              <option value="jewish">Jewish</option>
            </select>
            <select className="form-select form-select-sm w-auto" value={filters.denomination} onChange={(e) => setFilter("denomination", e.target.value)} aria-label="Denomination">
              <option value="">Any denomination</option>
              {(facets?.denomination ?? []).filter((d) => d._id).map((d) => <option key={d._id as string} value={d._id as string}>{d._id} ({d.n})</option>)}
            </select>
            <select className="form-select form-select-sm w-auto" value={filters.county} onChange={(e) => setFilter("county", e.target.value)} aria-label="County">
              <option value="">Any county</option>
              {(facets?.county ?? []).filter((c) => c._id).map((c) => <option key={c._id as string} value={c._id as string}>{countyLabel(c._id)} ({c.n})</option>)}
            </select>
            <select className="form-select form-select-sm w-auto" value={filters.outreach_status} onChange={(e) => setFilter("outreach_status", e.target.value)} aria-label="Outreach status">
              <option value="">Any outreach status</option>
              {CHURCH_STATUSES.map((s) => <option key={s} value={s}>{label(s)}</option>)}
            </select>
            <label className="form-check form-check-sm form-check-custom mb-0">
              <input className="form-check-input" type="checkbox" checked={filters.has_website === "1"} onChange={(e) => setFilter("has_website", e.target.checked ? "1" : "")} />
              <span className="form-check-label">Has a website</span>
            </label>
            <label className="form-check form-check-sm form-check-custom mb-0">
              <input className="form-check-input" type="checkbox" checked={filters.has_email === "1"} onChange={(e) => setFilter("has_email", e.target.checked ? "1" : "")} />
              <span className="form-check-label">Has an email</span>
            </label>
            <label className="form-check form-check-sm form-check-custom mb-0">
              <input className="form-check-input" type="checkbox" checked={filters.has_contact_page === "1"} onChange={(e) => setFilter("has_contact_page", e.target.checked ? "1" : "")} />
              <span className="form-check-label">Has a contact page</span>
            </label>
            <input className="form-control form-control-sm w-250px" placeholder="Search name, city, address or contact" value={filters.search} onChange={(e) => setFilter("search", e.target.value)} />
            <span className="ms-auto text-muted fs-7">{total.toLocaleString()} congregations</span>
          </div>
        </div>

        <div className={`card ${loading ? "overlay overlay-block" : ""}`}>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-row-dashed table-hover align-middle fs-6 mb-0">
                <thead>
                  <tr className="fw-bold text-muted text-uppercase fs-8">
                    <th className="ps-6">Congregation</th><th>Denomination</th><th>Place</th><th>Contact</th><th>Outreach</th><th className="pe-6">Last contact</th>
                  </tr>
                </thead>
                <tbody>
                  {!rows.length && !loading ? (
                    <tr><td colSpan={6} className="text-center text-muted p-10">No congregations match.</td></tr>
                  ) : rows.map((c) => (
                    <tr key={c._id} role="button" tabIndex={0} onClick={() => setOpenId(c._id)} onKeyDown={(e) => { if (e.key === "Enter") setOpenId(c._id); }}>
                      <td className="ps-6"><div className="fw-bold">{c.name}</div><div className="text-muted fs-8">{c.address}</div></td>
                      <td className="fs-7">{c.denomination}{c.religion === "jewish" ? <div className="text-muted fs-8">Jewish</div> : null}</td>
                      <td className="fs-7">{c.city}<div className="text-muted fs-8">{countyLabel(c.county)}</div></td>
                      <td className="fs-7">
                        {c.email ? <div>{c.email}</div> : null}
                        {c.phone ? <div className="text-muted fs-8">{c.phone}</div> : null}
                        {!c.email && c.contact_page_url ? <div className="text-muted fs-8">Contact page{c.contact_page_form ? " (form)" : ""}</div> : null}
                        {!c.email && !c.phone && !c.contact_page_url ? (c.website ? <span className="text-muted fs-8">Website only</span> : <span className="text-muted">—</span>) : null}
                      </td>
                      <td><span className={`badge ${statusBadge[c.outreach_status] ?? "badge-light"}`}>{label(c.outreach_status)}</span></td>
                      <td className="pe-6 fs-7">{c.last_contact_at ? <>{fmtDate(c.last_contact_at)}<div className="text-muted fs-8">{c.contact_count} logged</div></> : <span className="text-muted">Never</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card-footer d-flex justify-content-between align-items-center py-3">
            <span className="text-muted fs-7">Page {page} of {pages} · click a congregation to add an email, notes and contacts</span>
            <div className="btn-group btn-group-sm">
              <button className="btn btn-light" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
              <button className="btn btn-light" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>Next</button>
            </div>
          </div>
          {loading ? <ContentLoader /> : null}
        </div>
      </div>
      {openId ? <ChurchPopup id={openId} onClose={(changed) => { setOpenId(null); if (changed) load(); }} /> : null}
    </>
  );
};

export default ChurchesDatabase;
