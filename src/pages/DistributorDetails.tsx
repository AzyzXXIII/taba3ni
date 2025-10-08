import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  HiOutlineArrowLeft,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineMapPin,
  HiOutlineUser,
  HiOutlineTruck,
  HiOutlineStar,
  HiOutlineCalendar,
} from "react-icons/hi2";
import Heading from "../UI/Heading";
import Row from "../UI/Row";
import Button from "../UI/Button";
import Modal from "../UI/Modal";
import ConfirmDelete from "../UI/ConfirmDelete";

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

const StatusBadge = styled.span<{
  $status: "active" | "inactive" | "on-delivery";
}>`
  display: inline-flex;
  align-items: center;
  padding: 0.6rem 1.4rem;
  border-radius: 100px;
  font-size: 1.3rem;
  font-weight: 600;
  text-transform: uppercase;
  background-color: ${(props) => {
    if (props.$status === "active") return "var(--color-green-100)";
    if (props.$status === "on-delivery") return "var(--color-blue-100)";
    return "var(--color-grey-100)";
  }};
  color: ${(props) => {
    if (props.$status === "active") return "var(--color-green-700)";
    if (props.$status === "on-delivery") return "var(--color-blue-700)";
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

const DeliveriesTable = styled.div`
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

const DeliveryId = styled.span`
  font-weight: 600;
  color: var(--color-brand-600);
`;

const RatingStars = styled.div`
  display: flex;
  gap: 0.4rem;
  align-items: center;
  margin-top: 0.8rem;

  & svg {
    width: 1.8rem;
    height: 1.8rem;
    color: var(--color-yellow-700);
  }

  & span {
    margin-left: 0.8rem;
    font-weight: 600;
    color: var(--color-grey-700);
  }
`;

// Mock distributor data
const mockDistributorDetails = {
  id: "1",
  name: "Ahmed Mahmoudi",
  status: "on-delivery" as const,
  phone: "+216 98 123 456",
  email: "ahmed.mahmoudi@taba3ni.tn",
  zone: "Tunis, Lac 2, La Marsa, Carthage",
  vehicle: {
    type: "Refrigerated Truck",
    plate: "123 TU 1234",
    capacity: "2 tons",
  },
  totalDeliveries: 145,
  activeDeliveries: 2,
  completedToday: 3,
  rating: 4.8,
  totalRatings: 127,
  joinedDate: "2024-01-15",
  lastDelivery: "2025-10-09 13:45",
  recentDeliveries: [
    {
      id: "DEL-001",
      date: "2025-10-09 14:00",
      client: "Carrefour Lac 2",
      status: "in-progress",
    },
    {
      id: "DEL-015",
      date: "2025-10-09 10:30",
      client: "Monoprix Menzah",
      status: "completed",
    },
    {
      id: "DEL-023",
      date: "2025-10-08 16:00",
      client: "Magasin Général Marsa",
      status: "completed",
    },
  ],
  performance: {
    onTimeRate: 96,
    completionRate: 98,
    averageDeliveryTime: "28 min",
  },
};

