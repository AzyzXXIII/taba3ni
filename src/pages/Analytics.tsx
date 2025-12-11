import { useState } from "react";
import styled from "styled-components";
import {
  HiOutlineChartBar,
  HiOutlineTruck,
  HiOutlineCurrencyDollar,
  HiOutlineShoppingCart,
  HiOutlineArrowTrendingUp,
  HiOutlineArrowTrendingDown,
  HiOutlineArrowDownTray,
  HiOutlineCalendar,
  HiOutlineMapPin,
} from "react-icons/hi2";
import { HiOutlinePrinter } from "react-icons/hi2";
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

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
  gap: 1.6rem;
  margin-bottom: 2.4rem;
`;

const SummaryCard = styled.div<{ $color: string }>`
  padding: 2rem;
  background: linear-gradient(
    135deg,
    ${(props) => props.$color}15 0%,
    ${(props) => props.$color}05 100%
  );
  border: 2px solid ${(props) => props.$color}40;
  border-radius: var(--border-radius-md);
  transition: all 0.3s;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px ${(props) => props.$color}30;
    border-color: ${(props) => props.$color};
  }

  & h4 {
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--color-grey-600);
    text-transform: uppercase;
    margin-bottom: 0.8rem;
    letter-spacing: 0.5px;
  }

  & .value {
    font-size: 2.4rem;
    font-weight: 700;
    color: ${(props) => props.$color};
    margin-bottom: 0.4rem;
  }

  & .subtext {
    font-size: 1.2rem;
    color: var(--color-grey-500);
  }
`;

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
const CustomTooltip = styled.div`
  background-color: var(--color-grey-0);
  border: 2px solid var(--color-brand-600);
  border-radius: var(--border-radius-md);
  padding: 1.6rem;
  box-shadow: var(--shadow-lg);

  & .tooltip-label {
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--color-grey-900);
    margin-bottom: 0.8rem;
    padding-bottom: 0.8rem;
    border-bottom: 1px solid var(--color-grey-200);
  }

  & .tooltip-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
    font-size: 1.3rem;
    margin: 0.4rem 0;
  }

  & .tooltip-name {
    color: var(--color-grey-600);
  }

  & .tooltip-value {
    font-weight: 700;
    color: var(--color-brand-600);
  }
`;
const CustomChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <CustomTooltip>
        <div className="tooltip-label">{label}</div>
        {payload.map((item: any, index: number) => (
          <div key={index} className="tooltip-item">
            <span className="tooltip-name">{item.name}:</span>
            <span className="tooltip-value">
              {item.name.includes("Revenue") || item.name.includes("Forecast")
                ? `${item.value.toLocaleString()} TND`
                : item.value}
            </span>
          </div>
        ))}
      </CustomTooltip>
    );
  }
  return null;
};

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

const ExportButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 1.6rem;
  background-color: var(--color-green-700);
  color: var(--color-grey-0);
  border: none;
  border-radius: var(--border-radius-sm);
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-green-100);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  & svg {
    width: 1.8rem;
    height: 1.8rem;
  }
`;

const DateRangeInputs = styled.div`
  display: flex;
  gap: 1.2rem;
  align-items: center;
`;

const DateInput = styled.input`
  padding: 0.8rem 1.2rem;
  border: 1px solid var(--color-grey-300);
  border-radius: var(--border-radius-sm);
  font-size: 1.4rem;
  background-color: var(--color-grey-0);

  &:focus {
    outline: none;
    border-color: var(--color-brand-600);
  }
`;

const DateLabel = styled.span`
  font-size: 1.4rem;
  color: var(--color-grey-600);
  font-weight: 500;
`;

const HeatmapGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
  gap: 1.6rem;
  margin-top: 1.6rem;
`;

const ZoneCard = styled.div<{ $intensity: number }>`
  padding: 2rem;
  border-radius: var(--border-radius-md);
  background: ${(props) => {
    if (props.$intensity >= 80)
      return "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)";
    if (props.$intensity >= 60)
      return "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)";
    if (props.$intensity >= 40)
      return "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)";
    if (props.$intensity >= 20)
      return "linear-gradient(135deg, #eab308 0%, #ca8a04 100%)";
    return "linear-gradient(135deg, #10b981 0%, #059669 100%)";
  }};
  color: var(--color-grey-0);
  transition: all 0.3s;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: var(--shadow-lg);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.1);
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover::before {
    opacity: 1;
  }
`;

const ZoneHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.2rem;

  & svg {
    width: 2.4rem;
    height: 2.4rem;
  }
`;

