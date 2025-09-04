"use client";

import type {
    Icon,
    LeafletEventHandlerFnMap,
    Map as LeafletMap,
    Marker as LeafletMarker,
    LeafletMouseEvent
} from "leaflet";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label as UILabel } from "@/components/ui/label";
import { MapPin } from "lucide-react";

import marker2x from "leaflet/dist/images/marker-icon-2x.png";
import marker1x from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Client-only react-leaflet components
const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  {
      ssr: false,
    }
);
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), {
    ssr: false,
});

type Coords = { latitude: number; longitude: number };
export default function PinpointDialog({
    valueText,
    lat,
    lng,
    onPick,
}: {
    valueText: string;
    lat: number;
    lng: number;
    onPick: (v: Coords & { display?: string }) => void;
}) {
    const [open, setOpen] = useState(false);
    const [coord, setCoord] = useState<Coords>(() => ({
    latitude: Number.isFinite(lat) ? lat : -6.2088, // Jakarta fallback
    longitude: Number.isFinite(lng) ? lng : 106.8456,
}));
const mapRef = useRef<LeafletMap | null>(null);

  // leafet icon (tanpa mengubah prototype)
  const [icon, setIcon] = useState<Icon | null>(null);
  useEffect(() => {
    (async () => {
      const L = await import("leaflet");
      const defaultIcon = new L.Icon({
          iconRetinaUrl: (marker2x as { src: string }).src,
          iconUrl: (marker1x as { src: string }).src,
          shadowUrl: (markerShadow as { src: string }).src,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41],
      });
      setIcon(defaultIcon);
    })();
  }, []);

  // geolocate ketika dialog dibuka & tidak ada nilai awal
  useEffect(() => {
      if (!open) return;
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
          if ("geolocation" in navigator) {
              navigator.geolocation.getCurrentPosition(
          (pos) =>
            setCoord({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            }),
            () => void 0,
            { enableHighAccuracy: true, timeout: 8000 }
        );
    }
}
}, [open, lat, lng]);

// ref marker + handlers bertipe
const markerRef = useRef<LeafletMarker | null>(null);
  const markerHandlers: LeafletEventHandlerFnMap = useMemo(
      () => ({
          dragend: () => {
              const m = markerRef.current;
              if (!m) return;
        const p = m.getLatLng();
        setCoord({ latitude: p.lat, longitude: p.lng });
    },
}),
[]
);

return (
    <div className="space-y-2">
      <UILabel className="text-neutral-900">Pinpoint</UILabel>

      <div className="flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-3 py-2">
        <MapPin className="h-4 w-4 text-neutral-700" />
        <div
          className="flex-1 text-sm text-neutral-800 truncate"
          title={valueText}
        >
          {valueText ||
            `${coord.latitude.toFixed(5)}, ${coord.longitude.toFixed(5)}`}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-neutral-900"
          onClick={() => setOpen(true)}
        >
          Ubah
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Pilih lokasi di peta</DialogTitle>
            <DialogDescription>
              Klik peta atau seret penanda untuk menentukan titik.
            </DialogDescription>
          </DialogHeader>

          <div className="h-[56vh] w-full rounded-xl overflow-hidden">
            {typeof window !== "undefined" && (
              <MapContainer
                center={[coord.latitude, coord.longitude]}
                zoom={15}
                scrollWheelZoom
                className="h-full w-full"
                ref={mapRef}
                whenReady={() => {
                    // <- sesuai tipe: () => void
                    const map = mapRef.current;
                  if (!map) return;

                  // klik peta -> update koordinat
                  map.on("click", (e: LeafletMouseEvent) => {
                    const { lat, lng } = e.latlng;
                    setCoord({ latitude: lat, longitude: lng });
                  });
                }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="© OpenStreetMap contributors"
                />

                {icon && (
                  <Marker
                    position={[coord.latitude, coord.longitude]}
                    draggable
                    eventHandlers={markerHandlers}
                    icon={icon}
                    ref={(instance) => {
                      markerRef.current = instance as LeafletMarker | null;
                    }}
                  />
                )}
              </MapContainer>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 pt-3">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl border-neutral-300"
              onClick={() => {
                if (!("geolocation" in navigator)) return;
                navigator.geolocation.getCurrentPosition(
                  (pos) =>
                    setCoord({
                      latitude: pos.coords.latitude,
                      longitude: pos.coords.longitude,
                    }),
                  () => void 0,
                  { enableHighAccuracy: true, timeout: 8000 }
                );
              }}
            >
              Gunakan lokasi saya
            </Button>

            <div className="flex items-center gap-2 text-xs text-neutral-500">
              {coord.latitude.toFixed(5)},{coord.longitude.toFixed(5)}
              <Button
                className="rounded-xl bg-neutral-900 text-white hover:bg-neutral-800"
                onClick={() => {
                  onPick({
                    latitude: coord.latitude,
                    longitude: coord.longitude,
                    display: `${coord.latitude.toFixed(
                      5
                    )}, ${coord.longitude.toFixed(5)}`,
                  });
                  setOpen(false);
                }}
              >
                Simpan lokasi
              </Button>
            </div>
          </div>

          <div className="text-[11px] text-neutral-500">
            Map © OpenStreetMap contributors.
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
