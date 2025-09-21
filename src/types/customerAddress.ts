import { Customer } from "./customer";

export interface CustomerAddress {
  id: string;
  label: string;
  address: string;
  city: string;
  postalCode: string;
  phoneNumber: string;
  latitude: number;
  longitude: number;
  notes: string | null;
  isPrimary: boolean;
  
  customer?: Customer
}
