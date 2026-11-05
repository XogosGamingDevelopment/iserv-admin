// Outreach schools: public high schools to tell about iServ (principal, a second contact such as the college &
// career or service-hours counselor, and the National Honor Society advisor). Researched Nov 2026; every email has
// the page it came from. API: GET/PATCH outreach/schools (backend OutreachController).
import React, { useCallback, useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import { PageToolbar } from "../common";
import ContentLoader from "../common/ContentLoader";

type School = {
  _id: string; name: string; district?: string | null; type?: string; city?: string | null; county?: string | null; state: string; region: string;
  phone?: string | null; website?: string | null;
  principal_name?: string | null; principal_email?: string | null; principal_source_url?: string | null;
  admin2_name?: string | null; admin2_title?: string | null; admin2_email?: string | null; admin2_source_url?: string | null;
  nhs_advisor_name?: string | null; nhs_advisor_email?: string | null; nhs_source_url?: string | null;
  outreach_status: string; contacted_at?: string | null; notes?: string | null;
};

const OUTREACH = ["not_contacted", "contacted", "replied", "partnered", "declined", "do_not_contact"];
const label = (s: string) => s.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
const STATES = [["", "All states"], ["MO", "Missouri"], ["FL", "Florida"], ["TX", "Texas"]];

const Contact = ({ role, name, email, source }: { role: string; name?: string | null; email?: string | null; source?: string | null }) =>
  name || email ? (
    <div className="mb-2">
      <div className="text-muted fs-8 text-uppercase fw-bold">{role}</div>
      <div className="fw-semibold">{name || "—"}</div>
      {email ? <a href={`mailto:${email}`} className="fs-7">{email}</a> : <span className="text-muted fs-7">No email posted</span>}
      {source ? <> · <a href={source} target="_blank" rel="noopener noreferrer" className="fs-8">source</a></> : null}
    </div>
  ) : null;

const Schools: React.FC = () => {
  const axiosInstance = useAxios();
  const [filters, setFilters] = useState({ state: "", outreach_status: "", search: "", has_nhs: "" });
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<School[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState<Record<string, string>>({});
  const limit = 25;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page, limit };
      for (const [k, v] of Object.entries(filters)) if (v) params[k] = v;
      const res: any = await axiosInstance({ url: "outreach/schools", method: "GET", params });
      setRows(res.data?.schools ?? []);
      setTotal(res.data?.total ?? 0);
    } catch (e) {
      console.error("outreach schools", e);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page]);
  useEffect(() => { load(); }, [load]);

  const setFilter = (k: keyof typeof filters, v: string) => { setPage(1); setFilters((f) => ({ ...f, [k]: v })); };
  const save = async (s: School, patch: Partial<School>) => {
    try {
      const res: any = await axiosInstance({ url: `outreach/schools/${s._id}`, method: "PATCH", data: patch });
      const updated = res.data?.school;
      if (updated) setRows((rs) => rs.map((r) => (r._id === s._id ? { ...r, ...updated } : r)));
    } catch (e) {
      console.error("save school", e);
    }
  };
  const pages = Math.max(1, Math.ceil(total / limit));

  return (
    <>
      <PageToolbar title="Outreach Schools" />
      <div id="kt_content" className="content flex-column-fluid">
        <div className="card card-body mb-5 py-4">
          <div className="d-flex flex-wrap gap-3 align-items-center">
            <select className="form-select form-select-sm w-auto" value={filters.state} onChange={(e) => setFilter("state", e.target.value)}>
              {STATES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
            <select className="form-select form-select-sm w-auto" value={filters.outreach_status} onChange={(e) => setFilter("outreach_status", e.target.value)}>
              <option value="">Any outreach status</option>
              {OUTREACH.map((s) => <option key={s} value={s}>{label(s)}</option>)}
            </select>
            <label className="form-check form-check-sm form-check-custom mb-0">
              <input className="form-check-input" type="checkbox" checked={filters.has_nhs === "1"} onChange={(e) => setFilter("has_nhs", e.target.checked ? "1" : "")} />
              <span className="form-check-label">Has NHS advisor</span>
            </label>
            <input className="form-control form-control-sm w-275px" placeholder="Search school, district, city or principal" value={filters.search} onChange={(e) => setFilter("search", e.target.value)} />
            <span className="ms-auto text-muted fs-7">{total} schools</span>
          </div>
        </div>

        <div className={`card ${loading ? "overlay overlay-block" : ""}`}>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-row-dashed align-middle fs-6 mb-0">
                <thead>
                  <tr className="fw-bold text-muted text-uppercase fs-8">
                    <th className="ps-6">School</th><th>Principal</th><th>Second contact</th><th>NHS advisor</th><th className="pe-6" style={{ minWidth: 190 }}>Outreach</th>
                  </tr>
                </thead>
                <tbody>
                  {!rows.length && !loading ? (
                    <tr><td colSpan={5} className="text-center text-muted p-10">No schools match.</td></tr>
                  ) : rows.map((s) => (
                    <React.Fragment key={s._id}>
                      <tr>
                        <td className="ps-6">
                          <div className="fw-bold">{s.name}</div>
                          <div className="text-muted fs-7">{s.district}</div>
                          <div className="text-muted fs-8">{[s.city, s.county ? `${s.county} Co.` : null, s.state].filter(Boolean).join(" · ")}{s.phone ? ` · ${s.phone}` : ""}</div>
                          {s.website ? <a href={/^https?:/.test(s.website) ? s.website : `https://${s.website}`} target="_blank" rel="noopener noreferrer" className="fs-8">Website</a> : null}
                        </td>
                        <td><Contact role="Principal" name={s.principal_name} email={s.principal_email} source={s.principal_source_url} /></td>
                        <td><Contact role={s.admin2_title || "Contact"} name={s.admin2_name} email={s.admin2_email} source={s.admin2_source_url} /></td>
                        <td><Contact role="NHS" name={s.nhs_advisor_name} email={s.nhs_advisor_email} source={s.nhs_source_url} /></td>
                        <td className="pe-6">
                          <select className="form-select form-select-sm mb-2" value={s.outreach_status} onChange={(e) => save(s, { outreach_status: e.target.value })}>
                            {OUTREACH.map((o) => <option key={o} value={o}>{label(o)}</option>)}
                          </select>
                          {s.contacted_at ? <div className="text-muted fs-8 mb-1">Contacted {new Date(s.contacted_at).toLocaleDateString()}</div> : null}
                          <button className="btn btn-sm btn-light w-100" onClick={() => setOpen(open === s._id ? null : s._id)}>{open === s._id ? "Hide notes" : "Notes"}</button>
                        </td>
                      </tr>
                      {open === s._id ? (
                        <tr>
                          <td colSpan={5} className="ps-6 pe-6 pb-5">
                            <div className="d-flex gap-2">
                              <textarea
                                className="form-control form-control-sm"
                                rows={4}
                                value={noteDraft[s._id] ?? s.notes ?? ""}
                                onChange={(e) => setNoteDraft((d) => ({ ...d, [s._id]: e.target.value }))}
                              />
                              <button className="btn btn-sm btn-primary align-self-start" onClick={() => save(s, { notes: noteDraft[s._id] ?? s.notes ?? "" })}>Save</button>
                            </div>
                            <div className="text-muted fs-8 mt-1">Research notes say what to double-check (e.g. a principal name that differs between sources).</div>
                          </td>
                        </tr>
                      ) : null}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
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

export default Schools;
