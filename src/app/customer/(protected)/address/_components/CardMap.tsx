"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useGetLocationByCoord from "@/app/customer/(protected)/address/_hooks/useGetLocationByCoord";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import { FC, useEffect, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import { MapPin, Crosshair, Loader2 } from "lucide-react";

L.Icon.Default.mergeOptions({
  iconUrl: (markerIcon as { src: string }).src,
  iconRetinaUrl: (markerIcon2x as { src: string }).src,
  shadowUrl: (markerShadow as { src: string }).src,
});

export type LocationPick = {
  addressLine: string;
  city: string;
  latitude: number;
  longitude: number;
  isPrimary?: boolean;
  postalCode?: string;
};

export type InitialLocation = {
  lat: number;
  lng: number;
  addressLine?: string;
  city?: string;
  postalCode?: string;
};

interface CardMapProps {
  onLocationSelect: (loc: LocationPick) => void;
  initial: InitialLocation;
}

const CardMap: FC<CardMapProps> = ({ onLocationSelect, initial }) => {
  useEffect(() => {
  if (initial?.lat && initial?.lng) {
    const next: [number, number] = [initial.lat, initial.lng];
    setCurrentPosition(next);

    // kalau belum ada addressLine/city/postalCode dari initial, lakukan reverse geocode
    if (!initial.addressLine || !initial.city || !initial.postalCode) {
      void getLocationRef.current(next[0], next[1]);
    }
  }
}, [initial]);
  const { getLocation, data, isLoading } = useGetLocationByCoord();
  const [currentPosition, setCurrentPosition] = useState<
    [number, number] | null
  >(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onSelectRef = useRef(onLocationSelect);
  useEffect(() => {
    onSelectRef.current = onLocationSelect;
  }, [onLocationSelect]);

  const getLocationRef = useRef(getLocation);
  useEffect(() => {
    getLocationRef.current = getLocation;
  }, [getLocation]);

  const handleOpen = () => setIsOpen(true);

  useEffect(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next: [number, number] = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];
        setCurrentPosition(next);
        void getLocationRef.current(next[0], next[1]);
      },
      () => {
        setCurrentPosition(null);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  function ClickHandler() {
    useMapEvents({
      click: (evt) => {
        const { lat, lng } = evt.latlng;
        setCurrentPosition([lat, lng]);
        void getLocationRef.current(lat, lng);
      },
    });
    return null;
  }

  const handleConfirm = () => {
    if (!currentPosition) return;
    onSelectRef.current({
      addressLine: data?.formatted ?? "",
      city: data?.city ?? "",
      postalCode:  data?.postcode ||
    (typeof data?.formatted === "string"
      ? (data.formatted.match(/\b\d{5}\b/)?.[0] ?? "")
      : ""),
      latitude: currentPosition[0],
      longitude: currentPosition[1],
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          onClick={handleOpen}
          className="w-full sm:w-48 rounded-xl justify-center border-border bg-card hover:bg-accent hover:border-border text-foreground gap-2"
        >
          <MapPin className="h-4 w-4" />
          Pilih lokasi
        </Button>
      </DialogTrigger>

      <DialogContent
        className="max-w-3xl rounded-3xl p-0 overflow-hidden border border-border bg-card/90 backdrop-blur"
      >
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-16 -left-10 h-44 w-44 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute top-8 right-0 h-56 w-56 rounded-full bg-accent/40 blur-3xl" />
        </div>

        <DialogHeader className="px-6 pt-5 pb-3">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Crosshair className="h-4 w-4" />
            </span>
            Pilih Lokasi di Peta
          </DialogTitle>
          <DialogDescription className="mt-2 text-[13px] text-muted-foreground">
            Klik peta untuk menetapkan titik. Periksa preview di bawah, lalu konfirmasi.
          </DialogDescription>

          <div className="mt-4 rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground shadow-sm">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                Alamat:
              </span>
              <span className="font-medium">
                {isLoading ? "Mencari alamat" : data?.formatted ?? "—"}
              </span>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6">
          <div className="h-96 relative rounded-2xl overflow-hidden ring-1 ring-border">
            {currentPosition ? (
              <>
                <div className="absolute inset-0">
                  <MapContainer center={currentPosition} zoom={15} scrollWheelZoom className="h-full w-full">
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap contributors" />
                    <ClickHandler />
                    <Marker position={currentPosition}>
                      <Popup>Klik peta untuk mengubah titik.</Popup>
                    </Marker>
                  </MapContainer>
                </div>

                <div className="pointer-events-none absolute right-3 top-3">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-card/90 px-3 py-1.5 text-xs text-muted-foreground shadow ring-1 ring-border backdrop-blur">
                    <span className={`h-2 w-2 rounded-full ${isLoading ? "bg-yellow-500 animate-pulse" : "bg-emerald-500"}`} />
                    {isLoading ? "Mencari alamat" : "Preview siap"}
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full grid place-items-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-muted">
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    ) : (
                      <Crosshair className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Aktifkan izin lokasi, lalu buka peta.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="text-[11px] text-muted-foreground">
              Geocoding by OpenCage. Map © OpenStreetMap contributors.
            </div>
            <div className="flex items-center gap-2">
              <Button type="button" variant="ghost" className="rounded-xl" onClick={() => setIsOpen(false)}>
                Batal
              </Button>
              <Button type="button" className="rounded-xl" onClick={handleConfirm} disabled={!currentPosition || isLoading}>
                Gunakan titik ini
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CardMap;
