import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";

export type PickUpOrderStatus =
  | "WAITING_FOR_DRIVER"
  | "ON_THE_WAY_TO_CUSTOMER"
  | "ON_THE_WAY_TO_OUTLET"
  | "RECEIVED_BY_OUTLET"
  | "CANCELLED"
  | string;

export function PickUpStatusBadge({ status }: { status: PickUpOrderStatus }) {
  const { text, classes } = useMemo(() => {
    const BRAND = "bg-ring/10 text-ring";                 
    const POS   = "bg-accent text-primary";               
    const NEG   = "bg-destructive/10 text-destructive";   
    const NEU   = "bg-muted text-foreground";            

    switch (status) {
      case "WAITING_FOR_DRIVER":
        return { text: mapPickUpText(status), classes: BRAND };
      case "ON_THE_WAY_TO_CUSTOMER":
      case "ON_THE_WAY_TO_OUTLET":
        return { text: mapPickUpText(status), classes: NEU };
      case "RECEIVED_BY_OUTLET":
        return { text: mapPickUpText(status), classes: POS };
      case "CANCELLED":
        return { text: mapPickUpText(status), classes: NEG };
      default:
        return { text: status, classes: "bg-muted text-muted-foreground" };
    }
  }, [status]);

  return (
    <Badge className={`rounded-full px-2.5 py-0.5 ${classes}`}>
      {text}
    </Badge>
  );
}

function mapPickUpText(s: PickUpOrderStatus) {
  switch (s) {
    case "WAITING_FOR_DRIVER": return "Menunggu Driver";
    case "ON_THE_WAY_TO_CUSTOMER": return "Driver Menuju Customer";
    case "ON_THE_WAY_TO_OUTLET": return "Driver Menuju Outlet";
    case "RECEIVED_BY_OUTLET": return "Diterima di Outlet";
    case "CANCELLED": return "Dibatalkan";
    default: return String(s);
  }
}
