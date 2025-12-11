import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  HiOutlineCurrencyDollar,
  HiOutlineShoppingCart,
  HiOutlineTruck,
  HiOutlineUsers,
  HiOutlineClock,
  HiOutlineExclamationTriangle,
  HiOutlineArrowTrendingUp,
  HiOutlineMapPin,
} from "react-icons/hi2";
import Heading from "../UI/Heading";
import Row from "../UI/Row";
import StatsCard from "../UI/StatsCard";
import StatusBadge from "../UI/StatusBadge";
import { getStatusDisplay } from "../utils/statusHelpers";
import type { OrderStatus } from "../types/status";
import DeliveryCalendar from "../components/DeliveryCalendar";
import WeatherWidget from "../components/WeatherWidget";

// Styled Components
const DashboardLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(24rem, 1fr));
  gap: 2.4rem;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2.4rem;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
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
  padding-bottom: 1.2rem;
  border-bottom: 1px solid var(--color-grey-200);
`;

const ViewAllButton = styled.button`
  background: none;
  border: none;
  color: var(--color-brand-600);
  cursor: pointer;
  fontsize: 1.4rem;
  font-weight: 600;
  transition: color 0.2s;

  &:hover {
    color: var(--color-brand-700);
  }
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

// NEW: Chart Container
const ChartContainer = styled.div`
  margin-top: 1.6rem;
  padding: 1.6rem;
  background-color: var(--color-grey-50);
  border-radius: var(--border-radius-md);
`;

const ChartBar = styled.div<{ $width: number; $color: string }>`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 1.2rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ChartLabel = styled.span`
  min-width: 8rem;
  font-size: 1.3rem;
  font-weight: 500;
  color: var(--color-grey-700);
`;

const ChartBarFill = styled.div<{ $width: number; $color: string }>`
  flex: 1;
  height: 3rem;
  background-color: var(--color-grey-200);
  border-radius: var(--border-radius-sm);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${(props) => props.$width}%;
    background: ${(props) => props.$color};
    transition: width 0.5s ease;
  }
`;

const ChartValue = styled.span`
  min-width: 6rem;
  text-align: right;
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--color-grey-700);
`;

// NEW: Alert Card
const AlertCard = styled.div<{ $type: "warning" | "info" | "success" }>`
  display: flex;
  align-items: flex-start;
  gap: 1.2rem;
  padding: 1.6rem;
  background-color: ${(props) =>
    props.$type === "warning"
      ? "var(--color-yellow-50)"
      : props.$type === "info"
      ? "var(--color-blue-50)"
      : "var(--color-green-50)"};
  border-left: 4px solid
    ${(props) =>
      props.$type === "warning"
        ? "var(--color-yellow-700)"
        : props.$type === "info"
        ? "var(--color-blue-700)"
        : "var(--color-green-700)"};
  border-radius: var(--border-radius-sm);
  margin-bottom: 1.2rem;

  & svg {
    width: 2rem;
    height: 2rem;
    color: ${(props) =>
      props.$type === "warning"
        ? "var(--color-yellow-700)"
        : props.$type === "info"
        ? "var(--color-blue-700)"
        : "var(--color-green-700)"};
    flex-shrink: 0;
    margin-top: 0.2rem;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const AlertContent = styled.div`
  flex: 1;

  & h4 {
    font-size: 1.4rem;
    font-weight: 600;
    margin-bottom: 0.4rem;
    color: var(--color-grey-800);
  }

  & p {
    font-size: 1.3rem;
    color: var(--color-grey-600);
    margin: 0 0 1rem 0;
  }
`;

const AlertButton = styled.button`
  padding: 0.6rem 1.2rem;
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-300);
  border-radius: var(--border-radius-sm);
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
    transform: translateX(4px);
  }
`;

// NEW: Activity Timeline
const TimelineItem = styled.div`
  display: flex;
  gap: 1.2rem;
  padding: 1.2rem 0;
  border-bottom: 1px solid var(--color-grey-100);

  &:last-child {
    border-bottom: none;
  }
`;

const TimelineDot = styled.div<{ $color: string }>`
  width: 1rem;
  height: 1rem;
  background-color: ${(props) => props.$color};
  border-radius: 50%;
  margin-top: 0.6rem;
  flex-shrink: 0;
`;

const TimelineContent = styled.div`
  flex: 1;

  & p {
    font-size: 1.3rem;
    color: var(--color-grey-700);
    margin: 0 0 0.4rem 0;
  }

  & span {
    font-size: 1.2rem;
    color: var(--color-grey-500);
  }
`;

// NEW: Delivery Map (Placeholder)
const MapPlaceholder = styled.div`
  width: 100%;
  height: 25rem;
  background: linear-gradient(
    135deg,
    var(--color-brand-100),
    var(--color-brand-200)
  );
  border-radius: var(--border-radius-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
  color: var(--color-grey-0);

  & h3 {
    font-size: 1.8rem;
    margin: 0;
  }

  & p {
    font-size: 1.4rem;
    opacity: 0.9;
    margin: 0;
  }

  & svg {
    width: 4rem;
    height: 4rem;
  }
`;
const TodayHighlight = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2.4rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: var(--border-radius-lg);
  color: var(--color-grey-0);
  box-shadow: var(--shadow-lg);
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(16, 185, 129, 0.3);
  }
