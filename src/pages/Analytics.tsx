import { useState } from "react";
import styled from "styled-components";
import {
  HiOutlineChartBar,
  HiOutlineTruck,
  HiOutlineCurrencyDollar,
  HiOutlineShoppingCart,
  HiOutlineArrowTrendingUp, // ✅ ADD THIS LINE
} from "react-icons/hi2";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import Heading from "../UI/Heading";
import Row from "../UI/Row";
import StatsCard from "../UI/StatsCard";
import Select from "../UI/Select";

// Styled Components
const AnalyticsLayout = styled.div`
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

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(24rem, 1fr));
  gap: 2.4rem;
`;

const ChartCard = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.4rem;
  padding-bottom: 1.6rem;
  border-bottom: 1px solid var(--color-grey-200);
`;

const ChartTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--color-grey-900);
`;

const Grid2Cols = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2.4rem;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const Grid1Col = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.4rem;
`;

const TopItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const TopItemCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.6rem;
  background-color: var(--color-grey-50);
  border-radius: var(--border-radius-sm);
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
    transform: translateX(4px);
  }
`;

const ItemInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
`;

const ItemRank = styled.div`
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
  color: var(--color-grey-0);
  font-weight: 700;
  font-size: 1.6rem;
`;

const ItemDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const ItemName = styled.span`
  font-weight: 600;
  font-size: 1.4rem;
  color: var(--color-grey-900);
`;

const ItemSubtext = styled.span`
  font-size: 1.2rem;
  color: var(--color-grey-500);
`;

const ItemValue = styled.div`
  text-align: right;
`;

const ItemAmount = styled.div`
  font-weight: 700;
  font-size: 1.6rem;
  color: var(--color-brand-600);
`;

const ItemMetric = styled.div`
  font-size: 1.2rem;
  color: var(--color-grey-500);
`;

const TrendBadge = styled.span<{ $isPositive: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.8rem;
  border-radius: 100px;
  font-size: 1.2rem;
  font-weight: 600;
  background-color: ${(props) =>
    props.$isPositive ? "var(--color-green-100)" : "var(--color-red-100)"};
  color: ${(props) =>
    props.$isPositive ? "var(--color-green-700)" : "var(--color-red-700)"};

  & svg {
    width: 1.4rem;
    height: 1.4rem;
  }
`;

// Mock Data
const periodOptions = [
  { value: "7days", label: "Last 7 Days" },
  { value: "30days", label: "Last 30 Days" },
  { value: "90days", label: "Last 90 Days" },
  { value: "year", label: "This Year" },
];

// Revenue data for the chart
const revenueData = [
  { date: "Oct 1", revenue: 12500, orders: 45, forecast: 13000 },
  { date: "Oct 2", revenue: 15300, orders: 52, forecast: 15500 },
  { date: "Oct 3", revenue: 18200, orders: 61, forecast: 18000 },
  { date: "Oct 4", revenue: 14800, orders: 48, forecast: 15200 },
  { date: "Oct 5", revenue: 19500, orders: 68, forecast: 19800 },
  { date: "Oct 6", revenue: 21300, orders: 72, forecast: 21500 },
  { date: "Oct 7", revenue: 17800, orders: 58, forecast: 18200 },
  { date: "Oct 8", revenue: 22100, orders: 75, forecast: 22500 },
  { date: "Oct 9", revenue: 20500, orders: 69, forecast: 21000 },
  { date: "Oct 10", revenue: 23800, orders: 81, forecast: 24000 },
];

// Product category distribution
const categoryData = [
  { name: "Milk", value: 45, color: "#145DA0" },
  { name: "Yogurt", value: 28, color: "#2E8BC0" },
  { name: "Cheese", value: 18, color: "#B1D4E0" },
  { name: "Butter", value: 9, color: "#0C2D48" },
];

// Delivery performance
const deliveryPerformanceData = [
  { month: "Apr", onTime: 92, delayed: 8, failed: 2 },
  { month: "May", onTime: 94, delayed: 6, failed: 1 },
  { month: "Jun", onTime: 89, delayed: 10, failed: 3 },
  { month: "Jul", onTime: 96, delayed: 4, failed: 1 },
  { month: "Aug", onTime: 95, delayed: 5, failed: 2 },
  { month: "Sep", onTime: 97, delayed: 3, failed: 1 },
  { month: "Oct", onTime: 98, delayed: 2, failed: 0 },
];

// Top products
const topProducts = [
  {
    name: "Full Cream Milk (1L)",
    category: "Milk",
    units: 2450,
    revenue: 36750,
  },
  {
    name: "Greek Yogurt (500g)",
    category: "Yogurt",
    units: 1820,
    revenue: 14560,
  },
  {
    name: "Cheddar Cheese (200g)",
    category: "Cheese",
    units: 980,
    revenue: 17640,
  },
  { name: "Butter (250g)", category: "Butter", units: 750, revenue: 9000 },
  { name: "Skimmed Milk (1L)", category: "Milk", units: 680, revenue: 8840 },
];

// Top clients
const topClients = [
  {
    name: "Carrefour Lac 2",
    type: "Supermarket",
    orders: 145,
    revenue: 125400,
  },
  { name: "Monoprix Menzah", type: "Supermarket", orders: 98, revenue: 87500 },
  {
    name: "Magasin Général Marsa",
    type: "Grocery",
    orders: 67,
    revenue: 45200,
  },
  { name: "Superette Ariana", type: "Grocery", orders: 54, revenue: 28900 },
  { name: "Café des Arts", type: "Café", orders: 42, revenue: 18500 },
];

