import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import {
  HiOutlineTruck,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineMapPin,
  HiOutlineUser,
  HiOutlineCurrencyDollar,
  HiOutlineArrowDownTray,
  HiOutlineXCircle as HiOutlineClear,
  HiOutlineEye,
  HiOutlineArrowPath,
  HiOutlineStar,
  HiOutlineShoppingCart,
  HiOutlineChartBar,
  HiOutlineBuildingStorefront,
} from "react-icons/hi2";
import Heading from "../UI/Heading";
import Row from "../UI/Row";
import Button from "../UI/Button";
import SearchBar from "../UI/SearchBar";
import StatusBadge from "../UI/StatusBadge";
import StatsCard from "../UI/StatsCard";
import { useNotifications } from "../hooks/useNotifications";

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(1rem); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ─── Styled Components ────────────────────────────────────────────────────────

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  animation: ${fadeUp} 0.3s ease-out;
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
  gap: 2rem;
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

const ClearBtn = styled.button`
  padding: 0.8rem 1.6rem;
  background: var(--color-grey-0);
  border: 2px solid var(--color-grey-300);
  color: var(--color-grey-700);
  border-radius: var(--border-radius-sm);
  font-size: 1.3rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  & svg {
    width: 1.6rem;
    height: 1.6rem;
  }
  &:hover {
    border-color: var(--color-red-600);
    color: var(--color-red-600);
    background: var(--color-red-50);
  }
`;

const TableCard = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  overflow: hidden;
  @media (max-width: 1024px) {
    border: none;
    background: transparent;
  }
`;

const TableControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.6rem 2.4rem;
  background: var(--color-grey-50);
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

const ExportBtn = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.4rem;
  & svg {
    width: 1.8rem;
    height: 1.8rem;
  }
`;

// ── Desktop Table ──────────────────────────────────────────────────────────────

const TableScroll = styled.div`
  width: 100%;
  overflow-x: auto;
  @media (max-width: 1024px) {
    overflow-x: visible;
  }
`;

const THeader = styled.div<{ $cols: string }>`
  display: grid;
  grid-template-columns: ${(p) => p.$cols};
  gap: 1.6rem;
  padding: 1.4rem 2.4rem;
  background: var(--color-grey-50);
  font-weight: 600;
  font-size: 1.2rem;
  text-transform: uppercase;
  color: var(--color-grey-500);
  border-bottom: 1px solid var(--color-grey-100);
  @media (max-width: 1024px) {
    display: none;
  }
`;

const TRow = styled.div<{ $cols: string }>`
  display: grid;
  grid-template-columns: ${(p) => p.$cols};
  gap: 1.6rem;
  padding: 1.6rem 2.4rem;
  border-bottom: 1px solid var(--color-grey-100);
  align-items: center;
  transition: background 0.15s;
  &:hover {
    background: var(--color-grey-50);
  }
  &:last-child {
    border-bottom: none;
  }
  @media (max-width: 1024px) {
    display: none;
  }
`;

const IDSpan = styled.span`
  font-weight: 700;
  color: var(--color-brand-600);
  font-size: 1.3rem;
`;

const TwoLine = styled.div`
  & .primary {
    font-size: 1.4rem;
    font-weight: 600;
    color: var(--color-grey-900);
  }
  & .secondary {
    font-size: 1.2rem;
    color: var(--color-grey-500);
    margin-top: 0.2rem;
  }
`;

const ActionBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.4rem;
  height: 3.4rem;
  border-radius: var(--border-radius-sm);
  border: 1.5px solid var(--color-grey-200);
  background: var(--color-grey-0);
  color: var(--color-grey-600);
  cursor: pointer;
  transition: all 0.18s;
  & svg {
    width: 1.8rem;
    height: 1.8rem;
  }
  &:hover {
    border-color: var(--color-brand-400);
    color: var(--color-brand-600);
    background: var(--color-brand-50);
  }
`;

// ── Mobile Cards ──────────────────────────────────────────────────────────────

const MobileList = styled.div`
  display: none;
  @media (max-width: 1024px) {
    display: flex;
    flex-direction: column;
    gap: 1.6rem;
    padding: 1.6rem;
  }
`;

const MobileCard = styled.div`
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2rem;
  box-shadow: var(--shadow-sm);
`;

const MobileCardTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.4rem;
  padding-bottom: 1.4rem;
  border-bottom: 1px solid var(--color-grey-100);
`;

const MobileInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.7rem 0;
  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-50);
  }
`;

const MobileLabel = styled.span`
  font-size: 1.3rem;
  color: var(--color-grey-500);
  display: flex;
  align-items: center;
  gap: 0.6rem;
  & svg {
    width: 1.5rem;
    height: 1.5rem;
    color: var(--color-brand-500);
  }
`;

const MobileValue = styled.span`
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--color-grey-800);
`;

const MobileFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.4rem;
  padding-top: 1.2rem;
  border-top: 2px solid var(--color-grey-100);
`;

// ── Empty State ───────────────────────────────────────────────────────────────

const EmptyState = styled.div`
  padding: 8rem 2rem;
  text-align: center;
  & svg {
    width: 8rem;
    height: 8rem;
    margin: 0 auto 2rem;
    color: var(--color-grey-300);
  }
  & h3 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-grey-700);
    margin-bottom: 0.8rem;
  }
  & p {
    font-size: 1.4rem;
    color: var(--color-grey-500);
  }
`;

// ── Distributor Performance Card ──────────────────────────────────────────────

const PerfGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: 1.6rem;
`;

const PerfCard = styled.div`
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2rem;
  text-align: center;
`;

const PerfValue = styled.div`
  font-size: 3.2rem;
  font-weight: 800;
  color: var(--color-brand-600);
  line-height: 1;
  margin-bottom: 0.6rem;
`;

const PerfLabel = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-grey-500);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StarRating = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  margin-top: 0.6rem;
  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-yellow-500);
    fill: var(--color-yellow-500);
  }
`;

// ── Client Reorder button ─────────────────────────────────────────────────────

const ReorderBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.7rem 1.4rem;
  background: var(--color-brand-600);
  color: white;
  border: none;
  border-radius: var(--border-radius-sm);
  font-size: 1.3rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s;
  & svg {
    width: 1.5rem;
    height: 1.5rem;
  }
  &:hover {
    background: var(--color-brand-700);
    transform: translateY(-1px);
  }
