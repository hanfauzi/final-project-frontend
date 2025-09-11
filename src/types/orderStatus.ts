export type OrderStatus =
  | "WAITING_FOR_CONFIRMATION"
  | "ACCEPTED"
  | "REJECTED"
  | "PICKED_UP"
  | "IN_PROGRESS"
  | "READY"
  | "DELIVERING"
  | "COMPLETED"
  | "CANCELLED"
  | string;