function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState("30days");

  // Calculate stats
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = revenueData.reduce((sum, item) => sum + item.orders, 0);
  const avgOrderValue = totalRevenue / totalOrders;
  const revenueGrowth = 12.5; // Mock percentage

  const avgDeliveryTime = 28; // minutes
  const onTimeRate = 98; // percentage

  return (
    <AnalyticsLayout>
      {/* Header */}
      <Row type="horizontal">
        <Heading as="h1">Analytics & Insights</Heading>
        <FiltersBar>
          <Select
            options={periodOptions}
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          />
        </FiltersBar>
      </Row>

      {/* Key Metrics */}
      <StatsRow>
        <StatsCard
          title="Total Revenue"
          value={`${totalRevenue.toLocaleString()} TND`}
          icon={<HiOutlineCurrencyDollar />}
          color="var(--color-brand-600)"
          trend={{
            value: `+${revenueGrowth}%`,
            isPositive: true,
          }}
        />
        <StatsCard
          title="Total Orders"
          value={totalOrders}
          icon={<HiOutlineShoppingCart />}
          color="var(--color-blue-700)"
          trend={{
            value: "+8.3%",
            isPositive: true,
          }}
        />
        <StatsCard
          title="Avg Order Value"
          value={`${avgOrderValue.toFixed(0)} TND`}
          icon={<HiOutlineChartBar />}
          color="var(--color-green-700)"
          trend={{
            value: "+3.2%",
            isPositive: true,
          }}
        />
        <StatsCard
          title="On-Time Delivery"
          value={`${onTimeRate}%`}
          icon={<HiOutlineTruck />}
          color="var(--color-yellow-700)"
          trend={{
            value: "+2.1%",
            isPositive: true,
          }}
        />
      </StatsRow>

      {/* Revenue & Forecast Chart */}
      <ChartCard>
        <ChartHeader>
          <ChartTitle>Revenue Trend & Forecast</ChartTitle>
          <TrendBadge $isPositive={true}>
            <HiOutlineArrowTrendingUp />+{revenueGrowth}% vs last period
          </TrendBadge>
        </ChartHeader>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#145DA0" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#145DA0" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#666" }}
              tickLine={{ stroke: "#ccc" }}
            />
            <YAxis tick={{ fill: "#666" }} tickLine={{ stroke: "#ccc" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#145DA0"
              strokeWidth={3}
              fill="url(#colorRevenue)"
              name="Actual Revenue (TND)"
            />
            <Line
              type="monotone"
              dataKey="forecast"
              stroke="#82ca9d"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Forecast (TND)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Two Column Layout */}
      <Grid2Cols>
        {/* Delivery Performance */}
        <ChartCard>
          <ChartHeader>
            <ChartTitle>Delivery Performance</ChartTitle>
          </ChartHeader>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={deliveryPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                tick={{ fill: "#666" }}
                tickLine={{ stroke: "#ccc" }}
              />
              <YAxis tick={{ fill: "#666" }} tickLine={{ stroke: "#ccc" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar
                dataKey="onTime"
                stackId="a"
                fill="#10b981"
                name="On Time %"
              />
              <Bar
                dataKey="delayed"
                stackId="a"
                fill="#f59e0b"
                name="Delayed %"
              />
              <Bar
                dataKey="failed"
                stackId="a"
                fill="#ef4444"
                name="Failed %"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Product Category Distribution */}
        <ChartCard>
          <ChartHeader>
            <ChartTitle>Sales by Category</ChartTitle>
          </ChartHeader>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </Grid2Cols>

      {/* Top Products & Clients */}
      <Grid2Cols>
        {/* Top Products */}
        <ChartCard>
          <ChartHeader>
            <ChartTitle>🏆 Top Products</ChartTitle>
          </ChartHeader>
          <TopItemsList>
            {topProducts.map((product, index) => (
              <TopItemCard key={product.name}>
                <ItemInfo>
                  <ItemRank>{index + 1}</ItemRank>
                  <ItemDetails>
                    <ItemName>{product.name}</ItemName>
                    <ItemSubtext>{product.category}</ItemSubtext>
                  </ItemDetails>
                </ItemInfo>
                <ItemValue>
                  <ItemAmount>
                    {product.revenue.toLocaleString()} TND
                  </ItemAmount>
                  <ItemMetric>{product.units} units sold</ItemMetric>
                </ItemValue>
              </TopItemCard>
            ))}
          </TopItemsList>
        </ChartCard>

        {/* Top Clients */}
        <ChartCard>
          <ChartHeader>
            <ChartTitle>🏆 Top Clients</ChartTitle>
          </ChartHeader>
          <TopItemsList>
            {topClients.map((client, index) => (
              <TopItemCard key={client.name}>
                <ItemInfo>
                  <ItemRank>{index + 1}</ItemRank>
                  <ItemDetails>
                    <ItemName>{client.name}</ItemName>
                    <ItemSubtext>{client.type}</ItemSubtext>
                  </ItemDetails>
                </ItemInfo>
                <ItemValue>
                  <ItemAmount>{client.revenue.toLocaleString()} TND</ItemAmount>
                  <ItemMetric>{client.orders} orders</ItemMetric>
                </ItemValue>
              </TopItemCard>
            ))}
          </TopItemsList>
        </ChartCard>
      </Grid2Cols>
    </AnalyticsLayout>
  );
}

export default Analytics;
