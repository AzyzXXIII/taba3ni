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
  HiOutlineCheckCircle,
  HiOutlineDocumentText,
  HiOutlineStar,
  HiOutlineCalendar,
} from "react-icons/hi2";
import Heading from "../UI/Heading";
import Row from "../UI/Row";
import StatsCard from "../UI/StatsCard";
import Button from "../UI/Button";
import StatusBadge from "../UI/StatusBadge";
import { getStatusDisplay } from "../utils/statusHelpers";
import type { OrderStatus } from "../types/status";
import DeliveryCalendar from "../components/DeliveryCalendar";
import WeatherWidget from "../components/WeatherWidget";
import { useNotifications } from "../hooks/useNotifications";

// ─── Shared Styled Components ────────────────────────────────────────────────

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
  font-size: 1.4rem;
  font-weight: 600;
  transition: color 0.2s;

  &:hover {
    color: var(--color-brand-700);
  }
`;

const Table = styled.div`
  width: 100%;
`;

const TableHeader = styled.div<{ $cols: string }>`
  display: grid;
  grid-template-columns: ${(p) => p.$cols};
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

const TableRow = styled.div<{ $cols: string }>`
  display: grid;
  grid-template-columns: ${(p) => p.$cols};
  gap: 1.6rem;
  padding: 1.6rem;
  border-bottom: 1px solid var(--color-grey-100);
  align-items: center;
  transition: background-color 0.2s;
  cursor: pointer;

  &:hover {
    background-color: var(--color-grey-50);
  }
  &:last-child {
    border-bottom: none;
  }
`;

const ColBrand = styled.span`
  font-weight: 600;
  color: var(--color-brand-600);
`;

const AlertCard = styled.div<{ $type: "warning" | "info" | "success" }>`
  display: flex;
  align-items: flex-start;
  gap: 1.2rem;
  padding: 1.6rem;
  background-color: ${(p) =>
    p.$type === "warning"
      ? "var(--color-yellow-50)"
      : p.$type === "info"
        ? "var(--color-blue-50)"
        : "var(--color-green-50)"};
  border-left: 4px solid
    ${(p) =>
      p.$type === "warning"
        ? "var(--color-yellow-700)"
        : p.$type === "info"
          ? "var(--color-blue-700)"
          : "var(--color-green-700)"};
  border-radius: var(--border-radius-sm);
  margin-bottom: 1.2rem;

  & svg {
    width: 2rem;
    height: 2rem;
    color: ${(p) =>
      p.$type === "warning"
        ? "var(--color-yellow-700)"
        : p.$type === "info"
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
  background-color: ${(p) => p.$color};
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

const TodayHighlight = styled.div<{ $gradient: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2.4rem;
  background: ${(p) => p.$gradient};
  border-radius: var(--border-radius-lg);
  color: var(--color-grey-0);
  box-shadow: var(--shadow-lg);
  cursor: pointer;
  transition: all 0.3s;
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-xl, var(--shadow-lg));
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
  & svg {
    width: 6rem;
    height: 6rem;
  }
`;

const ChartContainer = styled.div`
  margin-top: 1.6rem;
  padding: 1.6rem;
  background-color: var(--color-grey-50);
  border-radius: var(--border-radius-md);
`;

const ChartBar = styled.div`
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
    width: ${(p) => p.$width}%;
    background: ${(p) => p.$color};
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

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
  gap: 1.6rem;
`;

const ActionCard = styled.div<{ $gradient?: string }>`
  padding: 2rem;
  background: ${(p) =>
    p.$gradient ||
    "linear-gradient(135deg, var(--color-brand-600) 0%, var(--color-brand-700) 100%)"};
  border-radius: var(--border-radius-md);
  color: var(--color-grey-0);
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
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

// ─── Progress Bar (for distributor) ──────────────────────────────────────────

const ProgressRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-bottom: 1.6rem;
  &:last-child {
    margin-bottom: 0;
  }
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--color-grey-700);
`;

const ProgressBar = styled.div<{ $pct: number; $color: string }>`
  height: 1rem;
  background-color: var(--color-grey-200);
  border-radius: 100px;
  overflow: hidden;

  &::after {
    content: "";
    display: block;
    height: 100%;
    width: ${(p) => p.$pct}%;
    background: ${(p) => p.$color};
    border-radius: 100px;
    transition: width 0.6s ease;
  }
`;

