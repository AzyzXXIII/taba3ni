import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineShoppingCart,
  HiOutlineCurrencyDollar,
  HiOutlineCalendar,
  HiOutlineTruck,
  HiOutlineArrowDownTray,
} from "react-icons/hi2";
import Heading from "../UI/Heading";
import Row from "../UI/Row";
import Button from "../UI/Button";
import StatusBadge from "../UI/StatusBadge";
import { getStatusDisplay } from "../utils/statusHelpers";
import type { OrderStatus, PaymentStatus } from "../types/status";
import SearchBar from "../UI/SearchBar";
import Menus from "../UI/Menus";
import Modal from "../UI/Modal";
import ConfirmDelete from "../UI/ConfirmDelete";
import OrderForm from "../components/OrderForm";

// Styled Components
const OrdersLayout = styled.div`
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
  grid-template-columns: 1fr 2fr 1.5fr 1fr 1fr 1fr 0.5fr;
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
  grid-template-columns: 1fr 2fr 1.5fr 1fr 1fr 1fr 0.5fr;
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

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  gap: 1.6rem;
  margin-bottom: 2.4rem;
`;

const StatCard = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 1.6rem;
  text-align: center;

  & h3 {
    font-size: 2.4rem;
    font-weight: 700;
    color: var(--color-brand-600);
    margin-bottom: 0.4rem;
  }

  & p {
    font-size: 1.3rem;
    color: var(--color-grey-600);
    text-transform: uppercase;
    letter-spacing: 0.5px;
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

const MobileOrderId = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-brand-600);
  margin-bottom: 0.4rem;
`;

const MobileClientName = styled.div`
  font-size: 1.4rem;
  color: var(--color-grey-600);
  font-weight: 500;
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

