import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import useAxios from "../../hooks/useAxios";
import { PageToolbar } from "../common";
import helpers from "../../_helpers/common";
import ContentLoader from "../common/ContentLoader";

interface Person { _id: string; fullname?: string; first_name?: string; last_name?: string; email?: string }

interface ServiceReport {
  _id: string;
  title: string;
  write_up?: string;
  description?: string;
  activity_date: string;
  hours_claimed: number;
  location: string;
  parent_email: string;
  status: number;
  coins_awarded: number;
  beforephotourl?: string | null;
  afterphotourl?: string | null;
  videourl?: string | null;
  parent_response_at?: string | null;
  created_at: string;
  student_id?: Person | null;
  admin_reviewed_at?: string | null;
  admin_reviewed_by?: Person | null;
  flagged_for_admin?: boolean;
  flag_note?: string;
  flagged_by?: Person | null;
  flagged_at?: string | null;
  flag_resolved_at?: string | null;
  flag_resolution?: string;
  parent_reminder_count?: number;
  parent_reminded_at?: string | null;
}

type Counts = Record<string, number>;
type StudentOption = { _id: string; name: string; email?: string; n: number; fresh: number };

// The stages a self-report moves through. Verification is done by the parent on Xogos, which also awards
// the coins, so admins read and follow up here: mark reports reviewed, flag questionable ones for the
// Super Admin, and nudge parents who haven't answered.
const STAGES: { key: string; label: string; badge: string; note?: string }[] = [
  { key: "all", label: "All", badge: "" },
  {
    key: "0",
    label: "Not sent to parent",
    badge: "Not sent to parent",
    note: "This report hasn't reached the parent on Xogos yet. That usually means the student's Xogos account isn't linked or the hand-off failed when it was submitted.",
  },
  {
    key: "1",
    label: "Waiting on parent",
    badge: "Waiting on parent",
    note: "The parent has been asked to confirm this on Xogos and hasn't answered yet. Parents get an automatic reminder email after 3 days.",
  },
  { key: "2", label: "Verified", badge: "Verified by parent" },
];
const REVIEW: { key: string; label: string }[] = [
  { key: "", label: "Everything" },
  { key: "new", label: "New, needs review" },
  { key: "flagged", label: "Flagged for Admin" },
];

const PAGE_SIZE = 10;
const fmtDate = (value?: string | null) => (value ? helpers.convertDateTime(new Date(value), "DD MMM, YYYY") : "—");
const nameOf = (p?: Person | null) => p?.fullname || `${p?.first_name || ""} ${p?.last_name || ""}`.trim() || p?.email || "an admin";