// ─── Greeting Banner ─────────────────────────────────────────────────────────

const GreetingBanner = styled.div<{ $gradient: string }>`
  padding: 2.4rem 3.2rem;
  background: ${(p) => p.$gradient};
  border-radius: var(--border-radius-lg);
  color: var(--color-grey-0);

  & h2 {
    font-size: 2.4rem;
    font-weight: 700;
    margin: 0 0 0.4rem 0;
  }
  & p {
    font-size: 1.5rem;
    opacity: 0.9;
    margin: 0;
  }
`;

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockAdminStats = {
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
    date: "Today, 10:30",
  },
  {
    id: "ORD-002",
    client: "Monoprix Menzah",
    amount: 890,
    status: "delivered" as OrderStatus,
    date: "Today, 09:15",
  },
  {
    id: "ORD-003",
    client: "Magasin Général Marsa",
    amount: 2100,
    status: "processing" as OrderStatus,
    date: "Today, 08:45",
  },
  {
    id: "ORD-004",
    client: "Superette Ariana",
    amount: 450,
    status: "pending" as OrderStatus,
    date: "Yesterday",
  },
  {
    id: "ORD-005",
    client: "Aziza Market",
    amount: 1680,
    status: "confirmed" as OrderStatus,
    date: "Yesterday",
  },
];

const topProducts = [
  { name: "Full Cream Milk", sales: 1250, percentage: 100 },
  { name: "Greek Yogurt", sales: 980, percentage: 78 },
  { name: "Butter", sales: 750, percentage: 60 },
  { name: "Cheese", sales: 620, percentage: 50 },
  { name: "Skimmed Milk", sales: 450, percentage: 36 },
];

const adminAlerts = [
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
    actionLink: "/orders",
  },
  {
    type: "warning" as const,
    title: "Overdue Invoices",
    message: "2 invoices are past due date",
    actionLabel: "View Invoices",
    actionLink: "/invoices",
  },
];

