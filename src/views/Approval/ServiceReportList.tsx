import React, { useEffect, useRef, useState } from "react";
import useAxios from "../../hooks/useAxios";
import { PageToolbar } from "../common";
import helpers from "../../_helpers/common";
import ContentLoader from "../common/ContentLoader";

interface ServiceReportStudent {
  _id: string;
  fullname?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
}

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
  student_id?: ServiceReportStudent | null;
}

type Counts = Record<string, number>;

// The stages a self-report moves through. Verification is done by the parent on Xogos, which also awards
// the coins, so this page is for reading and following up, not approving.
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
    note: "The parent has been asked to confirm this on Xogos and hasn't answered yet.",
  },
  { key: "2", label: "Verified", badge: "Verified by parent" },
];

const PAGE_SIZE = 10;

const fmtDate = (value?: string | null) =>
  value ? helpers.convertDateTime(new Date(value), "DD MMM, YYYY") : "—";

/**
 * Self-reported service projects ("Service Outside iServ") for the Super Admin and sub-admins: everything a
 * student has reported that is still in progress or has been verified by a parent. Declined reports aren't listed.
 */
const ServiceReportList: React.FC = () => {
  const axiosInstance = useAxios();
  const [stage, setStage] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [results, setResults] = useState<ServiceReport[] | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [counts, setCounts] = useState<Counts>({});
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
          params: { page, limit: PAGE_SIZE, status: stage, search },
        });
        if (id !== requestId.current) return; // a newer filter or page has been asked for
        const list = response?.data?.list;
        if (!list) throw new Error("No list in the response");
        setResults((prev) => (page === 1 ? list.docs : [...(prev ?? []), ...list.docs]));
        setHasMore(!!list.hasNextPage);
        setTotal(list.totalDocs || 0);
        setCounts(response.data.counts || {});
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
  }, [page, stage, search]);

  const chooseStage = (key: string) => {
    if (key === stage) return;
    setResults(null);
    setPage(1);
    setStage(key);
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const next = searchText.trim();
    if (next === search) return;
    setResults(null);
    setPage(1);
    setSearch(next);
  };

  const clearSearch = () => {
    setSearchText("");
    if (search) {
      setResults(null);
      setPage(1);
      setSearch("");
    }
  };

  const studentName = (r: ServiceReport) =>
    r.student_id?.fullname ||
    `${r.student_id?.first_name || ""} ${r.student_id?.last_name || ""}`.trim() ||
    "Unknown student";

  const stageOf = (status: number) => STAGES.find((s) => s.key === String(status));

  return (
    <>
      <PageToolbar title="Self-Reported Service" />
      <div id="kt_content" className="content flex-column-fluid">
        <p className="text-gray-700 fs-6 mb-5" style={{ maxWidth: "60rem" }}>
          Service that students did outside an iServ event and reported themselves. A parent confirms each report on
          Xogos, which is also where the coins are awarded. Reports a parent declined aren't shown.
        </p>

        <div className="d-flex flex-wrap align-items-center justify-content-between gap-4 mb-5">
          <div className="is-tabs" role="tablist" aria-label="Report stage">
            {STAGES.map((s) => (
              <button
                key={s.key}
                type="button"
                role="tab"
                aria-selected={stage === s.key}
                className={`is-tab ${stage === s.key ? "active" : ""}`}
                onClick={() => chooseStage(s.key)}
              >
                {s.label}
                <span className="is-tab-count">{counts[s.key] ?? 0}</span>
              </button>
            ))}
          </div>
          <form className="d-flex gap-2" onSubmit={submitSearch} role="search">
            <input
              type="search"
              className="form-control form-control-sm w-250px"
              placeholder="Student, title or location"
              aria-label="Search self-reported service"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button type="submit" className="btn btn-sm btn-primary">Search</button>
            {search ? (
              <button type="button" className="btn btn-sm btn-light" onClick={clearSearch}>Clear</button>
            ) : null}
          </form>
        </div>

        <div className={`position-relative ${isLoading ? "overlay overlay-block" : ""}`} style={{ minHeight: "40vh" }}>
          {results === null ? null : results.length === 0 ? (
            <div className="is-report is-empty fs-5">
              {failed
                ? "The reports couldn't be loaded. Refresh the page to try again."
                : search
                ? `No reports match "${search}".`
                : "No self-reported service here yet."}
            </div>
          ) : (
            <>
              {results.map((report) => {
                const st = stageOf(report.status);
                return (
                  <article key={report._id} className="is-report">
                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                      <div style={{ minWidth: 0 }}>
                        <h2 className="is-report-title">{report.title}</h2>
                        <p className="is-report-by">
                          by <strong>{studentName(report)}</strong>
                          {report.student_id?.email ? ` · ${report.student_id.email}` : ""}
                        </p>
                      </div>
                      <span className={`is-status is-status-${report.status}`}>{st?.badge || "Unknown"}</span>
                    </div>

                    <dl className="is-facts">
                      <div className="is-fact"><dt>Service date</dt><dd>{fmtDate(report.activity_date)}</dd></div>
                      <div className="is-fact"><dt>Hours claimed</dt><dd>{report.hours_claimed}</dd></div>
                      <div className="is-fact"><dt>Location</dt><dd>{report.location || "—"}</dd></div>
                      <div className="is-fact"><dt>Reported on</dt><dd>{fmtDate(report.created_at)}</dd></div>
                      <div className="is-fact"><dt>Parent</dt><dd>{report.parent_email || "—"}</dd></div>
                      {report.status === 2 ? (
                        <>
                          <div className="is-fact"><dt>Verified on</dt><dd>{fmtDate(report.parent_response_at)}</dd></div>
                          <div className="is-fact"><dt>Coins awarded</dt><dd>{report.coins_awarded}</dd></div>
                        </>
                      ) : null}
                    </dl>

                    {report.write_up || report.description ? (
                      <p className="is-writeup">{report.write_up || report.description}</p>
                    ) : null}

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
                      <a href={report.videourl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-light-primary mt-4">
                        Watch video
                      </a>
                    ) : null}

                    {st?.note ? <div className="is-note mt-4">{st.note}</div> : null}
                  </article>
                );
              })}
              <div className="d-flex flex-column align-items-center gap-3 py-6">
                <span className="text-muted fs-7">Showing {results.length} of {total}</span>
                {hasMore ? (
                  <button type="button" className="btn btn-light-primary" disabled={isLoading} onClick={() => setPage((p) => p + 1)}>
                    Show more
                  </button>
                ) : null}
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
