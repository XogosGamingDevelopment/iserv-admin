// Shared pieces for the Non-Profit Database, Schools Database and Drip Campaigns pages (Nov 24, 2026):
// the pop-up shell, the contact log (history + "record a contact" form) and the campaign panel.
// Backend: controllers/OutreachCrmController.ts (all admin-only).
import React, { useEffect, useState } from "react";

export const STATES: [string, string][] = [
  ["", "All states"], ["AL", "Alabama"], ["AK", "Alaska"], ["AZ", "Arizona"], ["AR", "Arkansas"], ["CA", "California"], ["CO", "Colorado"],
  ["CT", "Connecticut"], ["DE", "Delaware"], ["DC", "District of Columbia"], ["FL", "Florida"], ["GA", "Georgia"], ["HI", "Hawaii"],
  ["ID", "Idaho"], ["IL", "Illinois"], ["IN", "Indiana"], ["IA", "Iowa"], ["KS", "Kansas"], ["KY", "Kentucky"], ["LA", "Louisiana"],
  ["ME", "Maine"], ["MD", "Maryland"], ["MA", "Massachusetts"], ["MI", "Michigan"], ["MN", "Minnesota"], ["MS", "Mississippi"],
  ["MO", "Missouri"], ["MT", "Montana"], ["NE", "Nebraska"], ["NV", "Nevada"], ["NH", "New Hampshire"], ["NJ", "New Jersey"],
  ["NM", "New Mexico"], ["NY", "New York"], ["NC", "North Carolina"], ["ND", "North Dakota"], ["OH", "Ohio"], ["OK", "Oklahoma"],
  ["OR", "Oregon"], ["PA", "Pennsylvania"], ["RI", "Rhode Island"], ["SC", "South Carolina"], ["SD", "South Dakota"], ["TN", "Tennessee"],
  ["TX", "Texas"], ["UT", "Utah"], ["VT", "Vermont"], ["VA", "Virginia"], ["WA", "Washington"], ["WV", "West Virginia"],
  ["WI", "Wisconsin"], ["WY", "Wyoming"],
];

export const ORG_STATUSES = ["not_contacted", "contacted", "replied", "joined", "declined", "do_not_contact"];
export const SCHOOL_STATUSES = ["not_contacted", "contacted", "replied", "interested", "partnered", "declined", "do_not_contact"];
export const STATUS_HINT: Record<string, string> = {
  interested: "Wants to use iServ: start the nonprofit campaign for its area",
  partnered: "Using iServ",
  joined: "Has an iServ nonprofit account",
  replied: "Answered (campaign emails stop)",
  do_not_contact: "Asked not to be emailed (unsubscribe)",
};
export const statusBadge: Record<string, string> = {
  not_contacted: "badge-light", contacted: "badge-light-info", replied: "badge-light-primary", interested: "badge-light-warning",
  partnered: "badge-light-success", joined: "badge-light-success", declined: "badge-light-danger", do_not_contact: "badge-light-danger",
};
export const label = (s?: string | null) => String(s ?? "").replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
export const fmtDate = (d?: string | null) => (d ? new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "");
export const fmtDay = (d?: string | null) => (d ? new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }) : "");
export const todayInput = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
export const href = (u?: string | null) => (!u ? "" : /^https?:/i.test(u) ? u : `https://${u}`);

export type Contact = {
  _id: string; contacted_on: string; method: string; direction: string; person?: string | null; summary: string;
  next_step?: string | null; follow_up_on?: string | null; campaign?: string | null; campaign_step?: number | null; created_by_name?: string | null;
};
export type Enrollment = {
  _id: string; campaign: string; to_email: string; to_name?: string | null; to_role?: string | null; step: number; total_steps: number;
  status: string; stop_reason?: string | null; next_due_at?: string | null; last_sent_at?: string | null;
};
export type Drip = { campaign: string; status: string; step: number; total: number; people: number } | null;
export const CAMPAIGN_NAMES: Record<string, string> = { schools: "Schools campaign", nonprofits: "Nonprofit campaign", cities: "Cities campaign" };
export const CITY_STATUSES = ["not_contacted", "contacted", "replied", "joined", "declined", "do_not_contact"];
export const CHURCH_STATUSES = ["not_contacted", "contacted", "replied", "joined", "declined", "do_not_contact"];
export type TargetType = "organization" | "school" | "city" | "church";

