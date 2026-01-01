import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineBuildingStorefront,
  HiOutlinePhone,
  HiOutlineMapPin,
  HiOutlineCurrencyDollar,
  HiArrowUp,
  HiArrowDown,
  HiOutlineArrowDownTray,
  HiOutlineCalendar,
  HiOutlineShoppingCart,
} from "react-icons/hi2";
import Heading from "../UI/Heading";
import Row from "../UI/Row";
import Button from "../UI/Button";
import SearchBar from "../UI/SearchBar";
import Menus from "../UI/Menus";
import Modal from "../UI/Modal";
import ConfirmDelete from "../UI/ConfirmDelete";
import ClientForm from "../components/ClientForm";
import StatsCard from "../UI/StatsCard";

// Styled Components
const ClientsLayout = styled.div`
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
  background-color: var(--color-green-500);
  color: var(--color-grey-900);

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
  grid-template-columns: 2fr 1.5fr 1.5fr 1fr 1fr 1.5fr 1fr 0.5fr;
  gap: 1.6rem;
  padding: 1.6rem 2.4rem;
  background-color: var(--color-grey-0);
  font-weight: 600;
  font-size: 1.3rem;
  text-transform: uppercase;
  color: var(--color-grey-600);
  border-bottom: 2px solid var(--color-grey-200);

  @media (max-width: 1400px) {
    grid-template-columns: 2fr 1.5fr 1.5fr 1fr 1fr 1.5fr 0.5fr;
  }

  @media (max-width: 1024px) {
    display: none;
  }
`;

const SortableHeader = styled.div<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s;
  color: ${(props) =>
    props.$active ? "var(--color-brand-600)" : "var(--color-grey-600)"};

  &:hover {
    color: var(--color-brand-600);
  }

  & svg {
    width: 1.4rem;
    height: 1.4rem;
    transition: transform 0.2s;
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.5fr 1fr 1fr 1.5fr 1fr 0.5fr;
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

  @media (max-width: 1400px) {
    grid-template-columns: 2fr 1.5fr 1.5fr 1fr 1fr 1.5fr 0.5fr;
  }

  @media (max-width: 1024px) {
    display: none;
  }
`;

// Mobile Card View
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

const MobileClientInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  flex: 1;
`;

const MobileClientDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const MobileClientName = styled.h3`
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--color-grey-900);
  margin: 0;
`;

const MobileClientType = styled.span`
  font-size: 1.3rem;
  color: var(--color-grey-500);
  text-transform: capitalize;
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
  }
`;

const MobileValue = styled.span`
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--color-grey-900);
  text-align: right;
`;

const MobileCreditSection = styled.div`
  margin-top: 1.2rem;
  padding-top: 1.2rem;
  border-top: 2px solid var(--color-grey-200);
`;

const MobileCreditLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--color-grey-700);
`;

const MobileActionsRow = styled.div`
  display: flex;
  gap: 0.8rem;
  margin-top: 1.6rem;
  padding-top: 1.6rem;
  border-top: 1px solid var(--color-grey-200);
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

const ClientInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
`;

const ClientIcon = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    var(--color-brand-600),
    var(--color-brand-700)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-grey-0);
  font-weight: 700;
  font-size: 1.6rem;
  flex-shrink: 0;
`;

const ClientDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
`;

const ClientName = styled.span`
  font-weight: 600;
  font-size: 1.4rem;
  color: var(--color-grey-900);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ClientType = styled.span`
  font-size: 1.2rem;
  color: var(--color-grey-500);
  text-transform: capitalize;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 1.3rem;
  color: var(--color-grey-600);

  & > div {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  & svg {
    width: 1.4rem;
    height: 1.4rem;
    color: var(--color-brand-600);
    flex-shrink: 0;
  }
`;