`;

// ─── Types ────────────────────────────────────────────────────────────────────

type HistoryEntry = {
  id: string;
  deliveryId: string;
  orderId: string;
  clientId: string;
  clientName: string;
  clientAddress: string;
  distributorId: string;
  distributorName: string;
  completedDate: string;
  scheduledDate: string;
  status: "completed" | "failed";
  orderCount: number;
  totalAmount: number;
  distanceKm: number;
  durationMin: number;
  rating?: number; // 1-5, only on completed
  failureReason?: string;
};

type HistoryProps = {
  userRole?: "admin" | "distributor" | "client";
  userId?: string;
  userName?: string;
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockHistory: HistoryEntry[] = [
  {
    id: "1",
    deliveryId: "DEL-003",
    orderId: "ORD-003",
    clientId: "general.marsa@email.com",
    clientName: "Magasin Général Marsa",
    clientAddress: "Rue de la République, La Marsa",
    distributorId: "ahmed.mahmoudi@taba3ni.tn",
    distributorName: "Ahmed Mahmoudi",
    completedDate: "2025-12-28 16:15",
    scheduledDate: "2025-12-28 16:00",
    status: "completed",
    orderCount: 1,
    totalAmount: 1500,
    distanceKm: 8.2,
    durationMin: 18,
    rating: 5,
  },
  {
    id: "2",
    deliveryId: "DEL-007",
    orderId: "ORD-007",
    clientId: "client@taba3ni.tn",
    clientName: "Carrefour Lac 2",
    clientAddress: "Avenue de la Bourse, Lac 2, Tunis",
    distributorId: "ahmed.mahmoudi@taba3ni.tn",
    distributorName: "Ahmed Mahmoudi",
    completedDate: "2025-12-16 10:20",
    scheduledDate: "2025-12-16 10:00",
    status: "completed",
    orderCount: 2,
    totalAmount: 980,
    distanceKm: 12.5,
    durationMin: 25,
    rating: 4,
  },
  {
    id: "3",
    deliveryId: "DEL-004",
    orderId: "ORD-004-old",
    clientId: "superette.ariana@email.com",
    clientName: "Superette Ariana",
    clientAddress: "Avenue de la Liberté, Ariana",
    distributorId: "mohamed.trabelsi@taba3ni.tn",
    distributorName: "Mohamed Trabelsi",
    completedDate: "2025-12-27 10:45",
    scheduledDate: "2025-12-27 10:00",
    status: "failed",
    orderCount: 1,
    totalAmount: 890,
    distanceKm: 6.0,
    durationMin: 20,
    failureReason: "Client not available",
  },
  {
    id: "4",
    deliveryId: "DEL-008",
    orderId: "ORD-002",
    clientId: "monoprix.menzah@email.com",
    clientName: "Monoprix Menzah",
    clientAddress: "Avenue Habib Bourguiba, Ariana",
    distributorId: "karim.belaid@taba3ni.tn",
    distributorName: "Karim Belaid",
    completedDate: "2025-12-27 15:50",
    scheduledDate: "2025-12-27 15:30",
    status: "completed",
    orderCount: 2,
    totalAmount: 2100,
    distanceKm: 10.1,
    durationMin: 22,
    rating: 5,
  },
  {
    id: "5",
    deliveryId: "DEL-009",
    orderId: "ORD-009",
    clientId: "client@taba3ni.tn",
    clientName: "Carrefour Lac 2",
    clientAddress: "Avenue de la Bourse, Lac 2, Tunis",
    distributorId: "ahmed.mahmoudi@taba3ni.tn",
    distributorName: "Ahmed Mahmoudi",
    completedDate: "2025-12-10 11:30",
    scheduledDate: "2025-12-10 11:00",
    status: "completed",
    orderCount: 3,
    totalAmount: 3200,
    distanceKm: 12.5,
    durationMin: 28,
    rating: 5,
  },
  {
    id: "6",
    deliveryId: "DEL-010",
    orderId: "ORD-010",
    clientId: "general.marsa@email.com",
    clientName: "Magasin Général Marsa",
    clientAddress: "Rue de la République, La Marsa",
    distributorId: "karim.belaid@taba3ni.tn",
    distributorName: "Karim Belaid",
    completedDate: "2025-12-05 14:00",
    scheduledDate: "2025-12-05 13:30",
    status: "completed",
    orderCount: 1,
    totalAmount: 750,
    distanceKm: 14.3,
    durationMin: 32,
    rating: 4,
  },
  {
    id: "7",
    deliveryId: "DEL-011",
    orderId: "ORD-011",
    clientId: "client@taba3ni.tn",
    clientName: "Carrefour Lac 2",
    clientAddress: "Avenue de la Bourse, Lac 2, Tunis",
    distributorId: "ahmed.mahmoudi@taba3ni.tn",
    distributorName: "Ahmed Mahmoudi",
    completedDate: "2025-11-28 09:45",
    scheduledDate: "2025-11-28 09:30",
    status: "completed",
    orderCount: 2,
    totalAmount: 1650,
    distanceKm: 12.5,
    durationMin: 24,
    rating: 5,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StarDisplay({ rating }: { rating: number }) {
  return (
    <StarRating>
      {[1, 2, 3, 4, 5].map((s) => (
        <HiOutlineStar
          key={s}
          style={{
            opacity: s <= rating ? 1 : 0.2,
            fill: s <= rating ? "var(--color-yellow-500)" : "none",
          }}
        />
      ))}
    </StarRating>
  );
}

function formatDate(str: string) {
  return new Date(str).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Main Component ───────────────────────────────────────────────────────────

function DeliveryHistory({
  userRole = "admin",
  userId,
  userName,
}: HistoryProps) {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // ── Role filtering ──────────────────────────────────────────────────────────
  const roleFiltered = mockHistory.filter((h) => {
    if (userRole === "distributor") return h.distributorId === userId;
    if (userRole === "client") return h.clientId === userId;
    return true; // admin sees all
  });

  // ── Search + status + date ──────────────────────────────────────────────────
  const filtered = roleFiltered.filter((h) => {
    const matchesStatus = statusFilter === "all" || h.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      h.deliveryId.toLowerCase().includes(q) ||
      h.clientName.toLowerCase().includes(q) ||
      h.distributorName.toLowerCase().includes(q) ||
      h.orderId.toLowerCase().includes(q);

    let matchesDate = true;
    if (dateFrom || dateTo) {
      const d = new Date(h.completedDate);
      if (dateFrom) {
        const f = new Date(dateFrom);
        f.setHours(0, 0, 0, 0);
        matchesDate = matchesDate && d >= f;
      }
      if (dateTo) {
        const t = new Date(dateTo);
        t.setHours(23, 59, 59, 999);
        matchesDate = matchesDate && d <= t;
      }
    }
    return matchesStatus && matchesSearch && matchesDate;
  });

  // ── Stats ───────────────────────────────────────────────────────────────────
  const completed = roleFiltered.filter((h) => h.status === "completed");
  const failed = roleFiltered.filter((h) => h.status === "failed");
  const totalRevenue = completed.reduce((s, h) => s + h.totalAmount, 0);
  const totalKm = completed.reduce((s, h) => s + h.distanceKm, 0);
  const avgRating = completed
    .filter((h) => h.rating)
    .reduce((s, h, _, a) => s + (h.rating ?? 0) / a.length, 0);
  const successRate =
    roleFiltered.length > 0
      ? Math.round((completed.length / roleFiltered.length) * 100)
      : 0;

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleClearFilters = () => {
    setStatusFilter("all");
    setSearchQuery("");
    setDateFrom("");
    setDateTo("");
    addNotification("Filters Cleared", "All filters reset", "info", {
      duration: 3000,
    });
  };

  const handleExport = () => {
    const rows = [
      [
        "Delivery ID",
        "Order ID",
        "Client",
        "Distributor",
        "Completed",
        "Status",
        "Orders",
        "Amount (TND)",
        "Distance (km)",
        "Duration (min)",
        "Rating",
      ],
      ...filtered.map((h) => [
        h.deliveryId,
        h.orderId,
        h.clientName,
        h.distributorName,
        h.completedDate,
        h.status,
        h.orderCount,
        h.totalAmount,
        h.distanceKm,
        h.durationMin,
        h.rating ?? "N/A",
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `taba3ni-history-${userRole}-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    addNotification(
      "✅ Export Successful",
      `Exported ${filtered.length} records`,
      "success",
      { duration: 4000, persistent: true },
    );
  };

  const handleReorder = (entry: HistoryEntry) => {
    navigate("/new-order");
    addNotification(
      "🛒 Reorder",
      `Starting a new order based on ${entry.deliveryId}`,
      "info",
      { duration: 3000 },
    );
  };

  const hasActiveFilters =
    statusFilter !== "all" || searchQuery || dateFrom || dateTo;

  // ── Page title ──────────────────────────────────────────────────────────────
  const pageTitle =
    userRole === "distributor"
      ? "My Delivery History"
      : userRole === "client"
        ? "My Order History"
        : "Delivery History";

  // ── Column layouts per role ─────────────────────────────────────────────────
  // admin:       ID | Client | Distributor | Date | Orders | Amount | Status | Actions
  // distributor: ID | Client | Date | Distance | Duration | Amount | Rating | Status
  // client:      ID | Date | Orders | Amount | Status | Reorder

  const adminCols = "1fr 2fr 1.6fr 1.8fr 0.8fr 1fr 1fr 0.4fr";
  const distCols = "1fr 2fr 1.8fr 1fr 1fr 1fr 1.2fr 1fr";
  const clientCols = "1fr 1.8fr 0.8fr 1fr 1fr 1fr";

  const cols =
    userRole === "distributor"
      ? distCols
      : userRole === "client"
        ? clientCols
        : adminCols;

  return (
    <Layout>
      {/* Header */}
      <Row type="horizontal">
        <Heading as="h1">{pageTitle}</Heading>
        <ExportBtn $variation="secondary" $size="medium" onClick={handleExport}>
          <HiOutlineArrowDownTray />
          Export CSV
        </ExportBtn>
      </Row>

      {/* Stats */}
      <StatsRow>
        <StatsCard
          title="Total Deliveries"
          value={roleFiltered.length}
          icon={<HiOutlineTruck />}
          color="var(--color-brand-600)"
        />
        <StatsCard
          title="Completed"
          value={completed.length}
          icon={<HiOutlineCheckCircle />}
          color="var(--color-green-700)"
        />
        <StatsCard
          title="Failed"
          value={failed.length}
          icon={<HiOutlineXCircle />}
          color="var(--color-red-700)"
        />
        {userRole === "distributor" && (
          <>
            <StatsCard
              title="Total Distance"
              value={`${totalKm.toFixed(0)} km`}
              icon={<HiOutlineMapPin />}
              color="var(--color-blue-700)"
            />
            <StatsCard
              title="Avg Rating"
              value={avgRating > 0 ? avgRating.toFixed(1) : "—"}
              icon={<HiOutlineStar />}
              color="var(--color-yellow-700)"
            />
          </>
        )}
        {userRole !== "distributor" && (
          <StatsCard
            title={userRole === "client" ? "Total Spent" : "Total Revenue"}
            value={`${totalRevenue.toLocaleString()} TND`}
            icon={<HiOutlineCurrencyDollar />}
            color="var(--color-green-700)"
          />
        )}
        <StatsCard
          title="Success Rate"
          value={`${successRate}%`}
          icon={<HiOutlineChartBar />}
          color={
            successRate >= 90
              ? "var(--color-green-700)"
              : successRate >= 70
                ? "var(--color-yellow-700)"
                : "var(--color-red-700)"
          }
        />
      </StatsRow>

      {/* Distributor performance breakdown */}
      {userRole === "distributor" && completed.length > 0 && (
        <div>
          <Heading as="h2" style={{ marginBottom: "1.6rem" }}>
            Performance Overview
          </Heading>
          <PerfGrid>
            <PerfCard>
              <PerfValue>{completed.length}</PerfValue>
              <PerfLabel>Deliveries Completed</PerfLabel>
            </PerfCard>
            <PerfCard>
              <PerfValue>{totalKm.toFixed(0)}</PerfValue>
              <PerfLabel>Total km Covered</PerfLabel>
            </PerfCard>
            <PerfCard>
              <PerfValue>
                {Math.round(
                  completed.reduce((s, h) => s + h.durationMin, 0) /
                    completed.length,
                )}
              </PerfValue>
              <PerfLabel>Avg Delivery Time (min)</PerfLabel>
            </PerfCard>
            <PerfCard>
              <PerfValue style={{ fontSize: "2.4rem" }}>
                {avgRating > 0 ? avgRating.toFixed(1) : "—"}
              </PerfValue>
              <PerfLabel>Average Rating</PerfLabel>
              {avgRating > 0 && <StarDisplay rating={Math.round(avgRating)} />}
            </PerfCard>
            <PerfCard>
              <PerfValue>{successRate}%</PerfValue>
              <PerfLabel>Success Rate</PerfLabel>
            </PerfCard>
            <PerfCard>
              <PerfValue style={{ fontSize: "2rem" }}>
                {totalRevenue.toLocaleString()}
              </PerfValue>
              <PerfLabel>Total TND Delivered</PerfLabel>
            </PerfCard>
          </PerfGrid>
        </div>
      )}

      {/* Filters */}
      <FiltersBar>
        <SearchBar
          placeholder={
            userRole === "client"
              ? "Search by order ID or delivery ID..."
              : userRole === "distributor"
                ? "Search by delivery ID or client..."
                : "Search by delivery ID, client, or distributor..."
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
          {["all", "completed", "failed"].map((s) => (
            <FilterButton
              key={s}
              $active={statusFilter === s}
              onClick={() => setStatusFilter(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </FilterButton>
          ))}
        </FilterGroup>
        {hasActiveFilters && (
          <ClearBtn onClick={handleClearFilters}>
            <HiOutlineClear />
            Clear
          </ClearBtn>
        )}
      </FiltersBar>

      {/* Table */}
      <TableCard>
        <TableControls>
          <ResultsCount>
            Showing <strong>{filtered.length}</strong> of{" "}
            <strong>{roleFiltered.length}</strong> records
          </ResultsCount>
        </TableControls>

        <TableScroll>
          {/* ── Admin table ── */}
          {userRole === "admin" && (
            <>
              <THeader $cols={adminCols}>
                <div>Delivery ID</div>
                <div>Client</div>
                <div>Distributor</div>
                <div>Completed</div>
                <div>Orders</div>
                <div>Amount</div>
                <div>Status</div>
                <div />
              </THeader>
              {filtered.length === 0 ? (
                <EmptyState>
                  <HiOutlineTruck />
                  <h3>No records found</h3>
                  <p>Try adjusting your filters.</p>
                </EmptyState>
              ) : (
                filtered.map((h) => (
                  <TRow key={h.id} $cols={adminCols}>
                    <IDSpan>#{h.deliveryId}</IDSpan>
                    <TwoLine>
                      <div className="primary">{h.clientName}</div>
                      <div className="secondary">{h.clientAddress}</div>
                    </TwoLine>
                    <TwoLine>
                      <div className="primary">{h.distributorName}</div>
                    </TwoLine>
                    <div
                      style={{
                        fontSize: "1.3rem",
                        color: "var(--color-grey-600)",
                      }}
                    >
                      {formatDate(h.completedDate)}
                    </div>
                    <div style={{ fontWeight: 600 }}>{h.orderCount}</div>
                    <div style={{ fontWeight: 600 }}>
                      {h.totalAmount.toLocaleString()} TND
                    </div>
                    <StatusBadge
                      $status={
                        h.status === "completed" ? "delivered" : "failed"
                      }
                    >
                      {h.status === "completed" ? "✓ Completed" : "✗ Failed"}
                    </StatusBadge>
                    <ActionBtn
                      title="View delivery"
                      onClick={() => navigate(`/deliveryDetails/${h.id}`)}
                    >
                      <HiOutlineEye />
                    </ActionBtn>
                  </TRow>
                ))
              )}
            </>
          )}

          {/* ── Distributor table ── */}
          {userRole === "distributor" && (
            <>
              <THeader $cols={distCols}>
                <div>Delivery</div>
                <div>Client</div>
                <div>Completed</div>
                <div>Distance</div>
                <div>Duration</div>
                <div>Amount</div>
                <div>Rating</div>
                <div>Status</div>
              </THeader>
              {filtered.length === 0 ? (
                <EmptyState>
                  <HiOutlineTruck />
                  <h3>No history yet</h3>
                  <p>Completed deliveries will appear here.</p>
                </EmptyState>
              ) : (
                filtered.map((h) => (
                  <TRow key={h.id} $cols={distCols}>
                    <IDSpan>#{h.deliveryId}</IDSpan>
                    <TwoLine>
                      <div className="primary">{h.clientName}</div>
                      <div className="secondary">
                        {h.clientAddress.split(",")[1]?.trim()}
                      </div>
                    </TwoLine>
                    <div
                      style={{
                        fontSize: "1.3rem",
                        color: "var(--color-grey-600)",
                      }}
                    >
                      {formatDate(h.completedDate)}
                    </div>
                    <div style={{ fontWeight: 600 }}>{h.distanceKm} km</div>
                    <div style={{ fontWeight: 600 }}>{h.durationMin} min</div>
                    <div
                      style={{
                        fontWeight: 700,
                        color: "var(--color-grey-900)",
                      }}
                    >
                      {h.totalAmount.toLocaleString()} TND
                    </div>
                    <div>
                      {h.rating ? (
                        <StarDisplay rating={h.rating} />
                      ) : (
                        <span
                          style={{
                            color: "var(--color-grey-400)",
                            fontSize: "1.2rem",
                          }}
                        >
                          —
                        </span>
                      )}
                    </div>
                    <StatusBadge
                      $status={
                        h.status === "completed" ? "delivered" : "failed"
                      }
                    >
                      {h.status === "completed" ? "✓ Done" : "✗ Failed"}
                    </StatusBadge>
                  </TRow>
                ))
              )}
            </>
          )}

          {/* ── Client table ── */}
          {userRole === "client" && (
            <>
              <THeader $cols={clientCols}>
                <div>Order</div>
                <div>Delivered</div>
                <div>Items</div>
                <div>Amount</div>
                <div>Status</div>
                <div>Action</div>
              </THeader>
              {filtered.length === 0 ? (
                <EmptyState>
                  <HiOutlineShoppingCart />
                  <h3>No order history yet</h3>
                  <p>Your completed deliveries will appear here.</p>
                </EmptyState>
              ) : (
                filtered.map((h) => (
                  <TRow key={h.id} $cols={clientCols}>
                    <TwoLine>
                      <div
                        className="primary"
                        style={{
                          color: "var(--color-brand-600)",
                          fontWeight: 700,
                        }}
                      >
                        #{h.orderId}
                      </div>
                      <div className="secondary">#{h.deliveryId}</div>
                    </TwoLine>
                    <div
                      style={{
                        fontSize: "1.3rem",
                        color: "var(--color-grey-600)",
                      }}
                    >
                      {formatDate(h.completedDate)}
                    </div>
                    <div style={{ fontWeight: 600 }}>{h.orderCount}</div>
                    <div
                      style={{
                        fontWeight: 700,
                        color: "var(--color-grey-900)",
                      }}
                    >
                      {h.totalAmount.toLocaleString()} TND
                    </div>
                    <StatusBadge
                      $status={
                        h.status === "completed" ? "delivered" : "failed"
                      }
                    >
                      {h.status === "completed" ? "✓ Delivered" : "✗ Failed"}
                    </StatusBadge>
                    {h.status === "completed" && (
                      <ReorderBtn onClick={() => handleReorder(h)}>
                        <HiOutlineArrowPath />
                        Reorder
                      </ReorderBtn>
                    )}
                  </TRow>
                ))
              )}
            </>
          )}
        </TableScroll>

        {/* Mobile Cards — same for all roles */}
        <MobileList>
          {filtered.length === 0 ? (
            <EmptyState>
              <HiOutlineTruck />
              <h3>No records found</h3>
              <p>Try adjusting your filters.</p>
            </EmptyState>
          ) : (
            filtered.map((h) => (
              <MobileCard key={h.id}>
                <MobileCardTop>
                  <TwoLine>
                    <div
                      className="primary"
                      style={{
                        fontSize: "1.6rem",
                        color: "var(--color-brand-600)",
                        fontWeight: 700,
                      }}
                    >
                      #{h.deliveryId}
                    </div>
                    <div
                      className="secondary"
                      style={{
                        fontSize: "1.3rem",
                        color: "var(--color-grey-500)",
                        marginTop: "0.3rem",
                      }}
                    >
                      {h.clientName}
                    </div>
                  </TwoLine>
                  <StatusBadge
                    $status={h.status === "completed" ? "delivered" : "failed"}
                  >
                    {h.status === "completed" ? "✓ Done" : "✗ Failed"}
                  </StatusBadge>
                </MobileCardTop>

                <MobileInfoRow>
                  <MobileLabel>
                    <HiOutlineCalendar />
                    Completed
                  </MobileLabel>
                  <MobileValue>{formatDate(h.completedDate)}</MobileValue>
                </MobileInfoRow>

                {userRole !== "client" && (
                  <MobileInfoRow>
                    <MobileLabel>
                      <HiOutlineUser />
                      Distributor
                    </MobileLabel>
                    <MobileValue>{h.distributorName}</MobileValue>
                  </MobileInfoRow>
                )}

                <MobileInfoRow>
                  <MobileLabel>
                    <HiOutlineShoppingCart />
                    Orders
                  </MobileLabel>
                  <MobileValue>{h.orderCount}</MobileValue>
                </MobileInfoRow>

                <MobileInfoRow>
                  <MobileLabel>
                    <HiOutlineCurrencyDollar />
                    Amount
                  </MobileLabel>
                  <MobileValue>
                    {h.totalAmount.toLocaleString()} TND
                  </MobileValue>
                </MobileInfoRow>

                {userRole === "distributor" && (
                  <>
                    <MobileInfoRow>
                      <MobileLabel>
                        <HiOutlineMapPin />
                        Distance
                      </MobileLabel>
                      <MobileValue>{h.distanceKm} km</MobileValue>
                    </MobileInfoRow>
                    {h.rating && (
                      <MobileInfoRow>
                        <MobileLabel>
                          <HiOutlineStar />
                          Rating
                        </MobileLabel>
                        <MobileValue>
                          <StarDisplay rating={h.rating} />
                        </MobileValue>
                      </MobileInfoRow>
                    )}
                  </>
                )}

                {h.failureReason && (
                  <MobileInfoRow>
                    <MobileLabel>
                      <HiOutlineXCircle />
                      Reason
                    </MobileLabel>
                    <MobileValue style={{ color: "var(--color-red-600)" }}>
                      {h.failureReason}
                    </MobileValue>
                  </MobileInfoRow>
                )}

                <MobileFooter>
                  {userRole === "admin" && (
                    <ActionBtn
                      onClick={() => navigate(`/deliveryDetails/${h.id}`)}
                    >
                      <HiOutlineEye />
                    </ActionBtn>
                  )}
                  {userRole === "client" && h.status === "completed" && (
                    <ReorderBtn onClick={() => handleReorder(h)}>
                      <HiOutlineArrowPath />
                      Reorder
                    </ReorderBtn>
                  )}
                  {userRole === "distributor" && (
                    <span
                      style={{
                        fontSize: "1.2rem",
                        color: "var(--color-grey-400)",
                      }}
                    >
                      {h.durationMin} min delivery
                    </span>
                  )}
                </MobileFooter>
              </MobileCard>
            ))
          )}
        </MobileList>
      </TableCard>
    </Layout>
  );
}

export default DeliveryHistory;