/** Small "Campaign: email 2 of 4" chip for list rows. */
export const DripChip: React.FC<{ drip: Drip }> = ({ drip }) => {
  if (!drip) return null;
  const cls = drip.status === "active" ? "badge-light-primary" : drip.status === "completed" ? "badge-light-success" : drip.status === "paused" ? "badge-light-warning" : "badge-light";
  const text = drip.status === "completed" ? "all emails sent" : drip.status === "active" ? `next: email ${drip.step + 1} of ${drip.total}` : drip.status;
  return <span className={`badge ${cls}`} title={CAMPAIGN_NAMES[drip.campaign]}>Drip · {text}</span>;
};

/* ---------------------------------------------------------------- modal shell */

// Pop-ups can open on top of each other (a nonprofit from a school's pop-up): only the top one answers Escape, and
// the page scrolls again only when the last one closes.
const openModals: number[] = [];
let modalSeq = 0;

export const Modal: React.FC<{ title: React.ReactNode; subtitle?: React.ReactNode; onClose: () => void; children: React.ReactNode; size?: "lg" | "xl" }> = ({ title, subtitle, onClose, children, size = "xl" }) => {
  const [myId] = useState(() => ++modalSeq);
  const depth = openModals.indexOf(myId) >= 0 ? openModals.indexOf(myId) : openModals.length;
  useEffect(() => {
    openModals.push(myId);
    document.body.classList.add("modal-open");
    document.body.style.overflow = "hidden";
    return () => {
      openModals.splice(openModals.indexOf(myId), 1);
      if (!openModals.length) {
        document.body.classList.remove("modal-open");
        document.body.style.overflow = "";
      }
    };
  }, [myId]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && openModals[openModals.length - 1] === myId) onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, myId]);
  const z = 1055 + depth * 20;
  return (
    <>
      <div className="modal fade show" role="dialog" aria-modal="true" style={{ display: "block", zIndex: z + 1 }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        <div className={`modal-dialog modal-dialog-centered modal-dialog-scrollable modal-${size}`}>
          <div className="modal-content">
            <div className="modal-header align-items-start">
              <div style={{ minWidth: 0 }}>
                <h3 className="modal-title" style={{ overflowWrap: "anywhere" }}>{title}</h3>
                {subtitle ? <div className="text-muted fs-7 mt-1">{subtitle}</div> : null}
              </div>
              <button type="button" className="btn btn-sm btn-icon btn-light ms-3" aria-label="Close" onClick={onClose}>✕</button>
            </div>
            <div className="modal-body">{children}</div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" style={{ zIndex: z }} />
    </>
  );
};

export const Field: React.FC<{ k: string; children: React.ReactNode }> = ({ k, children }) =>
  children === null || children === undefined || children === "" ? null : (
    <div className="mb-3">
      <div className="text-muted fs-8 text-uppercase fw-bold">{k}</div>
      <div className="fs-6" style={{ overflowWrap: "anywhere" }}>{children}</div>
    </div>
  );

/* ---------------------------------------------------------------- contact log */

const METHODS = [["email", "Email"], ["phone", "Phone call"], ["meeting", "Meeting / video call"], ["visit", "In-person visit"], ["mail", "Letter / flyer"], ["social", "Social media"], ["other", "Other"]];

