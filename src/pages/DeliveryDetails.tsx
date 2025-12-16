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
  HiOutlineInformationCircle,
  HiOutlineExclamationTriangle,
  HiOutlinePrinter,
} from "react-icons/hi2";
import Heading from "../UI/Heading";
import Row from "../UI/Row";
import Button from "../UI/Button";
import Modal from "../UI/Modal";
import ConfirmDelete from "../UI/ConfirmDelete";
import Timeline from "../UI/Timeline";
import StatusBadge from "../UI/StatusBadge";
import Form from "../UI/Form";
import FormRow from "../UI/FormRow";
import Textarea from "../UI/Textarea";
import ButtonGroup from "../UI/ButtonGroup";
import DeliveryConfirmation from "../components/DeliveryConfirmation";
import DeliveryMap from "../components/DeliveryMap";

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

const ProofPhoto = styled.img`
  width: 100%;
  height: 12rem;
  object-fit: cover;
  border-radius: var(--border-radius-sm);
  border: 2px solid var(--color-grey-300);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.05);
    box-shadow: var(--shadow-md);
  }
`;

const PrintOnly = styled.div`
  @media print {
    display: block;
  }
  display: none;
`;

const ProofSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  margin-top: 1.6rem;
`;

const SignatureImage = styled.img`
  width: 100%;
  max-height: 15rem;
  border: 2px solid var(--color-grey-300);
  border-radius: var(--border-radius-md);
  background-color: var(--color-grey-50);
  object-fit: contain;
  padding: 1rem;
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
  gap: 1.2rem;
`;

const ProofLabel = styled.h4`
  margin-bottom: 0.8rem;
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--color-grey-800);
`;

const ProgressBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin: 2rem 0;
`;

const ProgressStep = styled.div<{ $active: boolean; $completed: boolean }>`
  flex: 1;
  height: 0.8rem;
  background-color: ${(props) =>
    props.$completed
      ? "var(--color-green-600)"
      : props.$active
      ? "var(--color-brand-600)"
      : "var(--color-grey-300)"};
  border-radius: 100px;
  transition: all 0.3s;
  position: relative;

  &::after {
    content: "${(props) => (props.$completed ? "✓" : "")}";
    position: absolute;
    top: -2.4rem;
    left: 50%;
    transform: translateX(-50%);
    font-size: 1.2rem;
    color: var(--color-green-700);
    font-weight: 700;
  }
`;

const ProgressLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  font-size: 1.2rem;
  color: var(--color-grey-600);
`;

// Add helper function:
const getDeliveryProgress = (status: string) => {
  switch (status) {
    case "scheduled":
      return 1;
    case "in-progress":
      return 2;
    case "completed":
      return 4;
    case "failed":
      return 0;
    default:
      return 0;
  }
};

const IssueForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
`;

const IssueTypeSelect = styled.select`
  padding: 1rem;
  border: 2px solid var(--color-grey-300);
  border-radius: var(--border-radius-sm);
  font-size: 1.4rem;

  &:focus {
    outline: none;
    border-color: var(--color-brand-600);
  }
`;

