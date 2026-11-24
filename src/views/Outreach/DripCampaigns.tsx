// Drip Campaigns (Nov 24, 2026). Two email sequences (backend configs/dripCampaigns.ts):
//   1. Schools: introduce iServ to high schools.
//   2. Nonprofits: when a school wants iServ (status Interested / Partnered), invite the nonprofits in its county.
// iServ does not send these. Each day the admin exports the emails that are due, sends them from a Google Workspace
// inbox (mail merge such as YAMM / GMass / Mailmeteor, or one at a time in Gmail), and marks them sent here. Never send
// cold outreach through AWS SES: it carries iServ's sign-up and password emails.
// API: GET outreach/drip/overview | preview | due | enrollments, PUT drip/settings, POST drip/enroll | mark-sent,
// PATCH drip/enrollments/:id.
import React, { useCallback, useEffect, useMemo, useState } from "react";
import useAxios from "../../hooks/useAxios";
import { PageToolbar } from "../common";
import ContentLoader from "../common/ContentLoader";
import { Modal, STATES, fmtDate, label, statusBadge } from "./crm";

type Step = { number: number; wait_days: number; subject: string; waiting: number };
type Campaign = { key: "schools" | "nonprofits"; name: string; audience: string; description: string; steps: Step[]; counts: Record<string, number> };
type Settings = { sender_name: string; sender_title: string; sender_email: string; organization_line: string; website: string; postal_address: string; daily_limit: number };
type DueItem = {
  id: string; step: number; step_number: number; total_steps: number; to_email: string; to_name?: string | null; to_role?: string | null;
  target_id: string; target_name: string; city?: string | null; state: string; subject: string; body_text: string; body_html: string;
};
type InterestedSchool = { _id: string; name: string; district?: string | null; city?: string | null; state: string; area: string; outreach_status: string; nonprofits_enrolled: number };
type EnrollmentRow = {
  _id: string; campaign: string; to_email: string; to_name?: string | null; to_role?: string | null; step: number; total_steps: number; status: string;
  stop_reason?: string | null; next_due_at?: string | null; last_sent_at?: string | null; target_name: string; target_place: string; via_school_name?: string | null;
};