const recentActivity = [
  {
    action: "New order created",
    details: "Order #ORD-001 from Carrefour Lac 2",
    time: "5 min ago",
    color: "var(--color-blue-700)",
  },
  {
    action: "Delivery completed",
    details: "Delivery #DEL-045 marked as delivered",
    time: "12 min ago",
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

// Distributor mock
const mockDistributorData = {
  assignedToday: 6,
  completed: 4,
  inProgress: 1,
  pending: 1,
  totalAmountToday: 8750,
  onTimeRate: 97,
  avgDeliveryTime: 24,
  deliveriesToday: [
    {
      id: "DEL-031",
      client: "Carrefour Lac 2",
      address: "Avenue de la Bourse, Lac 2",
      status: "completed" as DeliveryStatus,
      time: "09:00",
      amount: 3450,
    },
    {
      id: "DEL-032",
      client: "Monoprix Menzah",
      address: "Avenue Habib Bourguiba",
      status: "completed" as DeliveryStatus,
      time: "10:30",
      amount: 2100,
    },
    {
      id: "DEL-033",
      client: "Magasin Général Marsa",
      address: "Rue de la République",
      status: "in-progress" as DeliveryStatus,
      time: "14:00",
      amount: 1500,
    },
    {
      id: "DEL-034",
      client: "Superette Ariana",
      address: "Avenue de la Liberté",
      status: "scheduled" as DeliveryStatus,
      time: "15:30",
      amount: 890,
    },
    {
      id: "DEL-035",
      client: "Aziza Menzah",
      address: "Rue Ibn Khaldoun",
      status: "scheduled" as DeliveryStatus,
      time: "16:30",
      amount: 810,
    },
  ],
};

type DeliveryStatus = "scheduled" | "in-progress" | "completed" | "failed";

const deliveryStatusColor: Record<DeliveryStatus, string> = {
  scheduled: "pending",
  "in-progress": "processing",
  completed: "delivered",
  failed: "failed",
};

const deliveryStatusLabel: Record<DeliveryStatus, string> = {
  scheduled: "Scheduled",
  "in-progress": "In Progress",
  completed: "Completed",
  failed: "Failed",
};

// Client mock
const mockClientData = {
  activeOrders: 3,
  pendingDeliveries: 2,
  totalSpentMonth: 7200,
  unpaidInvoices: 1,
  recentOrders: [
    {
      id: "ORD-001",
      products: "Full Cream Milk × 50, Yogurt × 20",
      amount: 3450,
      status: "out-for-delivery" as OrderStatus,
      date: "Today",
    },
    {
      id: "ORD-004",
      products: "Butter × 30, Cheese × 10",
      amount: 2100,
      status: "processing" as OrderStatus,
      date: "Yesterday",
    },
    {
      id: "ORD-007",
      products: "Skimmed Milk × 40",
      amount: 1650,
      status: "confirmed" as OrderStatus,
      date: "2 days ago",
    },
  ],
  upcomingDeliveries: [
    {
      id: "DEL-001",
      date: "Today 14:00",
      distributor: "Ahmed Mahmoudi",
      status: "in-progress" as DeliveryStatus,
    },
    {
      id: "DEL-005",
      date: "Tomorrow 09:00",
      distributor: "Karim Belaid",
      status: "scheduled" as DeliveryStatus,
    },
  ],
  invoices: [
    { id: "INV-021", amount: 3450, due: "Dec 31", status: "unpaid" },
    { id: "INV-018", amount: 2100, due: "Dec 28", status: "paid" },
  ],
};

// ─── Props ────────────────────────────────────────────────────────────────────

type DashboardProps = {
  userRole?: "admin" | "distributor" | "client";
  userId?: string;
  userName?: string;
};

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

function AdminDashboard() {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const testNotifications = () => {
    addNotification(
      "Order Placed Successfully",
      "Your order #ORD-123 has been confirmed",
      "success",
      { priority: "high", playSound: true },
    );
    setTimeout(
      () =>
        addNotification(
          "Low Stock Warning",
          "Full Cream Milk is running low (only 5 units left)",
          "warning",
          { priority: "medium", playSound: true },
        ),
      2000,
    );
    setTimeout(
      () =>
        addNotification(
          "Payment Failed",
          "Unable to process payment for invoice #INV-456",
          "error",
          { priority: "high", playSound: true },
        ),
      4000,
    );
    setTimeout(
      () =>
        addNotification(
          "System Update",
          "A new version is available.",
          "info",
          { priority: "low", playSound: false },
        ),
      6000,
    );
  };

  return (
    <DashboardLayout>
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
        <Button onClick={testNotifications}>🧪 Test Notifications</Button>
      </Row>

      <StatsGrid>
        <StatsCard
          title="Total Revenue"
          value={`${mockAdminStats.totalRevenue.toLocaleString()} TND`}
          icon={<HiOutlineCurrencyDollar />}
          color="var(--color-green-700)"
          trend={{ value: "+12.5% from last month", isPositive: true }}
          onClick={() => navigate("/analytics")}
        />
        <StatsCard
          title="Total Orders"
          value={mockAdminStats.totalOrders}
          icon={<HiOutlineShoppingCart />}
          color="var(--color-blue-700)"
          trend={{ value: "+8.2% from last month", isPositive: true }}
          onClick={() => navigate("/orders")}
        />
        <StatsCard
          title="Active Deliveries"
          value={mockAdminStats.activeDeliveries}
          icon={<HiOutlineTruck />}
          color="var(--color-brand-600)"
          onClick={() => navigate("/deliveries")}
        />
        <StatsCard
          title="Total Clients"
          value={mockAdminStats.totalClients}
          icon={<HiOutlineUsers />}
          color="var(--color-yellow-700)"
          trend={{ value: "+3 new this week", isPositive: true }}
          onClick={() => navigate("/clients")}
        />
      </StatsGrid>

      <TodayHighlight
        $gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
        onClick={() => navigate("/deliveries")}
      >
        <HighlightContent>
          <h3>📦 Today's Deliveries</h3>
          <p>{mockAdminStats.activeDeliveries}</p>
          <span>5 completed • 3 in progress • 2 pending</span>
        </HighlightContent>
        <HighlightIcon>
          <HiOutlineTruck />
        </HighlightIcon>
      </TodayHighlight>

      {adminAlerts.length > 0 && (
        <Section>
          <SectionHeader>
            <Heading as="h2">Alerts & Notifications</Heading>
          </SectionHeader>
          {adminAlerts.map((alert, i) => (
            <AlertCard key={i} $type={alert.type}>
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

      <ContentGrid>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "2.4rem" }}
        >
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
              <ActionCard
                onClick={() => navigate("/clients")}
                $gradient="linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)"
              >
                <HiOutlineUsers />
                <h3>Add New Client</h3>
                <p>Register a new store</p>
              </ActionCard>
              <ActionCard
                onClick={() => navigate("/deliveries")}
                $gradient="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
              >
                <HiOutlineTruck />
                <h3>View Deliveries</h3>
                <p>Track active deliveries</p>
              </ActionCard>
            </QuickActions>
          </Section>

          <Section>
            <SectionHeader>
              <Heading as="h2">Recent Orders</Heading>
              <ViewAllButton onClick={() => navigate("/orders")}>
                View All →
              </ViewAllButton>
            </SectionHeader>
            <Table>
              <TableHeader $cols="1fr 2fr 1fr 1fr 1fr">
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
                    $cols="1fr 2fr 1fr 1fr 1fr"
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    <ColBrand>#{order.id}</ColBrand>
                    <span style={{ fontWeight: 500 }}>{order.client}</span>
                    <span style={{ fontWeight: 600 }}>{order.amount} TND</span>
                    <StatusBadge $status={order.status}>
                      {icon} {label}
                    </StatusBadge>
                    <span
                      style={{
                        fontSize: "1.3rem",
                        color: "var(--color-grey-600)",
                      }}
                    >
                      {order.date}
                    </span>
                  </TableRow>
                );
              })}
            </Table>
          </Section>

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
              {topProducts.map((p, i) => (
                <ChartBar key={i}>
                  <ChartLabel>{p.name}</ChartLabel>
                  <ChartBarFill
                    $width={p.percentage}
                    $color="var(--color-brand-600)"
                  />
                  <ChartValue>{p.sales.toLocaleString()} TND</ChartValue>
                </ChartBar>
              ))}
            </ChartContainer>
          </Section>
        </div>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "2.4rem" }}
        >
          <Section>
            <SectionHeader>
              <Heading as="h2">Weather Forecast</Heading>
            </SectionHeader>
            <WeatherWidget city="Tunis" country="TN" />
          </Section>

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
              onDateClick={(date) =>
                navigate(`/deliveries?date=${date.toISOString().split("T")[0]}`)
              }
            />
          </Section>

          <Section>
            <SectionHeader>
              <Heading as="h2">Active Deliveries</Heading>
              <ViewAllButton onClick={() => navigate("/deliveries")}>
                View All →
              </ViewAllButton>
            </SectionHeader>
            <MapPlaceholder>
              <HiOutlineMapPin />
              <h3>{mockAdminStats.activeDeliveries} Active</h3>
              <p>Click to view live tracking</p>
            </MapPlaceholder>
          </Section>

          <Section>
            <SectionHeader>
              <Heading as="h2">
                <HiOutlineClock
                  style={{ display: "inline", marginRight: "0.8rem" }}
                />
                Recent Activity
              </Heading>
            </SectionHeader>
            {recentActivity.map((a, i) => (
              <TimelineItem key={i}>
                <TimelineDot $color={a.color} />
                <TimelineContent>
                  <p>
                    <strong>{a.action}</strong>
                  </p>
                  <p
                    style={{
                      color: "var(--color-grey-600)",
                      marginBottom: "0.4rem",
                    }}
                  >
                    {a.details}
                  </p>
                  <span>{a.time}</span>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Section>
        </div>
      </ContentGrid>
    </DashboardLayout>
  );
}

// ─── Distributor Dashboard ────────────────────────────────────────────────────

function DistributorDashboard({ userName = "Ahmed" }: { userName?: string }) {
  const navigate = useNavigate();
  const firstName = userName.split(" ")[0];
  const d = mockDistributorData;
  const completionPct = Math.round((d.completed / d.assignedToday) * 100);

  return (
    <DashboardLayout>
      <GreetingBanner $gradient="linear-gradient(135deg, #145DA0 0%, #0c3d6e 100%)">
        <h2>👋 Good morning, {firstName}!</h2>
        <p>
          You have <strong>{d.assignedToday}</strong> deliveries today —{" "}
          {d.completed} completed, {d.inProgress} in progress, {d.pending}{" "}
          pending.
        </p>
      </GreetingBanner>

      <StatsGrid>
        <StatsCard
          title="Assigned Today"
          value={d.assignedToday}
          icon={<HiOutlineCalendar />}
          color="var(--color-blue-700)"
        />
        <StatsCard
          title="Completed"
          value={d.completed}
          icon={<HiOutlineCheckCircle />}
          color="var(--color-green-700)"
          trend={{ value: `${completionPct}% done`, isPositive: true }}
        />
        <StatsCard
          title="In Progress"
          value={d.inProgress}
          icon={<HiOutlineTruck />}
          color="var(--color-brand-600)"
        />
        <StatsCard
          title="Today's Revenue"
          value={`${d.totalAmountToday.toLocaleString()} TND`}
          icon={<HiOutlineCurrencyDollar />}
          color="var(--color-yellow-700)"
        />
      </StatsGrid>

      <ContentGrid>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "2.4rem" }}
        >
          {/* Today's route */}
          <Section>
            <SectionHeader>
              <Heading as="h2">🗺️ Today's Route</Heading>
              <ViewAllButton onClick={() => navigate("/deliveries")}>
                View All →
              </ViewAllButton>
            </SectionHeader>
            <Table>
              <TableHeader $cols="1fr 2fr 1.5fr 1fr 1fr">
                <div>ID</div>
                <div>Client</div>
                <div>Time</div>
                <div>Amount</div>
                <div>Status</div>
              </TableHeader>
              {d.deliveriesToday.map((del) => (
                <TableRow
                  key={del.id}
                  $cols="1fr 2fr 1.5fr 1fr 1fr"
                  onClick={() => navigate(`/deliveryDetails/${del.id}`)}
                >
                  <ColBrand>#{del.id}</ColBrand>
                  <div>
                    <div style={{ fontWeight: 600 }}>{del.client}</div>
                    <div
                      style={{
                        fontSize: "1.2rem",
                        color: "var(--color-grey-500)",
                      }}
                    >
                      {del.address}
                    </div>
                  </div>
                  <span style={{ fontWeight: 600 }}>{del.time}</span>
                  <span style={{ fontWeight: 600 }}>
                    {del.amount.toLocaleString()} TND
                  </span>
                  <StatusBadge $status={deliveryStatusColor[del.status]}>
                    {deliveryStatusLabel[del.status]}
                  </StatusBadge>
                </TableRow>
              ))}
            </Table>
          </Section>

          {/* Quick actions */}
          <Section>
            <SectionHeader>
              <Heading as="h2">Quick Actions</Heading>
            </SectionHeader>
            <QuickActions>
              <ActionCard onClick={() => navigate("/deliveries")}>
                <HiOutlineTruck />
                <h3>My Deliveries</h3>
                <p>View all assigned deliveries</p>
              </ActionCard>
              <ActionCard
                $gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
                onClick={() => navigate("/deliveries")}
              >
                <HiOutlineCheckCircle />
                <h3>Mark Complete</h3>
                <p>Update delivery status</p>
              </ActionCard>
            </QuickActions>
          </Section>
        </div>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "2.4rem" }}
        >
          {/* Performance */}
          <Section>
            <SectionHeader>
              <Heading as="h2">📊 My Performance</Heading>
            </SectionHeader>
            <ProgressRow>
              <ProgressLabel>
                <span>Today's completion</span>
                <span>{completionPct}%</span>
              </ProgressLabel>
              <ProgressBar
                $pct={completionPct}
                $color="var(--color-green-600)"
              />
            </ProgressRow>
            <ProgressRow>
              <ProgressLabel>
                <span>On-time rate</span>
                <span>{d.onTimeRate}%</span>
              </ProgressLabel>
              <ProgressBar
                $pct={d.onTimeRate}
                $color="var(--color-brand-600)"
              />
            </ProgressRow>
            <ProgressRow>
              <ProgressLabel>
                <span>Avg delivery time</span>
                <span>{d.avgDeliveryTime} min</span>
              </ProgressLabel>
              <ProgressBar
                $pct={Math.min(100, ((40 - d.avgDeliveryTime) / 40) * 100 + 40)}
                $color="var(--color-blue-600)"
              />
            </ProgressRow>
          </Section>

          <Section>
            <SectionHeader>
              <Heading as="h2">Weather Forecast</Heading>
            </SectionHeader>
            <WeatherWidget city="Tunis" country="TN" />
          </Section>

          <Section>
            <SectionHeader>
              <Heading as="h2">Delivery Schedule</Heading>
            </SectionHeader>
            <DeliveryCalendar
              deliveries={[
                { date: "2025-10-11", count: 6 },
                { date: "2025-10-12", count: 4 },
                { date: "2025-10-14", count: 7 },
              ]}
              onDateClick={(date) =>
                navigate(`/deliveries?date=${date.toISOString().split("T")[0]}`)
              }
            />
          </Section>
        </div>
      </ContentGrid>
    </DashboardLayout>
  );
}

