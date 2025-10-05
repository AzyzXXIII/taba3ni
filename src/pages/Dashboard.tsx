import styled from "styled-components";
import {
  HiOutlineCurrencyDollar,
  HiOutlineShoppingCart,
  HiOutlineTruck,
  HiOutlineUsers,
} from "react-icons/hi2";
import Heading from "../UI/Heading";
import Row from "../UI/Row";
import StatsCard from "../UI/StatsCard";
import StatusBadge from "../UI/StatusBadge";
import { getStatusDisplay } from "../utils/statusHelpers";
import type { OrderStatus } from "../types/status";

// Styled Components
const DashboardLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(24rem, 1fr));
  gap: 2.4rem;
`;

const Section = styled.section`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Table = styled.div`
  width: 100%;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr 1fr;
  gap: 1.6rem;
  padding: 1.2rem 1.6rem;
  background-color: var(--color-grey-50);
  border-radius: var(--border-radius-sm);
  font-weight: 600;
  font-size: 1.3rem;
  text-transform: uppercase;
  color: var(--color-grey-600);
  margin-bottom: 1rem;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr 1fr;
  gap: 1.6rem;
  padding: 1.6rem;
  border-bottom: 1px solid var(--color-grey-100);
  align-items: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--color-grey-50);
    cursor: pointer;
  }

  &:last-child {
    border-bottom: none;
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

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
  gap: 1.6rem;
`;

const ActionCard = styled.div`
  padding: 2rem;
  background: linear-gradient(
    135deg,
    var(--color-brand-600) 0%,
    var(--color-brand-700) 100%
  );
  border-radius: var(--border-radius-md);
  color: var(--color-grey-0);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  & h3 {
    font-size: 1.6rem;
    margin-bottom: 0.8rem;
  }

  & p {
    font-size: 1.3rem;
    opacity: 0.9;
  }

  & svg {
    width: 3.2rem;
    height: 3.2rem;
    margin-bottom: 1.2rem;
  }
`;

// Mock Data (Replace with API calls later)
const mockStats = {
  totalRevenue: 145231,
  totalOrders: 324,
  activeDeliveries: 18,
  totalClients: 67,
};

const mockRecentOrders = [
  {
    id: "ORD-001",
    client: "Carrefour Lac 2",
    amount: 1250,
    status: "out-for-delivery" as OrderStatus,
    date: "Today, 10:30 AM",
  },
  {
    id: "ORD-002",
    client: "Monoprix Menzah",
    amount: 890,
    status: "delivered" as OrderStatus,
    date: "Today, 09:15 AM",
  },
  {
    id: "ORD-003",
    client: "Magasin Général Marsa",
    amount: 2100,
    status: "processing" as OrderStatus,
    date: "Today, 08:45 AM",
  },
  {
    id: "ORD-004",
    client: "Superette Ariana",
    amount: 450,
    status: "pending" as OrderStatus,
    date: "Yesterday, 16:20 PM",
  },
  {
    id: "ORD-005",
    client: "Aziza Market",
    amount: 1680,
    status: "confirmed" as OrderStatus,
    date: "Yesterday, 15:10 PM",
  },
];

function Dashboard() {
  return (
    <DashboardLayout>
      {/* Header */}
      <Row type="horizontal">
        <Heading as="h1">Dashboard Overview</Heading>
        <p style={{ color: "var(--color-grey-600)" }}>
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </Row>

      {/* Stats Cards */}
      <StatsGrid>
        <StatsCard
          title="Total Revenue"
          value={`${mockStats.totalRevenue.toLocaleString()} TND`}
          icon={<HiOutlineCurrencyDollar />}
          color="var(--color-green-700)"
          trend={{ value: "+12.5% from last month", isPositive: true }}
        />
        <StatsCard
          title="Total Orders"
          value={mockStats.totalOrders}
          icon={<HiOutlineShoppingCart />}
          color="var(--color-blue-700)"
          trend={{ value: "+8.2% from last month", isPositive: true }}
        />
        <StatsCard
          title="Active Deliveries"
          value={mockStats.activeDeliveries}
          icon={<HiOutlineTruck />}
          color="var(--color-brand-600)"
        />
        <StatsCard
          title="Total Clients"
          value={mockStats.totalClients}
          icon={<HiOutlineUsers />}
          color="var(--color-yellow-700)"
          trend={{ value: "+3 new this week", isPositive: true }}
        />
      </StatsGrid>

      {/* Quick Actions */}
      <Section>
        <SectionHeader>
          <Heading as="h2">Quick Actions</Heading>
        </SectionHeader>
        <QuickActions>
          <ActionCard onClick={() => console.log("New Order")}>
            <HiOutlineShoppingCart />
            <h3>Create New Order</h3>
            <p>Place an order for a client</p>
          </ActionCard>
          <ActionCard onClick={() => console.log("Add Client")}>
            <HiOutlineUsers />
            <h3>Add New Client</h3>
            <p>Register a new store</p>
          </ActionCard>
          <ActionCard onClick={() => console.log("View Deliveries")}>
            <HiOutlineTruck />
            <h3>View Deliveries</h3>
            <p>Track active deliveries</p>
          </ActionCard>
        </QuickActions>
      </Section>

      {/* Recent Orders */}
      <Section>
        <SectionHeader>
          <Heading as="h2">Recent Orders</Heading>
          <button
            style={{
              background: "none",
              border: "none",
              color: "var(--color-brand-600)",
              cursor: "pointer",
              fontSize: "1.4rem",
              fontWeight: 600,
            }}
            onClick={() => console.log("View All Orders")}
          >
            View All →
          </button>
        </SectionHeader>

        <Table>
          <TableHeader>
            <div>Order ID</div>
            <div>Client</div>
            <div>Amount</div>
            <div>Status</div>
            <div>Date</div>
          </TableHeader>

          {mockRecentOrders.map((order) => {
            const { icon, label } = getStatusDisplay(order.status);
            return (
              <TableRow
                key={order.id}
                onClick={() => console.log("Order clicked:", order.id)}
              >
                <OrderId>#{order.id}</OrderId>
                <ClientName>{order.client}</ClientName>
                <Amount>{order.amount} TND</Amount>
                <div>
                  <StatusBadge $status={order.status}>
                    {icon} {label}
                  </StatusBadge>
                </div>
                <div
                  style={{ fontSize: "1.3rem", color: "var(--color-grey-600)" }}
                >
                  {order.date}
                </div>
              </TableRow>
            );
          })}
        </Table>
      </Section>
    </DashboardLayout>
  );
}

export default Dashboard;
