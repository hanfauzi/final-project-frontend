"use client";

import { useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

function LocationPicker({
  onPick,
  initialLat,
  initialLng,
}: {
  onPick: (coords: { lat: number; lng: number }) => void;
  initialLat?: number;
  initialLng?: number;
}) {
  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
    initialLat && initialLng ? { lat: initialLat, lng: initialLng } : null
  );

  useMapEvents({
    click(e) {
      const coords = { lat: e.latlng.lat, lng: e.latlng.lng };
      setMarker(coords);
      onPick(coords);
    },
  });

  return marker ? <Marker position={[marker.lat, marker.lng]} /> : null;
}

export function MapSelector({
  onPick,
  initialLat,
  initialLng,
}: {
  onPick: (coords: { lat: number; lng: number }) => void;
  initialLat?: number;
  initialLng?: number;
}) {
  return (
    <MapContainer
      center={initialLat && initialLng ? [initialLat, initialLng] : [-6.2, 106.8]}
      zoom={13}
      style={{ height: "300px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationPicker onPick={onPick} initialLat={initialLat} initialLng={initialLng} />
    </MapContainer>
  );
}
