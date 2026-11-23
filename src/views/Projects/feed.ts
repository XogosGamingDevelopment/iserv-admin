// Live student-facing listings for the admin map and project list: the public feed
// (GET <api>/feed/projects.json), the same data students see. Called WITHOUT the admin token: the feed reads an
// Authorization header as a partner key and would refuse an admin session token.

export type FeedItem = {
  guid: string; title: string; link: string; description: string; startDate: string | null; endDate: string | null;
  schedule: string | null; city: string | null; state: string | null; organization: string; source: "iserv" | "community";
  minAge: number | null; category: string | null; lat: number | null; lng: number | null; locationPrecision?: string | null;
  distanceMiles?: number | null; type?: string | null; difficulty?: string | null; address?: string | null; signupUrl?: string | null;
};

export const STATES: [string, string][] = [
  ["AL", "Alabama"], ["AK", "Alaska"], ["AZ", "Arizona"], ["AR", "Arkansas"], ["CA", "California"], ["CO", "Colorado"], ["CT", "Connecticut"],
  ["DE", "Delaware"], ["DC", "District of Columbia"], ["FL", "Florida"], ["GA", "Georgia"], ["HI", "Hawaii"], ["ID", "Idaho"], ["IL", "Illinois"],
  ["IN", "Indiana"], ["IA", "Iowa"], ["KS", "Kansas"], ["KY", "Kentucky"], ["LA", "Louisiana"], ["ME", "Maine"], ["MD", "Maryland"],
  ["MA", "Massachusetts"], ["MI", "Michigan"], ["MN", "Minnesota"], ["MS", "Mississippi"], ["MO", "Missouri"], ["MT", "Montana"], ["NE", "Nebraska"],
  ["NV", "Nevada"], ["NH", "New Hampshire"], ["NJ", "New Jersey"], ["NM", "New Mexico"], ["NY", "New York"], ["NC", "North Carolina"],
  ["ND", "North Dakota"], ["OH", "Ohio"], ["OK", "Oklahoma"], ["OR", "Oregon"], ["PA", "Pennsylvania"], ["RI", "Rhode Island"],
  ["SC", "South Carolina"], ["SD", "South Dakota"], ["TN", "Tennessee"], ["TX", "Texas"], ["UT", "Utah"], ["VT", "Vermont"], ["VA", "Virginia"],
  ["WA", "Washington"], ["WV", "West Virginia"], ["WI", "Wisconsin"], ["WY", "Wyoming"],
];

export const RADII = [2, 5, 10, 25];
const base = () => (process.env.REACT_APP_API_ENDPOINT || "").replace(/\/?$/, "/");

/** state: a 2-letter code; or zip + radius. Always includes ongoing roles. */
export async function fetchFeed(opts: { state?: string; zip?: string; radius?: number }): Promise<{ items: FeedItem[]; center?: [number, number] | null; error?: string }> {
  const q = new URLSearchParams({ include: "ongoing" });
  if (opts.zip) { q.set("zip", opts.zip); q.set("radius", String(opts.radius || 10)); q.set("limit", "200"); }
  else if (opts.state) { q.set("state", opts.state); q.set("limit", "all"); }
  try {
    const r = await fetch(`${base()}feed/projects.json?${q}`);
    const j = await r.json();
    if (!r.ok) return { items: [], error: j?.message || "Couldn't load projects" };
    return { items: j.items || [], center: j.center && typeof j.center.lat === "number" ? [j.center.lat, j.center.lng] : null };
  } catch {
    return { items: [], error: "Couldn't reach the project feed" };
  }
}

export const isDated = (i: FeedItem) => !!i.startDate;
export const fmtDay = (iso: string) => new Date(iso.slice(0, 10) + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
export const whenText = (i: FeedItem) => (i.startDate ? fmtDay(i.startDate) : i.schedule || "Ongoing");

/** Category colours (match the website's map). */
export const CAT_COLOR: Record<string, string> = {
  food: "#f87171", basic_needs: "#f87171", animals: "#38bdf8", shelter: "#38bdf8", environment: "#34d399", parks: "#34d399",
  tutoring: "#a78bfa", library: "#a78bfa", museum: "#a78bfa", youth: "#a78bfa", seniors: "#e879f9", hospital: "#e879f9",
};
export const colorOf = (i: FeedItem) => (i.source === "iserv" ? "#fbbf24" : CAT_COLOR[(i.category || "").toLowerCase()] || "#5eead4");

export const LAST_STATE_KEY = "iserv-admin-map-state";
export const store = {
  get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } },
};
