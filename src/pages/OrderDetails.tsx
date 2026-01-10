import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  HiOutlineArrowLeft,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineMapPin,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlinePrinter,
} from "react-icons/hi2";
import Heading from "../UI/Heading";
import Row from "../UI/Row";
import Button from "../UI/Button";
import StatusBadge from "../UI/StatusBadge";
import { getStatusDisplay } from "../utils/statusHelpers";
import type { OrderStatus, PaymentStatus } from "../types/status";
import Timeline from "../UI/Timeline";
import Modal from "../UI/Modal";
import ConfirmDelete from "../UI/ConfirmDelete";
import OrderForm from "../components/OrderForm";

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
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;

    & > * {
      flex: 1;
    }
  }
`;

const HeaderRow = styled(Row)`
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch !important;
    gap: 1.6rem;
  }
`;

const HeaderContent = styled.div`
  @media (max-width: 768px) {
    & > div {
      flex-wrap: wrap;
    }
  }
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

  @media (max-width: 768px) {
    padding: 1.6rem;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.6rem;
  border-bottom: 1px solid var(--color-grey-200);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.2rem;
  }
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

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.4rem;
    padding: 1rem 0;
  }
`;

const InfoLabel = styled.span`
  font-weight: 600;
  color: var(--color-grey-700);
  min-width: 12rem;

  @media (max-width: 768px) {
    min-width: auto;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }
`;

const InfoValue = styled.span`
  color: var(--color-grey-600);
  flex: 1;

  @media (max-width: 768px) {
    font-size: 1.4rem;
    font-weight: 500;
    color: var(--color-grey-900);
  }
`;

const ProductsTable = styled.div`
  width: 100%;
  margin-top: 1.6rem;
  overflow-x: auto;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 1.6rem;
  padding: 1.2rem 1.6rem;
  background-color: var(--color-grey-50);
  border-radius: var(--border-radius-sm);
  font-weight: 600;
  font-size: 1.3rem;
  text-transform: uppercase;
  color: var(--color-grey-600);

  @media (max-width: 768px) {
    display: none;
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 1.6rem;
  padding: 1.6rem;
  border-bottom: 1px solid var(--color-grey-100);

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

// Mobile Product Card
const MobileProductList = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    margin-top: 1.6rem;
  }
`;

const MobileProductCard = styled.div`
  background-color: var(--color-grey-50);
  padding: 1.6rem;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--color-grey-200);
`;

const MobileProductName = styled.div`
  font-weight: 600;
  font-size: 1.4rem;
  color: var(--color-grey-900);
  margin-bottom: 1rem;
`;

const MobileProductRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.4rem 0;
  font-size: 1.3rem;

  & .label {
    color: var(--color-grey-600);
  }

  & .value {
    font-weight: 600;
    color: var(--color-grey-900);
  }
`;

