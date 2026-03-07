import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineTruck,
  HiOutlineClock,
  HiOutlineUser,
  HiOutlineShoppingCart,
  HiOutlineCurrencyDollar,
  HiOutlineCalendar,
  HiOutlineArrowDownTray,
  HiOutlineXCircle,
} from "react-icons/hi2";
import Heading from "../UI/Heading";
import Row from "../UI/Row";
import Button from "../UI/Button";
import SearchBar from "../UI/SearchBar";
import Menus from "../UI/Menus";
import Modal from "../UI/Modal";
import ConfirmDelete from "../UI/ConfirmDelete";
import StatsCard from "../UI/StatsCard";
import StatusBadge from "../UI/StatusBadge";
import DeliveryForm from "../components/DeliveryForm";

import { useNotifications } from "../hooks/useNotifications";

// Styled Components
const DeliveriesLayout = styled.div`
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
    ${(props) =>
      props.$active ? "var(--color-brand-600)" : "var(--color-grey-300)"};
  background-color: ${(props) =>
    props.$active ? "var(--color-brand-50)" : "var(--color-grey-0)"};
  color: ${(props) =>
    props.$active ? "var(--color-brand-600)" : "var(--color-grey-600)"};
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
    justify-content: center;
  }
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
  gap: 2.4rem;
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
  grid-template-columns: 1fr 2fr 1.5fr 1.5fr 1fr 1fr 1fr 0.5fr;
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
  grid-template-columns: 1fr 2fr 1.5fr 1.5fr 1fr 1fr 1fr 0.5fr;
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

const DeliveryId = styled.span`
  font-weight: 600;
  color: var(--color-brand-600);
`;

const ClientInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const ClientName = styled.span`
  font-weight: 600;
  font-size: 1.4rem;
`;

const ClientAddress = styled.span`
  font-size: 1.2rem;
  color: var(--color-grey-500);
`;

const DistributorInfo = styled.div`
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
  font-size: 1.2rem;
`;

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

// Mobile Card View Components
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
  transition: all 0.2s;

  &:active {
    transform: scale(0.98);
    box-shadow: var(--shadow-md);
  }
`;

const MobileCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.6rem;
  padding-bottom: 1.6rem;
  border-bottom: 1px solid var(--color-grey-200);
`;

const MobileDeliveryId = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-brand-600);
  margin-bottom: 0.4rem;
`;

const MobileClientName = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-grey-900);
  margin-bottom: 0.4rem;
`;

const MobileClientAddress = styled.div`
  font-size: 1.3rem;
  color: var(--color-grey-500);
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

const MobileDistributorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const MobileDistributorAvatar = styled.div`
  width: 3.6rem;
  height: 3.6rem;
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
  font-size: 1.4rem;
`;

const MobileDistributorName = styled.div`
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--color-grey-900);
`;

const MobileStatusRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.2rem;
  padding-top: 1.2rem;
  border-top: 2px solid var(--color-grey-200);
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

  &:active {
    transform: scale(0.95);
  }
