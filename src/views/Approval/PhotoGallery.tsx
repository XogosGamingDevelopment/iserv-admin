import React, { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import { PageToolbar } from "../common";
import helpers from "../../_helpers/common";

/**
 * /photo-gallery (Nov 2026): approve photos for the public service gallery (homepage and the student, parent and
 * teacher dashboards). Event photos can be labelled "before" or "after" so the gallery shows them as a pair;
 * self-reported service already has a before and an after photo once a parent verifies it.
 */

type Tab = "events" | "reports";
type EventPhoto = {
  _id: string; filepath?: string; approval_status: number; photo_phase?: string | null; created_at?: string; event_date?: string;
  event_id?: { title?: string; displaypath?: string } | null; created_by?: { fullname?: string } | null;
};
type Report = {
  _id: string; title: string; activity_date?: string; hours_claimed?: number; location?: string; gallery_status?: number;
  beforephotourl?: string | null; afterphotourl?: string | null; photopath?: string | null;
  student_id?: { first_name?: string; last_name?: string } | null;
};

const fmt = (d?: string) => (d ? helpers.convertDateTime(new Date(d), "DD MMM, YYYY") : "");

const PhotoGallery: React.FC = () => {
  const axiosInstance = useAxios();
  const [tab, setTab] = useState<Tab>("events");
  const [eventStatus, setEventStatus] = useState(0); // 0 pending, 1 approved, 2 rejected
  const [reportStatus, setReportStatus] = useState(0); // 0 not reviewed, 1 in gallery, 2 kept out
  const [photos, setPhotos] = useState<EventPhoto[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        if (tab === "events") {
          const r: any = await axiosInstance({ url: "event-images/pending-image-approval-list", method: "GET", params: { page: 1, limit: 60, approval_status: eventStatus } });
          if (alive) setPhotos(r?.data?.imageslists?.docs || []);
        } else {
          const r: any = await axiosInstance({ url: "independent-projects/admin-gallery", method: "GET", params: { gallery: reportStatus } });
          if (alive) setReports(r?.data?.list?.docs || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, eventStatus, reportStatus]);

  const setPhoto = async (p: EventPhoto, new_status: number, photo_phase: string | null) => {
    setBusy(p._id);
    try {
      const r: any = await axiosInstance({ url: "event-images/approve-disapprove-image", method: "POST", data: { itemid: p._id, new_status, photo_phase: photo_phase ?? "" } });
      if (!r?.error) {
        setPhotos((prev) => (new_status === eventStatus ? prev.map((x) => (x._id === p._id ? { ...x, photo_phase } : x)) : prev.filter((x) => x._id !== p._id)));
      }
    } finally { setBusy(null); }
  };

  const setReport = async (rep: Report, status: 1 | 2) => {
    setBusy(rep._id);
    try {
      const r: any = await axiosInstance({ url: `independent-projects/admin/${rep._id}/gallery`, method: "POST", data: { status } });
      if (!r?.error) setReports((prev) => prev.filter((x) => x._id !== rep._id));
    } finally { setBusy(null); }
  };

  const Phase = ({ p }: { p: EventPhoto }) => (
    <div className="btn-group btn-group-sm w-100" role="group" aria-label="Photo label">
      {(["before", "after", null] as (string | null)[]).map((ph) => (
        <button key={String(ph)} type="button" disabled={busy === p._id}
          className={`btn ${p.photo_phase === ph || (!p.photo_phase && ph === null) ? "btn-primary" : "btn-light"}`}
          onClick={() => setPhoto(p, 1, ph)}>
          {ph === "before" ? "Before" : ph === "after" ? "After" : "Photo"}
        </button>
      ))}
    </div>
  );

  return (
    <>
      <PageToolbar title="Photo Gallery" />
      <div id="kt_content" className="content flex-column-fluid">
        <p className="text-gray-700 fs-6 mb-5" style={{ maxWidth: "62rem" }}>
          Approved photos appear in the service gallery on the homepage and the student, parent and teacher dashboards.
          Label event photos <b>Before</b> or <b>After</b> to show them as a pair. Self-reported service shows its
          before and after photos once a parent has verified it and you approve it here.
        </p>
        <div className="d-flex flex-wrap gap-3 align-items-center mb-5">
          <div className="is-tabs" role="tablist" aria-label="Photo source">
            <button type="button" role="tab" aria-selected={tab === "events"} className={`is-tab ${tab === "events" ? "active" : ""}`} onClick={() => setTab("events")}>Event photos</button>
            <button type="button" role="tab" aria-selected={tab === "reports"} className={`is-tab ${tab === "reports" ? "active" : ""}`} onClick={() => setTab("reports")}>Self-reported before &amp; after</button>
          </div>
          {tab === "events" ? (
            <select className="form-select form-select-sm w-auto" aria-label="Status" value={eventStatus} onChange={(e) => setEventStatus(Number(e.target.value))}>
              <option value={0}>Waiting for approval</option>
              <option value={1}>Approved (change labels)</option>
              <option value={2}>Rejected</option>
            </select>
          ) : (
            <select className="form-select form-select-sm w-auto" aria-label="Status" value={reportStatus} onChange={(e) => setReportStatus(Number(e.target.value))}>
              <option value={0}>Not reviewed</option>
              <option value={1}>In the gallery</option>
              <option value={2}>Kept out</option>
            </select>
          )}
          <span className="text-muted fs-7 ms-auto">{loading ? "Loading…" : `${tab === "events" ? photos.length : reports.length} shown`}</span>
        </div>

        {tab === "events" ? (
          <div className="is-gallery-grid">
            {!loading && photos.length === 0 ? <div className="is-report is-empty">No photos here.</div> : null}
            {photos.map((p) => (
              <figure key={p._id} className="is-gallery-card">
                <a href={p.filepath} target="_blank" rel="noreferrer"><img src={p.filepath} alt={p.event_id?.title || "Event photo"} loading="lazy" /></a>
                <figcaption>
                  <p className="fw-bold m-0 text-truncate" title={p.event_id?.title}>{p.event_id?.title || "Event"}</p>
                  <p className="text-muted fs-8 m-0">{p.created_by?.fullname ? `${p.created_by.fullname} · ` : ""}{fmt(p.event_date || p.created_at)}</p>
                  {eventStatus === 1 ? (
                    <div className="mt-2"><Phase p={p} /></div>
                  ) : (
                    <div className="d-grid gap-2 mt-2">
                      <div className="btn-group btn-group-sm" role="group" aria-label="Approve">
                        <button type="button" className="btn btn-primary" disabled={busy === p._id} onClick={() => setPhoto(p, 1, "before")}>Approve: before</button>
                        <button type="button" className="btn btn-primary" disabled={busy === p._id} onClick={() => setPhoto(p, 1, "after")}>after</button>
                        <button type="button" className="btn btn-primary" disabled={busy === p._id} onClick={() => setPhoto(p, 1, null)}>photo</button>
                      </div>
                      {eventStatus !== 2 ? <button type="button" className="btn btn-sm btn-light-danger" disabled={busy === p._id} onClick={() => setPhoto(p, 2, null)}>Reject</button> : null}
                    </div>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="d-flex flex-column gap-4">
            {!loading && reports.length === 0 ? <div className="is-report is-empty">Nothing here.</div> : null}
            {reports.map((r) => (
              <article key={r._id} className="is-report">
                <div className="d-flex justify-content-between flex-wrap gap-3">
                  <div>
                    <h2 className="is-report-title">{r.title}</h2>
                    <p className="is-report-by">{`${r.student_id?.first_name || ""} ${r.student_id?.last_name || ""}`.trim() || "Student"} · {fmt(r.activity_date)}{r.location ? ` · ${r.location}` : ""}</p>
                  </div>
                  <div className="d-flex gap-2 align-items-start">
                    {reportStatus !== 1 ? <button type="button" className="btn btn-sm btn-primary" disabled={busy === r._id} onClick={() => setReport(r, 1)}>Add to gallery</button> : null}
                    {reportStatus !== 2 ? <button type="button" className="btn btn-sm btn-light-danger" disabled={busy === r._id} onClick={() => setReport(r, 2)}>Keep out</button> : null}
                  </div>
                </div>
                <div className="is-photos mt-3">
                  {(r.beforephotourl || r.photopath) ? <a className="is-photo" href={r.beforephotourl || r.photopath || ""} target="_blank" rel="noreferrer"><img src={r.beforephotourl || r.photopath || ""} alt={`Before: ${r.title}`} loading="lazy" /><span>BEFORE</span></a> : null}
                  {r.afterphotourl ? <a className="is-photo" href={r.afterphotourl} target="_blank" rel="noreferrer"><img src={r.afterphotourl} alt={`After: ${r.title}`} loading="lazy" /><span>AFTER</span></a> : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default PhotoGallery;