const ServiceReportList: React.FC = () => {
  const axiosInstance = useAxios();
  const me: any = useSelector((state: RootState) => state.user.user);
  const isSuperAdmin = Number(me?.role_id) === 1;
  const [stage, setStage] = useState("all");
  const [review, setReview] = useState(() => new URLSearchParams(window.location.search).get("review") || "");
  const [student, setStudent] = useState("");
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [results, setResults] = useState<ServiceReport[] | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [counts, setCounts] = useState<Counts>({});
  const [openForm, setOpenForm] = useState<{ id: string; kind: "flag" | "resolve" } | null>(null);
  const [formText, setFormText] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const requestId = useRef(0);

  useEffect(() => {
    const id = ++requestId.current;
    const load = async () => {
      setIsLoading(true);
      setFailed(false);
      try {
        const response: any = await axiosInstance({
          url: "independent-projects/admin-list",
          method: "GET",
          params: { page, limit: PAGE_SIZE, status: stage, search, review, student },
        });
        if (id !== requestId.current) return; // a newer filter or page has been asked for
        const list = response?.data?.list;
        if (!list) throw new Error("No list in the response");
        setResults((prev) => (page === 1 ? list.docs : [...(prev ?? []), ...list.docs]));
        setHasMore(!!list.hasNextPage);
        setTotal(list.totalDocs || 0);
        setCounts(response.data.counts || {});
        setStudents(response.data.students || []);
      } catch (error: any) {
        if (id !== requestId.current) return;
        console.error("Error loading self-reported service:", error);
        setFailed(true);
        if (page === 1) setResults([]);
      } finally {
        if (id === requestId.current) setIsLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, stage, search, review, student, reloadKey]);

  const restart = () => { setResults(null); setPage(1); };
  const chooseStage = (key: string) => { if (key !== stage) { restart(); setStage(key); } };
  const chooseReview = (key: string) => { if (key !== review) { restart(); setReview(key); } };
  const chooseStudent = (id: string) => { if (id !== student) { restart(); setStudent(id); } };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const next = searchText.trim();
    if (next === search) return;
    restart();
    setSearch(next);
  };
  const clearSearch = () => { setSearchText(""); if (search) { restart(); setSearch(""); } };

  // Actions refresh only the changed card and the counts.
  const act = async (report: ServiceReport, url: string, data: any, patch: Partial<ServiceReport>) => {
    setBusy(report._id + url);
    try {
      const r: any = await axiosInstance({ url, method: "POST", data });
      if (!r?.error) {
        setResults((prev) => (prev ?? []).map((x) => (x._id === report._id ? { ...x, ...patch } : x)));
        setOpenForm(null);
        setFormText("");
        window.dispatchEvent(new Event("iserv:self-report-counts"));
        const c: any = await axiosInstance({ url: "independent-projects/admin-counts", method: "GET" });
        if (c?.data) setCounts((old) => ({ ...old, new: c.data.new, flagged: c.data.flagged }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(null);
    }
  };

  const studentName = (r: ServiceReport) => nameOf(r.student_id) || "Unknown student";
  const stageOf = (status: number) => STAGES.find((s) => s.key === String(status));

  return (
    <>
      <PageToolbar title="Self-Reported Service" />
      <div id="kt_content" className="content flex-column-fluid">
        <p className="text-gray-700 fs-6 mb-5" style={{ maxWidth: "62rem" }}>
          Service that students did outside an iServ event and reported themselves. A parent confirms each report on
          Xogos, which is also where the coins are awarded. Review new reports here, flag anything questionable for the
          Super Admin, and remind parents who haven't answered. Reports a parent declined aren't shown.
        </p>

        <div className="is-tabs mb-3" role="tablist" aria-label="Review status">
          {REVIEW.map((r) => (
            <button key={r.key} type="button" role="tab" aria-selected={review === r.key}
              className={`is-tab ${review === r.key ? "active" : ""}`} onClick={() => chooseReview(r.key)}>
              {r.label}
              {r.key ? <span className={`is-tab-count ${r.key && (counts[r.key] ?? 0) > 0 ? "is-tab-count-alert" : ""}`}>{counts[r.key] ?? 0}</span> : null}
            </button>
          ))}
        </div>

        <div className="d-flex flex-wrap align-items-center justify-content-between gap-4 mb-5">
          <div className="is-tabs" role="tablist" aria-label="Report stage">
            {STAGES.map((s) => (
              <button key={s.key} type="button" role="tab" aria-selected={stage === s.key}
                className={`is-tab ${stage === s.key ? "active" : ""}`} onClick={() => chooseStage(s.key)}>
                {s.label}
                <span className="is-tab-count">{counts[s.key] ?? 0}</span>
              </button>
            ))}
          </div>
          <div className="d-flex flex-wrap gap-2">
            <label className="visually-hidden" htmlFor="sr-student">Student</label>
            <select id="sr-student" className="form-select form-select-sm w-250px" value={student} onChange={(e) => chooseStudent(e.target.value)}>
              <option value="">All students ({students.length})</option>
              {students.map((s) => (
                <option key={s._id} value={s._id}>{(s.name || s.email || "Unknown").trim()} · {s.n}{s.fresh ? ` (${s.fresh} new)` : ""}</option>
              ))}
            </select>
            <form className="d-flex gap-2" onSubmit={submitSearch} role="search">
              <input type="search" className="form-control form-control-sm w-200px" placeholder="Student, title or location"
                aria-label="Search self-reported service" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
              <button type="submit" className="btn btn-sm btn-primary">Search</button>
              {search ? <button type="button" className="btn btn-sm btn-light" onClick={clearSearch}>Clear</button> : null}
            </form>
          </div>
        </div>

        <div className={`position-relative ${isLoading ? "overlay overlay-block" : ""}`} style={{ minHeight: "40vh" }}>
          {results === null ? null : results.length === 0 ? (
            <div className="is-report is-empty fs-5">
              {failed ? "The reports couldn't be loaded. Refresh the page to try again."
                : search ? `No reports match "${search}".`
                : review === "new" ? "Nothing new to review. Nice work."
                : review === "flagged" ? "No open flags."
                : "No self-reported service here yet."}
            </div>
          ) : (
            <>
              {results.map((report) => {
                const st = stageOf(report.status);
                const isNew = !report.admin_reviewed_at;
                const openFlag = report.flagged_for_admin && !report.flag_resolved_at;
                const waiting = report.status === 0 || report.status === 1;
                return (
                  <article key={report._id} className={`is-report ${openFlag ? "is-report-flagged" : ""}`}>
                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                      <div style={{ minWidth: 0 }}>
                        <h2 className="is-report-title">{report.title}</h2>
                        <p className="is-report-by">
                          by{" "}
                          <button type="button" className="btn btn-link p-0 fw-bold align-baseline" onClick={() => report.student_id?._id && chooseStudent(report.student_id._id)} title="Show only this student's reports">
                            {studentName(report)}
                          </button>
                          {report.student_id?.email ? ` · ${report.student_id.email}` : ""}
                        </p>
                      </div>
                      <div className="d-flex gap-2 flex-wrap">
                        {isNew ? <span className="is-status is-status-new">New</span> : null}
                        {openFlag ? <span className="is-status is-status-flag">Flagged</span> : null}
                        <span className={`is-status is-status-${report.status}`}>{st?.badge || "Unknown"}</span>
                      </div>
                    </div>

                    <dl className="is-facts">
                      <div className="is-fact"><dt>Service date</dt><dd>{fmtDate(report.activity_date)}</dd></div>
                      <div className="is-fact"><dt>Hours claimed</dt><dd>{report.hours_claimed}</dd></div>
                      <div className="is-fact"><dt>Location</dt><dd>{report.location || "—"}</dd></div>
                      <div className="is-fact"><dt>Reported on</dt><dd>{fmtDate(report.created_at)}</dd></div>
                      <div className="is-fact"><dt>Parent</dt><dd>{report.parent_email || "—"}</dd></div>
                      {waiting ? (
                        <div className="is-fact"><dt>Parent reminders</dt><dd>{report.parent_reminder_count ? `${report.parent_reminder_count} · last ${fmtDate(report.parent_reminded_at)}` : "None yet"}</dd></div>
                      ) : null}
                      {report.status === 2 ? (
                        <>
                          <div className="is-fact"><dt>Verified on</dt><dd>{fmtDate(report.parent_response_at)}</dd></div>
                          <div className="is-fact"><dt>Coins awarded</dt><dd>{report.coins_awarded}</dd></div>
                        </>
                      ) : null}
                    </dl>

                    {report.write_up || report.description ? <p className="is-writeup">{report.write_up || report.description}</p> : null}

                    <div className="is-photos">
                      {report.beforephotourl ? (
                        <a href={report.beforephotourl} target="_blank" rel="noopener noreferrer" className="is-photo">
                          <img src={report.beforephotourl} alt={`Before: ${report.title}`} loading="lazy" />
                          <span>BEFORE</span>
                        </a>
                      ) : null}
                      {report.afterphotourl ? (
                        <a href={report.afterphotourl} target="_blank" rel="noopener noreferrer" className="is-photo">
                          <img src={report.afterphotourl} alt={`After: ${report.title}`} loading="lazy" />
                          <span>AFTER</span>
                        </a>
                      ) : null}
                    </div>

                    {report.videourl ? (
                      <a href={report.videourl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-light-primary mt-4">Watch video</a>
                    ) : null}

                    {st?.note ? <div className="is-note mt-4">{st.note}</div> : null}

                    {report.flagged_for_admin ? (
                      <div className={`is-flag mt-4 ${report.flag_resolved_at ? "is-flag-closed" : ""}`}>
                        <p className="m-0"><b>{report.flag_resolved_at ? "Flag closed" : "Flagged for the Super Admin"}</b> by {nameOf(report.flagged_by)} · {fmtDate(report.flagged_at)}</p>
                        <p className="m-0 mt-1">{report.flag_note}</p>
                        {report.flag_resolved_at && report.flag_resolution ? <p className="m-0 mt-1"><b>Resolution:</b> {report.flag_resolution}</p> : null}
                      </div>
                    ) : null}

                    {openForm?.id === report._id ? (
                      <form className="is-inline-form mt-4" onSubmit={(e) => {
                        e.preventDefault();
                        if (openForm.kind === "flag") act(report, `independent-projects/admin/${report._id}/flag`, { note: formText }, { flagged_for_admin: true, flag_note: formText, flagged_at: new Date().toISOString(), flagged_by: me, flag_resolved_at: null, admin_reviewed_at: new Date().toISOString() });
                        else act(report, `independent-projects/admin/${report._id}/resolve-flag`, { resolution: formText }, { flag_resolved_at: new Date().toISOString(), flag_resolution: formText });
                      }}>
                        <label htmlFor={`f-${report._id}`} className="form-label fw-bold">
                          {openForm.kind === "flag" ? "What looks questionable? The Super Admin will see this note." : "How was it resolved?"}
                        </label>
                        <textarea id={`f-${report._id}`} className="form-control" rows={2} value={formText} onChange={(e) => setFormText(e.target.value)} required minLength={3} maxLength={1000} />
                        <div className="d-flex gap-2 mt-2">
                          <button type="submit" className="btn btn-sm btn-primary" disabled={!!busy}>{openForm.kind === "flag" ? "Send to Super Admin" : "Close flag"}</button>
                          <button type="button" className="btn btn-sm btn-secondary" onClick={() => { setOpenForm(null); setFormText(""); }}>Cancel</button>
                        </div>
                      </form>
                    ) : (
                      <div className="d-flex flex-wrap gap-2 mt-4">
                        {isNew ? (
                          <button type="button" className="btn btn-sm btn-primary" disabled={!!busy}
                            onClick={() => act(report, `independent-projects/admin/${report._id}/review`, {}, { admin_reviewed_at: new Date().toISOString(), admin_reviewed_by: me })}>
                            Mark reviewed
                          </button>
                        ) : (
                          <span className="text-muted fs-7 align-self-center">Reviewed by {nameOf(report.admin_reviewed_by)} · {fmtDate(report.admin_reviewed_at)}</span>
                        )}
                        {!openFlag ? (
                          <button type="button" className="btn btn-sm btn-light-warning" onClick={() => { setOpenForm({ id: report._id, kind: "flag" }); setFormText(""); }}>
                            Flag for Admin
                          </button>
                        ) : isSuperAdmin ? (
                          <button type="button" className="btn btn-sm btn-light-warning" onClick={() => { setOpenForm({ id: report._id, kind: "resolve" }); setFormText(""); }}>
                            Close flag
                          </button>
                        ) : null}
                        {waiting && report.parent_email ? (
                          <button type="button" className="btn btn-sm btn-light" disabled={!!busy}
                            onClick={() => act(report, `independent-projects/admin/${report._id}/remind-parent`, {}, { parent_reminder_count: (report.parent_reminder_count || 0) + 1, parent_reminded_at: new Date().toISOString() })}>
                            Email parent reminder
                          </button>
                        ) : null}
                      </div>
                    )}
                  </article>
                );
              })}
              <div className="d-flex flex-column align-items-center gap-3 py-6">
                <span className="text-muted fs-7">Showing {results.length} of {total}</span>
                {hasMore ? (
                  <button type="button" className="btn btn-light-primary" disabled={isLoading} onClick={() => setPage((p) => p + 1)}>Show more</button>
                ) : null}
                {!results.length ? null : (
                  <button type="button" className="btn btn-sm btn-link" onClick={() => { restart(); setReloadKey((k) => k + 1); }}>Refresh</button>
                )}
              </div>
            </>
          )}
          {isLoading ? <ContentLoader /> : null}
        </div>
      </div>
    </>
  );
};

export default ServiceReportList;
