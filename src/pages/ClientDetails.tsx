import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  HiOutlineArrowLeft,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineMapPin,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineBuildingStorefront,
  HiOutlineUser,
  HiOutlineCurrencyDollar,
  HiOutlineCalendar,
  HiOutlineShoppingCart,
} from "react-icons/hi2";
import Heading from "../UI/Heading";
import Row from "../UI/Row";
import Button from "../UI/Button";
import Modal from "../UI/Modal";
import ConfirmDelete from "../UI/ConfirmDelete";
import ClientForm from "../components/ClientForm";

// Styled Components
const DetailsLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: none;
  border: none;
  color: var(--color-brand-600);
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: var(--color-brand-700);
  }

  & svg {
    width: 2rem;
    height: 2rem;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1.2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2.4rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.6rem;
  border-bottom: 1px solid var(--color-grey-200);
`;

const StatusBadge = styled.span<{ $status: "active" | "inactive" | "pending" }>`
  display: inline-flex;
  align-items: center;
  padding: 0.6rem 1.4rem;
  border-radius: 100px;
  font-size: 1.3rem;
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

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1.2rem 0;
  border-bottom: 1px solid var(--color-grey-100);

  &:last-child {
    border-bottom: none;
  }

  & svg {
    width: 2rem;
    height: 2rem;
    color: var(--color-brand-600);
    flex-shrink: 0;
  }
`;

const InfoLabel = styled.span`
  font-weight: 600;
  color: var(--color-grey-700);
  min-width: 14rem;
`;

const InfoValue = styled.span`
  color: var(--color-grey-600);
  flex: 1;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.6rem;
  margin-top: 2rem;
`;

const StatBox = styled.div`
  padding: 1.6rem;
  background-color: var(--color-grey-50);
  border-radius: var(--border-radius-md);
  text-align: center;

  & h4 {
    font-size: 2.4rem;
    font-weight: 700;
    color: var(--color-brand-600);
    margin-bottom: 0.4rem;
  }

  & p {
    font-size: 1.2rem;
    color: var(--color-grey-600);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 0;
  }
`;

const OrdersTable = styled.div`
  margin-top: 1.6rem;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr;
  gap: 1.6rem;
  padding: 1.2rem 1.6rem;
  background-color: var(--color-grey-50);
  border-radius: var(--border-radius-sm);
  font-weight: 600;
  font-size: 1.3rem;
  text-transform: uppercase;
  color: var(--color-grey-600);
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr;
  gap: 1.6rem;
  padding: 1.6rem;
  border-bottom: 1px solid var(--color-grey-100);
  cursor: pointer;
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

// Mock client data
const mockClientDetails = {
  id: "1",
  name: "Carrefour Lac 2",
  type: "supermarket",
  status: "active" as const,
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
  joinedDate: "2024-01-15",
  lastOrderDate: "2025-10-05",
  recentOrders: [
    {
      id: "ORD-001",
      date: "2025-10-05",
      products: "Milk (50L), Yogurt (30)",
      amount: 1250,
      status: "delivered",
    },
    {
      id: "ORD-002",
      date: "2025-10-03",
      products: "Cheese (20kg), Butter (10kg)",
      amount: 890,
      status: "delivered",
    },
    {
      id: "ORD-003",
      date: "2025-10-01",
      products: "Milk (100L)",
      amount: 1500,
      status: "delivered",
    },
  ],
};

function ClientDetails() {
  const { clientId } = useParams();
  const navigate = useNavigate();

  const client = mockClientDetails;

  const handleDelete = () => {
    console.log("Delete client:", clientId);
    navigate("/clients");
  };

  const handleViewOrder = (orderId: string) => {
    navigate(`/orders/${orderId}`);
  };

  return (
    <DetailsLayout>
      {/* Back Button */}
      <BackButton onClick={() => navigate("/clients")}>
        <HiOutlineArrowLeft />
        Back to Clients
      </BackButton>

      {/* Header */}
      <Row type="horizontal">
        <div>
          <Heading as="h1">{client.name}</Heading>
          <div style={{ display: "flex", gap: "1.2rem", marginTop: "1.2rem" }}>
            <StatusBadge $status={client.status}>{client.status}</StatusBadge>
            <span
              style={{
                fontSize: "1.4rem",
                color: "var(--color-grey-600)",
                textTransform: "capitalize",
              }}
            >
              {client.type}
            </span>
          </div>
        </div>
        <ActionButtons>
          <Modal>
            <Modal.Open opens="edit-client">
              <Button $variation="secondary" $size="medium">
                <HiOutlinePencil style={{ width: "2rem", height: "2rem" }} />
                Edit Client
              </Button>
            </Modal.Open>
            <Modal.Window name="edit-client">
              <ClientForm clientToEdit={client} onCloseModal={() => {}} />
            </Modal.Window>
          </Modal>

          <Modal>
            <Modal.Open opens="delete-client">
              <Button $variation="danger" $size="medium">
                <HiOutlineTrash style={{ width: "2rem", height: "2rem" }} />
                Delete
              </Button>
            </Modal.Open>
            <Modal.Window name="delete-client">
              <ConfirmDelete
                resourceName={`client ${client.name}`}
                onConfirm={handleDelete}
                onCloseModal={() => {}}
              />
            </Modal.Window>
          </Modal>
        </ActionButtons>
      </Row>

      {/* Main Content Grid */}
      <Grid>
        {/* Left Column */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "2.4rem" }}
        >
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <Heading as="h2">Contact Information</Heading>
            </CardHeader>
            <InfoRow>
              <HiOutlineUser />
              <InfoLabel>Contact Person:</InfoLabel>
              <InfoValue>{client.contactPerson}</InfoValue>
            </InfoRow>
            <InfoRow>
              <HiOutlinePhone />
              <InfoLabel>Phone:</InfoLabel>
              <InfoValue>{client.phone}</InfoValue>
            </InfoRow>
            <InfoRow>
              <HiOutlineEnvelope />
              <InfoLabel>Email:</InfoLabel>
              <InfoValue>{client.email}</InfoValue>
            </InfoRow>
            <InfoRow>
              <HiOutlineMapPin />
              <InfoLabel>Address:</InfoLabel>
              <InfoValue>
                {client.address}, {client.city}
              </InfoValue>
            </InfoRow>
            <InfoRow>
              <HiOutlineBuildingStorefront />
              <InfoLabel>Tax ID:</InfoLabel>
              <InfoValue>{client.taxId || "N/A"}</InfoValue>
            </InfoRow>
          </Card>

          {/* Financial Information */}
          <Card>
            <CardHeader>
              <Heading as="h2">Financial Information</Heading>
            </CardHeader>
            <InfoRow>
              <HiOutlineCurrencyDollar />
              <InfoLabel>Credit Limit:</InfoLabel>
              <InfoValue>{client.creditLimit.toLocaleString()} TND</InfoValue>
            </InfoRow>
            <InfoRow>
              <HiOutlineCurrencyDollar />
              <InfoLabel>Current Balance:</InfoLabel>
              <InfoValue
                style={{ color: "var(--color-red-700)", fontWeight: 600 }}
              >
                {client.balance.toLocaleString()} TND
              </InfoValue>
            </InfoRow>
            <InfoRow>
              <HiOutlineCurrencyDollar />
              <InfoLabel>Available Credit:</InfoLabel>
              <InfoValue
                style={{ color: "var(--color-green-700)", fontWeight: 600 }}
              >
                {(client.creditLimit - client.balance).toLocaleString()} TND
              </InfoValue>
            </InfoRow>
            <InfoRow>
              <HiOutlineCalendar />
              <InfoLabel>Payment Terms:</InfoLabel>
              <InfoValue>{client.paymentTerms}</InfoValue>
            </InfoRow>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <Heading as="h2">Recent Orders</Heading>
              <Button
                $variation="secondary"
                $size="small"
                onClick={() => navigate(`/orders?client=${client.id}`)}
              >
                View All →
              </Button>
            </CardHeader>
            <OrdersTable>
              <TableHeader>
                <div>Order ID</div>
                <div>Products</div>
                <div>Amount</div>
                <div>Date</div>
              </TableHeader>
              {client.recentOrders.map((order) => (
                <TableRow
                  key={order.id}
                  onClick={() => handleViewOrder(order.id)}
                >
                  <OrderId>#{order.id}</OrderId>
                  <div
                    style={{
                      fontSize: "1.3rem",
                      color: "var(--color-grey-600)",
                    }}
                  >
                    {order.products}
                  </div>
                  <div style={{ fontWeight: 600 }}>{order.amount} TND</div>
                  <div
                    style={{
                      fontSize: "1.3rem",
                      color: "var(--color-grey-600)",
                    }}
                  >
                    {order.date}
                  </div>
                </TableRow>
              ))}
            </OrdersTable>
          </Card>
        </div>

        {/* Right Column - Statistics */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "2.4rem" }}
        >
          <Card>
            <CardHeader>
              <Heading as="h2">Statistics</Heading>
            </CardHeader>
            <StatsGrid>
              <StatBox>
                <h4>{client.totalOrders}</h4>
                <p>Total Orders</p>
              </StatBox>
              <StatBox>
                <h4>{client.totalSpent.toLocaleString()}</h4>
                <p>Total Spent (TND)</p>
              </StatBox>
              <StatBox>
                <h4>{(client.totalSpent / client.totalOrders).toFixed(0)}</h4>
                <p>Avg Order (TND)</p>
              </StatBox>
              <StatBox>
                <h4>{client.balance.toLocaleString()}</h4>
                <p>Outstanding (TND)</p>
              </StatBox>
            </StatsGrid>

            <InfoRow style={{ marginTop: "2rem" }}>
              <HiOutlineCalendar />
              <InfoLabel>Member Since:</InfoLabel>
              <InfoValue>{client.joinedDate}</InfoValue>
            </InfoRow>
            <InfoRow>
              <HiOutlineShoppingCart />
              <InfoLabel>Last Order:</InfoLabel>
              <InfoValue>{client.lastOrderDate}</InfoValue>
            </InfoRow>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <Heading as="h2">Quick Actions</Heading>
            </CardHeader>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.2rem",
              }}
            >
              <Button
                $variation="primary"
                $size="medium"
                onClick={() => navigate(`/orders/new?client=${client.id}`)}
              >
                <HiOutlineShoppingCart
                  style={{ width: "2rem", height: "2rem" }}
                />
                Create New Order
              </Button>
              <Button
                $variation="secondary"
                $size="medium"
                onClick={() => navigate(`/orders?client=${client.id}`)}
              >
                <HiOutlineShoppingCart
                  style={{ width: "2rem", height: "2rem" }}
                />
                View Order History
              </Button>
              <Button
                $variation="secondary"
                $size="medium"
                onClick={() => console.log("View invoices")}
              >
                <HiOutlineCurrencyDollar
                  style={{ width: "2rem", height: "2rem" }}
                />
                View Invoices
              </Button>
            </div>
          </Card>
        </div>
      </Grid>
    </DetailsLayout>
  );
}

export default ClientDetails;
