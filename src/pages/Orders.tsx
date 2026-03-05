import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineShoppingCart,
  HiOutlineCurrencyDollar,
  HiOutlineCalendar,
  HiOutlineTruck,
  HiOutlineArrowDownTray,
  HiOutlineXCircle,
  HiOutlineCheckCircle,
  HiOutlineArrowPath,
  HiOutlineClock,
  HiOutlineUser,
} from "react-icons/hi2";
import Heading from "../UI/Heading";
import Row from "../UI/Row";
import Button from "../UI/Button";
import ButtonGroup from "../UI/ButtonGroup";
import StatusBadge from "../UI/StatusBadge";
import { getStatusDisplay } from "../utils/statusHelpers";
import type { OrderStatus, PaymentStatus } from "../types/status";
import SearchBar from "../UI/SearchBar";
import Menus from "../UI/Menus";
import Modal from "../UI/Modal";
import ConfirmDelete from "../UI/ConfirmDelete";
import OrderForm from "../components/OrderForm";
import { useNotifications } from "../hooks/useNotifications";

// ─── Styled Components ────────────────────────────────────────────────────────

const OrdersLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
`;

const FiltersBar = styled.div`
  display: flex;
  gap: 1.6rem;
  align-items: center;
  flex-wrap: wrap;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const DateFilterGroup = styled.div`
  display: flex;
  gap: 0.8rem;
  align-items: center;
  background-color: var(--color-grey-0);
  padding: 0.8rem 1.2rem;
  border: 2px solid var(--color-grey-300);
  border-radius: var(--border-radius-sm);
  & label {
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--color-grey-700);
    white-space: nowrap;
  }
  & input[type="date"] {
    border: 1px solid var(--color-grey-300);
    padding: 0.6rem 1rem;
    border-radius: var(--border-radius-sm);
    font-size: 1.3rem;
    &:focus {
      outline: none;
      border-color: var(--color-brand-600);
    }
  }
  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
    & input[type="date"] {
      width: 100%;
    }
  }
`;

const ClearFiltersButton = styled.button`
  padding: 0.8rem 1.6rem;
  background-color: var(--color-grey-0);
  border: 2px solid var(--color-grey-300);
  color: var(--color-grey-700);
  border-radius: var(--border-radius-sm);
  font-size: 1.3rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  &:hover {
    border-color: var(--color-red-600);
    color: var(--color-red-600);
    background-color: var(--color-red-50);
  }
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FilterButton = styled.button<{ $active?: boolean }>`
  padding: 0.8rem 1.6rem;
  border: 2px solid
    ${(p) => (p.$active ? "var(--color-brand-600)" : "var(--color-grey-300)")};
  background-color: ${(p) =>
    p.$active ? "var(--color-brand-50)" : "var(--color-grey-0)"};
  color: ${(p) =>
    p.$active ? "var(--color-brand-600)" : "var(--color-grey-600)"};
  border-radius: var(--border-radius-sm);
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    border-color: var(--color-brand-600);
    color: var(--color-brand-600);
  }
  @media (max-width: 768px) {
    flex: 1;
  }
`;

const TableCard = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  overflow: hidden;
  @media (max-width: 1024px) {
    border: none;
    background-color: transparent;
  }
`;

const TableControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.6rem 2.4rem;
  background-color: var(--color-grey-50);
  border-bottom: 1px solid var(--color-grey-100);
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.2rem;
    align-items: stretch;
  }
`;

const ResultsCount = styled.div`
  font-size: 1.4rem;
  color: var(--color-grey-600);
  font-weight: 500;
  & strong {
    color: var(--color-grey-900);
    font-weight: 700;
  }
`;

const ExportButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.4rem;
  & svg {
    width: 1.8rem;
    height: 1.8rem;
  }
`;