function DistributorDetails() {
  const { distributorId } = useParams();
  const navigate = useNavigate();

  const distributor = mockDistributorDetails;

  const handleDelete = () => {
    console.log("Delete distributor:", distributorId);
    navigate("/distributors");
  };

  const handleViewDelivery = (deliveryId: string) => {
    navigate(`/deliveries/${deliveryId}`);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <HiOutlineStar
        key={i}
        style={{
          fill: i < Math.floor(rating) ? "currentColor" : "none",
        }}
      />
    ));
  };

  return (
    <DetailsLayout>
      {/* Back Button */}
      <BackButton onClick={() => navigate("/distributors")}>
        <HiOutlineArrowLeft />
        Back to Distributors
      </BackButton>

      {/* Header */}
      <Row type="horizontal">
        <div>
          <Heading as="h1">{distributor.name}</Heading>
          <div style={{ display: "flex", gap: "1.2rem", marginTop: "1.2rem" }}>
            <StatusBadge $status={distributor.status}>
              {distributor.status === "on-delivery"
                ? "On Delivery"
                : distributor.status}
            </StatusBadge>
          </div>
          <RatingStars>
            {renderStars(distributor.rating)}
            <span>
              {distributor.rating} ({distributor.totalRatings} reviews)
            </span>
          </RatingStars>
        </div>
        <ActionButtons>
          <Modal>
            <Modal.Open opens="edit-distributor">
              <Button $variation="secondary" $size="medium">
                <HiOutlinePencil style={{ width: "2rem", height: "2rem" }} />
                Edit Distributor
              </Button>
            </Modal.Open>
            <Modal.Window name="edit-distributor">
              <div>Edit form coming soon</div>
            </Modal.Window>
          </Modal>

          <Modal>
            <Modal.Open opens="delete-distributor">
              <Button $variation="danger" $size="medium">
                <HiOutlineTrash style={{ width: "2rem", height: "2rem" }} />
                Delete
              </Button>
            </Modal.Open>
            <Modal.Window name="delete-distributor">
              <ConfirmDelete
                resourceName={`distributor ${distributor.name}`}
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
              <InfoLabel>Full Name:</InfoLabel>
              <InfoValue>{distributor.name}</InfoValue>
            </InfoRow>
            <InfoRow>
              <HiOutlinePhone />
              <InfoLabel>Phone:</InfoLabel>
              <InfoValue>{distributor.phone}</InfoValue>
            </InfoRow>
            <InfoRow>
              <HiOutlineEnvelope />
              <InfoLabel>Email:</InfoLabel>
              <InfoValue>{distributor.email}</InfoValue>
            </InfoRow>
            <InfoRow>
              <HiOutlineMapPin />
              <InfoLabel>Assigned Zone:</InfoLabel>
              <InfoValue>{distributor.zone}</InfoValue>
            </InfoRow>
          </Card>

          {/* Vehicle Information */}
          <Card>
            <CardHeader>
              <Heading as="h2">Vehicle Information</Heading>
            </CardHeader>
            <InfoRow>
              <HiOutlineTruck />
              <InfoLabel>Vehicle Type:</InfoLabel>
              <InfoValue>{distributor.vehicle.type}</InfoValue>
            </InfoRow>
            <InfoRow>
              <HiOutlineTruck />
              <InfoLabel>License Plate:</InfoLabel>
              <InfoValue>{distributor.vehicle.plate}</InfoValue>
            </InfoRow>
            <InfoRow>
              <HiOutlineTruck />
              <InfoLabel>Capacity:</InfoLabel>
              <InfoValue>{distributor.vehicle.capacity}</InfoValue>
            </InfoRow>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <Heading as="h2">Performance Metrics</Heading>
            </CardHeader>
            <InfoRow>
              <HiOutlineStar />
              <InfoLabel>On-Time Rate:</InfoLabel>
              <InfoValue
                style={{ color: "var(--color-green-700)", fontWeight: 600 }}
              >
                {distributor.performance.onTimeRate}%
              </InfoValue>
            </InfoRow>
            <InfoRow>
              <HiOutlineStar />
              <InfoLabel>Completion Rate:</InfoLabel>
              <InfoValue
                style={{ color: "var(--color-green-700)", fontWeight: 600 }}
              >
                {distributor.performance.completionRate}%
              </InfoValue>
            </InfoRow>
            <InfoRow>
              <HiOutlineStar />
              <InfoLabel>Avg Delivery Time:</InfoLabel>
              <InfoValue>
                {distributor.performance.averageDeliveryTime}
              </InfoValue>
            </InfoRow>
          </Card>

          {/* Recent Deliveries */}
          <Card>
            <CardHeader>
              <Heading as="h2">Recent Deliveries</Heading>
              <Button
                $variation="secondary"
                $size="small"
                onClick={() =>
                  navigate(`/deliveries?distributor=${distributor.id}`)
                }
              >
                View All →
              </Button>
            </CardHeader>
            <DeliveriesTable>
              <TableHeader>
                <div>Delivery ID</div>
                <div>Client</div>
                <div>Date</div>
                <div>Status</div>
              </TableHeader>
              {distributor.recentDeliveries.map((delivery) => (
                <TableRow
                  key={delivery.id}
                  onClick={() => handleViewDelivery(delivery.id)}
                >
                  <DeliveryId>#{delivery.id}</DeliveryId>
                  <div
                    style={{
                      fontSize: "1.3rem",
                      color: "var(--color-grey-600)",
                    }}
                  >
                    {delivery.client}
                  </div>
                  <div
                    style={{
                      fontSize: "1.3rem",
                      color: "var(--color-grey-600)",
                    }}
                  >
                    {delivery.date}
                  </div>
                  <div
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: 600,
                      textTransform: "capitalize",
                    }}
                  >
                    {delivery.status === "in-progress"
                      ? "In Progress"
                      : delivery.status}
                  </div>
                </TableRow>
              ))}
            </DeliveriesTable>
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
                <h4>{distributor.totalDeliveries}</h4>
                <p>Total Deliveries</p>
              </StatBox>
              <StatBox>
                <h4>{distributor.activeDeliveries}</h4>
                <p>Active Now</p>
              </StatBox>
              <StatBox>
                <h4>{distributor.completedToday}</h4>
                <p>Completed Today</p>
              </StatBox>
              <StatBox>
                <h4>{distributor.rating}</h4>
                <p>Rating</p>
              </StatBox>
            </StatsGrid>

            <InfoRow style={{ marginTop: "2rem" }}>
              <HiOutlineCalendar />
              <InfoLabel>Joined Date:</InfoLabel>
              <InfoValue>{distributor.joinedDate}</InfoValue>
            </InfoRow>
            <InfoRow>
              <HiOutlineTruck />
              <InfoLabel>Last Delivery:</InfoLabel>
              <InfoValue>{distributor.lastDelivery}</InfoValue>
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
                onClick={() =>
                  navigate(`/deliveries/new?distributor=${distributor.id}`)
                }
              >
                <HiOutlineTruck style={{ width: "2rem", height: "2rem" }} />
                Assign New Delivery
              </Button>
              <Button
                $variation="secondary"
                $size="medium"
                onClick={() =>
                  navigate(`/deliveries?distributor=${distributor.id}`)
                }
              >
                <HiOutlineTruck style={{ width: "2rem", height: "2rem" }} />
                View All Deliveries
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

export default DistributorDetails;
