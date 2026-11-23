import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FeedItem, RADII, STATES, colorOf, fetchFeed, isDated, whenText, LAST_STATE_KEY, store } from "./feed";

/**
 * Admin projects map (Nov 2026): every live listing students can see (iServ events + community projects) for a
 * state, or within 2 / 5 / 10 / 25 miles of a ZIP code. Projects at the same spot share one pin with a count.
 * Used full-size on /projects-map and as a compact card on the dashboard.
 */

type Show = "all" | "dated" | "ongoing";
type Source = "all" | "iserv" | "community";

const pin = (color: string, count: number) =>
  L.divIcon({
    className: "",
    html: count > 1
      ? `<span style="position:relative;display:block;width:24px;height:24px;border-radius:9999px;background:${color};border:3px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,.45)"><span style="position:absolute;top:-9px;right:-11px;min-width:18px;height:18px;padding:0 4px;border-radius:9999px;background:#020617;color:#fff;font:700 11px/18px system-ui,sans-serif;text-align:center;border:1.5px solid #fff">${count}</span></span>`
      : `<span style="display:block;width:18px;height:18px;border-radius:9999px;background:${color};border:3px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,.45)"></span>`,
    iconSize: count > 1 ? [24, 24] : [18, 18],
    iconAnchor: count > 1 ? [12, 12] : [9, 9],
    popupAnchor: [0, -12],
  });

/** Fits the map to the pins (or the search circle) whenever they change. */
const Fit: React.FC<{ points: [number, number][]; center?: [number, number] | null; radius?: number }> = ({ points, center, radius }) => {
  const map = useMap();
  useEffect(() => {
    if (center && radius) { map.fitBounds(L.latLng(center).toBounds(radius * 1609.34 * 2), { padding: [20, 20] }); return; }
    if (points.length) map.fitBounds(L.latLngBounds(points), { padding: [30, 30], maxZoom: 12 });
  }, [map, points, center, radius]);
  return null;
};