const csvCell = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
function downloadCsv(name: string, items: DueItem[]) {
  const head = ["enrollment_id", "email_number", "to_email", "to_name", "to_role", "school_or_nonprofit", "city", "state", "subject", "body_text", "body_html"];
  const lines = [head.join(",")].concat(items.map((i) => [i.id, i.step_number, i.to_email, i.to_name, i.to_role, i.target_name, i.city, i.state, i.subject, i.body_text, i.body_html].map(csvCell).join(",")));
  const blob = new Blob(["﻿" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
const gmailLink = (i: DueItem, from?: string) =>
  `https://mail.google.com/mail/?${from ? `authuser=${encodeURIComponent(from)}&` : ""}view=cm&fs=1&to=${encodeURIComponent(i.to_email)}&su=${encodeURIComponent(i.subject)}&body=${encodeURIComponent(i.body_text)}`;

/* ---------------------------------------------------------------- sender details */

const SenderCard: React.FC<{ axios: any; settings: Settings; onSaved: () => void }> = ({ axios, settings, onSaved }) => {
  const [form, setForm] = useState<Settings>(settings);
  const [open, setOpen] = useState(!settings.postal_address);
  useEffect(() => setForm(settings), [settings]);
  const set = (k: keyof Settings, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await axios({ url: "outreach/drip/settings", method: "PUT", data: form }); onSaved(); setOpen(false); } catch (err) { console.error("drip settings", err); }
  };
  return (
    <div className="card card-body mb-5">
      <div className="d-flex flex-wrap gap-3 align-items-center">
        <div>
          <div className="fw-bold fs-5">Sender details</div>
          <div className="text-muted fs-7">{settings.sender_name} · {settings.sender_email} · up to {settings.daily_limit} emails a day</div>
        </div>
        {!settings.postal_address ? <span className="badge badge-light-danger">Postal address needed before sending</span> : null}
        <button className="btn btn-sm btn-light ms-auto" onClick={() => setOpen((o) => !o)}>{open ? "Close" : "Edit"}</button>
      </div>
      {open ? (
        <form onSubmit={save} className="row g-3 mt-2">
          {([["sender_name", "Your name"], ["sender_title", "Title"], ["sender_email", "Sending inbox (Google Workspace)"], ["organization_line", "Organization line"], ["website", "Website"]] as [keyof Settings, string][]).map(([k, l]) => (
            <div className="col-md-4" key={k}>
              <label className="form-label fs-8 text-muted mb-1">{l}</label>
              <input className="form-control form-control-sm" value={String(form[k] ?? "")} onChange={(e) => set(k, e.target.value)} />
            </div>
          ))}
          <div className="col-md-4">
            <label className="form-label fs-8 text-muted mb-1">Emails a day (keep 300–500)</label>
            <input type="number" min={10} max={2000} className="form-control form-control-sm" value={form.daily_limit} onChange={(e) => set("daily_limit", e.target.value)} />
          </div>
          <div className="col-12">
            <label className="form-label fs-8 text-muted mb-1">Postal address (required by the CAN-SPAM Act in every commercial email; a P.O. box works)</label>
            <input className="form-control form-control-sm" value={form.postal_address} onChange={(e) => set("postal_address", e.target.value)} placeholder="Innovate the Future, PO Box 123, City, ST 00000" />
          </div>
          <div className="col-12"><button className="btn btn-sm btn-primary">Save sender details</button></div>
        </form>
      ) : null}
    </div>
  );
};

/* ---------------------------------------------------------------- page */

const DripCampaigns: React.FC = () => {
  const axios = useAxios();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [interested, setInterested] = useState<InterestedSchool[]>([]);
  const [tab, setTab] = useState<"schools" | "nonprofits">("schools");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<{ step: number; email?: any } | null>(null);
  // Due now
  const [due, setDue] = useState<DueItem[] | null>(null);
  const [dueTotal, setDueTotal] = useState(0);
  const [missingAddress, setMissingAddress] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [viewing, setViewing] = useState<DueItem | null>(null);
  // Add schools
  const [addState, setAddState] = useState("");
  const [addCounty, setAddCounty] = useState("");
  const [who, setWho] = useState<"best" | "all">("best");
  // People
  const [people, setPeople] = useState<EnrollmentRow[]>([]);
  const [peopleTotal, setPeopleTotal] = useState(0);
  const [peoplePage, setPeoplePage] = useState(1);
  const [peopleStatus, setPeopleStatus] = useState("");

  const campaign = campaigns.find((c) => c.key === tab);

  const loadOverview = useCallback(async () => {
    setLoading(true);
    try {
      const res: any = await axios({ url: "outreach/drip/overview", method: "GET" });
      setCampaigns(res?.data?.campaigns ?? []);
      setSettings(res?.data?.settings ?? null);
      setInterested(res?.data?.interested_schools ?? []);
    } catch (e) { console.error("drip overview", e); } finally { setLoading(false); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const loadDue = useCallback(async () => {
    setDue(null);
    try {
      const res: any = await axios({ url: "outreach/drip/due", method: "GET", params: { campaign: tab }, timeout: 60000 });
      const items: DueItem[] = res?.data?.items ?? [];
      setDue(items);
      setDueTotal(res?.data?.total_due ?? 0);
      setMissingAddress(!!res?.data?.missing_postal_address);
      setSelected(new Set(items.map((i) => i.id)));
    } catch (e) { console.error("drip due", e); setDue([]); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);
  const loadPeople = useCallback(async () => {
    try {
      const res: any = await axios({ url: "outreach/drip/enrollments", method: "GET", params: { campaign: tab, status: peopleStatus || undefined, page: peoplePage, limit: 25 } });
      setPeople(res?.data?.enrollments ?? []);
      setPeopleTotal(res?.data?.total ?? 0);
    } catch (e) { console.error("drip people", e); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, peopleStatus, peoplePage]);

  useEffect(() => { loadOverview(); }, [loadOverview]);
  useEffect(() => { setDue(null); setSelected(new Set()); }, [tab]);
  useEffect(() => { loadPeople(); }, [loadPeople]);
  const refreshAll = () => { loadOverview(); loadPeople(); if (due) loadDue(); };

  const openPreview = async (step: number) => {
    setPreview({ step });
    try {
      const res: any = await axios({ url: "outreach/drip/preview", method: "GET", params: { campaign: tab, step } });
      setPreview({ step, email: res?.data?.email });
    } catch (e) { console.error("drip preview", e); }
  };

  const enrollSchools = async () => {
    if (!addState) return;
    const where = addCounty ? `${addCounty} County, ${addState}` : addState;
    if (!window.confirm(`Add every not-yet-answered school in ${where} with an email to the schools campaign (${who === "best" ? "one contact per school" : "every contact"})?`)) return;
    try {
      await axios({ url: "outreach/drip/enroll", method: "POST", data: { campaign: "schools", filter: { state: addState, county: addCounty || undefined }, who }, timeout: 60000 });
      refreshAll();
    } catch (e) { console.error("enroll schools", e); }
  };
  const enrollNear = async (s: InterestedSchool) => {
    if (!window.confirm(`Start the nonprofit campaign for the nonprofits in ${s.area} (near ${s.name})?`)) return;
    try {
      await axios({ url: "outreach/drip/enroll", method: "POST", data: { campaign: "nonprofits", via_school: s._id }, timeout: 60000 });
      refreshAll();
    } catch (e) { console.error("enroll nonprofits", e); }
  };

  const chosen = useMemo(() => (due ?? []).filter((i) => selected.has(i.id)), [due, selected]);
  const markSent = async (items: DueItem[]) => {
    if (!items.length) return;
    if (items.length > 1 && !window.confirm(`Mark ${items.length} emails as sent? Do this only after they've actually gone out.`)) return;
    try {
      await axios({ url: "outreach/drip/mark-sent", method: "POST", data: { items: items.map((i) => ({ id: i.id, step: i.step })) }, timeout: 120000 });
      setViewing(null);
      loadDue(); loadOverview(); loadPeople();
    } catch (e) { console.error("mark sent", e); }
  };
  const setPersonStatus = async (e: EnrollmentRow, status: string) => {
    try { await axios({ url: `outreach/drip/enrollments/${e._id}`, method: "PATCH", data: { status } }); loadPeople(); loadOverview(); } catch (err) { console.error("drip status", err); }
  };
  const toggle = (id: string) => setSelected((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });

  const c = campaign?.counts ?? {};
  const peoplePages = Math.max(1, Math.ceil(peopleTotal / 25));

  return (
    <>
      <PageToolbar title="Drip Campaigns" />
      <div id="kt_content" className="content flex-column-fluid">
        <div className="card card-body mb-5">
          <div className="fw-bold fs-4 mb-2">How it works</div>
          <ol className="mb-2 fs-6">
            <li><b>Schools:</b> add the schools of a state (or one county) to the schools campaign. Each gets four emails over about three weeks about iServ, the verified Service Certificate and how staff track hours.</li>
            <li><b>Every day:</b> open <i>Due now</i>, download the CSV and send it with a mail merge from your Google Workspace inbox (YAMM, GMass or Mailmeteor), or send one at a time with <i>Open in Gmail</i>. Then click <i>Mark sent</i>. The next email comes due a few days later.</li>
            <li><b>When a school says yes:</b> set it to <i>Interested</i> or <i>Partnered</i> in the Schools Database. Its emails stop, and the nonprofit campaign can start for the nonprofits in its county, inviting them to post more projects for its students.</li>
          </ol>
          <div className="text-muted fs-7">Anyone you mark Replied, Joined, Declined or Do not contact stops getting campaign emails. If someone replies "unsubscribe", set them to Do not contact. Don't send these through iServ's own mail service (AWS SES): it carries sign-up and password emails and can be paused by complaints.</div>
        </div>

        {settings ? <SenderCard axios={axios} settings={settings} onSaved={() => { loadOverview(); if (due) loadDue(); }} /> : null}

        <div className="is-tabs mb-5" role="tablist">
          {campaigns.map((x) => (
            <button key={x.key} type="button" role="tab" aria-selected={tab === x.key} className={`is-tab ${tab === x.key ? "active" : ""}`} onClick={() => { setTab(x.key); setPeoplePage(1); }}>
              {x.key === "schools" ? "1 · Schools" : "2 · Nonprofits"} <span className="is-tab-count">{x.counts.due ?? 0} due</span>
            </button>
          ))}
        </div>

        {campaign ? (
          <>
            <div className="card card-body mb-5">
              <div className="fw-bold fs-4">{campaign.name}</div>
              <div className="text-muted fs-6 mb-4">{campaign.description}</div>
              <div className="is-stat-grid mb-5">
                {[["due", "Due now"], ["active", "In progress"], ["paused", "Paused"], ["completed", "Got every email"], ["stopped", "Stopped (answered / opted out)"]].map(([k, l]) => (
                  <div key={k} className={`is-stat ${k === "due" && (c.due ?? 0) > 0 ? "is-amber" : ""}`} style={{ cursor: "default" }}>
                    <span className="is-stat-value">{(c[k] ?? 0).toLocaleString()}</span>
                    <span className="is-stat-label">{l}</span>
                  </div>
                ))}
              </div>
              <div className="table-responsive">
                <table className="table table-row-dashed align-middle fs-6 mb-0">
                  <thead><tr className="fw-bold text-muted text-uppercase fs-8"><th>Email</th><th>Sent</th><th>Subject</th><th className="text-center">Waiting for it</th><th></th></tr></thead>
                  <tbody>
                    {campaign.steps.map((s) => (
                      <tr key={s.number}>
                        <td className="fw-bold">{s.number}</td>
                        <td className="text-muted fs-7">{s.wait_days === 0 ? "Right away" : `${s.wait_days} days after email ${s.number - 1}`}</td>
                        <td>{s.subject}</td>
                        <td className="text-center">{s.waiting}</td>
                        <td className="text-end"><button className="btn btn-sm btn-light" onClick={() => openPreview(s.number)}>Preview</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add people */}
            <div className="card card-body mb-5">
              {tab === "schools" ? (
                <>
                  <div className="fw-bold fs-5 mb-1">Add schools</div>
                  <div className="text-muted fs-7 mb-3">Adds schools that haven't answered yet and have an email. Anyone already in the campaign, declined or marked do-not-contact is skipped. Single schools can also be added from their pop-up in the Schools Database.</div>
                  <div className="d-flex flex-wrap gap-3 align-items-center">
                    <select className="form-select form-select-sm w-auto" value={addState} onChange={(e) => setAddState(e.target.value)} aria-label="State">
                      <option value="">Choose a state…</option>
                      {STATES.filter(([v]) => v).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                    <input className="form-control form-control-sm w-200px" placeholder="County (optional)" value={addCounty} onChange={(e) => setAddCounty(e.target.value)} />
                    <select className="form-select form-select-sm w-auto" value={who} onChange={(e) => setWho(e.target.value as any)} aria-label="Who at each school">
                      <option value="best">One person per school (NHS advisor, else counselor, else principal)</option>
                      <option value="all">Everyone with an email at each school</option>
                    </select>
                    <button className="btn btn-sm btn-primary" disabled={!addState} onClick={enrollSchools}>Add to schools campaign</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="fw-bold fs-5 mb-1">Schools that want iServ</div>
                  <div className="text-muted fs-7 mb-3">Schools marked Interested or Partnered. Start the campaign for the nonprofits in each one's county; the emails name the school. You can also pick nonprofits one by one from a school's pop-up.</div>
                  {!interested.length ? (
                    <div className="text-muted fs-7">No school is marked Interested or Partnered yet. When one says yes, set its status in the Schools Database.</div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-row-dashed align-middle fs-6 mb-0">
                        <thead><tr className="fw-bold text-muted text-uppercase fs-8"><th>School</th><th>Area</th><th>Status</th><th className="text-center">Nonprofits added</th><th></th></tr></thead>
                        <tbody>
                          {interested.map((s) => (
                            <tr key={s._id}>
                              <td><div className="fw-bold">{s.name}</div><div className="text-muted fs-8">{s.district}</div></td>
                              <td className="fs-7">{s.area}, {s.state}</td>
                              <td><span className={`badge ${statusBadge[s.outreach_status] ?? "badge-light"}`}>{label(s.outreach_status)}</span></td>
                              <td className="text-center">{s.nonprofits_enrolled}</td>
                              <td className="text-end"><button className="btn btn-sm btn-primary" onClick={() => enrollNear(s)}>{s.nonprofits_enrolled ? "Add any new nonprofits" : "Start for nonprofits nearby"}</button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Due now */}
            <div className="card card-body mb-5">
              <div className="d-flex flex-wrap gap-3 align-items-center mb-3">
                <div>
                  <div className="fw-bold fs-5">Due now</div>
                  <div className="text-muted fs-7">{(c.due ?? 0).toLocaleString()} due · today's batch is up to {settings?.daily_limit ?? 300}</div>
                </div>
                <button className="btn btn-sm btn-light ms-auto" onClick={loadDue}>{due ? "Refresh" : "Load today's emails"}</button>
              </div>
              {missingAddress ? (
                <div className="p-4 rounded bg-light-danger fs-6">Add your postal address under <b>Sender details</b> first. The law (CAN-SPAM) requires it in every one of these emails.</div>
              ) : due === null ? null : !due.length ? (
                <div className="text-muted fs-7">Nothing due right now.</div>
              ) : (
                <>
                  <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
                    <button className="btn btn-sm btn-primary" disabled={!chosen.length} onClick={() => downloadCsv(`iserv-${tab}-due-${new Date().toISOString().slice(0, 10)}.csv`, chosen)}>Download CSV ({chosen.length})</button>
                    <button className="btn btn-sm btn-success" disabled={!chosen.length} onClick={() => markSent(chosen)}>Mark {chosen.length} sent</button>
                    <button className="btn btn-sm btn-light" onClick={() => setSelected(selected.size === due.length ? new Set() : new Set(due.map((i) => i.id)))}>{selected.size === due.length ? "Select none" : "Select all"}</button>
                    <span className="text-muted fs-8">Showing {due.length} of {dueTotal}. In the mail merge use the columns <code>to_email</code>, <code>subject</code> and <code>body_text</code> (or <code>body_html</code>).</span>
                  </div>
                  <div className="table-responsive" style={{ maxHeight: 520, overflowY: "auto" }}>
                    <table className="table table-sm table-row-dashed align-middle fs-7 mb-0">
                      <thead><tr className="fw-bold text-muted"><th></th><th>To</th><th>{tab === "schools" ? "School" : "Nonprofit"}</th><th>Email</th><th>Subject</th><th></th></tr></thead>
                      <tbody>
                        {due.map((i) => (
                          <tr key={i.id}>
                            <td><input type="checkbox" className="form-check-input" checked={selected.has(i.id)} onChange={() => toggle(i.id)} aria-label={`Select ${i.to_email}`} /></td>
                            <td><div className="fw-semibold">{i.to_name || i.to_email}</div><div className="text-muted fs-8">{i.to_role}{i.to_name ? ` · ${i.to_email}` : ""}</div></td>
                            <td>{i.target_name}<div className="text-muted fs-8">{[i.city, i.state].filter(Boolean).join(", ")}</div></td>
                            <td>{i.step_number} of {i.total_steps}</td>
                            <td style={{ maxWidth: 320 }}>{i.subject}</td>
                            <td className="text-end text-nowrap">
                              <button className="btn btn-sm btn-light me-1" onClick={() => setViewing(i)}>View</button>
                              <a className="btn btn-sm btn-light-primary me-1" href={gmailLink(i, settings?.sender_email)} target="_blank" rel="noopener noreferrer">Open in Gmail</a>
                              <button className="btn btn-sm btn-light-success" onClick={() => markSent([i])}>Sent</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>

            {/* People in the campaign */}
            <div className="card card-body mb-5">
              <div className="d-flex flex-wrap gap-3 align-items-center mb-3">
                <div className="fw-bold fs-5">People in this campaign</div>
                <select className="form-select form-select-sm w-auto ms-auto" value={peopleStatus} onChange={(e) => { setPeopleStatus(e.target.value); setPeoplePage(1); }} aria-label="Status">
                  <option value="">Everyone</option>
                  {["active", "paused", "completed", "stopped"].map((s) => <option key={s} value={s}>{label(s)}</option>)}
                </select>
                <span className="text-muted fs-7">{peopleTotal.toLocaleString()}</span>
              </div>
              {!people.length ? <div className="text-muted fs-7">Nobody yet.</div> : (
                <div className="table-responsive">
                  <table className="table table-sm table-row-dashed align-middle fs-7 mb-0">
                    <thead><tr className="fw-bold text-muted"><th>Person</th><th>{tab === "schools" ? "School" : "Nonprofit"}</th><th>Progress</th><th>Next email</th><th></th></tr></thead>
                    <tbody>
                      {people.map((e) => (
                        <tr key={e._id}>
                          <td><div className="fw-semibold">{e.to_name || e.to_email}</div><div className="text-muted fs-8">{e.to_role}{e.to_name ? ` · ${e.to_email}` : ""}</div></td>
                          <td>{e.target_name}<div className="text-muted fs-8">{e.target_place}{e.via_school_name ? ` · near ${e.via_school_name}` : ""}</div></td>
                          <td>
                            {e.status === "completed" ? <span className="badge badge-light-success">All {e.total_steps} sent</span>
                              : <><span className={`badge ${e.status === "active" ? "badge-light-primary" : e.status === "paused" ? "badge-light-warning" : "badge-light"}`}>{label(e.status)}</span> <span className="text-muted">{e.step} of {e.total_steps} sent</span></>}
                            {e.stop_reason ? <div className="text-muted fs-8">{e.stop_reason}</div> : null}
                          </td>
                          <td>{e.status === "active" && e.next_due_at ? (new Date(e.next_due_at) <= new Date() ? <span className="text-warning">Due now</span> : fmtDate(e.next_due_at)) : e.last_sent_at ? <span className="text-muted">Last sent {fmtDate(e.last_sent_at)}</span> : "—"}</td>
                          <td className="text-end text-nowrap">
                            {e.status === "active" ? <button className="btn btn-sm btn-light me-1" onClick={() => setPersonStatus(e, "paused")}>Pause</button> : null}
                            {e.status === "paused" || e.status === "stopped" ? <button className="btn btn-sm btn-light me-1" onClick={() => setPersonStatus(e, "active")}>Resume</button> : null}
                            {e.status === "active" || e.status === "paused" ? <button className="btn btn-sm btn-light-danger" onClick={() => setPersonStatus(e, "stopped")}>Stop</button> : null}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="d-flex justify-content-between align-items-center mt-3">
                <span className="text-muted fs-7">Page {peoplePage} of {peoplePages}</span>
                <div className="btn-group btn-group-sm">
                  <button className="btn btn-light" disabled={peoplePage <= 1} onClick={() => setPeoplePage((p) => p - 1)}>Previous</button>
                  <button className="btn btn-light" disabled={peoplePage >= peoplePages} onClick={() => setPeoplePage((p) => p + 1)}>Next</button>
                </div>
              </div>
            </div>
          </>
        ) : loading ? <div className="card card-body position-relative" style={{ minHeight: 160 }}><ContentLoader /></div> : null}
      </div>

      {preview ? (
        <Modal size="lg" onClose={() => setPreview(null)} title={`${campaign?.name ?? ""}: email ${preview.step}`} subtitle="Filled in with sample details. Real emails use each school's or nonprofit's own names and counts.">
          {!preview.email ? <div className="text-muted">Loading…</div> : (
            <>
              <div className="mb-3"><span className="text-muted fs-8 text-uppercase fw-bold">Subject</span><div className="fw-bold fs-5">{preview.email.subject}</div></div>
              <div className="rounded p-4" style={{ background: "#fff", color: "#111", whiteSpace: "normal" }} dangerouslySetInnerHTML={{ __html: preview.email.body_html }} />
            </>
          )}
        </Modal>
      ) : null}

      {viewing ? (
        <Modal size="lg" onClose={() => setViewing(null)} title={viewing.subject} subtitle={`To ${viewing.to_name ? `${viewing.to_name} <${viewing.to_email}>` : viewing.to_email} · email ${viewing.step_number} of ${viewing.total_steps}`}>
          <div className="rounded p-4 mb-4" style={{ background: "#fff", color: "#111" }} dangerouslySetInnerHTML={{ __html: viewing.body_html }} />
          <div className="d-flex flex-wrap gap-2">
            <a className="btn btn-sm btn-primary" href={gmailLink(viewing, settings?.sender_email)} target="_blank" rel="noopener noreferrer">Open in Gmail</a>
            <button className="btn btn-sm btn-light" onClick={() => navigator.clipboard?.writeText(viewing.body_text)}>Copy text</button>
            <button className="btn btn-sm btn-success ms-auto" onClick={() => markSent([viewing])}>Mark sent</button>
          </div>
        </Modal>
      ) : null}
    </>
  );
};

export default DripCampaigns;
