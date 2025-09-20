import type { PickUpOrderStatus } from "@/types/orderPickUpStatus"; // pakai enum yg sudah kamu punya

export type OutletInfo = {
  id: string;
  name: string;
  cityName: string;
  address: string;
};

export type DriverInfo = {
  id: string;
  name: string;
  phoneNumber: string | null;
} | null;

export type CustomerPickUpOrderDetail = {
  id: string;
  status: PickUpOrderStatus;
  notes: string | null;
  distance: number;
  price: number;
  scheduledAt: string | null;     
  pickedUpAt: string | null;      
  arrivedAtOutlet: string | null; 
  createdAt: string;              
  updatedAt: string;              
  outlet: OutletInfo;
  driver: DriverInfo;
};