const MobileStatusRow = styled.div`
  display: flex;
  gap: 0.8rem;
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
type Product = {
  productId: string;
  name: string;
  quantity: number;
  price: number;
};

type EditableOrder = {
  id: string;
  orderNumber: string;
  client: string;
  deliveryDate: string;
  products: Product[];
  notes: string;
} | null;

type Order = {
  id: string;
  orderNumber: string;
  clientId: string; // FIXED: Added clientId for filtering
  client: string;
  products: string;
  amount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  date: string;
  distributorId?: string; // FIXED: Added for distributor filtering
};

type OrdersProps = {
  userRole?: "admin" | "distributor" | "client";
  userId?: string;
  userName?: string;
};

// Mock Data - UPDATED with clientId and distributorId
const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-001",
    clientId: "1", // Carrefour
    client: "Carrefour Lac 2",
    products: "Milk (50L), Yogurt (30)",
    amount: 1250,
    status: "out-for-delivery",
    paymentStatus: "unpaid",
    date: "2025-12-28 10:30",
    distributorId: "dist-1",
  },
  {
    id: "2",
    orderNumber: "ORD-002",
    clientId: "2", // Monoprix
    client: "Monoprix Menzah",
    products: "Cheese (20kg), Butter (10kg)",
    amount: 890,
    status: "delivered",
    paymentStatus: "paid",
    date: "2025-12-27 09:15",
    distributorId: "dist-1",
  },
  {
    id: "3",
    orderNumber: "ORD-003",
    clientId: "3", // Magasin
    client: "Magasin Général Marsa",
    products: "Milk (100L), Yogurt (50)",
    amount: 2100,
    status: "processing",
    paymentStatus: "partial",
    date: "2025-12-25 08:45",
    distributorId: "dist-2",
  },
  {
    id: "4",
    orderNumber: "ORD-004",
    clientId: "1", // Carrefour (another order)
    client: "Carrefour Lac 2",
    products: "Butter (15kg), Cream (20L)",
    amount: 650,
    status: "pending",
    paymentStatus: "unpaid",
    date: "2025-12-29 11:00",
  },
  {
    id: "5",
    orderNumber: "ORD-005",
    clientId: "4", // Superette
    client: "Superette Ariana",
    products: "Milk (30L), Yogurt (20)",
    amount: 580,
    status: "processing",
    paymentStatus: "unpaid",
    date: "2025-12-28 14:30",
    distributorId: "dist-2",
  },
];

function Orders({ userRole = "admin", userId, userName }: OrdersProps) {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // FIXED: Role-based data filtering
  const getRoleFilteredOrders = (): Order[] => {
    if (userRole === "client") {
      // Clients only see THEIR orders
      return mockOrders.filter((order) => order.clientId === userId);
    }
    if (userRole === "distributor") {
      // Distributors only see ASSIGNED orders
      return mockOrders.filter((order) => order.distributorId === userId);
    }
    // Admins see ALL orders
    return mockOrders;
  };

  const roleFilteredOrders = getRoleFilteredOrders();

  // Filter orders by status and search
  const filteredOrders = roleFilteredOrders.filter((order) => {
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.client.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate stats based on role-filtered data
  const stats = {
    total: roleFilteredOrders.length,
    pending: roleFilteredOrders.filter((o) => o.status === "pending").length,
    processing: roleFilteredOrders.filter((o) => o.status === "processing")
      .length,
    delivered: roleFilteredOrders.filter((o) => o.status === "delivered")
      .length,
    failed: roleFilteredOrders.filter((o) => o.status === "failed").length,
  };

  // Export to CSV
  const handleExport = () => {
    const csvData = [
      [
        "Order Number",
        "Client",
        "Products",
        "Amount (TND)",
        "Status",
        "Payment Status",
        "Date",
      ],
      ...filteredOrders.map((o) => [
        o.orderNumber,
        o.client,
        o.products,
        o.amount,
        o.status,
        o.paymentStatus,
        o.date,
      ]),
    ];

    const csvContent = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `taba3ni-orders-${userRole}-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleViewOrder = (orderId: string) => {
    navigate(`/orders/${orderId}`);
  };

  const handleDeleteOrder = (orderId: string) => {
    console.log("Delete order:", orderId);
  };

  // Get page title based on role
  const getPageTitle = () => {
    if (userRole === "client") return "My Orders";
    if (userRole === "distributor") return "My Deliveries";
    return "Orders Management";
  };

  // Get button text based on role
  const getButtonText = () => {
    if (userRole === "client") return "+ Place New Order";
    if (userRole === "distributor") return "View Route";
    return "+ New Order";
  };

  return (
    <OrdersLayout>
      {/* Header - Role-based */}
      <Row type="horizontal">
        <Heading as="h1">{getPageTitle()}</Heading>
        {userRole !== "distributor" && (
          <Modal>
            <Modal.Open opens="create-order">
              <Button $size="medium">{getButtonText()}</Button>
            </Modal.Open>
            <Modal.Window name="create-order">
              <OrderForm
                onCloseModal={() => {}}
                userRole={userRole}
                clientId={userRole === "client" ? userId : undefined}
                clientName={userRole === "client" ? userName : undefined}
              />
            </Modal.Window>
          </Modal>
        )}
      </Row>

      {/* Stats */}
      <StatsRow>
        <StatCard>
          <h3>{stats.total}</h3>
          <p>Total {userRole === "distributor" ? "Deliveries" : "Orders"}</p>
        </StatCard>
        <StatCard>
          <h3>{stats.pending}</h3>
          <p>Pending</p>
        </StatCard>
        <StatCard>
          <h3>{stats.processing}</h3>
          <p>Processing</p>
        </StatCard>
        <StatCard>
          <h3>{stats.delivered}</h3>
          <p>Delivered</p>
        </StatCard>
        {userRole === "admin" && (
          <StatCard>
            <h3>{stats.failed}</h3>
            <p>Failed</p>
          </StatCard>
        )}
      </StatsRow>

      {/* Filters & Search */}
      <FiltersBar>
        <SearchBar
          placeholder="Search by order ID or client..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FilterGroup>
          <FilterButton
            $active={statusFilter === "all"}
            onClick={() => setStatusFilter("all")}
          >
            All
          </FilterButton>
          <FilterButton
            $active={statusFilter === "pending"}
            onClick={() => setStatusFilter("pending")}
          >
            Pending
          </FilterButton>
          <FilterButton
            $active={statusFilter === "processing"}
            onClick={() => setStatusFilter("processing")}
          >
            Processing
          </FilterButton>
          <FilterButton
            $active={statusFilter === "delivered"}
            onClick={() => setStatusFilter("delivered")}
          >
            Delivered
          </FilterButton>
          {userRole === "admin" && (
            <FilterButton
              $active={statusFilter === "failed"}
              onClick={() => setStatusFilter("failed")}
            >
              Failed
            </FilterButton>
          )}
        </FilterGroup>
      </FiltersBar>

      {/* Orders Table */}
      <TableCard>
        <TableControls>
          <ResultsCount>
            Showing <strong>{filteredOrders.length}</strong> of{" "}
            <strong>{roleFilteredOrders.length}</strong>{" "}
            {userRole === "distributor" ? "deliveries" : "orders"}
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
          <TableHeader>
            <div>Order ID</div>
            <div>Client</div>
            <div>Products</div>
            <div>Amount</div>
            <div>Status</div>
            <div>Payment</div>
            <div></div>
          </TableHeader>

          {filteredOrders.length === 0 ? (
            <EmptyState>
              <HiOutlineShoppingCart />
              <h3>
                No {userRole === "distributor" ? "deliveries" : "orders"} found
              </h3>
              <p>
                {roleFilteredOrders.length === 0
                  ? userRole === "client"
                    ? "You haven't placed any orders yet"
                    : userRole === "distributor"
                    ? "No deliveries assigned to you yet"
                    : "No orders in the system yet"
                  : "Try adjusting your filters or search query"}
              </p>
              {userRole === "client" && roleFilteredOrders.length === 0 && (
                <Modal>
                  <Modal.Open opens="create-first-order">
                    <Button $size="medium">+ Place Your First Order</Button>
                  </Modal.Open>
                  <Modal.Window name="create-first-order">
                    <OrderForm
                      onCloseModal={() => {}}
                      userRole={userRole}
                      clientId={userId}
                      clientName={userName}
                    />
                  </Modal.Window>
                </Modal>
              )}
            </EmptyState>
          ) : (
            <>
              {/* Desktop Table View */}
              <Menus>
                {filteredOrders.map((order) => {
                  const orderStatus = getStatusDisplay(order.status);
                  const paymentStatus = getStatusDisplay(order.paymentStatus);

                  return (
                    <TableRow key={order.id}>
                      <OrderId>#{order.orderNumber}</OrderId>
                      <ClientName>{order.client}</ClientName>
                      <div
                        style={{
                          fontSize: "1.3rem",
                          color: "var(--color-grey-600)",
                        }}
                      >
                        {order.products}
                      </div>
                      <Amount>{order.amount} TND</Amount>
                      <div>
                        <StatusBadge $status={order.status}>
                          {orderStatus.icon} {orderStatus.label}
                        </StatusBadge>
                      </div>
                      <div>
                        <StatusBadge $status={order.paymentStatus}>
                          {paymentStatus.icon} {paymentStatus.label}
                        </StatusBadge>
                      </div>
                      <div>
                        <Modal>
                          <Menus.Menu>
                            <Menus.Toggle id={order.id} />
                            <Menus.List id={order.id}>
                              <Menus.Button
                                icon={<HiOutlineEye />}
                                onClick={() => handleViewOrder(order.id)}
                              >
                                View Details
                              </Menus.Button>
                              {userRole === "admin" && (
                                <>
                                  <Modal.Open opens={`edit-${order.id}`}>
                                    <Menus.Button icon={<HiOutlinePencil />}>
                                      Edit Order
                                    </Menus.Button>
                                  </Modal.Open>
                                  <Modal.Open opens={`delete-${order.id}`}>
                                    <Menus.Button icon={<HiOutlineTrash />}>
                                      Delete Order
                                    </Menus.Button>
                                  </Modal.Open>
                                </>
                              )}
                              {userRole === "client" &&
                                order.status === "pending" && (
                                  <Modal.Open opens={`cancel-${order.id}`}>
                                    <Menus.Button icon={<HiOutlineTrash />}>
                                      Cancel Order
                                    </Menus.Button>
                                  </Modal.Open>
                                )}
                              {userRole === "distributor" && (
                                <Menus.Button icon={<HiOutlineTruck />}>
                                  Mark as Delivered
                                </Menus.Button>
                              )}
                            </Menus.List>
                          </Menus.Menu>

                          {userRole === "admin" && (
                            <>
                              <Modal.Window name={`edit-${order.id}`}>
                                <OrderForm
                                  orderToEdit={{
                                    id: order.id,
                                    orderNumber: order.orderNumber,
                                    client: order.client,
                                    deliveryDate: order.date,
                                    products: [
                                      {
                                        productId: "1",
                                        name: "Full Cream Milk (1L)",
                                        quantity: 50,
                                        price: 15,
                                      },
                                    ],
                                    notes: "Sample order notes",
                                  }}
                                  onCloseModal={() => {}}
                                  userRole={userRole}
                                />
                              </Modal.Window>

                              <Modal.Window name={`delete-${order.id}`}>
                                <ConfirmDelete
                                  resourceName={`order ${order.orderNumber}`}
                                  onConfirm={() => handleDeleteOrder(order.id)}
                                  onCloseModal={() => {}}
                                />
                              </Modal.Window>
                            </>
                          )}

                          {userRole === "client" && (
                            <Modal.Window name={`cancel-${order.id}`}>
                              <ConfirmDelete
                                resourceName={`order ${order.orderNumber}`}
                                onConfirm={() => handleDeleteOrder(order.id)}
                                onCloseModal={() => {}}
                                disabled={order.status !== "pending"}
                              />
                            </Modal.Window>
                          )}
                        </Modal>
                      </div>
                    </TableRow>
                  );
                })}
              </Menus>

              {/* Mobile Card View */}
              <MobileCardList>
                {filteredOrders.map((order) => {
                  const orderStatus = getStatusDisplay(order.status);
                  const paymentStatus = getStatusDisplay(order.paymentStatus);

                  return (
                    <MobileCard key={order.id}>
                      <MobileCardHeader>
                        <div>
                          <MobileOrderId>#{order.orderNumber}</MobileOrderId>
                          <MobileClientName>{order.client}</MobileClientName>
                        </div>
                      </MobileCardHeader>

                      <MobileCardBody>
                        <MobileInfoRow>
                          <MobileLabel>
                            <HiOutlineShoppingCart />
                            Products
                          </MobileLabel>
                          <MobileValue
                            style={{
                              fontSize: "1.3rem",
                              textAlign: "right",
                              maxWidth: "18rem",
                            }}
                          >
                            {order.products}
                          </MobileValue>
                        </MobileInfoRow>

                        <MobileInfoRow>
                          <MobileLabel>
                            <HiOutlineCurrencyDollar />
                            Amount
                          </MobileLabel>
                          <MobileValue>{order.amount} TND</MobileValue>
                        </MobileInfoRow>

                        <MobileInfoRow>
                          <MobileLabel>
                            <HiOutlineCalendar />
                            Date
                          </MobileLabel>
                          <MobileValue>
                            {new Date(order.date).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </MobileValue>
                        </MobileInfoRow>
                      </MobileCardBody>

                      <MobileStatusRow>
                        <StatusBadge $status={order.status}>
                          {orderStatus.icon} {orderStatus.label}
                        </StatusBadge>
                        <StatusBadge $status={order.paymentStatus}>
                          {paymentStatus.icon} {paymentStatus.label}
                        </StatusBadge>
                      </MobileStatusRow>

                      <MobileActionsRow>
                        <MobileActionButton
                          onClick={() => handleViewOrder(order.id)}
                        >
                          <HiOutlineEye />
                          View
                        </MobileActionButton>
                        {userRole === "admin" && (
                          <Modal>
                            <Modal.Open opens={`edit-mobile-${order.id}`}>
                              <MobileActionButton>
                                <HiOutlinePencil />
                                Edit
                              </MobileActionButton>
                            </Modal.Open>
                            <Modal.Window name={`edit-mobile-${order.id}`}>
                              <OrderForm
                                orderToEdit={{
                                  id: order.id,
                                  orderNumber: order.orderNumber,
                                  client: order.client,
                                  deliveryDate: order.date,
                                  products: [
                                    {
                                      productId: "1",
                                      name: "Full Cream Milk (1L)",
                                      quantity: 50,
                                      price: 15,
                                    },
                                  ],
                                  notes: "Sample order notes",
                                }}
                                onCloseModal={() => {}}
                                userRole={userRole}
                              />
                            </Modal.Window>
                          </Modal>
                        )}
                        {userRole === "distributor" && (
                          <MobileActionButton
                            onClick={() =>
                              console.log("Mark as delivered:", order.id)
                            }
                          >
                            <HiOutlineTruck />
                            Deliver
                          </MobileActionButton>
                        )}
                      </MobileActionsRow>
                    </MobileCard>
                  );
                })}
              </MobileCardList>
            </>
          )}
        </Table>
      </TableCard>
    </OrdersLayout>
  );
}

export default Orders;
