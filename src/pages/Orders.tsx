import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { HiOutlineEye, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi2";
import Heading from "../UI/Heading";
import Row from "../UI/Row"; // ← MAKE SURE THIS IS IMPORTED
import Button from "../UI/Button";
import StatusBadge from "../UI/StatusBadge";
import { getStatusDisplay } from "../utils/statusHelpers";
import type { OrderStatus, PaymentStatus } from "../types/status";
import SearchBar from "../UI/SearchBar";
import Menus from "../UI/Menus";
import Modal from "../UI/Modal";
import ConfirmDelete from "../UI/ConfirmDelete";
import OrderForm from "../components/OrderForm";

// ---------------- Styled Components ----------------
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
  grid-template-columns: 1fr 2fr 1.5fr 1fr 1fr 1fr 0.5fr;
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
  padding: 6rem 2rem;
  text-align: center;
  color: var(--color-grey-500);

  & p {
    font-size: 1.8rem;
    margin-bottom: 1.6rem;
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

// ---------------- Types ----------------
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
  client: string;
  products: string;
  amount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  date: string;
};

// Add props type
type OrdersProps = {
  userRole?: "admin" | "distributor" | "client";
  userId?: string;
  userName?: string;
};

// ---------------- Mock Data ----------------
const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-001",
    client: "Carrefour Lac 2",
    products: "Milk (50L), Yogurt (30)",
    amount: 1250,
    status: "out-for-delivery",
    paymentStatus: "unpaid",
    date: "2025-10-05 10:30",
  },
  {
    id: "2",
    orderNumber: "ORD-002",
    client: "Monoprix Menzah",
    products: "Cheese (20kg), Butter (10kg)",
    amount: 890,
    status: "delivered",
    paymentStatus: "paid",
    date: "2025-10-05 09:15",
  },
  {
    id: "3",
    orderNumber: "ORD-003",
    client: "Magasin Général Marsa",
    products: "Milk (100L), Yogurt (50)",
    amount: 2100,
    status: "processing",
    paymentStatus: "partial",
    date: "2025-10-05 08:45",
  },
];

// ---------------- Component ----------------
function Orders({ userRole = "admin", userId, userName }: OrdersProps) {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter orders
  const filteredOrders = mockOrders.filter((order) => {
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.client.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate stats
  const stats = {
    total: mockOrders.length,
    pending: mockOrders.filter((o) => o.status === "pending").length,
    processing: mockOrders.filter((o) => o.status === "processing").length,
    delivered: mockOrders.filter((o) => o.status === "delivered").length,
    failed: mockOrders.filter((o) => o.status === "failed").length,
  };

  const handleViewOrder = (orderId: string) => {
    navigate(`/orders/${orderId}`);
  };

  const handleDeleteOrder = (orderId: string) => {
    console.log("Delete order:", orderId);
  };

  return (
    <OrdersLayout>
      {/* Header - Role-based */}
      <Row type="horizontal">
        <Heading as="h1">
          {userRole === "client" ? "My Orders" : "Orders Management"}
        </Heading>
        <Modal>
          <Modal.Open opens="create-order">
            <Button $size="medium">
              {userRole === "client" ? "+ Place New Order" : "+ New Order"}
            </Button>
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
      </Row>

      {/* Stats */}
      <StatsRow>
        <StatCard>
          <h3>{stats.total}</h3>
          <p>Total Orders</p>
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
        <StatCard>
          <h3>{stats.failed}</h3>
          <p>Failed</p>
        </StatCard>
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
          <FilterButton
            $active={statusFilter === "failed"}
            onClick={() => setStatusFilter("failed")}
          >
            Failed
          </FilterButton>
        </FilterGroup>
      </FiltersBar>

      {/* Orders Table */}
      <TableCard>
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
              <p>🔍 No orders found</p>
              <p style={{ fontSize: "1.4rem" }}>
                Try adjusting your filters or search query
              </p>
            </EmptyState>
          ) : (
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
                                <Modal.Open opens="delete">
                                  <Menus.Button icon={<HiOutlineTrash />}>
                                    Delete Order
                                  </Menus.Button>
                                </Modal.Open>
                              </>
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
                                    {
                                      productId: "2",
                                      name: "Greek Yogurt (500g)",
                                      quantity: 30,
                                      price: 8,
                                    },
                                  ],
                                  notes: "Sample order notes",
                                }}
                                onCloseModal={() => {}}
                                userRole={userRole}
                              />
                            </Modal.Window>

                            <Modal.Window name="delete">
                              <ConfirmDelete
                                resourceName={`order ${order.orderNumber}`}
                                onConfirm={() => handleDeleteOrder(order.id)}
                                onCloseModal={() => {}}
                              />
                            </Modal.Window>
                          </>
                        )}
                      </Modal>
                    </div>
                  </TableRow>
                );
              })}
            </Menus>
          )}
        </Table>
      </TableCard>
    </OrdersLayout>
  );
}

export default Orders;