const StatusBadge = styled.span<{ $status: "active" | "inactive" | "pending" }>`
  display: inline-flex;
  align-items: center;
  padding: 0.4rem 1rem;
  border-radius: 100px;
  font-size: 1.2rem;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
  background-color: ${(props) => {
    if (props.$status === "active") return "var(--color-green-100)";
    if (props.$status === "pending") return "var(--color-yellow-100)";
    return "var(--color-grey-100)";
  }};
  color: ${(props) => {
    if (props.$status === "active") return "var(--color-green-700)";
    if (props.$status === "pending") return "var(--color-yellow-700)";
    return "var(--color-grey-700)";
  }};
`;

const Amount = styled.span<{ $negative?: boolean }>`
  font-weight: 600;
  font-size: 1.4rem;
  color: ${(props) =>
    props.$negative ? "var(--color-red-700)" : "var(--color-grey-900)"};
`;

const CreditBar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  min-width: 12rem;
`;

const CreditHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1rem;
  color: var(--color-grey-600);
`;

const CreditAmount = styled.span`
  font-weight: 600;
  font-size: 1.2rem;
`;

const CreditPercentage = styled.span<{ $color: string }>`
  font-weight: 700;
  font-size: 1.2rem;
  color: ${(props) => props.$color};
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 0.8rem;
  background-color: var(--color-grey-200);
  border-radius: 10rem;
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ProgressBarFill = styled.div<{ $percentage: number; $color: string }>`
  height: 100%;
  width: ${(props) => props.$percentage}%;
  background: linear-gradient(
    90deg,
    ${(props) => props.$color},
    ${(props) => props.$color}dd
  );
  border-radius: 10rem;
  transition: width 0.3s ease;
  box-shadow: 0 0 8px ${(props) => props.$color}88;
