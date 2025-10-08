import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineTruck,
  HiOutlineClock,
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
  grid-template-columns: 1fr 2fr 1.5fr 1.5fr 1fr 1fr 1fr 0.5fr;
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
type DeliveryStatus = "scheduled" | "in-progress" | "completed" | "failed";

type Delivery = {
  id: string;
  deliveryId: string;
  orderId: string;
  client: {
    name: string;
    address: string;
    city: string;
  };
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

// Mock Data
const mockDeliveries: Delivery[] = [
  {
    id: "1",
    deliveryId: "DEL-001",
    orderId: "ORD-001",
    client: {
      name: "Carrefour Lac 2",
      address: "Avenue de la Bourse, Lac 2",
      city: "Tunis",
    },
    distributor: {
      name: "Ahmed Mahmoudi",
      phone: "+216 98 123 456",
    },
    scheduledTime: "2025-10-09 14:00",
    status: "in-progress",
    orderCount: 3,
    totalAmount: 3450,
  },
  {
    id: "2",
    deliveryId: "DEL-002",
    orderId: "ORD-002",
    client: {
      name: "Monoprix Menzah",
      address: "Avenue Habib Bourguiba",
      city: "Ariana",
    },
    distributor: {
      name: "Karim Belaid",
      phone: "+216 98 234 567",
    },
    scheduledTime: "2025-10-09 15:30",
    status: "scheduled",
    orderCount: 2,
    totalAmount: 2100,
  },
  {
    id: "3",
    deliveryId: "DEL-003",
    orderId: "ORD-003",
    client: {
      name: "Magasin Général Marsa",
      address: "Rue de la République",
      city: "La Marsa",
    },
    distributor: {
      name: "Ahmed Mahmoudi",
      phone: "+216 98 123 456",
    },
    scheduledTime: "2025-10-08 16:00",
    deliveredTime: "2025-10-08 16:15",
    status: "completed",
    orderCount: 1,
    totalAmount: 1500,
  },
  {
    id: "4",
    deliveryId: "DEL-004",
    orderId: "ORD-004",
    client: {
      name: "Superette Ariana",
      address: "Avenue de la Liberté",
      city: "Ariana",
    },
    distributor: {
      name: "Mohamed Trabelsi",
      phone: "+216 98 345 678",
    },
    scheduledTime: "2025-10-08 10:00",
    status: "failed",
    orderCount: 1,
    totalAmount: 890,
  },
];

function Deliveries() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter deliveries
  const filteredDeliveries = mockDeliveries.filter((delivery) => {
    const matchesStatus =
      statusFilter === "all" || delivery.status === statusFilter;
    const matchesSearch =
      delivery.deliveryId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.distributor.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Stats
  const stats = {
    total: mockDeliveries.length,
    scheduled: mockDeliveries.filter((d) => d.status === "scheduled").length,
    inProgress: mockDeliveries.filter((d) => d.status === "in-progress").length,
    completed: mockDeliveries.filter((d) => d.status === "completed").length,
    failed: mockDeliveries.filter((d) => d.status === "failed").length,
  };

  const handleViewDelivery = (deliveryId: string) => {
    navigate(`/deliveries/${deliveryId}`);
  };

  const handleDeleteDelivery = (deliveryId: string) => {
    console.log("Delete delivery:", deliveryId);
  };

  // ✅ FIXED getInitials
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

  return (
    <DeliveriesLayout>
      <Row type="horizontal">
        <Heading as="h1">Deliveries Management</Heading>
        <Button $size="medium" onClick={() => navigate("/deliveries/new")}>
          + Schedule Delivery
        </Button>
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
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </FilterButton>
            )
          )}
        </FilterGroup>
      </FiltersBar>

      <TableCard>
        <Table>
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
              <p>🔍 No deliveries found</p>
              <p style={{ fontSize: "1.4rem" }}>
                Try adjusting your filters or search query
              </p>
            </EmptyState>
          ) : (
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
                          <Menus.Button icon={<HiOutlinePencil />}>
                            Edit Delivery
                          </Menus.Button>
                          <Modal.Open opens={`delete-${delivery.id}`}>
                            <Menus.Button icon={<HiOutlineTrash />}>
                              Cancel Delivery
                            </Menus.Button>
                          </Modal.Open>
                        </Menus.List>
                      </Menus.Menu>

                      <Modal.Window name={`delete-${delivery.id}`}>
                        <ConfirmDelete
                          resourceName={`delivery ${delivery.deliveryId}`}
                          onConfirm={() => handleDeleteDelivery(delivery.id)}
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
    </DeliveriesLayout>
  );
}

export default Deliveries;