export const ContactLog: React.FC<{
  axios: any; targetType: TargetType; targetId: string; contacts: Contact[];
  statuses: string[]; currentStatus: string; people?: { email: string; name: string | null; role: string }[];
  onChange: (contacts: Contact[], record?: any) => void;
}> = ({ axios, targetType, targetId, contacts, statuses, currentStatus, people = [], onChange }) => {
  const blank = { contacted_on: todayInput(), method: "email", direction: "outgoing", person: "", summary: "", next_step: "", follow_up_on: "", outreach_status: "" };
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);
  const set = (k: keyof typeof blank, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.summary.trim()) return;
    setSaving(true);
    try {
      const res: any = await axios({
        url: "outreach/contacts", method: "POST",
        data: { ...form, target_type: targetType, target: targetId, contacted_on: `${form.contacted_on}T12:00:00`, follow_up_on: form.follow_up_on ? `${form.follow_up_on}T12:00:00` : null },
      });
      if (res?.data?.contact) {
        const next = [res.data.contact, ...contacts].sort((a, b) => +new Date(b.contacted_on) - +new Date(a.contacted_on));
        onChange(next, res.data.record);
        setForm(blank);
      }
    } catch (err) { console.error("add contact", err); } finally { setSaving(false); }
  };

  const remove = async (c: Contact) => {
    if (!window.confirm("Delete this contact entry?")) return;
    try {
      await axios({ url: `outreach/contacts/${c._id}`, method: "DELETE" });
      onChange(contacts.filter((x) => x._id !== c._id));
    } catch (err) { console.error("delete contact", err); }
  };

  return (
    <div>
      <form onSubmit={submit} className="rounded border p-4 mb-5" style={{ borderColor: "var(--is-line, rgba(255,255,255,.12))" }}>
        <div className="fw-bold fs-5 mb-3">Record a contact</div>
        <div className="row g-3">
          <div className="col-sm-4 col-lg-3">
            <label className="form-label fs-8 text-muted mb-1">Date</label>
            <input type="date" className="form-control form-control-sm" value={form.contacted_on} max={todayInput()} onChange={(e) => set("contacted_on", e.target.value)} required />
          </div>
          <div className="col-sm-4 col-lg-3">
            <label className="form-label fs-8 text-muted mb-1">How</label>
            <select className="form-select form-select-sm" value={form.method} onChange={(e) => set("method", e.target.value)}>
              {METHODS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div className="col-sm-4 col-lg-3">
            <label className="form-label fs-8 text-muted mb-1">Direction</label>
            <select className="form-select form-select-sm" value={form.direction} onChange={(e) => set("direction", e.target.value)}>
              <option value="outgoing">We reached out</option>
              <option value="incoming">They contacted us / replied</option>
            </select>
          </div>
          <div className="col-sm-12 col-lg-3">
            <label className="form-label fs-8 text-muted mb-1">Person</label>
            <input className="form-control form-control-sm" list={`people-${targetId}`} placeholder="Name, role" value={form.person} onChange={(e) => set("person", e.target.value)} maxLength={200} />
            <datalist id={`people-${targetId}`}>
              {people.map((p) => <option key={p.email} value={[p.name, p.role].filter(Boolean).join(", ")}>{p.email}</option>)}
            </datalist>
          </div>
          <div className="col-12">
            <label className="form-label fs-8 text-muted mb-1">What happened</label>
            <textarea className="form-control form-control-sm" rows={3} placeholder="e.g. Spoke with the counselor; she'll share the flyer with the NHS chapter." value={form.summary} onChange={(e) => set("summary", e.target.value)} maxLength={4000} required />
          </div>
          <div className="col-md-6">
            <label className="form-label fs-8 text-muted mb-1">Next step (optional)</label>
            <input className="form-control form-control-sm" placeholder="e.g. Send flyer, call back Tuesday" value={form.next_step} onChange={(e) => set("next_step", e.target.value)} maxLength={1000} />
          </div>
          <div className="col-sm-6 col-md-3">
            <label className="form-label fs-8 text-muted mb-1">Follow up on</label>
            <input type="date" className="form-control form-control-sm" value={form.follow_up_on} min={todayInput()} onChange={(e) => set("follow_up_on", e.target.value)} />
          </div>
          <div className="col-sm-6 col-md-3">
            <label className="form-label fs-8 text-muted mb-1">Set status</label>
            <select className="form-select form-select-sm" value={form.outreach_status} onChange={(e) => set("outreach_status", e.target.value)}>
              <option value="">Keep: {label(currentStatus)}</option>
              {statuses.filter((s) => s !== currentStatus).map((s) => <option key={s} value={s}>{label(s)}</option>)}
            </select>
          </div>
        </div>
        <div className="d-flex align-items-center gap-3 mt-4">
          <button className="btn btn-sm btn-primary" disabled={saving || !form.summary.trim()}>{saving ? "Saving…" : "Save contact"}</button>
          {form.outreach_status && STATUS_HINT[form.outreach_status] ? <span className="text-muted fs-8">{STATUS_HINT[form.outreach_status]}</span> : null}
        </div>
      </form>

      <div className="fw-bold fs-5 mb-3">Contact history {contacts.length ? <span className="text-muted fs-7 fw-semibold">({contacts.length})</span> : null}</div>
      {!contacts.length ? (
        <div className="text-muted fs-7">No contacts recorded yet.</div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {contacts.map((c) => (
            <div key={c._id} className="rounded p-3" style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)" }}>
              <div className="d-flex flex-wrap gap-2 align-items-center fs-7">
                <span className="fw-bold">{fmtDate(c.contacted_on)}</span>
                <span className="badge badge-light">{METHODS.find(([v]) => v === c.method)?.[1] ?? c.method}</span>
                <span className={`badge ${c.direction === "incoming" ? "badge-light-success" : "badge-light-info"}`}>{c.direction === "incoming" ? "From them" : "From us"}</span>
                {c.campaign ? <span className="badge badge-light-primary">{CAMPAIGN_NAMES[c.campaign] ?? c.campaign}</span> : null}
                {c.person ? <span className="text-muted">{c.person}</span> : null}
                <span className="ms-auto text-muted fs-8">{c.created_by_name || ""}</span>
                <button type="button" className="btn btn-sm btn-link p-0 text-danger fs-8" onClick={() => remove(c)}>Delete</button>
              </div>
              <div className="mt-2" style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{c.summary}</div>
              {c.next_step || c.follow_up_on ? (
                <div className="mt-2 fs-7 text-warning">
                  {c.next_step ? <>Next: {c.next_step}</> : null}{c.next_step && c.follow_up_on ? " · " : ""}{c.follow_up_on ? <>Follow up {fmtDate(c.follow_up_on)}</> : null}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ---------------------------------------------------------------- campaign panel */

export const CampaignPanel: React.FC<{
  axios: any; campaign: "schools" | "nonprofits" | "cities"; targetId: string; enrollments: Enrollment[]; people: { email: string; name: string | null; role: string }[];
  blocked?: string | null; viaSchool?: string | null; onChange: () => void;
}> = ({ axios, campaign, targetId, enrollments, people, blocked, viaSchool, onChange }) => {
  const [busy, setBusy] = useState(false);
  const inCampaign = new Set(enrollments.filter((e) => e.campaign === campaign).map((e) => e.to_email));
  const notYet = people.filter((p) => !inCampaign.has(p.email));

  const enroll = async (who: "best" | "all") => {
    setBusy(true);
    try {
      await axios({ url: "outreach/drip/enroll", method: "POST", data: { campaign, target_ids: [targetId], who, via_school: viaSchool || undefined } });
      onChange();
    } catch (e) { console.error("enroll", e); } finally { setBusy(false); }
  };
  const setStatus = async (e: Enrollment, status: string) => {
    try { await axios({ url: `outreach/drip/enrollments/${e._id}`, method: "PATCH", data: { status } }); onChange(); } catch (err) { console.error("drip status", err); }
  };

  return (
    <div>
      {enrollments.length ? (
        <table className="table table-sm table-row-dashed fs-7 mb-3">
          <thead><tr className="fw-bold text-muted"><th>Person</th><th>Campaign</th><th>Progress</th><th>Next email</th><th></th></tr></thead>
          <tbody>
            {enrollments.map((e) => (
              <tr key={e._id}>
                <td><div className="fw-semibold">{e.to_name || e.to_email}</div><div className="text-muted fs-8">{e.to_role}{e.to_name ? ` · ${e.to_email}` : ""}</div></td>
                <td>{CAMPAIGN_NAMES[e.campaign] ?? e.campaign}</td>
                <td>
                  {e.status === "completed" ? <span className="badge badge-light-success">All {e.total_steps} sent</span>
                    : <><span className={`badge ${e.status === "active" ? "badge-light-primary" : e.status === "paused" ? "badge-light-warning" : "badge-light"}`}>{label(e.status)}</span> <span className="text-muted">{e.step} of {e.total_steps} sent</span></>}
                  {e.stop_reason ? <div className="text-muted fs-8">{e.stop_reason}</div> : null}
                </td>
                <td>{e.status === "active" && e.next_due_at ? (new Date(e.next_due_at) <= new Date() ? <span className="text-warning">Due now</span> : fmtDate(e.next_due_at)) : "—"}</td>
                <td className="text-end text-nowrap">
                  {e.status === "active" ? <button className="btn btn-sm btn-light me-1" onClick={() => setStatus(e, "paused")}>Pause</button> : null}
                  {e.status === "paused" || e.status === "stopped" ? <button className="btn btn-sm btn-light me-1" onClick={() => setStatus(e, "active")}>Resume</button> : null}
                  {e.status === "active" || e.status === "paused" ? <button className="btn btn-sm btn-light-danger" onClick={() => setStatus(e, "stopped")}>Stop</button> : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <div className="text-muted fs-7 mb-3">Not in a campaign yet.</div>}

      {blocked ? (
        <div className="text-muted fs-7">{blocked}</div>
      ) : !people.length ? (
        <div className="text-muted fs-7">No email address on file, so this one can't join a campaign. Record calls or visits in the contact log instead.</div>
      ) : notYet.length ? (
        <div className="d-flex flex-wrap gap-2 align-items-center">
          <button className="btn btn-sm btn-primary" disabled={busy} onClick={() => enroll("best")}>
            Add {inCampaign.size ? notYet[0].email : (notYet[0].name || notYet[0].email)} to the {CAMPAIGN_NAMES[campaign].toLowerCase()}
          </button>
          {notYet.length > 1 ? <button className="btn btn-sm btn-light" disabled={busy} onClick={() => enroll("all")}>Add all {notYet.length} contacts</button> : null}
          <span className="text-muted fs-8">The first email shows up under Drip Campaigns → Due now.</span>
        </div>
      ) : <div className="text-muted fs-7">Everyone with an email here is already in this campaign.</div>}
    </div>
  );
};

/* ---------------------------------------------------------------- mailing address (Nov 27, 2026) */

// For the Cities and Churches Databases: organizations with no email, phone or contact page can be reached by mail.
// Cities: the city / town government's address (Census Bureau, 2022 list of local governments). Churches: the mailing
// address the church gave the IRS, else its street address.
export type Mailing = {
  mailing_name?: string | null; mailing_attn?: string | null; mailing_address?: string | null; mailing_address2?: string | null;
  mailing_city?: string | null; mailing_state?: string | null; mailing_zip?: string | null; mailing_source?: string | null;
};
export const MAILING_SOURCE: Record<string, string> = {
  census_govts_2022: "Census Bureau list of local governments (2022)",
  irs: "IRS exempt-organization list (the church's mailing address)",
  street: "Street address on file",
  "street+census_geocoder": "Street address on file (ZIP from the Census geocoder)",
};
/** The envelope lines: name, Attn, street, suite, "City, ST ZIP". */
export const mailingLines = (m: Mailing & { name?: string }) =>
  !m.mailing_address ? [] : [
    m.mailing_name || m.name || "",
    m.mailing_attn ? `Attn: ${m.mailing_attn}` : "",
    m.mailing_address,
    m.mailing_address2 || "",
    `${m.mailing_city || ""}, ${m.mailing_state || ""} ${m.mailing_zip || ""}`.trim(),
  ].filter(Boolean);

const MAIL_KEYS = ["mailing_attn", "mailing_address", "mailing_address2", "mailing_city", "mailing_zip"] as const;
/** Mailing address block for a pop-up, with an Edit form. `save` PATCHes the record and resolves true when saved. */
export const MailingEditor: React.FC<{ record: Mailing & { name: string }; save: (data: any) => Promise<boolean> }> = ({ record, save }) => {
  const pick = () => Object.fromEntries(MAIL_KEYS.map((k) => [k, record[k] ?? ""])) as Record<string, string>;
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState(pick);
  const [busy, setBusy] = useState(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setForm(pick()); }, [record]);
  const lines = mailingLines(record);
  const box = { background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)" };
  const input = (k: string, ph: string, cls: string) => (
    <div className={cls}><input className="form-control form-control-sm" placeholder={ph} value={form[k] ?? ""} onChange={(e) => setForm({ ...form, [k]: e.target.value })} /></div>
  );
  return (
    <div className="rounded p-3 mb-4" style={box}>
      <div className="d-flex align-items-center mb-2">
        <div className="text-muted fs-8 text-uppercase fw-bold">Mailing address</div>
        {!edit ? <button className="btn btn-sm btn-link p-0 ms-auto fs-8" onClick={() => setEdit(true)}>{lines.length ? "Edit" : "Add"}</button> : null}
      </div>
      {!edit ? (
        lines.length ? (
          <>
            <div className="fs-7" style={{ whiteSpace: "pre-line" }}>{lines.join("\n")}</div>
            {record.mailing_source ? <div className="text-muted fs-8 mt-1">From: {MAILING_SOURCE[record.mailing_source] ?? record.mailing_source}</div> : null}
          </>
        ) : <span className="text-muted fs-7">No mailing address on file</span>
      ) : (
        <div className="row g-2">
          {input("mailing_attn", "Attn: (person or office)", "col-12")}
          {input("mailing_address", "Street or PO Box", "col-12")}
          {input("mailing_address2", "Suite / unit (optional)", "col-12")}
          {input("mailing_city", "City", "col-7")}
          {input("mailing_zip", "ZIP", "col-5")}
          <div className="col-12 d-flex gap-2">
            <button className="btn btn-sm btn-primary" disabled={busy} onClick={async () => { setBusy(true); const ok = await save(form); setBusy(false); if (ok) setEdit(false); }}>Save</button>
            <button className="btn btn-sm btn-light" onClick={() => { setForm(pick()); setEdit(false); }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Downloads the filtered list's mailing addresses as a CSV for a mail merge or label printing
 * (GET outreach/<cities|churches>/mailing-list with the page's filters). Returns a message for the page.
 */
export async function downloadMailingList(axios: any, kind: "cities" | "churches", filters: Record<string, string>, fileName: string): Promise<string> {
  const params: any = {};
  for (const [k, v] of Object.entries(filters)) if (v) params[k] = v;
  const res: any = await axios({ url: `outreach/${kind}/mailing-list`, method: "GET", params });
  const rows: any[] = res?.data?.rows ?? [];
  if (!rows.length) return "No one in this list has a mailing address.";
  const cell = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const head = kind === "cities"
    ? ["Name", "Attn", "Address", "Address 2", "City", "State", "ZIP", "City (iServ)", "County", "Outreach status", "Address source"]
    : ["Name", "Attn", "Address", "Address 2", "City", "State", "ZIP", "Church (iServ)", "Denomination", "County", "Outreach status", "Address source"];
  const lines = [head.map(cell).join(",")].concat(rows.map((r) => {
    const base = [r.mailing_name || r.name, r.mailing_attn, r.mailing_address, r.mailing_address2, r.mailing_city, r.mailing_state, r.mailing_zip];
    const more = kind === "cities" ? [r.name, r.county, label(r.outreach_status), r.mailing_source] : [r.name, r.denomination, r.county, label(r.outreach_status), r.mailing_source];
    return [...base, ...more].map(cell).join(",");
  }));
  const blob = new Blob(["﻿" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  return `Downloaded ${rows.length.toLocaleString()} mailing address${rows.length === 1 ? "" : "es"}${res?.data?.truncated ? " (the first 60,000; narrow the filters for the rest)" : ""}. After mailing, log a "Letter / flyer" contact or set the status to Contacted.`;
}