const Table = styled.div`
  width: 100%;
  overflow-x: auto;
  @media (max-width: 1024px) {
    overflow-x: visible;
  }
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.8fr 1.5fr 1.5fr 1fr 1fr 1fr 0.5fr;
  gap: 1.6rem;
  padding: 1.6rem 2.4rem;
  background-color: var(--color-grey-50);
  font-weight: 600;
  font-size: 1.3rem;
  text-transform: uppercase;
  color: var(--color-grey-600);
  border-bottom: 1px solid var(--color-grey-100);
  @media (max-width: 1024px) {
    display: none;
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.8fr 1.5fr 1.5fr 1fr 1fr 1fr 0.5fr;
  gap: 1.6rem;
  padding: 1.6rem 2.4rem;
  border-bottom: 1px solid var(--color-grey-100);
  align-items: center;
  transition: background-color 0.2s;
  &:hover {
    background-color: var(--color-grey-50);
  }
  &:last-child {
    border-bottom: none;
  }
  @media (max-width: 1024px) {
    display: none;
  }
`;

const OrderId = styled.span`
  font-weight: 600;
  color: var(--color-brand-600);
`;

const ClientName = styled.span`
  font-weight: 500;
`;

const Amount = styled.span`
  font-weight: 600;
  color: var(--color-grey-900);
`;

// ── Distributor Cell ──────────────────────────────────────────────────────────

const DistributorCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const DistributorAvatar = styled.div`
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    var(--color-brand-600),
    var(--color-brand-700)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  flex-shrink: 0;
`;

const DistributorName = styled.div`
  display: flex;
  flex-direction: column;
  & .name {
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--color-grey-800);
  }
  & .label {
    font-size: 1.1rem;
    color: var(--color-grey-500);
  }
`;

const UnassignedBadge = styled.span`
  font-size: 1.2rem;
  color: var(--color-grey-400);
  font-style: italic;
`;

// ── Empty State ───────────────────────────────────────────────────────────────

const EmptyState = styled.div`
  padding: 8rem 2rem;
  text-align: center;
  color: var(--color-grey-500);
  & svg {
    width: 10rem;
    height: 10rem;
    margin: 0 auto 2.4rem;
    color: var(--color-grey-300);
  }
  & h3 {
    font-size: 2rem;
    font-weight: 600;
    color: var(--color-grey-700);
    margin-bottom: 0.8rem;
  }
  & p {
    font-size: 1.5rem;
    margin-bottom: 2.4rem;
  }
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  gap: 1.6rem;
  margin-bottom: 2.4rem;
`;

const StatCard = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 1.6rem;
  text-align: center;
  & h3 {
    font-size: 2.4rem;
    font-weight: 700;
    color: var(--color-brand-600);
    margin-bottom: 0.4rem;
  }
  & p {
    font-size: 1.3rem;
    color: var(--color-grey-600);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

// ── Mobile Cards ──────────────────────────────────────────────────────────────

const MobileCardList = styled.div`
  display: none;
  @media (max-width: 1024px) {
    display: flex;
    flex-direction: column;
    gap: 1.6rem;
    padding: 1.6rem;
  }
`;

const MobileCard = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2rem;
  box-shadow: var(--shadow-sm);
`;

const MobileCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.6rem;
  padding-bottom: 1.6rem;
  border-bottom: 1px solid var(--color-grey-200);
`;

const MobileOrderId = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-brand-600);
  margin-bottom: 0.4rem;
`;

const MobileClientName = styled.div`
  font-size: 1.4rem;
  color: var(--color-grey-600);
  font-weight: 500;
`;

const MobileCardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const MobileInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 0;
  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }
`;

const MobileLabel = styled.span`
  font-size: 1.3rem;
  color: var(--color-grey-600);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-brand-600);
    flex-shrink: 0;
  }
`;

const MobileValue = styled.span`
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--color-grey-900);
  text-align: right;
`;

const MobileStatusRow = styled.div`
  display: flex;
  gap: 0.8rem;
  margin-top: 1.2rem;
  padding-top: 1.2rem;
  border-top: 2px solid var(--color-grey-200);
  flex-wrap: wrap;
`;

const MobileActionsRow = styled.div`
  display: flex;
  gap: 0.8rem;
  margin-top: 1.6rem;
`;

const MobileActionButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 1rem 1.6rem;
  background-color: var(--color-grey-0);
  border: 2px solid var(--color-grey-300);
  border-radius: var(--border-radius-sm);
  color: var(--color-grey-700);
  font-size: 1.3rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  & svg {
    width: 1.6rem;
    height: 1.6rem;
  }
  &:hover {
    border-color: var(--color-brand-600);
    color: var(--color-brand-600);
    background-color: var(--color-brand-50);
  }
