import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

type MapProps = {
  height: string;
  width: string;
  zoom?: number;
  lat?: number;
  lng?: number;
};

const EventMap: React.FC<MapProps> = ({
  height,
  width,
  zoom = 5,
  lat = 39.5,
  lng = -98.35,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_KEY || "",
    libraries: ["places"], // Make sure 'places' library is included
  });

  const onLoad = React.useCallback(
    function callback(map: google.maps.Map) {
      const bounds = new window.google.maps.LatLngBounds({ lat, lng });
      map.fitBounds(bounds);
      setMap(map);
    },
    [lat, lng]
  );

  const onUnmount = React.useCallback(function callback() {
    setMap(null);
  }, []);

  useEffect(() => {
    if (isLoaded && map && inputRef.current) {
      const autocomplete = new google.maps.places.Autocomplete(
        inputRef.current
      );
      autocomplete.bindTo("bounds", map);

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) return;

        map.panTo(place.geometry.location);
        map.setZoom(14); // Adjust zoom as needed
      });
    }
  }, [isLoaded, map]);

  return isLoaded ? (
    <div style={{ position: "relative" }}>
      {/* Input field for address search */}
      <input
        ref={inputRef}
        type="text"
        placeholder="Search for a location"
        style={{
          position: "absolute",
          top: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 5,
          padding: "8px",
          width: "300px",
        }}
      />

      {/* Google Map */}
      <GoogleMap
        mapContainerStyle={{ height, width }}
        center={{ lat, lng }}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {/* You can add markers or other children here */}
      </GoogleMap>
    </div>
  ) : (
    <></>
  );
};

export default React.memo(EventMap);