const TotalSection = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid var(--color-grey-200);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const TotalRow = styled.div<{ $isFinal?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${(props) => (props.$isFinal ? "2rem" : "1.6rem")};
  font-weight: ${(props) => (props.$isFinal ? "700" : "500")};
  color: ${(props) =>
    props.$isFinal ? "var(--color-brand-600)" : "var(--color-grey-700)"};

  @media (max-width: 768px) {
    font-size: ${(props) => (props.$isFinal ? "1.8rem" : "1.4rem")};
  }
`;

// Mock order data
const mockOrderDetails = {
  id: "1",
  orderNumber: "ORD-001",
  status: "out-for-delivery" as OrderStatus,
  paymentStatus: "unpaid" as PaymentStatus,
  createdDate: "2025-10-05 10:30",
  deliveryDate: "2025-10-05 14:00",
  client: {
    name: "Carrefour Lac 2",
    address: "Avenue de la Bourse, Lac 2, Tunis 1053",
    phone: "+216 71 123 456",
    email: "carrefour.lac2@example.com",
  },
  products: [
    {
      id: "1",
      name: "Full Cream Milk (1L)",
      quantity: 50,
      price: 15,
      total: 750,
    },
    {
      id: "2",
      name: "Greek Yogurt (500g)",
      quantity: 30,
      price: 8,
      total: 240,
    },
    { id: "3", name: "Butter (250g)", quantity: 20, price: 12, total: 240 },
  ],
  subtotal: 1230,
  tax: 20,
  total: 1250,
  paidAmount: 0,
  notes: "Please deliver before 2 PM. Contact store manager upon arrival.",
  timeline: [
    { action: "Order created", date: "2025-10-05 10:30" },
    { action: "Order confirmed", date: "2025-10-05 10:45" },
    {
      action: "Assigned to distributor: Ahmed Mahmoudi",
      date: "2025-10-05 11:00",
    },
    { action: "Out for delivery", date: "2025-10-05 12:30" },
  ],
};

function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  // In real app, fetch order details using orderId
  const order = mockOrderDetails;

  const orderStatus = getStatusDisplay(order.status);
  const paymentStatus = getStatusDisplay(order.paymentStatus);

  const handleEdit = () => {
    console.log("Edit order:", orderId);
    // Now handled by Modal - no need for extra logic
  };

  const handleDelete = () => {
    console.log("Delete order:", orderId);
    // TODO: Call delete API and navigate back
    navigate("/orders");
  };

  const handlePrint = () => {
    console.log("Print order:", orderId);
    window.print();
  };

  return (
    <DetailsLayout>
      {/* Back Button */}
      <BackButton onClick={() => navigate("/orders")}>
        <HiOutlineArrowLeft />
        Back to Orders
      </BackButton>

      {/* Header */}
      <HeaderRow type="horizontal">
        <HeaderContent>
          <Heading as="h1">Order #{order.orderNumber}</Heading>
          <div style={{ display: "flex", gap: "1.2rem", marginTop: "1.2rem" }}>
            <StatusBadge $status={order.status}>
              {orderStatus.icon} {orderStatus.label}
            </StatusBadge>
            <StatusBadge $status={order.paymentStatus}>
              {paymentStatus.icon} {paymentStatus.label}
            </StatusBadge>
          </div>
        </HeaderContent>
        <ActionButtons>
          <Button $variation="secondary" $size="medium" onClick={handlePrint}>
            <HiOutlinePrinter style={{ width: "2rem", height: "2rem" }} />
            Print
          </Button>

          {/* Edit Button with Modal */}
          <Modal>
            <Modal.Open opens="edit-order">
              <Button $variation="secondary" $size="medium">
                <HiOutlinePencil style={{ width: "2rem", height: "2rem" }} />
                Edit
              </Button>
            </Modal.Open>
            <Modal.Window name="edit-order">
              <OrderForm
                orderToEdit={{
                  id: order.id,
                  orderNumber: order.orderNumber,
                  client: order.client.name,
                  deliveryDate: order.deliveryDate,
                  products: order.products.map((p) => ({
                    id: p.id,
                    productId: p.id,
                    name: p.name,
                    quantity: p.quantity,
                    price: p.price,
                  })),
                  notes: order.notes,
                }}
                onCloseModal={() => {}}
              />
            </Modal.Window>
          </Modal>

          {/* Delete Button with Modal */}
          <Modal>
            <Modal.Open opens="delete-order">
              <Button $variation="danger" $size="medium">
                <HiOutlineTrash style={{ width: "2rem", height: "2rem" }} />
                Delete
              </Button>
            </Modal.Open>
            <Modal.Window name="delete-order">
              <ConfirmDelete
                resourceName={`order ${order.orderNumber}`}
                onConfirm={handleDelete}
                onCloseModal={() => {}}
              />
            </Modal.Window>
          </Modal>
        </ActionButtons>
      </HeaderRow>

      {/* Main Content Grid */}
      <Grid>
        {/* Left Column */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "2.4rem" }}
        >
          {/* Order Details */}
          <Card>
            <CardHeader>
              <Heading as="h2">Order Details</Heading>
            </CardHeader>
            <InfoRow>
              <InfoLabel>
                <HiOutlineCalendar />
                Created Date:
              </InfoLabel>
              <InfoValue>{order.createdDate}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>
                <HiOutlineClock />
                Delivery Date:
              </InfoLabel>
              <InfoValue>{order.deliveryDate}</InfoValue>
            </InfoRow>
          </Card>

          {/* Client Information */}
          <Card>
            <CardHeader>
              <Heading as="h2">Client Information</Heading>
            </CardHeader>
            <InfoRow>
              <InfoLabel>
                <HiOutlineMapPin />
                Store Name:
              </InfoLabel>
              <InfoValue>{order.client.name}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>
                <HiOutlineMapPin />
                Address:
              </InfoLabel>
              <InfoValue>{order.client.address}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>
                <HiOutlinePhone />
                Phone:
              </InfoLabel>
              <InfoValue>{order.client.phone}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>
                <HiOutlineEnvelope />
                Email:
              </InfoLabel>
              <InfoValue>{order.client.email}</InfoValue>
            </InfoRow>
          </Card>

          {/* Products */}
          <Card>
            <CardHeader>
              <Heading as="h2">Products</Heading>
            </CardHeader>

            {/* Desktop Table */}
            <ProductsTable>
              <TableHeader>
                <div>Product</div>
                <div>Quantity</div>
                <div>Price</div>
                <div>Total</div>
              </TableHeader>
              {order.products.map((product) => (
                <TableRow key={product.id}>
                  <div style={{ fontWeight: 500 }}>{product.name}</div>
                  <div>{product.quantity}</div>
                  <div>{product.price} TND</div>
                  <div style={{ fontWeight: 600 }}>{product.total} TND</div>
                </TableRow>
              ))}
            </ProductsTable>

            {/* Mobile Cards */}
            <MobileProductList>
              {order.products.map((product) => (
                <MobileProductCard key={product.id}>
                  <MobileProductName>{product.name}</MobileProductName>
                  <MobileProductRow>
                    <span className="label">Quantity:</span>
                    <span className="value">{product.quantity}</span>
                  </MobileProductRow>
                  <MobileProductRow>
                    <span className="label">Price:</span>
                    <span className="value">{product.price} TND</span>
                  </MobileProductRow>
                  <MobileProductRow>
                    <span className="label">Total:</span>
                    <span className="value">{product.total} TND</span>
                  </MobileProductRow>
                </MobileProductCard>
              ))}
            </MobileProductList>

            <TotalSection>
              <TotalRow>
                <span>Subtotal:</span>
                <span>{order.subtotal} TND</span>
              </TotalRow>
              <TotalRow>
                <span>Tax (TVA):</span>
                <span>{order.tax} TND</span>
              </TotalRow>
              <TotalRow $isFinal>
                <span>Total:</span>
                <span>{order.total} TND</span>
              </TotalRow>
              <TotalRow>
                <span>Paid Amount:</span>
                <span style={{ color: "var(--color-green-700)" }}>
                  {order.paidAmount} TND
                </span>
              </TotalRow>
              <TotalRow>
                <span>Remaining:</span>
                <span style={{ color: "var(--color-red-700)" }}>
                  {order.total - order.paidAmount} TND
                </span>
              </TotalRow>
            </TotalSection>
          </Card>

          {/* Notes */}
          {order.notes && (
            <Card>
              <CardHeader>
                <Heading as="h2">Notes</Heading>
              </CardHeader>
              <p
                style={{
                  color: "var(--color-grey-600)",
                  lineHeight: "1.6",
                  fontSize: "1.4rem",
                }}
              >
                {order.notes}
              </p>
            </Card>
          )}
        </div>

        {/* Right Column - Timeline */}
        <Card>
          <CardHeader>
            <Heading as="h2">Order Timeline</Heading>
          </CardHeader>
          <Timeline actions={order.timeline} />
        </Card>
      </Grid>
    </DetailsLayout>
  );
}

export default OrderDetails;
