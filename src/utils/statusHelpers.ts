import type { OrderStatus, PaymentStatus } from "../types/status";

export const statusColors = {
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
    bg: "var(--color-brand-50)",
    text: "var(--color-brand-600)",
  },
  delivered: {
    bg: "var(--color-green-100)",
    text: "var(--color-green-700)",
  },
  failed: {
    bg: "var(--color-red-100)",
    text: "var(--color-red-700)",
  },
  cancelled: {
    bg: "var(--color-grey-200)",
    text: "var(--color-grey-600)",
  },
  // Payment statuses
  paid: {
    bg: "var(--color-green-100)",
    text: "var(--color-green-700)",
  },
  unpaid: {
    bg: "var(--color-red-100)",
    text: "var(--color-red-700)",
  },
  partial: {
    bg: "var(--color-yellow-100)",
    text: "var(--color-yellow-700)",
  },
};

export function getStatusDisplay(status: OrderStatus | PaymentStatus) {
  const icons = {
    pending: "⏳",
    confirmed: "✓",
    processing: "⚙️",
    "out-for-delivery": "🚛",
    delivered: "✅",
    failed: "❌",
    cancelled: "🚫",
    paid: "💰",
    unpaid: "⏰",
    partial: "📊",
  };

  const labels = {
    pending: "Pending",
    confirmed: "Confirmed",
    processing: "Processing",
    "out-for-delivery": "Out for Delivery",
    delivered: "Delivered",
    failed: "Failed",
    cancelled: "Cancelled",
    paid: "Paid",
    unpaid: "Unpaid",
    partial: "Partial Payment",
  };

  return {
    icon: icons[status],
    label: labels[status],
  };
}
