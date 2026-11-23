import React, { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";

/**
 * Attendance for event lists (Nov 2026): volunteers asked for vs. who actually came, and for events held on more than
 * one date, the usual turnout and a popularity score. Data: GET events/attendance-summary?ids=...
 */

export type EventStats = {
  requested: number; signed_up: number; attended: number; dates: number; dates_held: number;
  avg_attended: number | null; show_rate: number | null; fill_rate: number | null;
  popularity_score: number | null; popularity: string; recurring: boolean;
};

export function useAttendance(ids: string[]) {
  const axiosInstance = useAxios();
  const [stats, setStats] = useState<Record<string, EventStats>>({});
  const key = ids.filter(Boolean).join(",");
  useEffect(() => {
    if (!key) { setStats({}); return; }
    let alive = true;
    axiosInstance({ url: "events/attendance-summary", method: "GET", params: { ids: key } })
      .then((r: any) => { if (alive) setStats(r?.data?.events || {}); })
      .catch(() => undefined);
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return stats;
}

/** "Asked 10 · came 7"; repeating events add the usual turnout per date. */
export const AttendanceCell: React.FC<{ s?: EventStats; requested?: number }> = ({ s, requested }) => {
  const asked = s?.requested ?? requested ?? 0;
  if (!s) return <span className="text-muted">Asked {asked || "—"}</span>;
  return (
    <div className="lh-sm">
      <span className="fw-bold">{s.attended}</span>
      <span className="text-muted"> came / {asked || "—"} asked</span>
      {s.recurring && s.dates_held > 0 ? (
        <span className="d-block text-muted fs-8">
          ~{s.avg_attended ?? 0} per date over {s.dates_held} {s.dates_held === 1 ? "date" : "dates"}
          {s.show_rate !== null ? ` · ${s.show_rate}% show up` : ""}
        </span>
      ) : s.signed_up ? <span className="d-block text-muted fs-8">{s.signed_up} signed up</span> : null}
    </div>
  );
};

const TONE: Record<string, string> = { "Very popular": "is-pop-hot", Popular: "is-pop-good", Steady: "is-pop-mid", "Needs volunteers": "is-pop-low", New: "is-pop-new" };

export const PopularityPill: React.FC<{ s?: EventStats }> = ({ s }) => {
  if (!s) return <span className="text-muted">—</span>;
  return (
    <span className={`is-pop ${TONE[s.popularity] || "is-pop-new"}`} title={s.popularity_score !== null ? `Score ${s.popularity_score}/100: how full dates are (60%) and how many signed-up students show up (40%)` : "No dates held yet"}>
      {s.popularity}{s.popularity_score !== null ? ` · ${s.popularity_score}` : ""}
    </span>
  );
};