`;

const LastOrderDate = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  font-size: 1.3rem;

  & .date {
    color: var(--color-grey-900);
    font-weight: 500;
  }

  & .time-ago {
    color: var(--color-grey-500);
    font-size: 1.1rem;
  }
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

// Types
type ClientType = "supermarket" | "grocery" | "restaurant" | "cafe" | "other";
type ClientStatus = "active" | "inactive" | "pending";

type Client = {
  id: string;
  name: string;
  type: ClientType;
  status: ClientStatus;
  phone: string;
  email: string;
  address: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  creditLimit: number;
  balance: number;
  contactPerson: string;
  taxId?: string;
  paymentTerms: string;
  lastOrderDate?: string; // FIXED: Added this property
};

// Mock Data - UPDATED with lastOrderDate
const mockClients: Client[] = [
  {
    id: "1",
    name: "Carrefour Lac 2",
    type: "supermarket",
    status: "active",
    phone: "+216 71 123 456",
    email: "carrefour.lac2@email.com",
    address: "Avenue de la Bourse, Lac 2",
    city: "Tunis",
    totalOrders: 145,
    totalSpent: 125400,
    creditLimit: 50000,
    balance: 45000,
    contactPerson: "Ahmed Ben Ali",
    taxId: "123456789",
    paymentTerms: "30 days",
    lastOrderDate: "2025-12-28",
  },
  {
    id: "2",
    name: "Monoprix Menzah",
    type: "supermarket",
    status: "active",
    phone: "+216 71 234 567",
    email: "monoprix.menzah@email.com",
    address: "Avenue Habib Bourguiba",
    city: "Ariana",
    totalOrders: 98,
    totalSpent: 87500,
    creditLimit: 40000,
    balance: 28000,
    contactPerson: "Fatma Trabelsi",
    taxId: "987654321",
    paymentTerms: "30 days",
    lastOrderDate: "2025-12-27",
  },
  {
    id: "3",
    name: "Magasin Général Marsa",
    type: "grocery",
    status: "active",
    phone: "+216 71 345 678",
    email: "general.marsa@email.com",
    address: "Rue de la République",
    city: "La Marsa",
    totalOrders: 67,
    totalSpent: 45200,
    creditLimit: 20000,
    balance: 10000,
    contactPerson: "Mohamed Sassi",
    paymentTerms: "15 days",
    lastOrderDate: "2025-12-25",
  },
  {
    id: "4",
    name: "Superette Ariana",
    type: "grocery",
    status: "active",
    phone: "+216 71 456 789",
    email: "superette.ariana@email.com",
    address: "Avenue de la Liberté",
    city: "Ariana",
    totalOrders: 34,
    totalSpent: 28900,
    creditLimit: 15000,
    balance: 3200,
    contactPerson: "Salah Gharbi",
    paymentTerms: "Cash",
    lastOrderDate: "2025-12-20",
  },
  {
    id: "5",
    name: "Café des Arts",
    type: "cafe",
    status: "pending",
    phone: "+216 71 567 890",
    email: "cafe.arts@email.com",
    address: "Avenue Bourguiba",
    city: "Tunis",
    totalOrders: 2,
    totalSpent: 1200,
    creditLimit: 5000,
    balance: 0,
    contactPerson: "Karim Jlassi",
    paymentTerms: "Cash",
    lastOrderDate: "2025-11-15",
  },
  {
    id: "6",
    name: "Restaurant Le Gourmet",
    type: "restaurant",
    status: "active",
    phone: "+216 71 678 901",
    email: "legourmet@email.com",
    address: "Avenue de France",
    city: "Tunis",
    totalOrders: 89,
    totalSpent: 67800,
    creditLimit: 35000,
    balance: 15000,
    contactPerson: "Leila Mansour",
    paymentTerms: "30 days",
    lastOrderDate: "2025-12-29",
  },
];

function Clients() {
  const navigate = useNavigate();
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "orders" | "spent" | "credit">(
    "name"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Filter clients
  const filteredClients = mockClients.filter((client) => {
    const matchesType = typeFilter === "all" || client.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" || client.status === statusFilter;
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.includes(searchQuery) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  // Sort clients
  const sortedClients = [...filteredClients].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "orders":
        comparison = a.totalOrders - b.totalOrders;
        break;
      case "spent":
        comparison = a.totalSpent - b.totalSpent;
        break;
      case "credit":
        const aUsage = (a.balance / a.creditLimit) * 100;
        const bUsage = (b.balance / b.creditLimit) * 100;
        comparison = aUsage - bUsage;
        break;
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  // Calculate stats
  const stats = {
    total: mockClients.length,
    active: mockClients.filter((c) => c.status === "active").length,
    totalRevenue: mockClients.reduce((sum, c) => sum + c.totalSpent, 0),
    totalBalance: mockClients.reduce((sum, c) => sum + c.balance, 0),
  };

  // Handle sort
  const handleSort = (field: "name" | "orders" | "spent" | "credit") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Export to CSV
  const handleExport = () => {
    const csvData = [
      [
        "Name",
        "Type",
        "Status",
        "Phone",
        "Email",
        "City",
        "Total Orders",
        "Total Spent (TND)",
        "Balance (TND)",
        "Credit Limit (TND)",
        "Credit Usage %",
        "Last Order Date",
      ],
      ...sortedClients.map((c) => [
        c.name,
        c.type,
        c.status,
        c.phone,
        c.email,
        c.city,
        c.totalOrders,
        c.totalSpent,
        c.balance,
        c.creditLimit,
        ((c.balance / c.creditLimit) * 100).toFixed(1),
        c.lastOrderDate || "N/A",
      ]),
    ];

    const csvContent = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `taba3ni-clients-export-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Calculate credit utilization color
  const getCreditColor = (percentage: number) => {
    if (percentage >= 90) return "#dc2626"; // Red
    if (percentage >= 70) return "#f59e0b"; // Orange
    if (percentage >= 50) return "#eab308"; // Yellow
    return "#10b981"; // Green
  };

  // Format relative time
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const handleViewClient = (clientId: string) => {
    navigate(`/clients/${clientId}`);
  };

  const handleDeleteClient = (clientId: string) => {
    console.log("Delete client:", clientId);
    // TODO: Call API to delete client
  };

  const getClientInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const types = [
    "all",
    "supermarket",
    "grocery",
    "restaurant",
    "cafe",
    "other",
  ];

  return (
    <ClientsLayout>
      <Row type="horizontal">
        <Heading as="h1">Clients Management</Heading>
        <Modal>
          <Modal.Open opens="create-client">
            <Button $size="medium">+ Add Client</Button>
          </Modal.Open>
          <Modal.Window name="create-client">
            <ClientForm onCloseModal={() => {}} />
          </Modal.Window>
        </Modal>
      </Row>

      {/* Stats */}
      <StatsRow>
        <StatsCard
          title="Total Clients"
          value={stats.total}
          icon={<HiOutlineBuildingStorefront />}
          color="var(--color-blue-700)"
        />
        <StatsCard
          title="Active Clients"
          value={stats.active}
          icon={<HiOutlineBuildingStorefront />}
          color="var(--color-green-700)"
        />
        <StatsCard
          title="Total Revenue"
          value={`${stats.totalRevenue.toLocaleString()} TND`}
          icon={<HiOutlineCurrencyDollar />}
          color="var(--color-brand-600)"
        />
        <StatsCard
          title="Outstanding Balance"
          value={`${stats.totalBalance.toLocaleString()} TND`}
          icon={<HiOutlineCurrencyDollar />}
          color="var(--color-red-700)"
        />
      </StatsRow>

      {/* Filters & Search */}
      <FiltersBar>
        <SearchBar
          placeholder="Search by name, phone, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FilterGroup>
          <FilterButton
            $active={statusFilter === "all"}
            onClick={() => setStatusFilter("all")}
          >
            All Status
          </FilterButton>
          <FilterButton
            $active={statusFilter === "active"}
            onClick={() => setStatusFilter("active")}
          >
            Active
          </FilterButton>
          <FilterButton
            $active={statusFilter === "pending"}
            onClick={() => setStatusFilter("pending")}
          >
            Pending
          </FilterButton>
          <FilterButton
            $active={statusFilter === "inactive"}
            onClick={() => setStatusFilter("inactive")}
          >
            Inactive
          </FilterButton>
        </FilterGroup>
        <FilterGroup>
          {types.map((type) => (
            <FilterButton
              key={type}
              $active={typeFilter === type}
              onClick={() => setTypeFilter(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </FilterButton>
          ))}
        </FilterGroup>
      </FiltersBar>

      {/* Clients Table */}
      <TableCard>
        <TableControls>
          <ResultsCount>
            Showing <strong>{sortedClients.length}</strong> of{" "}
            <strong>{mockClients.length}</strong> clients
          </ResultsCount>
          <ExportButton $variation="secondary" $size="" onClick={handleExport}>
            <HiOutlineArrowDownTray />
            Export to CSV
          </ExportButton>
        </TableControls>

        <Table>
          <TableHeader>
            <SortableHeader
              $active={sortBy === "name"}
              onClick={() => handleSort("name")}
            >
              Client
              {sortBy === "name" &&
                (sortOrder === "asc" ? <HiArrowUp /> : <HiArrowDown />)}
            </SortableHeader>
            <div>Contact</div>
            <div>Location</div>
            <SortableHeader
              $active={sortBy === "orders"}
              onClick={() => handleSort("orders")}
            >
              Orders
              {sortBy === "orders" &&
                (sortOrder === "asc" ? <HiArrowUp /> : <HiArrowDown />)}
            </SortableHeader>
            <SortableHeader
              $active={sortBy === "spent"}
              onClick={() => handleSort("spent")}
            >
              Total Spent
              {sortBy === "spent" &&
                (sortOrder === "asc" ? <HiArrowUp /> : <HiArrowDown />)}
            </SortableHeader>
            <SortableHeader
              $active={sortBy === "credit"}
              onClick={() => handleSort("credit")}
            >
              Credit Usage
              {sortBy === "credit" &&
                (sortOrder === "asc" ? <HiArrowUp /> : <HiArrowDown />)}
            </SortableHeader>
            <div>Last Order</div>
            <div></div>
          </TableHeader>

          {sortedClients.length === 0 ? (
            <EmptyState>
              <HiOutlineBuildingStorefront />
              <h3>No clients found</h3>
              <p>Try adjusting your filters or search query</p>
              <Modal>
                <Modal.Open opens="create-client-empty">
                  <Button $size="medium">+ Add Your First Client</Button>
                </Modal.Open>
                <Modal.Window name="create-client-empty">
                  <ClientForm onCloseModal={() => {}} />
                </Modal.Window>
              </Modal>
            </EmptyState>
          ) : (
            <>
              {/* Desktop Table View */}
              <Menus>
                {sortedClients.map((client) => {
                  const creditUsage =
                    (client.balance / client.creditLimit) * 100;
                  const creditColor = getCreditColor(creditUsage);

                  return (
                    <TableRow key={client.id}>
                      <ClientInfo>
                        <ClientIcon>
                          {getClientInitials(client.name)}
                        </ClientIcon>
                        <ClientDetails>
                          <ClientName>{client.name}</ClientName>
                          <ClientType>{client.type}</ClientType>
                        </ClientDetails>
                      </ClientInfo>

                      <ContactInfo>
                        <div>
                          <HiOutlinePhone />
                          {client.phone}
                        </div>
                      </ContactInfo>

                      <ContactInfo>
                        <div>
                          <HiOutlineMapPin />
                          {client.city}
                        </div>
                      </ContactInfo>

                      <div style={{ fontWeight: 600, fontSize: "1.4rem" }}>
                        {client.totalOrders}
                      </div>

                      <Amount>{client.totalSpent.toLocaleString()} TND</Amount>

                      <CreditBar>
                        <CreditHeader>
                          <CreditAmount>
                            {client.balance.toLocaleString()} TND
                          </CreditAmount>
                          <CreditPercentage $color={creditColor}>
                            {creditUsage.toFixed(0)}%
                          </CreditPercentage>
                        </CreditHeader>
                        <ProgressBarContainer>
                          <ProgressBarFill
                            $percentage={creditUsage}
                            $color={creditColor}
                          />
                        </ProgressBarContainer>
                      </CreditBar>

                      <LastOrderDate>
                        <span className="date">
                          {client.lastOrderDate
                            ? new Date(client.lastOrderDate).toLocaleDateString(
                                "en-GB",
                                { day: "2-digit", month: "short" }
                              )
                            : "N/A"}
                        </span>
                        {client.lastOrderDate && (
                          <span className="time-ago">
                            {getTimeAgo(client.lastOrderDate)}
                          </span>
                        )}
                      </LastOrderDate>

                      <div>
                        <Modal>
                          <Menus.Menu>
                            <Menus.Toggle id={client.id} />
                            <Menus.List id={client.id}>
                              <Menus.Button
                                icon={<HiOutlineEye />}
                                onClick={() => handleViewClient(client.id)}
                              >
                                View Details
                              </Menus.Button>
                              <Modal.Open opens={`edit-${client.id}`}>
                                <Menus.Button icon={<HiOutlinePencil />}>
                                  Edit Client
                                </Menus.Button>
                              </Modal.Open>
                              <Modal.Open opens={`delete-${client.id}`}>
                                <Menus.Button icon={<HiOutlineTrash />}>
                                  Delete Client
                                </Menus.Button>
                              </Modal.Open>
                            </Menus.List>
                          </Menus.Menu>

                          <Modal.Window name={`edit-${client.id}`}>
                            <ClientForm
                              clientToEdit={client}
                              onCloseModal={() => {}}
                            />
                          </Modal.Window>

                          <Modal.Window name={`delete-${client.id}`}>
                            <ConfirmDelete
                              resourceName={`client ${client.name}`}
                              onConfirm={() => handleDeleteClient(client.id)}
                              onCloseModal={() => {}}
                            />
                          </Modal.Window>
                        </Modal>
                      </div>
                    </TableRow>
                  );
                })}
              </Menus>

              {/* Mobile Card View */}
              <MobileCardList>
                {sortedClients.map((client) => {
                  const creditUsage =
                    (client.balance / client.creditLimit) * 100;
                  const creditColor = getCreditColor(creditUsage);

                  return (
                    <MobileCard key={client.id}>
                      <MobileCardHeader>
                        <MobileClientInfo>
                          <ClientIcon>
                            {getClientInitials(client.name)}
                          </ClientIcon>
                          <MobileClientDetails>
                            <MobileClientName>{client.name}</MobileClientName>
                            <MobileClientType>{client.type}</MobileClientType>
                          </MobileClientDetails>
                        </MobileClientInfo>
                        <StatusBadge $status={client.status}>
                          {client.status}
                        </StatusBadge>
                      </MobileCardHeader>

                      <MobileCardBody>
                        <MobileInfoRow>
                          <MobileLabel>
                            <HiOutlinePhone />
                            Phone
                          </MobileLabel>
                          <MobileValue>{client.phone}</MobileValue>
                        </MobileInfoRow>

                        <MobileInfoRow>
                          <MobileLabel>
                            <HiOutlineMapPin />
                            Location
                          </MobileLabel>
                          <MobileValue>{client.city}</MobileValue>
                        </MobileInfoRow>

                        <MobileInfoRow>
                          <MobileLabel>
                            <HiOutlineShoppingCart />
                            Total Orders
                          </MobileLabel>
                          <MobileValue>{client.totalOrders}</MobileValue>
                        </MobileInfoRow>

                        <MobileInfoRow>
                          <MobileLabel>
                            <HiOutlineCurrencyDollar />
                            Total Spent
                          </MobileLabel>
                          <MobileValue>
                            {client.totalSpent.toLocaleString()} TND
                          </MobileValue>
                        </MobileInfoRow>

                        <MobileInfoRow>
                          <MobileLabel>
                            <HiOutlineCalendar />
                            Last Order
                          </MobileLabel>
                          <MobileValue>
                            {client.lastOrderDate
                              ? getTimeAgo(client.lastOrderDate)
                              : "N/A"}
                          </MobileValue>
                        </MobileInfoRow>
                      </MobileCardBody>

                      <MobileCreditSection>
                        <MobileCreditLabel>
                          <span>Credit Usage</span>
                          <span style={{ color: creditColor }}>
                            {creditUsage.toFixed(0)}%
                          </span>
                        </MobileCreditLabel>
                        <ProgressBarContainer>
                          <ProgressBarFill
                            $percentage={creditUsage}
                            $color={creditColor}
                          />
                        </ProgressBarContainer>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "0.8rem",
                            fontSize: "1.2rem",
                            color: "var(--color-grey-600)",
                          }}
                        >
                          <span>
                            {client.balance.toLocaleString()} TND used
                          </span>
                          <span>
                            {client.creditLimit.toLocaleString()} TND limit
                          </span>
                        </div>
                      </MobileCreditSection>

                      <MobileActionsRow>
                        <MobileActionButton
                          onClick={() => handleViewClient(client.id)}
                        >
                          <HiOutlineEye />
                          View
                        </MobileActionButton>
                        <Modal>
                          <Modal.Open opens={`edit-mobile-${client.id}`}>
                            <MobileActionButton>
                              <HiOutlinePencil />
                              Edit
                            </MobileActionButton>
                          </Modal.Open>
                          <Modal.Window name={`edit-mobile-${client.id}`}>
                            <ClientForm
                              clientToEdit={client}
                              onCloseModal={() => {}}
                            />
                          </Modal.Window>
                        </Modal>
                      </MobileActionsRow>
                    </MobileCard>
                  );
                })}
              </MobileCardList>
            </>
          )}
        </Table>
      </TableCard>
    </ClientsLayout>
  );
}

export default Clients;
