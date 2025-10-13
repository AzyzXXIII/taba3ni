import type { OrderStatus, PaymentStatus, Status } from "../types/status";

// Status colors configuration
export const statusColors: Record<Status, { bg: string; text: string }> = {
  // Order statuses
  pending: {
    bg: "var(--color-yellow-100)",
    text: "var(--color-yellow-700)",
  },
  confirmed: {
    bg: "var(--color-blue-100)",
    text: "var(--color-blue-700)",
  },
  processing: {
    bg: "var(--color-blue-100)",
    text: "var(--color-blue-700)",
  },
  "out-for-delivery": {
    bg: "var(--color-brand-100)",
    text: "var(--color-brand-700)",
  },
  delivered: {
    bg: "var(--color-green-100)",
    text: "var(--color-green-700)",
  },
  cancelled: {
    bg: "var(--color-grey-100)",
    text: "var(--color-grey-700)",
  },
  failed: {
    bg: "var(--color-red-100)",
    text: "var(--color-red-700)",
  },

  // Payment statuses
  unpaid: {
    bg: "var(--color-red-100)",
    text: "var(--color-red-700)",
  },
  partial: {
    bg: "var(--color-yellow-100)",
    text: "var(--color-yellow-700)",
  },
  paid: {
    bg: "var(--color-green-100)",
    text: "var(--color-green-700)",
  },
};

// Get display info for status (label and icon)
export const getStatusDisplay = (
  status: OrderStatus | PaymentStatus
): { label: string; icon: string } => {
  const statusMap: Record<
    OrderStatus | PaymentStatus,
    { label: string; icon: string }
  > = {
    // Order statuses
    pending: { label: "Pending", icon: "⏳" },
    confirmed: { label: "Confirmed", icon: "✓" },
    processing: { label: "Processing", icon: "⚙️" },
    "out-for-delivery": { label: "Out for Delivery", icon: "🚛" },
    delivered: { label: "Delivered", icon: "✅" },
    cancelled: { label: "Cancelled", icon: "❌" },
    failed: { label: "Failed", icon: "⚠️" },

    // Payment statuses
    unpaid: { label: "Unpaid", icon: "💰" },
    partial: { label: "Partial", icon: "💵" },
    paid: { label: "Paid", icon: "✅" },
    refunded: { label: "Refunded", icon: "↩️" },
  };

  return statusMap[status] || { label: status, icon: "•" };
};
