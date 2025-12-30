import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom marker icon
const customMarkerIcon = new L.Icon({
  iconUrl: "/assets/media/images/place-marker.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

type MapProps = {
  height: string;
  width: string;
  zoom?: number;
  lat?: number;
  lng?: number;
};

// Helper component to ensure map pans to marker location
const RecenterMap: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
};

const EventMapLeaflet: React.FC<MapProps> = ({
  height,
  width,
  zoom = 5,
  lat = 39.5,
  lng = -98.35,
}) => {
  return (
    <MapContainer center={[lat, lng]} zoom={zoom} style={{ height, width }}>
      <RecenterMap lat={lat} lng={lng} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]} icon={customMarkerIcon}>
        <Popup>
          Custom Marker Image! <br /> Clicked from here.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default React.memo(EventMapLeaflet);
