export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "out-for-delivery"
  | "delivered"
  | "failed"
  | "cancelled";

export type PaymentStatus = "paid" | "unpaid" | "partial";
