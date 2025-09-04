"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import useGetLocationByCoord from "@/hooks/useGetLocationByCoord";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import { FC, useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";

L.Icon.Default.mergeOptions({
  iconUrl: (markerIcon as { src: string }).src,
  iconRetinaUrl: (markerIcon2x as { src: string }).src,
  shadowUrl: (markerShadow as { src: string }).src,
});

export type LocationPick = {
  addressLine: string; // formatted dari OpenCage
  city: string;
  latitude: number;
  longitude: number;
  isPrimary?: boolean;
};

interface CardMapProps {
  onLocationSelect: (loc: LocationPick) => void;
}

const CardMap: FC<CardMapProps> = ({ onLocationSelect }) => {
  const { getLocation, data } = useGetLocationByCoord();
  const [currentPosition, setCurrentPosition] = useState<
    [number, number] | null
  >(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // buka dialog
  const handleOpen = () => setIsOpen(true);

  // geolocate awal
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCurrentPosition([pos.coords.latitude, pos.coords.longitude]);
      },
      () => {
        // fallback Jakarta
        setCurrentPosition([-6.2088, 106.8456]);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  // setiap selesai reverse geocode → kirim ke parent
  useEffect(() => {
    if (!data || !currentPosition) return;
    onLocationSelect({
      addressLine: data.formatted,
      city: data.city,
      latitude: currentPosition[0],
      longitude: currentPosition[1],
    });
  }, [data, currentPosition, onLocationSelect]);

  // handler click map
  function ClickHandler() {
    useMapEvents({
      click: (evt) => {
        const { lat, lng } = evt.latlng;
        setCurrentPosition([lat, lng]);
        void getLocation(lat, lng);
        setIsOpen(false);
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
        <div className="h-96">
          {currentPosition && (
            <MapContainer
              center={currentPosition}
              zoom={15}
              scrollWheelZoom={true}
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
