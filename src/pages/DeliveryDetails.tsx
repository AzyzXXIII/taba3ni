import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  HiOutlineArrowLeft,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineMapPin,
  HiOutlinePhone,
  HiOutlineTruck,
  HiOutlineUser,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineCheckCircle,
} from "react-icons/hi2";
import Heading from "../UI/Heading";
import Row from "../UI/Row";
import Button from "../UI/Button";
import Modal from "../UI/Modal";
import ConfirmDelete from "../UI/ConfirmDelete";
import Timeline from "../UI/Timeline";
import StatusBadge from "../UI/StatusBadge";

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

const MapPlaceholder = styled.div`
  width: 100%;
  height: 30rem;
  background: linear-gradient(
    135deg,
    var(--color-brand-100),
    var(--color-brand-200)
  );
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-grey-0);
  font-size: 6rem;
  margin-top: 1.6rem;
`;

const OrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  margin-top: 1.6rem;
`;

const OrderCard = styled.div`
  padding: 1.6rem;
  background-color: var(--color-grey-50);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
  }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
`;

const OrderId = styled.span`
  font-weight: 600;
  color: var(--color-brand-600);
`;

const OrderAmount = styled.span`
  font-weight: 700;
  color: var(--color-grey-900);
`;

const OrderProducts = styled.div`
  font-size: 1.3rem;
  color: var(--color-grey-600);