// ─── Client Dashboard ─────────────────────────────────────────────────────────

function ClientDashboard({
  userName = "Carrefour Lac 2",
}: {
  userName?: string;
}) {
  const navigate = useNavigate();
  const c = mockClientData;

  return (
    <DashboardLayout>
      <GreetingBanner $gradient="linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)">
        <h2>👋 Welcome, {userName}!</h2>
        <p>
          You have <strong>{c.activeOrders}</strong> active orders and{" "}
          <strong>{c.pendingDeliveries}</strong> upcoming deliveries.
        </p>
      </GreetingBanner>

      <StatsGrid>
        <StatsCard
          title="Active Orders"
          value={c.activeOrders}
          icon={<HiOutlineShoppingCart />}
          color="var(--color-blue-700)"
          onClick={() => navigate("/orders")}
        />
        <StatsCard
          title="Pending Deliveries"
          value={c.pendingDeliveries}
          icon={<HiOutlineTruck />}
          color="var(--color-brand-600)"
          onClick={() => navigate("/deliveries")}
        />
        <StatsCard
          title="Spent This Month"
          value={`${c.totalSpentMonth.toLocaleString()} TND`}
          icon={<HiOutlineCurrencyDollar />}
          color="var(--color-green-700)"
        />
        <StatsCard
          title="Unpaid Invoices"
          value={c.unpaidInvoices}
          icon={<HiOutlineDocumentText />}
          color={
            c.unpaidInvoices > 0
              ? "var(--color-red-600)"
              : "var(--color-grey-500)"
          }
          onClick={() => navigate("/invoices")}
        />
      </StatsGrid>

      {c.unpaidInvoices > 0 && (
        <AlertCard $type="warning">
          <HiOutlineExclamationTriangle />
          <AlertContent>
            <h4>Unpaid Invoice</h4>
            <p>
              You have {c.unpaidInvoices} invoice(s) due soon. Pay now to avoid
              interruptions.
            </p>
            <AlertButton onClick={() => navigate("/invoices")}>
              View Invoices →
            </AlertButton>
          </AlertContent>
        </AlertCard>
      )}

      <ContentGrid>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "2.4rem" }}
        >
          {/* Recent orders */}
          <Section>
            <SectionHeader>
              <Heading as="h2">My Recent Orders</Heading>
              <ViewAllButton onClick={() => navigate("/orders")}>
                View All →
              </ViewAllButton>
            </SectionHeader>
            <Table>
              <TableHeader $cols="1fr 3fr 1fr 1fr">
                <div>Order ID</div>
                <div>Products</div>
                <div>Amount</div>
                <div>Status</div>
              </TableHeader>
              {c.recentOrders.map((order) => {
                const { icon, label } = getStatusDisplay(order.status);
                return (
                  <TableRow
                    key={order.id}
                    $cols="1fr 3fr 1fr 1fr"
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    <ColBrand>#{order.id}</ColBrand>
                    <span
                      style={{
                        fontSize: "1.3rem",
                        color: "var(--color-grey-600)",
                      }}
                    >
                      {order.products}
                    </span>
                    <span style={{ fontWeight: 600 }}>
                      {order.amount.toLocaleString()} TND
                    </span>
                    <StatusBadge $status={order.status}>
                      {icon} {label}
                    </StatusBadge>
                  </TableRow>
                );
              })}
            </Table>
          </Section>

          {/* Upcoming deliveries */}
          <Section>
            <SectionHeader>
              <Heading as="h2">🚚 Upcoming Deliveries</Heading>
              <ViewAllButton onClick={() => navigate("/deliveries")}>
                View All →
              </ViewAllButton>
            </SectionHeader>
            <Table>
              <TableHeader $cols="1fr 2fr 2fr 1fr">
                <div>ID</div>
                <div>Scheduled</div>
                <div>Distributor</div>
                <div>Status</div>
              </TableHeader>
              {c.upcomingDeliveries.map((del) => (
                <TableRow key={del.id} $cols="1fr 2fr 2fr 1fr">
                  <ColBrand>#{del.id}</ColBrand>
                  <span style={{ fontWeight: 600 }}>{del.date}</span>
                  <span>{del.distributor}</span>
                  <StatusBadge $status={deliveryStatusColor[del.status]}>
                    {deliveryStatusLabel[del.status]}
                  </StatusBadge>
                </TableRow>
              ))}
            </Table>
          </Section>

          {/* Quick actions */}
          <Section>
            <SectionHeader>
              <Heading as="h2">Quick Actions</Heading>
            </SectionHeader>
            <QuickActions>
              <ActionCard onClick={() => navigate("/new-order")}>
                <HiOutlineShoppingCart />
                <h3>Place New Order</h3>
                <p>Order dairy products</p>
              </ActionCard>
              <ActionCard
                $gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
                onClick={() => navigate("/invoices")}
              >
                <HiOutlineDocumentText />
                <h3>View Invoices</h3>
                <p>Check payments & bills</p>
              </ActionCard>
            </QuickActions>
          </Section>
        </div>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "2.4rem" }}
        >
          {/* Invoice summary */}
          <Section>
            <SectionHeader>
              <Heading as="h2">💳 Invoices</Heading>
              <ViewAllButton onClick={() => navigate("/invoices")}>
                View All →
              </ViewAllButton>
            </SectionHeader>
            {c.invoices.map((inv) => (
              <div
                key={inv.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "1.2rem 0",
                  borderBottom: "1px solid var(--color-grey-100)",
                }}
              >
                <div>
                  <div
                    style={{ fontWeight: 600, color: "var(--color-brand-600)" }}
                  >
                    #{inv.id}
                  </div>
                  <div
                    style={{
                      fontSize: "1.2rem",
                      color: "var(--color-grey-500)",
                    }}
                  >
                    Due: {inv.due}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700, fontSize: "1.6rem" }}>
                    {inv.amount.toLocaleString()} TND
                  </div>
                  <StatusBadge
                    $status={inv.status === "paid" ? "delivered" : "pending"}
                  >
                    {inv.status === "paid" ? "✅ Paid" : "⏳ Unpaid"}
                  </StatusBadge>
                </div>
              </div>
            ))}
          </Section>

          {/* Rating / loyalty */}
          <Section>
            <SectionHeader>
              <Heading as="h2">⭐ Account Status</Heading>
            </SectionHeader>
            <div style={{ textAlign: "center", padding: "2rem 0" }}>
              <div style={{ fontSize: "5rem", marginBottom: "0.8rem" }}>🥇</div>
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: 700,
                  color: "var(--color-brand-600)",
                  marginBottom: "0.4rem",
                }}
              >
                Gold Client
              </div>
              <div
                style={{
                  fontSize: "1.4rem",
                  color: "var(--color-grey-600)",
                  marginBottom: "1.6rem",
                }}
              >
                Member since Jan 2024
              </div>
              <ProgressRow>
                <ProgressLabel>
                  <span>Loyalty points</span>
                  <span>720 / 1000</span>
                </ProgressLabel>
                <ProgressBar $pct={72} $color="var(--color-yellow-600)" />
              </ProgressRow>
              <div
                style={{
                  fontSize: "1.2rem",
                  color: "var(--color-grey-500)",
                  marginTop: "0.8rem",
                }}
              >
                280 points to Platinum status
              </div>
            </div>
          </Section>
        </div>
      </ContentGrid>
    </DashboardLayout>
  );
}

// ─── Root Dashboard (role switcher) ──────────────────────────────────────────

function Dashboard({ userRole = "admin", userId, userName }: DashboardProps) {
  if (userRole === "distributor")
    return <DistributorDashboard userName={userName} />;
  if (userRole === "client") return <ClientDashboard userName={userName} />;
  return <AdminDashboard />;
}

export default Dashboard;
