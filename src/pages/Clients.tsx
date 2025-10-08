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
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 0.8rem;
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
`;

const Table = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.5fr 1fr 1fr 1fr 0.5fr;
  gap: 1.6rem;
  padding: 1.6rem 2.4rem;
  background-color: var(--color-grey-50);
  font-weight: 600;
  font-size: 1.3rem;
  text-transform: uppercase;
  color: var(--color-grey-600);
  border-bottom: 1px solid var(--color-grey-100);
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.5fr 1fr 1fr 1fr 0.5fr;
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
`;

const ClientDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const ClientName = styled.span`
  font-weight: 600;
  font-size: 1.4rem;
  color: var(--color-grey-900);
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
  color: ${(props) =>
    props.$negative ? "var(--color-red-700)" : "var(--color-grey-900)"};
`;

const EmptyState = styled.div`
  padding: 6rem 2rem;
  text-align: center;
  color: var(--color-grey-500);

  & p {
    font-size: 1.8rem;
    margin-bottom: 1.6rem;
  }

  & svg {
    width: 8rem;
    height: 8rem;
    margin: 0 auto 2rem;
    color: var(--color-grey-400);
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
};

// Mock Data
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
    balance: 12500,
    contactPerson: "Ahmed Ben Ali",
    taxId: "123456789",
    paymentTerms: "30 days",
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
    balance: 8900,
    contactPerson: "Fatma Trabelsi",
    taxId: "987654321",
    paymentTerms: "30 days",
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
    balance: 5600,
    contactPerson: "Mohamed Sassi",
    paymentTerms: "15 days",
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
  },
];

function Clients() {
  const navigate = useNavigate();
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

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

  // Calculate stats
  const stats = {
    total: mockClients.length,
    active: mockClients.filter((c) => c.status === "active").length,
    totalRevenue: mockClients.reduce((sum, c) => sum + c.totalSpent, 0),
    totalBalance: mockClients.reduce((sum, c) => sum + c.balance, 0),
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
      {/* Header */}
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
        <Table>
          <TableHeader>
            <div>Client</div>
            <div>Contact</div>
            <div>Location</div>
            <div>Orders</div>
            <div>Total Spent</div>
            <div>Status</div>
            <div></div>
          </TableHeader>

          {filteredClients.length === 0 ? (
            <EmptyState>
              <HiOutlineBuildingStorefront />
              <p>🔍 No clients found</p>
              <p style={{ fontSize: "1.4rem" }}>
                Try adjusting your filters or search query
              </p>
            </EmptyState>
          ) : (
            <Menus>
              {filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <ClientInfo>
                    <ClientIcon>{getClientInitials(client.name)}</ClientIcon>
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

                  <div style={{ fontWeight: 600 }}>{client.totalOrders}</div>

                  <Amount>{client.totalSpent.toLocaleString()} TND</Amount>

                  <StatusBadge $status={client.status}>
                    {client.status}
                  </StatusBadge>

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
              ))}
            </Menus>
          )}
        </Table>
      </TableCard>
    </ClientsLayout>
  );
}

export default Clients;