const ProjectsMapView: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const [state, setState] = useState(() => store.get(LAST_STATE_KEY) || "MO");
  const [zipInput, setZipInput] = useState("");
  const [zip, setZip] = useState("");
  const [radius, setRadius] = useState(10);
  const [show, setShow] = useState<Show>("all");
  const [source, setSource] = useState<Source>("all");
  const [items, setItems] = useState<FeedItem[]>([]);
  const [center, setCenter] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");
    fetchFeed(zip ? { zip, radius } : { state }).then((r) => {
      if (!alive) return;
      setItems(r.items);
      setCenter(zip ? r.center ?? null : null);
      setError(r.error || "");
      setLoading(false);
    });
    return () => { alive = false; };
  }, [state, zip, radius]);

  const shown = useMemo(() => items.filter((i) =>
    i.lat !== null && i.lng !== null &&
    (show === "all" || (show === "dated" ? isDated(i) : !isDated(i))) &&
    (source === "all" || i.source === source)), [items, show, source]);

  const spots = useMemo(() => {
    const by = new Map<string, FeedItem[]>();
    for (const i of shown) { const k = `${i.lat!.toFixed(4)},${i.lng!.toFixed(4)}`; by.set(k, [...(by.get(k) || []), i]); }
    return Array.from(by.values());
  }, [shown]);
  const points = useMemo(() => spots.map((g) => [g[0].lat!, g[0].lng!] as [number, number]), [spots]);

  const dated = items.filter(isDated).length;
  const submitZip = (e: React.FormEvent) => {
    e.preventDefault();
    const z = zipInput.trim();
    if (z && !/^\d{5}$/.test(z)) { setError("Enter a 5-digit ZIP code."); return; }
    setZip(z);
  };

  return (
    <div className="is-mapcard">
      <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
        <label className="visually-hidden" htmlFor={`map-state-${compact}`}>State</label>
        <select id={`map-state-${compact}`} className="form-select form-select-sm w-auto" value={state} disabled={!!zip}
          onChange={(e) => { setState(e.target.value); store.set(LAST_STATE_KEY, e.target.value); }}>
          {STATES.map(([c, n]) => <option key={c} value={c}>{n}</option>)}
        </select>
        <form className="d-flex gap-2" onSubmit={submitZip}>
          <label className="visually-hidden" htmlFor={`map-zip-${compact}`}>ZIP code</label>
          <input id={`map-zip-${compact}`} className="form-control form-control-sm w-100px" inputMode="numeric" maxLength={5} placeholder="ZIP"
            value={zipInput} onChange={(e) => setZipInput(e.target.value.replace(/\D/g, ""))} />
          <label className="visually-hidden" htmlFor={`map-radius-${compact}`}>Distance</label>
          <select id={`map-radius-${compact}`} className="form-select form-select-sm w-auto" value={radius} onChange={(e) => setRadius(Number(e.target.value))}>
            {RADII.map((r) => <option key={r} value={r}>{r} mi</option>)}
          </select>
          <button type="submit" className="btn btn-sm btn-primary">Go</button>
          {zip ? <button type="button" className="btn btn-sm btn-light" onClick={() => { setZip(""); setZipInput(""); }}>Whole state</button> : null}
        </form>
        {!compact ? (
          <>
            <select className="form-select form-select-sm w-auto" aria-label="Show" value={show} onChange={(e) => setShow(e.target.value as Show)}>
              <option value="all">Dated + ongoing</option>
              <option value="dated">Dated events</option>
              <option value="ongoing">Ongoing</option>
            </select>
            <select className="form-select form-select-sm w-auto" aria-label="Source" value={source} onChange={(e) => setSource(e.target.value as Source)}>
              <option value="all">All sources</option>
              <option value="iserv">iServ events</option>
              <option value="community">Community projects</option>
            </select>
          </>
        ) : null}
        <span className="text-muted fs-7 ms-auto">
          {loading ? "Loading…" : `${items.length} listings · ${dated} dated · ${items.length - dated} ongoing${zip ? ` within ${radius} mi of ${zip}` : ""}`}
        </span>
      </div>
      {error ? <div className="alert alert-warning py-2 fs-7">{error}</div> : null}
      <div className="is-map" style={{ height: compact ? 360 : "calc(100vh - 290px)", minHeight: 420 }}>
        <MapContainer center={[38.5, -92.5]} zoom={6} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
          <TileLayer className="is-map-tiles" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Fit points={points} center={center} radius={zip ? radius : undefined} />
          {center && zip ? <Circle center={center} radius={radius * 1609.34} pathOptions={{ color: "#2dd4bf", weight: 1, fillOpacity: 0.05 }} /> : null}
          {spots.map((g) => (
            <Marker key={g[0].guid} position={[g[0].lat!, g[0].lng!]} icon={pin(colorOf(g[0]), g.length)}>
              <Popup>
                {g.length > 1 ? <p className="fw-bold text-uppercase fs-8 mb-2" style={{ letterSpacing: ".15em", color: "#5eead4" }}>{g.length} listings here</p> : null}
                <div style={{ maxHeight: 260, overflowY: "auto" }}>
                  {g.map((i: FeedItem) => (
                    <div key={i.guid} className="mb-3">
                      <p className="fw-bold m-0">{i.title}</p>
                      <p className="m-0 text-muted fs-8">{i.organization} · {i.source === "iserv" ? "iServ event" : "Community project"}{i.difficulty ? ` · ${i.difficulty}` : ""}</p>
                      <p className="m-0 fs-8">{whenText(i)}{i.city ? ` · ${i.city}` : ""}{i.locationPrecision === "city" ? " (approximate)" : ""}</p>
                      <a href={i.link} target="_blank" rel="noreferrer" className="fs-8 fw-bold">Open listing ↗</a>
                    </div>
                  ))}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <div className="d-flex flex-wrap gap-4 mt-3 fs-8 text-muted align-items-center">
        <span><span className="is-legend-dot" style={{ background: "#fbbf24" }} /> iServ event</span>
        <span><span className="is-legend-dot" style={{ background: "#34d399" }} /> Parks / environment</span>
        <span><span className="is-legend-dot" style={{ background: "#f87171" }} /> Food</span>
        <span><span className="is-legend-dot" style={{ background: "#38bdf8" }} /> Animals</span>
        <span><span className="is-legend-dot" style={{ background: "#a78bfa" }} /> Learning</span>
        <span><span className="is-legend-dot" style={{ background: "#e879f9" }} /> Seniors / health</span>
        <span><span className="is-legend-dot" style={{ background: "#5eead4" }} /> Other</span>
        {compact ? <Link to="/projects-map" className="ms-auto fw-bold">Open the full map →</Link> : null}
      </div>
    </div>
  );
};

export default ProjectsMapView;
