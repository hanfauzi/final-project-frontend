export type PickUpOrderStatus =
  | "WAITING_FOR_DRIVER"
  | "ON_THE_WAY_TO_CUSTOMER"
  | "ON_THE_WAY_TO_OUTLET"
  | "RECEIVED_BY_OUTLET"
  | "CANCELLED"
  | string;