`;

// Types
type DeliveryStatus = "scheduled" | "in-progress" | "completed" | "failed";

type Delivery = {
  id: string;
  deliveryId: string;
  orderId: string;
  clientId: string; // NEW: For client filtering
  client: {
    name: string;
    address: string;
    city: string;
  };
  distributorId: string; // NEW: For distributor filtering
  distributor: {
    name: string;
    phone: string;
  };
  scheduledTime: string;
  deliveredTime?: string;
  status: DeliveryStatus;
  orderCount: number;
  totalAmount: number;
};

type DeliveriesProps = {
  userRole?: "admin" | "distributor" | "client";
  userId?: string;
  userName?: string;
};

// Mock Data - UPDATED with clientId and distributorId (using emails)
const mockDeliveries: Delivery[] = [
  {
    id: "1",
    deliveryId: "DEL-001",
    orderId: "ORD-001",
    clientId: "client@taba3ni.tn", // Email-based ID
    client: {
      name: "Carrefour Lac 2",
      address: "Avenue de la Bourse, Lac 2",
      city: "Tunis",
    },
    distributorId: "ahmed.mahmoudi@taba3ni.tn", // Email-based ID
    distributor: {
      name: "Ahmed Mahmoudi",
      phone: "+216 98 123 456",
    },
    scheduledTime: "2025-12-29 14:00",
    status: "in-progress",
    orderCount: 3,
    totalAmount: 3450,
  },
  {
    id: "2",
    deliveryId: "DEL-002",
    orderId: "ORD-002",
    clientId: "monoprix.menzah@email.com",
    client: {
      name: "Monoprix Menzah",
      address: "Avenue Habib Bourguiba",
      city: "Ariana",
    },
    distributorId: "karim.belaid@taba3ni.tn",
    distributor: {
      name: "Karim Belaid",
      phone: "+216 98 234 567",
    },
    scheduledTime: "2025-12-29 15:30",
    status: "scheduled",
    orderCount: 2,
    totalAmount: 2100,
  },
  {
    id: "3",
    deliveryId: "DEL-003",
    orderId: "ORD-003",
    clientId: "general.marsa@email.com",
    client: {
      name: "Magasin Général Marsa",
      address: "Rue de la République",
      city: "La Marsa",
    },
    distributorId: "ahmed.mahmoudi@taba3ni.tn",
    distributor: {
      name: "Ahmed Mahmoudi",
      phone: "+216 98 123 456",
    },
    scheduledTime: "2025-12-28 16:00",
    deliveredTime: "2025-12-28 16:15",
    status: "completed",
    orderCount: 1,
    totalAmount: 1500,
  },
  {
    id: "4",
    deliveryId: "DEL-004",
    orderId: "ORD-004",
    clientId: "superette.ariana@email.com",
    client: {
      name: "Superette Ariana",
      address: "Avenue de la Liberté",
      city: "Ariana",
    },
    distributorId: "mohamed.trabelsi@taba3ni.tn",
    distributor: {
      name: "Mohamed Trabelsi",
      phone: "+216 98 345 678",
    },
    scheduledTime: "2025-12-27 10:00",
    status: "failed",
    orderCount: 1,
    totalAmount: 890,
  },
  {
    id: "5",
    deliveryId: "DEL-005",
    orderId: "ORD-005",
    clientId: "client@taba3ni.tn", // Same client, another delivery
    client: {
      name: "Carrefour Lac 2",
      address: "Avenue de la Bourse, Lac 2",
      city: "Tunis",
    },
    distributorId: "karim.belaid@taba3ni.com",
    distributor: {
      name: "Karim Belaid",
      phone: "+216 98 234 567",
    },
    scheduledTime: "2025-12-30 09:00",
    status: "scheduled",
    orderCount: 2,
    totalAmount: 1800,
  },
];

function Deliveries({ userRole = "admin", userId, userName }: DeliveriesProps) {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  // ALL state at the top — before any function that references them
  const [deliveries, setDeliveries] = useState<Delivery[]>(mockDeliveries);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // ROLE-BASED DATA FILTERING
  const getRoleFilteredDeliveries = (): Delivery[] => {
    if (userRole === "client") {
      return deliveries.filter((d) => d.clientId === userId);
    }
    if (userRole === "distributor") {
      return deliveries.filter((d) => d.distributorId === userId);
    }
    return deliveries;
  };

  const roleFilteredDeliveries = getRoleFilteredDeliveries();

  // Filter deliveries by status, search, and date range
  const filteredDeliveries = roleFilteredDeliveries.filter((delivery) => {
    const matchesStatus =
      statusFilter === "all" || delivery.status === statusFilter;
    const matchesSearch =
      delivery.deliveryId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.distributor.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    // Date filtering
    let matchesDateRange = true;
    if (dateFrom || dateTo) {
      const deliveryDate = new Date(delivery.scheduledTime);
      if (dateFrom) {
        const fromDate = new Date(dateFrom);
        fromDate.setHours(0, 0, 0, 0);
        matchesDateRange = matchesDateRange && deliveryDate >= fromDate;
      }
      if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999);
        matchesDateRange = matchesDateRange && deliveryDate <= toDate;
      }
    }

    return matchesStatus && matchesSearch && matchesDateRange;
  });

  // Stats - calculated from role-filtered data
  const stats = {
    total: roleFilteredDeliveries.length,
    scheduled: roleFilteredDeliveries.filter((d) => d.status === "scheduled")
      .length,
    inProgress: roleFilteredDeliveries.filter((d) => d.status === "in-progress")
      .length,
    completed: roleFilteredDeliveries.filter((d) => d.status === "completed")
      .length,
    failed: roleFilteredDeliveries.filter((d) => d.status === "failed").length,
  };

  // Clear all filters
  const handleClearFilters = () => {
    setStatusFilter("all");
    setSearchQuery("");
    setDateFrom("");
    setDateTo("");
    addNotification(
      "Filters Cleared",
      "All delivery filters have been reset",
      "info",
      { duration: 3000 },
    );
  };
  // Export to CSV
  const handleExport = () => {
    const csvData = [
      [
        "Delivery ID",
        "Client",
        "Address",
        "City",
        "Distributor",
        "Phone",
        "Scheduled Time",
        "Delivered Time",
        "Status",
        "Order Count",
        "Total Amount (TND)",
      ],
      ...filteredDeliveries.map((d) => [
        d.deliveryId,
        d.client.name,
        d.client.address,
        d.client.city,
        d.distributor.name,
        d.distributor.phone,
        d.scheduledTime,
        d.deliveredTime || "N/A",
        d.status,
        d.orderCount,
        d.totalAmount,
      ]),
    ];

    const csvContent = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `taba3ni-deliveries-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    addNotification(
      "✅ Export Successful",
      `Exported ${filteredDeliveries.length} deliveries to CSV`,
      "success",
      { duration: 4000, persistent: true },
    );
  };

  const handleViewDelivery = (deliveryId: string) => {
    navigate(`/deliveryDetails/${deliveryId}`);
  };

  const handleDeleteDelivery = (id: string, deliveryId: string) => {
    setDeliveries((prev) => prev.filter((d) => d.id !== id));
    addNotification(
      "🗑️ Delivery Cancelled",
      `Delivery #${deliveryId} has been cancelled`,
      "warning",
      { duration: 4000, persistent: true },
    );
  };

  const getInitials = (name: string) => {
    if (!name || typeof name !== "string") return "";
    return name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0].toUpperCase())
      .join("")
      .slice(0, 2);
  };

  const getStatusColor = (status: DeliveryStatus) => {
    switch (status) {
      case "scheduled":
        return "pending";
      case "in-progress":
        return "processing";
      case "completed":
        return "delivered";
      case "failed":
        return "failed";
      default:
        return "pending";
    }
  };

  const getStatusLabel = (status: DeliveryStatus) => {
    switch (status) {
      case "scheduled":
        return "Scheduled";
      case "in-progress":
        return "In Progress";
      case "completed":
        return "Completed";
      case "failed":
        return "Failed";
      default:
        return status;
    }
  };

  const hasActiveFilters =
    statusFilter !== "all" || searchQuery || dateFrom || dateTo;

  // Get page title based on role
  const getPageTitle = () => {
    if (userRole === "client") return "My Deliveries";
    if (userRole === "distributor") return "My Assigned Deliveries";
    return "Deliveries Management";
  };

  return (
    <DeliveriesLayout>
      <Row type="horizontal">
        <Heading as="h1">{getPageTitle()}</Heading>
        {userRole !== "distributor" && userRole !== "client" && (
          <Modal>
            <Modal.Open opens="schedule-delivery">
              <Button $size="medium">+ Schedule Delivery</Button>
            </Modal.Open>
            <Modal.Window name="schedule-delivery">
              <DeliveryForm
                onCloseModal={() => {
                  addNotification(
                    "✅ Delivery Scheduled",
                    "New delivery has been successfully scheduled",
                    "success",
                    { duration: 4000, persistent: true },
                  );
                }}
              />
            </Modal.Window>
          </Modal>
        )}
      </Row>

      <StatsRow>
        <StatsCard
          title="Total Deliveries"
          value={stats.total}
          icon={<HiOutlineTruck />}
          color="var(--color-blue-700)"
        />
        <StatsCard
          title="Scheduled"
          value={stats.scheduled}
          icon={<HiOutlineClock />}
          color="var(--color-yellow-700)"
        />
        <StatsCard
          title="In Progress"
          value={stats.inProgress}
          icon={<HiOutlineTruck />}
          color="var(--color-brand-600)"
        />
        <StatsCard
          title="Completed Today"
          value={stats.completed}
          icon={<HiOutlineTruck />}
          color="var(--color-green-700)"
        />
      </StatsRow>

      <FiltersBar>
        <SearchBar
          placeholder="Search by delivery ID, client, or distributor..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Date Range Filter */}
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

        {/* Status Filters */}
        <FilterGroup>
          {["all", "scheduled", "in-progress", "completed", "failed"].map(
            (status) => (
              <FilterButton
                key={status}
                $active={statusFilter === status}
                onClick={() => setStatusFilter(status)}
              >
                {status === "all"
                  ? "All"
                  : status === "in-progress"
                    ? "In Progress"
                    : status.charAt(0).toUpperCase() + status.slice(1)}
              </FilterButton>
            ),
          )}
        </FilterGroup>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <ClearFiltersButton onClick={handleClearFilters}>
            <HiOutlineXCircle />
            Clear Filters
          </ClearFiltersButton>
        )}
      </FiltersBar>

      <TableCard>
        {/* Table Controls with Export Button */}
        <TableControls>
          <ResultsCount>
            Showing <strong>{filteredDeliveries.length}</strong> of{" "}
            <strong>{roleFilteredDeliveries.length}</strong> deliveries
          </ResultsCount>
          <ExportButton
            $variation="secondary"
            $size="small"
            onClick={handleExport}
          >
            <HiOutlineArrowDownTray />
            Export to CSV
          </ExportButton>
        </TableControls>
        <Table>
          {/* Desktop Table Header */}
          <TableHeader>
            <div>Delivery ID</div>
            <div>Client</div>
            <div>Distributor</div>
            <div>Scheduled Time</div>
            <div>Orders</div>
            <div>Amount</div>
            <div>Status</div>
            <div></div>
          </TableHeader>

          {filteredDeliveries.length === 0 ? (
            <EmptyState>
              <HiOutlineTruck />
              <h3>No deliveries found</h3>
              <p>
                {roleFilteredDeliveries.length === 0
                  ? userRole === "client"
                    ? "You don't have any deliveries yet"
                    : userRole === "distributor"
                      ? "No deliveries assigned to you yet"
                      : "No deliveries scheduled yet"
                  : "Try adjusting your filters or search query"}
              </p>
              {userRole === "admin" && roleFilteredDeliveries.length === 0 && (
                <Modal>
                  <Modal.Open opens="schedule-first-delivery">
                    <Button $size="medium">+ Schedule First Delivery</Button>
                  </Modal.Open>
                  <Modal.Window name="schedule-first-delivery">
                    <DeliveryForm onCloseModal={() => {}} />
                  </Modal.Window>
                </Modal>
              )}
            </EmptyState>
          ) : (
            <>
              {/* Desktop Table View */}
              <Menus>
                {filteredDeliveries.map((delivery) => (
                  <TableRow key={delivery.id}>
                    <DeliveryId>#{delivery.deliveryId}</DeliveryId>

                    <ClientInfo>
                      <ClientName>{delivery.client.name}</ClientName>
                      <ClientAddress>
                        {delivery.client.address}, {delivery.client.city}
                      </ClientAddress>
                    </ClientInfo>

                    <DistributorInfo>
                      <DistributorAvatar>
                        {getInitials(delivery.distributor.name)}
                      </DistributorAvatar>
                      <span>{delivery.distributor.name}</span>
                    </DistributorInfo>

                    <div style={{ fontSize: "1.3rem" }}>
                      {delivery.scheduledTime}
                    </div>

                    <div style={{ fontWeight: 600 }}>{delivery.orderCount}</div>

                    <div style={{ fontWeight: 600 }}>
                      {delivery.totalAmount.toLocaleString()} TND
                    </div>

                    <StatusBadge $status={getStatusColor(delivery.status)}>
                      {getStatusLabel(delivery.status)}
                    </StatusBadge>

                    <div>
                      <Modal>
                        <Menus.Menu>
                          <Menus.Toggle id={delivery.id} />
                          <Menus.List id={delivery.id}>
                            <Menus.Button
                              icon={<HiOutlineEye />}
                              onClick={() => handleViewDelivery(delivery.id)}
                            >
                              View Details
                            </Menus.Button>
                            <Modal.Open opens={`edit-${delivery.id}`}>
                              <Menus.Button icon={<HiOutlinePencil />}>
                                Edit Delivery
                              </Menus.Button>
                            </Modal.Open>
                            <Modal.Open opens={`delete-${delivery.id}`}>
                              <Menus.Button icon={<HiOutlineTrash />}>
                                Cancel Delivery
                              </Menus.Button>
                            </Modal.Open>
                          </Menus.List>
                        </Menus.Menu>

                        <Modal.Window name={`edit-${delivery.id}`}>
                          <DeliveryForm
                            deliveryToEdit={{
                              id: delivery.id,
                              deliveryId: delivery.deliveryId,
                              distributor: "1",
                              scheduledDate:
                                delivery.scheduledTime.split(" ")[0],
                              scheduledTime:
                                delivery.scheduledTime.split(" ")[1],
                              orders: Array.from(
                                { length: delivery.orderCount },
                                (_, i) => String(i + 1),
                              ),
                            }}
                            onCloseModal={() => {
                              addNotification(
                                "✅ Delivery Updated",
                                `Delivery #${delivery.deliveryId} has been updated`,
                                "success",
                                { duration: 4000, persistent: true },
                              );
                            }}
                          />
                        </Modal.Window>

                        <Modal.Window name={`delete-${delivery.id}`}>
                          <ConfirmDelete
                            resourceName={`delivery ${delivery.deliveryId}`}
                            onConfirm={() =>
                              handleDeleteDelivery(
                                delivery.id,
                                delivery.deliveryId,
                              )
                            }
                            onCloseModal={() => {}}
                          />
                        </Modal.Window>
                      </Modal>
                    </div>
                  </TableRow>
                ))}
              </Menus>

              {/* Mobile Card View */}
              <MobileCardList>
                {filteredDeliveries.map((delivery) => (
                  <MobileCard key={delivery.id}>
                    <MobileCardHeader>
                      <div style={{ flex: 1 }}>
                        <MobileDeliveryId>
                          #{delivery.deliveryId}
                        </MobileDeliveryId>
                        <MobileClientName>
                          {delivery.client.name}
                        </MobileClientName>
                        <MobileClientAddress>
                          {delivery.client.address}, {delivery.client.city}
                        </MobileClientAddress>
                      </div>
                    </MobileCardHeader>

                    <MobileCardBody>
                      <MobileInfoRow>
                        <MobileLabel>
                          <HiOutlineUser />
                          Distributor
                        </MobileLabel>
                        <MobileDistributorInfo>
                          <MobileDistributorAvatar>
                            {getInitials(delivery.distributor.name)}
                          </MobileDistributorAvatar>
                          <MobileDistributorName>
                            {delivery.distributor.name}
                          </MobileDistributorName>
                        </MobileDistributorInfo>
                      </MobileInfoRow>

                      <MobileInfoRow>
                        <MobileLabel>
                          <HiOutlineCalendar />
                          Scheduled
                        </MobileLabel>
                        <MobileValue>
                          {new Date(delivery.scheduledTime).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </MobileValue>
                      </MobileInfoRow>

                      <MobileInfoRow>
                        <MobileLabel>
                          <HiOutlineShoppingCart />
                          Orders
                        </MobileLabel>
                        <MobileValue>{delivery.orderCount}</MobileValue>
                      </MobileInfoRow>

                      <MobileInfoRow>
                        <MobileLabel>
                          <HiOutlineCurrencyDollar />
                          Amount
                        </MobileLabel>
                        <MobileValue>
                          {delivery.totalAmount.toLocaleString()} TND
                        </MobileValue>
                      </MobileInfoRow>
                    </MobileCardBody>

                    <MobileStatusRow>
                      <StatusBadge $status={getStatusColor(delivery.status)}>
                        {getStatusLabel(delivery.status)}
                      </StatusBadge>
                    </MobileStatusRow>

                    <MobileActionsRow>
                      <MobileActionButton
                        onClick={() => handleViewDelivery(delivery.id)}
                      >
                        <HiOutlineEye />
                        View
                      </MobileActionButton>
                      <Modal>
                        <Modal.Open opens={`edit-mobile-${delivery.id}`}>
                          <MobileActionButton>
                            <HiOutlinePencil />
                            Edit
                          </MobileActionButton>
                        </Modal.Open>
                        <Modal.Window name={`edit-mobile-${delivery.id}`}>
                          <DeliveryForm
                            deliveryToEdit={{
                              id: delivery.id,
                              deliveryId: delivery.deliveryId,
                              distributor: "1",
                              scheduledDate:
                                delivery.scheduledTime.split(" ")[0],
                              scheduledTime:
                                delivery.scheduledTime.split(" ")[1],
                              orders: Array.from(
                                { length: delivery.orderCount },
                                (_, i) => String(i + 1),
                              ),
                            }}
                            onCloseModal={() => {}}
                          />
                        </Modal.Window>
                      </Modal>
                    </MobileActionsRow>
                  </MobileCard>
                ))}
              </MobileCardList>
            </>
          )}
        </Table>
      </TableCard>
    </DeliveriesLayout>
  );
}

export default Deliveries;