const ZoneName = styled.h4`
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0;
`;

const ZoneStats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const ZoneStat = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.3rem;
`;

const StatLabel = styled.span`
  opacity: 0.9;
`;

const StatValue = styled.span`
  font-weight: 700;
  font-size: 1.5rem;
`;

const IntensityBar = styled.div<{ $intensity: number }>`
  width: 100%;
  height: 0.6rem;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 100px;
  margin-top: 1.2rem;
  overflow: hidden;

  &::after {
    content: "";
    display: block;
    width: ${(props) => props.$intensity}%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 100px;
    transition: width 0.5s ease-out;
  }
`;

const HeatmapLegend = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 2.4rem;
  padding: 1.6rem;
  background-color: var(--color-grey-50);
  border-radius: var(--border-radius-md);
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const LegendColor = styled.div<{ $color: string }>`
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 0.4rem;
  background: ${(props) => props.$color};
`;

const LegendLabel = styled.span`
  font-size: 1.3rem;
  color: var(--color-grey-700);
  font-weight: 500;
`;
const PrintButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 1.6rem;
  background-color: var(--color-blue-700);
  color: var(--color-grey-0);
  border: none;
  border-radius: var(--border-radius-sm);
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-blue-100);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  & svg {
    width: 1.8rem;
    height: 1.8rem;
  }
`;

const ChartToggle = styled.div`
  display: flex;
  gap: 0.4rem;
  background-color: var(--color-grey-100);
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
`;
const ToggleButton = styled.button<{ $active: boolean }>`
  padding: 0.6rem 1.2rem;
  border: none;
  background-color: ${(props) =>
    props.$active ? "var(--color-grey-0)" : "transparent"};
  color: ${(props) =>
    props.$active ? "var(--color-brand-600)" : "var(--color-grey-600)"};
  border-radius: var(--border-radius-sm);
  font-size: 1.3rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: ${(props) => (props.$active ? "var(--shadow-sm)" : "none")};

  &:hover {
    color: var(--color-brand-600);
  }
`;

// Mock Data
const periodOptions = [
  { value: "7days", label: "Last 7 Days" },
  { value: "30days", label: "Last 30 Days" },
  { value: "90days", label: "Last 90 Days" },
  { value: "year", label: "This Year" },
];