`;

// ── Status Update Modal ───────────────────────────────────────────────────────

const StatusUpdateContainer = styled.div`
  padding: 2.4rem;
`;

const StatusOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  margin: 2.4rem 0;
`;

const StatusOption = styled.button<{ $selected?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1.6rem;
  padding: 1.6rem;
  background-color: ${(p) =>
    p.$selected ? "var(--color-brand-50)" : "var(--color-grey-0)"};
  border: 2px solid
    ${(p) => (p.$selected ? "var(--color-brand-600)" : "var(--color-grey-300)")};
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  &:hover {
    border-color: var(--color-brand-600);
    background-color: var(--color-brand-50);
  }
  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-brand-600);
  }
`;

const StatusOptionContent = styled.div`
  flex: 1;
  & h4 {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-grey-900);
    margin-bottom: 0.4rem;
  }
  & p {
    font-size: 1.3rem;
    color: var(--color-grey-600);
    margin: 0;
  }
`;

// ─── Types ────────────────────────────────────────────────────────────────────

type Order = {
  id: string;
  orderNumber: string;
  clientId: string;
  client: string;
  products: string;
  amount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  date: string;
  distributorId?: string;
  distributorName?: string;
};

type OrdersProps = {
  userRole?: "admin" | "distributor" | "client";
  userId?: string;
  userName?: string;
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
// clientId    must match Login fillDemoCredentials client  email → "client@taba3ni.tn"
// distributorId must match Login fillDemoCredentials dist email  → "ahmed.mahmoudi@taba3ni.tn"

const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-001",
    clientId: "client@taba3ni.tn",
    client: "Carrefour Lac 2",
    products: "Full Cream Milk (50L), Greek Yogurt (30)",
    amount: 1250,
    status: "out-for-delivery",
    paymentStatus: "unpaid",
    date: "2025-12-28 10:30",
    distributorId: "ahmed.mahmoudi@taba3ni.tn",
    distributorName: "Ahmed Mahmoudi",
  },
  {
    id: "2",
    orderNumber: "ORD-002",
    clientId: "monoprix.menzah@email.com",
    client: "Monoprix Menzah",
    products: "Cheddar Cheese (20kg), Butter (10kg)",
    amount: 890,
    status: "delivered",
    paymentStatus: "paid",
    date: "2025-12-27 09:15",
    distributorId: "karim.belaid@taba3ni.tn",
    distributorName: "Karim Belaid",
  },
  {
    id: "3",
    orderNumber: "ORD-003",
    clientId: "general.marsa@email.com",
    client: "Magasin Général Marsa",
    products: "Full Cream Milk (100L), Greek Yogurt (50)",
    amount: 2100,
    status: "processing",
    paymentStatus: "partial",
    date: "2025-12-25 08:45",
    distributorId: "ahmed.mahmoudi@taba3ni.tn",
    distributorName: "Ahmed Mahmoudi",
  },
  {
    id: "4",
    orderNumber: "ORD-004",
    clientId: "client@taba3ni.tn",
    client: "Carrefour Lac 2",
    products: "Butter (15kg), Whipping Cream (20L)",
    amount: 650,
    status: "pending",
    paymentStatus: "unpaid",
    date: "2025-12-29 11:00",
    // No distributor yet — pending orders not assigned
  },
  {
    id: "5",
    orderNumber: "ORD-005",
    clientId: "superette.ariana@email.com",
    client: "Superette Ariana",
    products: "Skimmed Milk (30L), Greek Yogurt (20)",
    amount: 580,
    status: "processing",
    paymentStatus: "unpaid",
    date: "2025-12-28 14:30",
    distributorId: "ahmed.mahmoudi@taba3ni.tn",
    distributorName: "Ahmed Mahmoudi",
  },
  {
    id: "6",
    orderNumber: "ORD-006",
    clientId: "monoprix.menzah@email.com",
    client: "Monoprix Menzah",
    products: "Full Cream Milk (80L)",
    amount: 1200,
    status: "pending",
    paymentStatus: "unpaid",
    date: "2025-12-20 08:00",
    distributorId: "karim.belaid@taba3ni.tn",
    distributorName: "Karim Belaid",
  },
  {
    id: "7",
    orderNumber: "ORD-007",
    clientId: "client@taba3ni.tn",
    client: "Carrefour Lac 2",
    products: "Greek Yogurt (100), Full Cream Milk (30L)",
    amount: 980,
    status: "delivered",
    paymentStatus: "paid",
    date: "2025-12-15 09:00",
    distributorId: "ahmed.mahmoudi@taba3ni.tn",
    distributorName: "Ahmed Mahmoudi",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getInitials = (name: string) =>
  name
    .trim()
    .split(" ")
    .map((n) => n[0]?.toUpperCase())
    .join("")
    .slice(0, 2);

// ─── Status Update Modal ──────────────────────────────────────────────────────

function StatusUpdateModal({
  orderId,
  currentStatus,
  onUpdate,
  onClose,
}: {
  orderId: string;
  currentStatus: OrderStatus;
  onUpdate: (newStatus: OrderStatus) => void;
  onClose: () => void;
}) {
  const [selectedStatus, setSelectedStatus] =
    useState<OrderStatus>(currentStatus);

  const statusOptions = [
    {
      value: "pending" as OrderStatus,
      label: "Pending",
      description: "Order received, awaiting processing",
      icon: <HiOutlineClock />,
    },
    {
      value: "processing" as OrderStatus,
      label: "Processing",
      description: "Order being prepared",
      icon: <HiOutlineArrowPath />,
    },
    {
      value: "out-for-delivery" as OrderStatus,
      label: "Out for Delivery",
      description: "On the way to customer",
      icon: <HiOutlineTruck />,
    },
    {
      value: "delivered" as OrderStatus,
      label: "Delivered",
      description: "Successfully delivered to customer",
      icon: <HiOutlineCheckCircle />,
    },
    {
      value: "failed" as OrderStatus,
      label: "Failed",
      description: "Delivery unsuccessful",
      icon: <HiOutlineXCircle />,
    },
  ];

  return (
    <StatusUpdateContainer>
      <Heading as="h3">Update Order Status</Heading>
      <p style={{ color: "var(--color-grey-600)", marginBottom: "2.4rem" }}>
        Select the new status for order #{orderId}
      </p>
      <StatusOptions>
        {statusOptions.map((option) => (
          <StatusOption
            key={option.value}
            $selected={selectedStatus === option.value}
            onClick={() => setSelectedStatus(option.value)}
          >
            {option.icon}
            <StatusOptionContent>
              <h4>{option.label}</h4>
              <p>{option.description}</p>
            </StatusOptionContent>
          </StatusOption>
        ))}
      </StatusOptions>
      <ButtonGroup>
        <Button type="button" $variation="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="button"
          onClick={() => {
            onUpdate(selectedStatus);
            onClose();
          }}
          disabled={selectedStatus === currentStatus}
        >
          Update Status
        </Button>
      </ButtonGroup>
    </StatusUpdateContainer>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

function Orders({ userRole = "admin", userId, userName }: OrdersProps) {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  // ── Role-based filtering ────────────────────────────────────────────────────
  const getRoleFilteredOrders = (): Order[] => {
    if (userRole === "client") {
      return orders.filter((o) => o.clientId === userId);
    }
    if (userRole === "distributor") {
      return orders.filter((o) => o.distributorId === userId);
    }
    return orders;
  };

  const roleFilteredOrders = getRoleFilteredOrders();

  // ── Search + status + date filtering ───────────────────────────────────────
  const filteredOrders = roleFilteredOrders.filter((order) => {
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.distributorName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ??
        false);

    let matchesDateRange = true;
    if (dateFrom || dateTo) {
      const orderDate = new Date(order.date);
      if (dateFrom) {
        const from = new Date(dateFrom);
        from.setHours(0, 0, 0, 0);
        matchesDateRange = matchesDateRange && orderDate >= from;
      }
      if (dateTo) {
        const to = new Date(dateTo);
        to.setHours(23, 59, 59, 999);
        matchesDateRange = matchesDateRange && orderDate <= to;
      }
    }
    return matchesStatus && matchesSearch && matchesDateRange;
  });

  // ── Stats ───────────────────────────────────────────────────────────────────
  const stats = {
    total: roleFilteredOrders.length,
    pending: roleFilteredOrders.filter((o) => o.status === "pending").length,
    processing: roleFilteredOrders.filter((o) => o.status === "processing")
      .length,
    delivered: roleFilteredOrders.filter((o) => o.status === "delivered")
      .length,
    failed: roleFilteredOrders.filter((o) => o.status === "failed").length,
  };

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleClearFilters = () => {
    setStatusFilter("all");
    setSearchQuery("");
    setDateFrom("");
    setDateTo("");
    addNotification("Filters Cleared", "All filters have been reset", "info", {
      duration: 3000,
    });
  };

  const handleExport = () => {
    const rows = [
      [
        "Order Number",
        "Client",
        "Distributor",
        "Products",
        "Amount (TND)",
        "Status",
        "Payment Status",
        "Date",
      ],
      ...filteredOrders.map((o) => [
        o.orderNumber,
        o.client,
        o.distributorName || "Unassigned",
        o.products,
        o.amount,
        o.status,
        o.paymentStatus,
        o.date,
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `taba3ni-orders-${userRole}-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    addNotification(
      "✅ Export Successful",
      `Exported ${filteredOrders.length} orders`,
      "success",
      { duration: 4000, persistent: true },
    );
  };

  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
    );
    addNotification(
      "✅ Status Updated",
      `Order status changed to ${newStatus}`,
      "success",
      { duration: 4000, persistent: true },
    );
  };

  const handleCancelOrder = (orderId: string, orderNumber: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    addNotification(
      "✅ Order Cancelled",
      `Order ${orderNumber} has been cancelled`,
      "success",
      { duration: 4000, persistent: true },
    );
  };

  const handleDeleteOrder = (orderId: string, orderNumber: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    addNotification(
      "✅ Order Deleted",
      `Order ${orderNumber} deleted`,
      "success",
      { duration: 4000, persistent: true },
    );
  };

  const getPageTitle = () => {
    if (userRole === "client") return "My Orders";
    if (userRole === "distributor") return "My Deliveries";
    return "Orders Management";
  };

  const hasActiveFilters =
    statusFilter !== "all" || searchQuery || dateFrom || dateTo;

  return (
    <OrdersLayout>
      {/* Header */}
      <Row type="horizontal">
        <Heading as="h1">{getPageTitle()}</Heading>
        {userRole !== "distributor" && (
          <Modal>
            <Modal.Open opens="create-order">
              <Button $size="medium">
                {userRole === "client" ? "+ Place New Order" : "+ New Order"}
              </Button>
            </Modal.Open>
            <Modal.Window name="create-order">
              <OrderForm
                onCloseModal={() => {}}
                userRole={userRole}
                clientId={userRole === "client" ? userId : undefined}
                clientName={userRole === "client" ? userName : undefined}
              />
            </Modal.Window>
          </Modal>
        )}
      </Row>

      {/* Stats */}
      <StatsRow>
        <StatCard>
          <h3>{stats.total}</h3>
          <p>Total {userRole === "distributor" ? "Deliveries" : "Orders"}</p>
        </StatCard>
        <StatCard>
          <h3>{stats.pending}</h3>
          <p>Pending</p>
        </StatCard>
        <StatCard>
          <h3>{stats.processing}</h3>
          <p>Processing</p>
        </StatCard>
        <StatCard>
          <h3>{stats.delivered}</h3>
          <p>Delivered</p>
        </StatCard>
        {userRole === "admin" && (
          <StatCard>
            <h3>{stats.failed}</h3>
            <p>Failed</p>
          </StatCard>
        )}
      </StatsRow>

      {/* Filters */}
      <FiltersBar>
        <SearchBar
          placeholder={
            userRole === "admin"
              ? "Search by order ID, client, or distributor..."
              : "Search by order ID..."
          }
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <DateFilterGroup>
          <label>From:</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
          <label>To:</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </DateFilterGroup>
        <FilterGroup>
          {[
            "all",
            "pending",
            "processing",
            "out-for-delivery",
            "delivered",
            ...(userRole === "admin" ? ["failed"] : []),
          ].map((s) => (
            <FilterButton
              key={s}
              $active={statusFilter === s}
              onClick={() => setStatusFilter(s)}
            >
              {s === "all"
                ? "All"
                : s === "out-for-delivery"
                  ? "Out for Delivery"
                  : s.charAt(0).toUpperCase() + s.slice(1)}
            </FilterButton>
          ))}
        </FilterGroup>
        {hasActiveFilters && (
          <ClearFiltersButton onClick={handleClearFilters}>
            Clear Filters
          </ClearFiltersButton>
        )}
      </FiltersBar>

      {/* Table */}
      <TableCard>
        <TableControls>
          <ResultsCount>
            Showing <strong>{filteredOrders.length}</strong> of{" "}
            <strong>{roleFilteredOrders.length}</strong>{" "}
            {userRole === "distributor" ? "deliveries" : "orders"}
          </ResultsCount>
          <ExportButton
            $variation="secondary"
            $size="medium"
            onClick={handleExport}
          >
            <HiOutlineArrowDownTray />
            Export to CSV
          </ExportButton>
        </TableControls>

        <Table>
          <TableHeader>
            <div>Order ID</div>
            <div>Client</div>
            <div>Distributor</div>
            <div>Products</div>
            <div>Amount</div>
            <div>Status</div>
            <div>Payment</div>
            <div />
          </TableHeader>

          {filteredOrders.length === 0 ? (
            <EmptyState>
              <HiOutlineShoppingCart />
              <h3>
                No {userRole === "distributor" ? "deliveries" : "orders"} found
              </h3>
              <p>
                {roleFilteredOrders.length === 0
                  ? userRole === "client"
                    ? "You haven't placed any orders yet"
                    : userRole === "distributor"
                      ? "No deliveries assigned to you yet"
                      : "No orders in the system yet"
                  : "Try adjusting your filters or search query"}
              </p>
              {userRole === "client" && roleFilteredOrders.length === 0 && (
                <Modal>
                  <Modal.Open opens="create-first-order">
                    <Button $size="medium">+ Place Your First Order</Button>
                  </Modal.Open>
                  <Modal.Window name="create-first-order">
                    <OrderForm
                      onCloseModal={() => {}}
                      userRole={userRole}
                      clientId={userId}
                      clientName={userName}
                    />
                  </Modal.Window>
                </Modal>
              )}
            </EmptyState>
          ) : (
            <>
              {/* ── Desktop Table ── */}
              <Menus>
                {filteredOrders.map((order) => {
                  const orderStatus = getStatusDisplay(order.status);
                  const paymentStatus = getStatusDisplay(order.paymentStatus);

                  return (
                    <TableRow key={order.id}>
                      <OrderId>#{order.orderNumber}</OrderId>

                      <ClientName>{order.client}</ClientName>

                      {/* Distributor column */}
                      <DistributorCell>
                        {order.distributorName ? (
                          <>
                            <DistributorAvatar>
                              {getInitials(order.distributorName)}
                            </DistributorAvatar>
                            <DistributorName>
                              <span className="name">
                                {order.distributorName}
                              </span>
                              <span className="label">Distributor</span>
                            </DistributorName>
                          </>
                        ) : (
                          <UnassignedBadge>Unassigned</UnassignedBadge>
                        )}
                      </DistributorCell>

                      <div
                        style={{
                          fontSize: "1.3rem",
                          color: "var(--color-grey-600)",
                        }}
                      >
                        {order.products}
                      </div>

                      <Amount>{order.amount.toLocaleString()} TND</Amount>

                      <StatusBadge $status={order.status}>
                        {orderStatus.icon} {orderStatus.label}
                      </StatusBadge>

                      <StatusBadge $status={order.paymentStatus}>
                        {paymentStatus.icon} {paymentStatus.label}
                      </StatusBadge>

                      <div>
                        <Modal>
                          <Menus.Menu>
                            <Menus.Toggle id={order.id} />
                            <Menus.List id={order.id}>
                              <Menus.Button
                                icon={<HiOutlineEye />}
                                onClick={() => navigate(`/orders/${order.id}`)}
                              >
                                View Details
                              </Menus.Button>
                              {userRole === "admin" && (
                                <>
                                  <Modal.Open opens={`status-${order.id}`}>
                                    <Menus.Button icon={<HiOutlineArrowPath />}>
                                      Update Status
                                    </Menus.Button>
                                  </Modal.Open>
                                  <Modal.Open opens={`edit-${order.id}`}>
                                    <Menus.Button icon={<HiOutlinePencil />}>
                                      Edit Order
                                    </Menus.Button>
                                  </Modal.Open>
                                  <Modal.Open opens={`delete-${order.id}`}>
                                    <Menus.Button icon={<HiOutlineTrash />}>
                                      Delete Order
                                    </Menus.Button>
                                  </Modal.Open>
                                </>
                              )}
                              {userRole === "client" &&
                                order.status === "pending" && (
                                  <Modal.Open opens={`cancel-${order.id}`}>
                                    <Menus.Button icon={<HiOutlineXCircle />}>
                                      Cancel Order
                                    </Menus.Button>
                                  </Modal.Open>
                                )}
                              {userRole === "distributor" && (
                                <Modal.Open opens={`status-${order.id}`}>
                                  <Menus.Button icon={<HiOutlineTruck />}>
                                    Update Status
                                  </Menus.Button>
                                </Modal.Open>
                              )}
                            </Menus.List>
                          </Menus.Menu>

                          {(userRole === "admin" ||
                            userRole === "distributor") && (
                            <Modal.Window name={`status-${order.id}`}>
                              <StatusUpdateModal
                                orderId={order.orderNumber}
                                currentStatus={order.status}
                                onUpdate={(s) =>
                                  handleStatusUpdate(order.id, s)
                                }
                                onClose={() => {}}
                              />
                            </Modal.Window>
                          )}
                          {userRole === "admin" && (
                            <>
                              <Modal.Window name={`edit-${order.id}`}>
                                <OrderForm
                                  orderToEdit={{
                                    id: order.id,
                                    orderNumber: order.orderNumber,
                                    client: order.client,
                                    deliveryDate: order.date,
                                    products: [
                                      {
                                        productId: "1",
                                        name: "Full Cream Milk (1L)",
                                        quantity: 50,
                                        price: 15,
                                      },
                                    ],
                                    notes: "",
                                  }}
                                  onCloseModal={() => {}}
                                  userRole={userRole}
                                />
                              </Modal.Window>
                              <Modal.Window name={`delete-${order.id}`}>
                                <ConfirmDelete
                                  resourceName={`order ${order.orderNumber}`}
                                  onConfirm={() =>
                                    handleDeleteOrder(
                                      order.id,
                                      order.orderNumber,
                                    )
                                  }
                                  onCloseModal={() => {}}
                                />
                              </Modal.Window>
                            </>
                          )}
                          {userRole === "client" && (
                            <Modal.Window name={`cancel-${order.id}`}>
                              <ConfirmDelete
                                resourceName={`order ${order.orderNumber}`}
                                onConfirm={() =>
                                  handleCancelOrder(order.id, order.orderNumber)
                                }
                                onCloseModal={() => {}}
                              />
                            </Modal.Window>
                          )}
                        </Modal>
                      </div>
                    </TableRow>
                  );
                })}
              </Menus>

              {/* ── Mobile Cards ── */}
              <MobileCardList>
                {filteredOrders.map((order) => {
                  const orderStatus = getStatusDisplay(order.status);
                  const paymentStatus = getStatusDisplay(order.paymentStatus);

                  return (
                    <MobileCard key={order.id}>
                      <MobileCardHeader>
                        <div>
                          <MobileOrderId>#{order.orderNumber}</MobileOrderId>
                          <MobileClientName>{order.client}</MobileClientName>
                        </div>
                      </MobileCardHeader>

                      <MobileCardBody>
                        {/* Show distributor to client & admin */}
                        {userRole !== "distributor" && (
                          <MobileInfoRow>
                            <MobileLabel>
                              <HiOutlineUser />
                              Distributor
                            </MobileLabel>
                            <MobileValue>
                              {order.distributorName ? (
                                <span
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.6rem",
                                  }}
                                >
                                  <DistributorAvatar
                                    style={{
                                      width: "2.4rem",
                                      height: "2.4rem",
                                      fontSize: "0.9rem",
                                    }}
                                  >
                                    {getInitials(order.distributorName)}
                                  </DistributorAvatar>
                                  {order.distributorName}
                                </span>
                              ) : (
                                "Unassigned"
                              )}
                            </MobileValue>
                          </MobileInfoRow>
                        )}
                        <MobileInfoRow>
                          <MobileLabel>
                            <HiOutlineShoppingCart />
                            Products
                          </MobileLabel>
                          <MobileValue
                            style={{
                              fontSize: "1.3rem",
                              textAlign: "right",
                              maxWidth: "18rem",
                            }}
                          >
                            {order.products}
                          </MobileValue>
                        </MobileInfoRow>
                        <MobileInfoRow>
                          <MobileLabel>
                            <HiOutlineCurrencyDollar />
                            Amount
                          </MobileLabel>
                          <MobileValue>
                            {order.amount.toLocaleString()} TND
                          </MobileValue>
                        </MobileInfoRow>
                        <MobileInfoRow>
                          <MobileLabel>
                            <HiOutlineCalendar />
                            Date
                          </MobileLabel>
                          <MobileValue>
                            {new Date(order.date).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </MobileValue>
                        </MobileInfoRow>
                      </MobileCardBody>

                      <MobileStatusRow>
                        <StatusBadge $status={order.status}>
                          {orderStatus.icon} {orderStatus.label}
                        </StatusBadge>
                        <StatusBadge $status={order.paymentStatus}>
                          {paymentStatus.icon} {paymentStatus.label}
                        </StatusBadge>
                      </MobileStatusRow>

                      <MobileActionsRow>
                        <MobileActionButton
                          onClick={() => navigate(`/orders/${order.id}`)}
                        >
                          <HiOutlineEye /> View
                        </MobileActionButton>
                        {userRole === "admin" && (
                          <Modal>
                            <Modal.Open opens={`edit-mobile-${order.id}`}>
                              <MobileActionButton>
                                <HiOutlinePencil /> Edit
                              </MobileActionButton>
                            </Modal.Open>
                            <Modal.Window name={`edit-mobile-${order.id}`}>
                              <OrderForm
                                orderToEdit={{
                                  id: order.id,
                                  orderNumber: order.orderNumber,
                                  client: order.client,
                                  deliveryDate: order.date,
                                  products: [
                                    {
                                      productId: "1",
                                      name: "Full Cream Milk (1L)",
                                      quantity: 50,
                                      price: 15,
                                    },
                                  ],
                                  notes: "",
                                }}
                                onCloseModal={() => {}}
                                userRole={userRole}
                              />
                            </Modal.Window>
                          </Modal>
                        )}
                        {userRole === "distributor" && (
                          <Modal>
                            <Modal.Open opens={`status-mobile-${order.id}`}>
                              <MobileActionButton>
                                <HiOutlineTruck /> Update
                              </MobileActionButton>
                            </Modal.Open>
                            <Modal.Window name={`status-mobile-${order.id}`}>
                              <StatusUpdateModal
                                orderId={order.orderNumber}
                                currentStatus={order.status}
                                onUpdate={(s) =>
                                  handleStatusUpdate(order.id, s)
                                }
                                onClose={() => {}}
                              />
                            </Modal.Window>
                          </Modal>
                        )}
                        {userRole === "client" &&
                          order.status === "pending" && (
                            <Modal>
                              <Modal.Open opens={`cancel-mobile-${order.id}`}>
                                <MobileActionButton>
                                  <HiOutlineXCircle /> Cancel
                                </MobileActionButton>
                              </Modal.Open>
                              <Modal.Window name={`cancel-mobile-${order.id}`}>
                                <ConfirmDelete
                                  resourceName={`order ${order.orderNumber}`}
                                  onConfirm={() =>
                                    handleCancelOrder(
                                      order.id,
                                      order.orderNumber,
                                    )
                                  }
                                  onCloseModal={() => {}}
                                />
                              </Modal.Window>
                            </Modal>
                          )}
                      </MobileActionsRow>
                    </MobileCard>
                  );
                })}
              </MobileCardList>
            </>
          )}
        </Table>
      </TableCard>
    </OrdersLayout>
  );
}

export default Orders;