`;

const HighlightContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;

  & h3 {
    font-size: 1.6rem;
    font-weight: 600;
    margin: 0;
  }

  & p {
    font-size: 3.2rem;
    font-weight: 700;
    margin: 0;
  }

  & span {
    font-size: 1.3rem;
    opacity: 0.9;
  }
`;

const HighlightIcon = styled.div`
  font-size: 6rem;
  opacity: 0.8;
`;
// Mock Data
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

// NEW: Top Products Data
const topProducts = [
  { name: "Full Cream Milk", sales: 1250, percentage: 100 },
  { name: "Greek Yogurt", sales: 980, percentage: 78 },
  { name: "Butter", sales: 750, percentage: 60 },
  { name: "Cheese", sales: 620, percentage: 50 },
  { name: "Skimmed Milk", sales: 450, percentage: 36 },
];

// NEW: Alerts/Notifications
const alerts = [
  {
    type: "warning" as const,
    title: "Low Stock Alert",
    message: "3 products are running low on stock",
    actionLabel: "View Products",
    actionLink: "/products",
  },
  {
    type: "info" as const,
    title: "Pending Orders",
    message: "5 orders waiting for confirmation",
    actionLabel: "Review Orders",
    actionLink: "/orders?status=pending",
  },
  {
    type: "warning" as const,
    title: "Overdue Invoices",
    message: "2 invoices are past due date",
    actionLabel: "View Invoices",
    actionLink: "/invoices?status=overdue",
  },
];

// NEW: Recent Activity
const recentActivity = [
  {
    action: "New order created",
    details: "Order #ORD-001 from Carrefour Lac 2",
    time: "5 minutes ago",
    color: "var(--color-blue-700)",
  },
  {
    action: "Delivery completed",
    details: "Delivery #DEL-045 marked as delivered",
    time: "12 minutes ago",
    color: "var(--color-green-700)",
  },
  {
    action: "Payment received",
    details: "1,250 TND from Monoprix Menzah",
    time: "1 hour ago",
    color: "var(--color-yellow-700)",
  },
  {
    action: "New client registered",
    details: "Café des Arts added to system",
    time: "2 hours ago",
    color: "var(--color-brand-600)",
  },
];