// Mock comparison data:
const comparisonData = [
  { date: "Oct 1", current: 12500, previous: 11200 },
  { date: "Oct 2", current: 15300, previous: 13800 },
  { date: "Oct 3", current: 18200, previous: 16500 },
  { date: "Oct 4", current: 14800, previous: 13900 },
  { date: "Oct 5", current: 19500, previous: 17200 },
  { date: "Oct 6", current: 21300, previous: 19100 },
  { date: "Oct 7", current: 17800, previous: 16400 },
  { date: "Oct 8", current: 22100, previous: 19800 },
  { date: "Oct 9", current: 20500, previous: 18700 },
  { date: "Oct 10", current: 23800, previous: 21200 },
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

// Delivery Heatmap Data (zones with delivery activity)
const deliveryHeatmapData = [
  {
    zone: "Tunis Center",
    deliveries: 245,
    avgTime: 22,
    onTimeRate: 98,
    intensity: 95,
  },
  {
    zone: "Lac 2 & Berges du Lac",
    deliveries: 189,
    avgTime: 25,
    onTimeRate: 97,
    intensity: 82,
  },
  {
    zone: "Ariana & Menzah",
    deliveries: 156,
    avgTime: 28,
    onTimeRate: 96,
    intensity: 68,
  },
  {
    zone: "La Marsa & Gammarth",
    deliveries: 134,
    avgTime: 32,
    onTimeRate: 94,
    intensity: 58,
  },
  {
    zone: "Ben Arous",
    deliveries: 98,
    avgTime: 26,
    onTimeRate: 95,
    intensity: 42,
  },
  {
    zone: "Bizerte",
    deliveries: 67,
    avgTime: 45,
    onTimeRate: 91,
    intensity: 29,
  },
  {
    zone: "Nabeul",
    deliveries: 54,
    avgTime: 38,
    onTimeRate: 92,
    intensity: 23,
  },
  {
    zone: "Sousse",
    deliveries: 43,
    avgTime: 52,
    onTimeRate: 89,
    intensity: 18,
  },
];

function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState("30days");
  const [startDate, setStartDate] = useState("2025-09-11");
  const [endDate, setEndDate] = useState("2025-10-11");
  const [useCustomRange, setUseCustomRange] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [revenueChartType, setRevenueChartType] = useState<"area" | "bar">(
    "area"
  );

  // Calculate stats
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = revenueData.reduce((sum, item) => sum + item.orders, 0);
  const avgOrderValue = totalRevenue / totalOrders;
  const revenueGrowth = 12.5; // Mock percentage

  const avgDeliveryTime = 28; // minutes
  const onTimeRate = 98; // percentage

  const handleExportReport = () => {
    // Generate CSV data
    const csvData = [
      [
        "Analytics Report",
        `Period: ${
          useCustomRange ? `${startDate} to ${endDate}` : selectedPeriod
        }`,
      ],
      [""],
      ["Key Metrics"],
      ["Metric", "Value"],
      ["Total Revenue", `${totalRevenue.toLocaleString()} TND`],
      ["Total Orders", totalOrders],
      ["Average Order Value", `${avgOrderValue.toFixed(2)} TND`],
      ["On-Time Delivery Rate", `${onTimeRate}%`],
      [""],
      ["Top Products"],
      ["Rank", "Product", "Category", "Units Sold", "Revenue (TND)"],
      ...topProducts.map((p, i) => [
        i + 1,
        p.name,
        p.category,
        p.units,
        p.revenue,
      ]),
      [""],
      ["Top Clients"],
      ["Rank", "Client", "Type", "Orders", "Revenue (TND)"],
      ...topClients.map((c, i) => [i + 1, c.name, c.type, c.orders, c.revenue]),
      [""],
      ["Delivery Heatmap"],
      ["Zone", "Deliveries", "Avg Time (min)", "On-Time Rate (%)"],
      ...deliveryHeatmapData.map((z) => [
        z.zone,
        z.deliveries,
        z.avgTime,
        z.onTimeRate,
      ]),
    ];

    // Convert to CSV string
    const csvContent = csvData.map((row) => row.join(",")).join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `analytics_report_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value);
    setUseCustomRange(value === "custom");
  };

  return (
    <AnalyticsLayout>
      {/* Header */}
      <Row type="horizontal">
        <Heading as="h1">Analytics & Insights</Heading>
        <FiltersBar>
          <Select
            options={periodOptions}
            value={selectedPeriod}
            onChange={(e) => handlePeriodChange(e.target.value)}
          />
          {useCustomRange && (
            <DateRangeInputs>
              <DateLabel>From:</DateLabel>
              <DateInput
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <DateLabel>To:</DateLabel>
              <DateInput
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </DateRangeInputs>
          )}
          <ExportButton onClick={handleExportReport}>
            <HiOutlineArrowDownTray />
            Export Report
          </ExportButton>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.8rem",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={showComparison}
              onChange={(e) => setShowComparison(e.target.checked)}
              style={{ width: "1.6rem", height: "1.6rem", cursor: "pointer" }}
            />
            <span
              style={{
                fontSize: "1.4rem",
                fontWeight: 600,
                color: "var(--color-grey-700)",
              }}
            >
              Compare Periods
            </span>
          </label>
          <PrintButton onClick={() => window.print()}>
            <HiOutlinePrinter />
            Print Report
          </PrintButton>
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

      {/* Performance Summary */}
      <SummaryGrid>
        <SummaryCard $color="#145DA0">
          <h4>Best Selling Product</h4>
          <div className="value">Full Cream Milk</div>
          <div className="subtext">2,450 units sold</div>
        </SummaryCard>

        <SummaryCard $color="#10b981">
          <h4>Top Client</h4>
          <div className="value">Carrefour Lac 2</div>
          <div className="subtext">125,400 TND revenue</div>
        </SummaryCard>

        <SummaryCard $color="#f59e0b">
          <h4>Busiest Zone</h4>
          <div className="value">Tunis Center</div>
          <div className="subtext">245 deliveries</div>
        </SummaryCard>

        <SummaryCard $color="#8b5cf6">
          <h4>Avg Delivery Time</h4>
          <div className="value">28 min</div>
          <div className="subtext">98% on-time rate</div>
        </SummaryCard>
      </SummaryGrid>

      {/* Revenue & Forecast Chart */}
      <ChartCard>
        <ChartHeader>
          <ChartTitle>Revenue Trend & Forecast</ChartTitle>
          <div style={{ display: "flex", gap: "1.6rem", alignItems: "center" }}>
            <ChartToggle>
              <ToggleButton
                $active={revenueChartType === "area"}
                onClick={() => setRevenueChartType("area")}
              >
                Area Chart
              </ToggleButton>
              <ToggleButton
                $active={revenueChartType === "bar"}
                onClick={() => setRevenueChartType("bar")}
              >
                Bar Chart
              </ToggleButton>
            </ChartToggle>
            <TrendBadge $isPositive={true}>
              <HiOutlineArrowTrendingUp />+{revenueGrowth}% vs last period
            </TrendBadge>
          </div>
        </ChartHeader>
        <ResponsiveContainer width="100%" height={350}>
          {revenueChartType === "area" ? (
            <AreaChart data={showComparison ? comparisonData : revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#145DA0" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#145DA0" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fill: "#666" }} />
              <YAxis tick={{ fill: "#666" }} />
              <Tooltip content={<CustomChartTooltip />} />
              <Legend />

              {showComparison ? (
                <>
                  <Area
                    type="monotone"
                    dataKey="current"
                    stroke="#145DA0"
                    strokeWidth={3}
                    fill="url(#colorRevenue)"
                    name="Current Period (TND)"
                  />
                  <Area
                    type="monotone"
                    dataKey="previous"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    fill="url(#colorPrevious)"
                    name="Previous Period (TND)"
                  />
                </>
              ) : (
                <>
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
                </>
              )}
            </AreaChart>
          ) : (
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fill: "#666" }} />
              <YAxis tick={{ fill: "#666" }} />
              <Tooltip content={<CustomChartTooltip />} />
              <Legend />
              <Bar
                dataKey="revenue"
                fill="#145DA0"
                name="Actual Revenue (TND)"
              />
              <Bar dataKey="forecast" fill="#82ca9d" name="Forecast (TND)" />
            </BarChart>
          )}
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
              <Tooltip content={<CustomChartTooltip />} />
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
              <Tooltip content={<CustomChartTooltip />} />
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

      {/* Delivery Heatmap */}
      <ChartCard>
        <ChartHeader>
          <ChartTitle>
            🗺️ Delivery Activity Heatmap - Most Active Zones
          </ChartTitle>
          <TrendBadge $isPositive={true}>
            <HiOutlineMapPin />
            {deliveryHeatmapData.reduce((sum, z) => sum + z.deliveries, 0)}{" "}
            total deliveries
          </TrendBadge>
        </ChartHeader>
        <HeatmapGrid>
          {deliveryHeatmapData.map((zone) => (
            <ZoneCard key={zone.zone} $intensity={zone.intensity}>
              <ZoneHeader>
                <HiOutlineMapPin />
                <ZoneName>{zone.zone}</ZoneName>
              </ZoneHeader>
              <ZoneStats>
                <ZoneStat>
                  <StatLabel>Deliveries:</StatLabel>
                  <StatValue>{zone.deliveries}</StatValue>
                </ZoneStat>
                <ZoneStat>
                  <StatLabel>Avg Time:</StatLabel>
                  <StatValue>{zone.avgTime} min</StatValue>
                </ZoneStat>
                <ZoneStat>
                  <StatLabel>On-Time:</StatLabel>
                  <StatValue>{zone.onTimeRate}%</StatValue>
                </ZoneStat>
              </ZoneStats>
              <IntensityBar $intensity={zone.intensity} />
            </ZoneCard>
          ))}
        </HeatmapGrid>
        <HeatmapLegend>
          <LegendItem>
            <LegendColor $color="linear-gradient(135deg, #dc2626 0%, #991b1b 100%)" />
            <LegendLabel>Very High (80%+)</LegendLabel>
          </LegendItem>
          <LegendItem>
            <LegendColor $color="linear-gradient(135deg, #ea580c 0%, #c2410c 100%)" />
            <LegendLabel>High (60-79%)</LegendLabel>
          </LegendItem>
          <LegendItem>
            <LegendColor $color="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" />
            <LegendLabel>Medium (40-59%)</LegendLabel>
          </LegendItem>
          <LegendItem>
            <LegendColor $color="linear-gradient(135deg, #eab308 0%, #ca8a04 100%)" />
            <LegendLabel>Low (20-39%)</LegendLabel>
          </LegendItem>
          <LegendItem>
            <LegendColor $color="linear-gradient(135deg, #10b981 0%, #059669 100%)" />
            <LegendLabel>Very Low (0-19%)</LegendLabel>
          </LegendItem>
        </HeatmapLegend>
      </ChartCard>
    </AnalyticsLayout>
  );
}

export default Analytics;