`;

// Mock delivery data
const mockDeliveryDetails = {
  id: "1",
  deliveryId: "DEL-001",
  status: "in-progress",
  scheduledTime: "2025-10-09 14:00",
  startedTime: "2025-10-09 13:45",
  estimatedArrival: "2025-10-09 14:15",
  client: {
    name: "Carrefour Lac 2",
    address: "Avenue de la Bourse, Lac 2",
    city: "Tunis",
    phone: "+216 71 123 456",
    contactPerson: "Ahmed Ben Ali",
  },
  distributor: {
    name: "Ahmed Mahmoudi",
    phone: "+216 98 123 456",
    vehicle: "Refrigerated Truck - 123 TU 1234",
  },
  orders: [
    {
      id: "ORD-001",
      products: "Milk (50L), Yogurt (30)",
      amount: 1250,
    },
    {
      id: "ORD-012",
      products: "Cheese (20kg), Butter (10kg)",
      amount: 1300,
    },
    {
      id: "ORD-018",
      products: "Milk (30L)",
      amount: 900,
    },
  ],
  totalAmount: 3450,
  timeline: [
    { action: "Delivery scheduled", date: "2025-10-08 16:30" },
    { action: "Assigned to Ahmed Mahmoudi", date: "2025-10-08 16:45" },
    { action: "Delivery started", date: "2025-10-09 13:45" },
    { action: "En route to destination", date: "2025-10-09 13:50" },
  ],
  route: {
    distance: "12.5 km",
    duration: "25 min",
  },
};

function DeliveryDetails() {
  const { deliveryId } = useParams();
  const navigate = useNavigate();

  const delivery = mockDeliveryDetails;

  const handleDelete = () => {
    console.log("Cancel delivery:", deliveryId);
    navigate("/deliveries");
  };

  const handleOrderClick = (orderId: string) => {
    navigate(`/orders/${orderId}`);
  };

  const getStatusLabel = (status: string) => {
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

  const getStatusColor = (status: string) => {
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

  return (
    <DetailsLayout>
      {/* Back Button */}
      <BackButton onClick={() => navigate("/deliveries")}>
        <HiOutlineArrowLeft />
        Back to Deliveries
      </BackButton>

      {/* Header */}
      <Row type="horizontal">
        <div>
          <Heading as="h1">Delivery #{delivery.deliveryId}</Heading>
          <div style={{ display: "flex", gap: "1.2rem", marginTop: "1.2rem" }}>
            <StatusBadge $status={getStatusColor(delivery.status)}>
              {getStatusLabel(delivery.status)}
            </StatusBadge>
          </div>
        </div>
        <ActionButtons>
          <Button $variation="secondary" $size="medium">
            <HiOutlinePencil style={{ width: "2rem", height: "2rem" }} />
            Edit Delivery
          </Button>
          <Modal>
            <Modal.Open opens="cancel-delivery">
              <Button $variation="danger" $size="medium">
                <HiOutlineTrash style={{ width: "2rem", height: "2rem" }} />
                Cancel
              </Button>
            </Modal.Open>
            <Modal.Window name="cancel-delivery">
              <ConfirmDelete
                resourceName={`delivery ${delivery.deliveryId}`}
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
          {/* Delivery Information */}
          <Card>
            <CardHeader>
              <Heading as="h2">Delivery Information</Heading>
            </CardHeader>
            <InfoRow>
              <HiOutlineCalendar />
              <InfoLabel>Scheduled Time:</InfoLabel>
              <InfoValue>{delivery.scheduledTime}</InfoValue>
            </InfoRow>
            <InfoRow>
              <HiOutlineClock />
              <InfoLabel>Started Time:</InfoLabel>
              <InfoValue>{delivery.startedTime || "Not started yet"}</InfoValue>
            </InfoRow>
            <InfoRow>
              <HiOutlineClock />
              <InfoLabel>Estimated Arrival:</InfoLabel>
              <InfoValue>{delivery.estimatedArrival}</InfoValue>
            </InfoRow>
            <InfoRow>
              <HiOutlineMapPin />
              <InfoLabel>Distance:</InfoLabel>
              <InfoValue>{delivery.route.distance}</InfoValue>
            </InfoRow>
            <InfoRow>
              <HiOutlineClock />
              <InfoLabel>Duration:</InfoLabel>
              <InfoValue>{delivery.route.duration}</InfoValue>
            </InfoRow>
          </Card>

          {/* Client Information */}
          <Card>
            <CardHeader>
              <Heading as="h2">Client Information</Heading>
            </CardHeader>
            <InfoRow>
              <HiOutlineMapPin />
              <InfoLabel>Store Name:</InfoLabel>
              <InfoValue>{delivery.client.name}</InfoValue>
            </InfoRow>
            <InfoRow>
              <HiOutlineMapPin />
              <InfoLabel>Address:</InfoLabel>
              <InfoValue>
                {delivery.client.address}, {delivery.client.city}
              </InfoValue>
            </InfoRow>
            <InfoRow>
              <HiOutlinePhone />
              <InfoLabel>Phone:</InfoLabel>
              <InfoValue>{delivery.client.phone}</InfoValue>
            </InfoRow>
            <InfoRow>
              <HiOutlineUser />
              <InfoLabel>Contact Person:</InfoLabel>
              <InfoValue>{delivery.client.contactPerson}</InfoValue>
            </InfoRow>
          </Card>

          {/* Distributor Information */}
          <Card>
            <CardHeader>
              <Heading as="h2">Distributor Information</Heading>
            </CardHeader>
            <InfoRow>
              <HiOutlineUser />
              <InfoLabel>Name:</InfoLabel>
              <InfoValue>{delivery.distributor.name}</InfoValue>
            </InfoRow>
            <InfoRow>
              <HiOutlinePhone />
              <InfoLabel>Phone:</InfoLabel>
              <InfoValue>{delivery.distributor.phone}</InfoValue>
            </InfoRow>
            <InfoRow>
              <HiOutlineTruck />
              <InfoLabel>Vehicle:</InfoLabel>
              <InfoValue>{delivery.distributor.vehicle}</InfoValue>
            </InfoRow>
          </Card>

          {/* Route Map */}
          <Card>
            <CardHeader>
              <Heading as="h2">Delivery Route</Heading>
            </CardHeader>
            <MapPlaceholder>🗺️</MapPlaceholder>
            <p
              style={{
                marginTop: "1.2rem",
                fontSize: "1.3rem",
                color: "var(--color-grey-600)",
              }}
            >
              GPS tracking integration coming soon
            </p>
          </Card>
        </div>

        {/* Right Column */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "2.4rem" }}
        >
          {/* Orders in Delivery */}
          <Card>
            <CardHeader>
              <Heading as="h2">Orders ({delivery.orders.length})</Heading>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: "1.6rem",
                  color: "var(--color-brand-600)",
                }}
              >
                {delivery.totalAmount.toLocaleString()} TND
              </span>
            </CardHeader>
            <OrdersList>
              {delivery.orders.map((order) => (
                <OrderCard
                  key={order.id}
                  onClick={() => handleOrderClick(order.id)}
                >
                  <OrderHeader>
                    <OrderId>#{order.id}</OrderId>
                    <OrderAmount>{order.amount} TND</OrderAmount>
                  </OrderHeader>
                  <OrderProducts>{order.products}</OrderProducts>
                </OrderCard>
              ))}
            </OrdersList>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <Heading as="h2">Delivery Timeline</Heading>
            </CardHeader>
            <Timeline actions={delivery.timeline} />
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
              <Button $variation="primary" $size="medium">
                <HiOutlineCheckCircle
                  style={{ width: "2rem", height: "2rem" }}
                />
                Mark as Delivered
              </Button>
              <Button $variation="secondary" $size="medium">
                <HiOutlinePhone style={{ width: "2rem", height: "2rem" }} />
                Call Client
              </Button>
              <Button $variation="secondary" $size="medium">
                <HiOutlinePhone style={{ width: "2rem", height: "2rem" }} />
                Call Distributor
              </Button>
            </div>
          </Card>
        </div>
      </Grid>
    </DetailsLayout>
  );
}

export default DeliveryDetails;
