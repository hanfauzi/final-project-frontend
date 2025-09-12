"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent,
  DialogDescription,
  DialogHeader, DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useGetLocationByCoord from "@/hooks/useGetLocationByCoord";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import { FC, useEffect, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";

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
};

export type InitialLocation = {
  lat: number;             
  lng: number;             
  addressLine?: string;  
  city?: string;          
};
interface CardMapProps {
  onLocationSelect: (loc: LocationPick) => void;
  initial: InitialLocation
}

const CardMap: FC<CardMapProps> = ({ onLocationSelect }) => {
  const { getLocation, data } = useGetLocationByCoord();
  const [currentPosition, setCurrentPosition] = useState<[number, number] | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const shouldCloseRef = useRef(false);

  const onSelectRef = useRef(onLocationSelect);
  useEffect(() => { onSelectRef.current = onLocationSelect; }, [onLocationSelect]);

  const getLocationRef = useRef(getLocation);
  useEffect(() => { getLocationRef.current = getLocation; }, [getLocation]);

  const handleOpen = () => setIsOpen(true);

  useEffect(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setCurrentPosition(next);
        void getLocationRef.current(next[0], next[1]);
      },
      () => {
        setCurrentPosition(null);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  useEffect(() => {
    if (!data || !currentPosition) return;
    onSelectRef.current({
      addressLine: data.formatted,
      city: data.city,
      latitude: currentPosition[0],
      longitude: currentPosition[1],
    });
    if (shouldCloseRef.current) {
      shouldCloseRef.current = false;
      setIsOpen(false);
    }
  }, [data, currentPosition]);

  function ClickHandler() {
    useMapEvents({
      click: (evt) => {
        const { lat, lng } = evt.latlng;
        setCurrentPosition([lat, lng]);
        shouldCloseRef.current = true;
        void getLocationRef.current(lat, lng);
      },
    });
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-56 justify-start text-left rounded-xl border-neutral-300 text-teal-700 hover:bg-teal-50"
          onClick={handleOpen}
        >
          Set Location on Map
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="sr-only">Pilih lokasi di peta</DialogTitle>
          <DialogDescription className="sr-only">Klik peta untuk memilih lokasi.</DialogDescription>
        </DialogHeader>

        <div className="h-96">
          {currentPosition ? (
            <MapContainer
              center={currentPosition}
              zoom={15}
              scrollWheelZoom
              className="h-full w-full rounded-xl overflow-hidden"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="© OpenStreetMap contributors"
              />
              <ClickHandler />
              <Marker position={currentPosition}>
                <Popup>Klik pada peta untuk memilih lokasi.</Popup>
              </Marker>
            </MapContainer>
          ) : (
            <div className="h-full grid place-items-center text-sm text-neutral-500">
              Aktifkan izin lokasi lalu buka peta.
            </div>
          )}
        </div>

        <div className="text-[11px] text-neutral-500">
          Geocoding by OpenCage. Map © OpenStreetMap contributors.
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CardMap;