// Mock delivery data
const mockDeliveryDetails = {
  etaDelay: 5,
  id: "1",
  deliveryId: "DEL-001",
  status: "completed",
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
  proofOfDelivery: {
    recipientName: "Ahmed Ben Ali",
    // Replace the signature with this longer mock signature:
    signature:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTAgNTBRNTAgMjAgMTAwIDUwVDE5MCA1MFQyODAgNTBUMzkwIDUwIiBzdHJva2U9IiMwMDAiIGZpbGw9Im5vbmUiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==",
    photos: [
      "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=400&h=300&fit=crop", // Delivery truck
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop", // Boxes
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop", // Store entrance
    ],
    location: { lat: 36.8189, lng: 10.1658 },
    timestamp: "2025-10-09 14:15",
    notes: "Delivered at reception desk",
  },
  notes: [
    { time: "13:45", note: "Started delivery route", author: "Ahmed Mahmoudi" },
    {
      time: "13:50",
      note: "Traffic on Avenue Bourguiba, slight delay",
      author: "Ahmed Mahmoudi",
    },
    { time: "14:00", note: "5 minutes away", author: "Ahmed Mahmoudi" },
  ],
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
          <Button
            $variation="secondary"
            $size="medium"
            onClick={() => window.print()}
          >
            <HiOutlinePrinter style={{ width: "2rem", height: "2rem" }} />
            Print Manifest
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
      <Card>
        <ProgressBar>
          <ProgressStep
            $active={getDeliveryProgress(delivery.status) >= 1}
            $completed={getDeliveryProgress(delivery.status) > 1}
          />
          <ProgressStep
            $active={getDeliveryProgress(delivery.status) >= 2}
            $completed={getDeliveryProgress(delivery.status) > 2}
          />
          <ProgressStep
            $active={getDeliveryProgress(delivery.status) >= 3}
            $completed={getDeliveryProgress(delivery.status) > 3}
          />
          <ProgressStep
            $active={getDeliveryProgress(delivery.status) >= 2}
            $completed={getDeliveryProgress(delivery.status) >= 4}
          />
        </ProgressBar>
        <ProgressLabels>
          <span>Scheduled</span>
          <span>En Route</span>
          <span>At Location</span>
          <span>Delivered</span>
        </ProgressLabels>
      </Card>

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
            <InfoRow>
              <HiOutlineClock />
              <InfoLabel>Updated ETA:</InfoLabel>
              <InfoValue
                style={{
                  color:
                    delivery.etaDelay && delivery.etaDelay > 5
                      ? "var(--color-red-700)"
                      : "var(--color-green-700)",
                  fontWeight: 600,
                }}
              >
                {delivery.estimatedArrival}
                {delivery.etaDelay && delivery.etaDelay > 0 && (
                  <span style={{ marginLeft: "0.8rem", fontSize: "1.2rem" }}>
                    (+{delivery.etaDelay} min delay)
                  </span>
                )}
              </InfoValue>
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
              <Heading as="h2">Live Delivery Tracking</Heading>
            </CardHeader>
            <DeliveryMap
              distributorLocation={{ lat: 36.8065, lng: 10.1815 }}
              clientLocation={{ lat: 36.8189, lng: 10.1658 }}
              distributorName={delivery.distributor.name}
              clientName={delivery.client.name}
            />
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
            {delivery.notes && delivery.notes.length > 0 && (
              <div
                style={{
                  marginTop: "2rem",
                  paddingTop: "2rem",
                  borderTop: "1px solid var(--color-grey-200)",
                }}
              >
                <h4
                  style={{
                    marginBottom: "1.2rem",
                    fontSize: "1.4rem",
                    fontWeight: 600,
                  }}
                >
                  Driver Notes:
                </h4>
                {delivery.notes.map((note, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "1rem",
                      background: "var(--color-blue-50)",
                      borderRadius: "var(--border-radius-sm)",
                      marginBottom: "0.8rem",
                      fontSize: "1.3rem",
                    }}
                  >
                    <strong style={{ color: "var(--color-blue-700)" }}>
                      {note.time}
                    </strong>
                    : {note.note}
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <Heading as="h2">Quick Actions</Heading>
            </CardHeader>
            <Modal>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.2rem",
                }}
              >
                <Modal.Open opens="confirm-delivery">
                  <Button $variation="primary" $size="medium">
                    <HiOutlineCheckCircle
                      style={{ width: "2rem", height: "2rem" }}
                    />
                    Mark as Delivered
                  </Button>
                </Modal.Open>
                <Button $variation="secondary" $size="medium">
                  <HiOutlinePhone style={{ width: "2rem", height: "2rem" }} />
                  Call Client
                </Button>
                <Button $variation="secondary" $size="medium">
                  <HiOutlinePhone style={{ width: "2rem", height: "2rem" }} />
                  Call Distributor
                </Button>
                <Modal.Open opens="report-issue">
                  <Button $variation="danger" $size="medium">
                    <HiOutlineExclamationTriangle
                      style={{ width: "2rem", height: "2rem" }}
                    />
                    Report Issue
                  </Button>
                </Modal.Open>
                <Button
                  $variation="secondary"
                  $size="medium"
                  onClick={() => {
                    console.log("Sending notification to driver...");
                    alert(
                      "SMS sent to driver: 'Urgent: Client requested early delivery'"
                    );
                  }}
                >
                  Send Message to Driver
                </Button>
              </div>

              {/* Modal Windows */}
              <Modal.Window name="confirm-delivery">
                <DeliveryConfirmation
                  deliveryId={delivery.deliveryId}
                  onCloseModal={() => {}}
                />
              </Modal.Window>

              <Modal.Window name="report-issue">
                <Form
                  type="modal"
                  onSubmit={(e) => {
                    e.preventDefault();
                    console.log("Issue reported");
                  }}
                >
                  <Heading as="h2">Report Delivery Issue</Heading>
                  <IssueForm>
                    <FormRow label="Issue Type">
                      <IssueTypeSelect>
                        <option>Client Not Available</option>
                        <option>Wrong Address</option>
                        <option>Access Denied</option>
                        <option>Vehicle Breakdown</option>
                        <option>Traffic Delay</option>
                        <option>Other</option>
                      </IssueTypeSelect>
                    </FormRow>
                    <FormRow label="Description">
                      <Textarea rows={4} placeholder="Describe the issue..." />
                    </FormRow>
                    <ButtonGroup>
                      <Button type="button" $variation="secondary">
                        Cancel
                      </Button>
                      <Button type="submit">Submit Report</Button>
                    </ButtonGroup>
                  </IssueForm>
                </Form>
              </Modal.Window>
            </Modal>
          </Card>

          {/* ✅ PROOF OF DELIVERY CARD - MOVE IT HERE (OUTSIDE Modal) */}
          {delivery.status === "completed" && delivery.proofOfDelivery && (
            <Card>
              <CardHeader>
                <Heading as="h2">📋 Proof of Delivery</Heading>
              </CardHeader>
              <ProofSection>
                <InfoRow>
                  <HiOutlineUser />
                  <InfoLabel>Received by:</InfoLabel>
                  <InfoValue>
                    {delivery.proofOfDelivery.recipientName}
                  </InfoValue>
                </InfoRow>
                <InfoRow>
                  <HiOutlineClock />
                  <InfoLabel>Delivered at:</InfoLabel>
                  <InfoValue>{delivery.proofOfDelivery.timestamp}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <HiOutlineMapPin />
                  <InfoLabel>GPS Location:</InfoLabel>
                  <InfoValue>
                    {delivery.proofOfDelivery.location.lat.toFixed(6)},{" "}
                    {delivery.proofOfDelivery.location.lng.toFixed(6)}
                  </InfoValue>
                </InfoRow>

                <div>
                  <ProofLabel>✍️ Recipient Signature:</ProofLabel>
                  <SignatureImage
                    src={delivery.proofOfDelivery.signature}
                    alt="Recipient signature"
                  />
                </div>

                {delivery.proofOfDelivery.photos &&
                  delivery.proofOfDelivery.photos.length > 0 && (
                    <div>
                      <ProofLabel>
                        📸 Delivery Photos (
                        {delivery.proofOfDelivery.photos.length}):
                      </ProofLabel>
                      <PhotoGrid>
                        {delivery.proofOfDelivery.photos.map((photo, index) => (
                          <ProofPhoto
                            key={index}
                            src={photo}
                            alt={`Delivery proof ${index + 1}`}
                            onClick={() => window.open(photo, "_blank")}
                            title="Click to view full size"
                          />
                        ))}
                      </PhotoGrid>
                    </div>
                  )}

                {delivery.proofOfDelivery.notes && (
                  <InfoRow>
                    <HiOutlineInformationCircle />
                    <InfoLabel>Additional Notes:</InfoLabel>
                    <InfoValue>{delivery.proofOfDelivery.notes}</InfoValue>
                  </InfoRow>
                )}
              </ProofSection>
            </Card>
          )}
        </div>
      </Grid>
    </DetailsLayout>
  );
}

export default DeliveryDetails;
