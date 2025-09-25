"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";

function LocationPicker({ onPick }: { onPick: (coords: { lat: number; lng: number }) => void }) {
  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(null);

  useMapEvents({
    click(e) {
      const coords = { lat: e.latlng.lat, lng: e.latlng.lng };
      setMarker(coords);
      onPick(coords);
    },
  });

  return marker ? <Marker position={marker} /> : null;
}

export function MapSelector({ onPick }: { onPick: (coords: { lat: number; lng: number }) => void }) {
  return (
    <MapContainer
      center={[-6.2, 106.8]} 
      zoom={13}
      style={{ height: "300px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationPicker onPick={onPick} />
    </MapContainer>
  );
}