function Dashboard() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      {/* Header */}
      <Row type="horizontal">
        <div>
          <Heading as="h1">Dashboard Overview</Heading>
          <p style={{ color: "var(--color-grey-600)", marginTop: "0.8rem" }}>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </Row>

      {/* Stats Cards */}
      <StatsGrid>
        <StatsCard
          title="Total Revenue"
          value={`${mockStats.totalRevenue.toLocaleString()} TND`}
          icon={<HiOutlineCurrencyDollar />}
          color="var(--color-green-700)"
          trend={{ value: "+12.5% from last month", isPositive: true }}
          onClick={() => navigate("/analytics")}
          style={{ cursor: "pointer", transition: "transform 0.2s" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
          }}
        />
        <StatsCard
          title="Total Orders"
          value={mockStats.totalOrders}
          icon={<HiOutlineShoppingCart />}
          color="var(--color-blue-700)"
          trend={{ value: "+8.2% from last month", isPositive: true }}
          onClick={() => navigate("/orders")}
          style={{ cursor: "pointer", transition: "transform 0.2s" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "translateY(-4px)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "translateY(0)")
          }
        />
        <StatsCard
          title="Active Deliveries"
          value={mockStats.activeDeliveries}
          icon={<HiOutlineTruck />}
          color="var(--color-brand-600)"
          onClick={() => navigate("/deliveries")}
          style={{ cursor: "pointer", transition: "transform 0.2s" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "translateY(-4px)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "translateY(0)")
          }
        />
        <StatsCard
          title="Total Clients"
          value={mockStats.totalClients}
          icon={<HiOutlineUsers />}
          color="var(--color-yellow-700)"
          trend={{ value: "+3 new this week", isPositive: true }}
          onClick={() => navigate("/clients")}
          style={{ cursor: "pointer", transition: "transform 0.2s" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "translateY(-4px)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "translateY(0)")
          }
        />
      </StatsGrid>

      {/* Today's Deliveries Highlight */}
      <TodayHighlight onClick={() => navigate("/deliveries")}>
        <HighlightContent>
          <h3>📦 Today's Deliveries</h3>
          <p>{mockStats.activeDeliveries}</p>
          <span>5 completed • 3 in progress • 2 pending</span>
        </HighlightContent>
        <HighlightIcon>
          <HiOutlineTruck />
        </HighlightIcon>
      </TodayHighlight>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Section>
          <SectionHeader>
            <Heading as="h2">Alerts & Notifications</Heading>
          </SectionHeader>
          {alerts.map((alert, index) => (
            <AlertCard key={index} $type={alert.type}>
              <HiOutlineExclamationTriangle />
              <AlertContent>
                <h4>{alert.title}</h4>
                <p>{alert.message}</p>
                <AlertButton onClick={() => navigate(alert.actionLink)}>
                  {alert.actionLabel} →
                </AlertButton>
              </AlertContent>
            </AlertCard>
          ))}
        </Section>
      )}

      {/* Main Content Grid */}
      <ContentGrid>
        {/* Left Column */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "2.4rem" }}
        >
          {/* Quick Actions */}
          <Section>
            <SectionHeader>
              <Heading as="h2">Quick Actions</Heading>
            </SectionHeader>
            <QuickActions>
              <ActionCard onClick={() => navigate("/orders")}>
                <HiOutlineShoppingCart />
                <h3>Create New Order</h3>
                <p>Place an order for a client</p>
              </ActionCard>
              <ActionCard onClick={() => navigate("/clients")}>
                <HiOutlineUsers />
                <h3>Add New Client</h3>
                <p>Register a new store</p>
              </ActionCard>
              <ActionCard onClick={() => navigate("/deliveries")}>
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
              <ViewAllButton onClick={() => navigate("/orders")}>
                View All →
              </ViewAllButton>
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
                    onClick={() => navigate(`/orders/${order.id}`)}
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
                      style={{
                        fontSize: "1.3rem",
                        color: "var(--color-grey-600)",
                      }}
                    >
                      {order.date}
                    </div>
                  </TableRow>
                );
              })}
            </Table>
          </Section>

          {/* Top Selling Products */}
          <Section>
            <SectionHeader>
              <Heading as="h2">
                <HiOutlineArrowTrendingUp
                  style={{ display: "inline", marginRight: "0.8rem" }}
                />
                Top Selling Products
              </Heading>
              <ViewAllButton onClick={() => navigate("/products")}>
                View All →
              </ViewAllButton>
            </SectionHeader>

            <ChartContainer>
              {topProducts.map((product, index) => (
                <ChartBar
                  key={index}
                  $width={product.percentage}
                  $color="var(--color-brand-600)"
                >
                  <ChartLabel>{product.name}</ChartLabel>
                  <ChartBarFill
                    $width={product.percentage}
                    $color="var(--color-brand-600)"
                  />
                  <ChartValue>{product.sales.toLocaleString()} TND</ChartValue>
                </ChartBar>
              ))}
            </ChartContainer>
          </Section>
        </div>

        {/* Right Column */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "2.4rem" }}
        >
          {/* Weather Widget  */}
          <Section>
            <SectionHeader>
              <Heading as="h2">Weather Forecast</Heading>
            </SectionHeader>
            <WeatherWidget city="Tunis" country="TN" />
          </Section>

          {/* Delivery Calendar */}
          <Section>
            <SectionHeader>
              <Heading as="h2">Delivery Schedule</Heading>
            </SectionHeader>
            <DeliveryCalendar
              deliveries={[
                { date: "2025-10-11", count: 5 },
                { date: "2025-10-12", count: 3 },
                { date: "2025-10-14", count: 8 },
                { date: "2025-10-15", count: 2 },
              ]}
              onDateClick={(date) => {
                navigate(
                  `/deliveries?date=${date.toISOString().split("T")[0]}`
                );
              }}
            />
          </Section>

          {/* Active Deliveries Map */}
          <Section>
            <SectionHeader>
              <Heading as="h2">Active Deliveries</Heading>
              <ViewAllButton onClick={() => navigate("/deliveries")}>
                View All →
              </ViewAllButton>
            </SectionHeader>
            <MapPlaceholder>
              <HiOutlineMapPin />
              <h3>{mockStats.activeDeliveries} Active</h3>
              <p>Click to view live tracking</p>
            </MapPlaceholder>
          </Section>

          {/* Recent Activity */}
          <Section>
            <SectionHeader>
              <Heading as="h2">
                <HiOutlineClock
                  style={{ display: "inline", marginRight: "0.8rem" }}
                />
                Recent Activity
              </Heading>
            </SectionHeader>
            {recentActivity.map((activity, index) => (
              <TimelineItem key={index}>
                <TimelineDot $color={activity.color} />
                <TimelineContent>
                  <p>
                    <strong>{activity.action}</strong>
                  </p>
                  <p
                    style={{
                      color: "var(--color-grey-600)",
                      marginBottom: "0.4rem",
                    }}
                  >
                    {activity.details}
                  </p>
                  <span>{activity.time}</span>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Section>
        </div>
      </ContentGrid>
    </DashboardLayout>
  );
}

export default Dashboard;
