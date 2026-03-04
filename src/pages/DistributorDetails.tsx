import { useState } from "react";
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
  HiOutlineArrowDownTray,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineXCircle,
} from "react-icons/hi2";
import Heading from "../UI/Heading";
import Row from "../UI/Row";
import Button from "../UI/Button";
import Modal from "../UI/Modal";
import ConfirmDelete from "../UI/ConfirmDelete";
import DistributorForm from "../components/DistributorForm";

// ─── Types ────────────────────────────────────────────────────────────────────

type DistributorStatus = "active" | "inactive" | "on-delivery";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockDistributor = {
  id: "1",
  name: "Ahmed Mahmoudi",
  status: "on-delivery" as DistributorStatus,
  phone: "+216 98 123 456",
  email: "ahmed.mahmoudi@taba3ni.tn",
  zone: "Tunis, Lac 2, La Marsa, Carthage",
  joinedDate: "2024-01-15",
  lastDelivery: "2025-10-09 13:45",
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
  performance: {
    onTimeRate: 96,
    completionRate: 98,
    averageDeliveryTime: "28 min",
  },
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
    {
      id: "DEL-031",
      date: "2025-10-07 09:15",
      client: "Superette Ariana",
      status: "completed",
    },
    {
      id: "DEL-038",
      date: "2025-10-06 14:30",
      client: "Restaurant Le Gourmet",
      status: "failed",
    },
  ],
};

// ─── Styled Components ────────────────────────────────────────────────────────

const PageLayout = styled.div`
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
  transition: color 0.2s;
  &:hover {
    color: var(--color-brand-700);
  }
  & svg {
    width: 2rem;
    height: 2rem;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  flex-wrap: wrap;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.2rem;
  }
`;

const LargeAvatar = styled.div`
  width: 7.2rem;
  height: 7.2rem;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    var(--color-brand-600),
    var(--color-brand-700)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 800;
  font-size: 2.4rem;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
`;

const HeaderMeta = styled.div`
  & h1 {
    font-size: 2.4rem;
    font-weight: 800;
    color: var(--color-grey-900);
    margin-bottom: 0.6rem;
  }
`;

const StatusBadge = styled.span<{ $status: DistributorStatus }>`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1.2rem;
  border-radius: 100px;
  font-size: 1.3rem;
  font-weight: 700;
  text-transform: uppercase;
  background-color: ${(p) =>
    p.$status === "active"
      ? "var(--color-green-100)"
      : p.$status === "on-delivery"
        ? "var(--color-blue-100)"
        : "var(--color-grey-100)"};
  color: ${(p) =>
    p.$status === "active"
      ? "var(--color-green-700)"
      : p.$status === "on-delivery"
        ? "var(--color-blue-700)"
        : "var(--color-grey-700)"};
`;

const Stars = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  margin-top: 0.8rem;
  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-yellow-700);
  }
  & span {
    margin-left: 0.6rem;
    font-weight: 600;
    font-size: 1.3rem;
    color: var(--color-grey-600);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: flex-start;
`;

// ── Grid Layout ───────────────────────────────────────────────────────────────

const Grid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2.4rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

// ── Card ──────────────────────────────────────────────────────────────────────

const Card = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem;
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-grey-800);
  margin-bottom: 1.6rem;
  padding-bottom: 1.2rem;
  border-bottom: 1px solid var(--color-grey-100);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.2rem;
  padding: 1.2rem 0;
  border-bottom: 1px solid var(--color-grey-100);
  &:last-child {
    border-bottom: none;
  }
  & svg {
    width: 1.8rem;
    height: 1.8rem;
    color: var(--color-brand-600);
    flex-shrink: 0;
    margin-top: 0.1rem;
  }
`;

const InfoLabel = styled.span`
  font-weight: 600;
  color: var(--color-grey-700);
  min-width: 14rem;
  font-size: 1.4rem;
`;

const InfoValue = styled.span`
  color: var(--color-grey-600);
  font-size: 1.4rem;
`;

// ── Stats Grid ────────────────────────────────────────────────────────────────

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
  margin-bottom: 2rem;
`;

const StatBox = styled.div`
  padding: 1.6rem;
  background-color: var(--color-grey-50);
  border-radius: var(--border-radius-md);
  text-align: center;
  border: 1px solid var(--color-grey-100);

  & h4 {
    font-size: 2.4rem;
    font-weight: 800;
    color: var(--color-brand-600);
    margin-bottom: 0.4rem;
  }
  & p {
    font-size: 1.1rem;
    color: var(--color-grey-500);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 0;
  }
`;

// ── Performance Bar ───────────────────────────────────────────────────────────

const PerfRow = styled.div`
  margin-bottom: 1.6rem;
  &:last-child {
    margin-bottom: 0;
  }
`;

const PerfHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.6rem;
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--color-grey-700);
`;

const ProgressTrack = styled.div`
  height: 0.8rem;
  background: var(--color-grey-200);
  border-radius: 9999px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $pct: number; $color?: string }>`
  height: 100%;
  width: ${(p) => p.$pct}%;
  background: ${(p) => p.$color || "var(--color-brand-600)"};
  border-radius: 9999px;
  transition: width 0.6s ease;
`;

// ── Deliveries Table ──────────────────────────────────────────────────────────

const DeliveryRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1.5fr 1fr;
  gap: 1.2rem;
  padding: 1.4rem 0;
  border-bottom: 1px solid var(--color-grey-100);
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s;
  border-radius: var(--border-radius-sm);
  padding-left: 0.8rem;
  &:hover {
    background: var(--color-grey-50);
  }
  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr 1fr;
    gap: 0.8rem;
    padding: 1.2rem 0;
  }
`;

const DeliveryTableHeader = styled(DeliveryRow)`
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--color-grey-500);
  letter-spacing: 0.5px;
  cursor: default;
  &:hover {
    background: none;
  }
`;

const DeliveryId = styled.span`
  font-weight: 700;
  color: var(--color-brand-600);
  font-size: 1.3rem;
`;

type DeliveryStatus = "completed" | "in-progress" | "failed";

const deliveryStatusConfig: Record<
  DeliveryStatus,
  { icon: JSX.Element; color: string; label: string }
> = {
  completed: {
    icon: <HiOutlineCheckCircle />,
    color: "#16a34a",
    label: "Completed",
  },
  "in-progress": {
    icon: <HiOutlineClock />,
    color: "#d97706",
    label: "In Progress",
  },
  failed: { icon: <HiOutlineXCircle />, color: "#dc2626", label: "Failed" },
};

const DeliveryStatusBadge = styled.span<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: ${(p) => p.$color};
  & svg {
    width: 1.4rem;
    height: 1.4rem;
  }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getInitials = (name: string) =>
  name
    .trim()
    .split(" ")
    .map((n) => n[0]?.toUpperCase())
    .join("")
    .slice(0, 2);

function exportDistributorCSV(d: typeof mockDistributor) {
  const date = new Date().toISOString().split("T")[0];
  const rows = [
    ["Field", "Value"],
    ["Name", d.name],
    ["Phone", d.phone],
    ["Email", d.email],
    ["Zone", d.zone],
    ["Status", d.status],
    ["Vehicle Type", d.vehicle.type],
    ["License Plate", d.vehicle.plate],
    ["Capacity", d.vehicle.capacity],
    ["Total Deliveries", d.totalDeliveries],
    ["Active Deliveries", d.activeDeliveries],
    ["Completed Today", d.completedToday],
    ["Rating", d.rating],
    ["Total Ratings", d.totalRatings],
    ["On-Time Rate", `${d.performance.onTimeRate}%`],
    ["Completion Rate", `${d.performance.completionRate}%`],
    ["Avg Delivery Time", d.performance.averageDeliveryTime],
    ["Joined Date", d.joinedDate],
    ["Last Delivery", d.lastDelivery],
  ];

  const csv = rows.map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `distributor_${d.name.replace(/\s+/g, "_")}_${date}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Component ────────────────────────────────────────────────────────────────

function DistributorDetails() {
  const { distributorId } = useParams();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const d = mockDistributor; // In real app: fetch by distributorId

  const statusLabel =
    d.status === "on-delivery"
      ? "On Delivery"
      : d.status === "active"
        ? "Available"
        : "Inactive";

  const handleDelete = () => {
    navigate("/distributors");
  };

  return (
    <PageLayout>
      {/* Back */}
      <BackButton onClick={() => navigate("/distributors")}>
        <HiOutlineArrowLeft /> Back to Distributors
      </BackButton>

      {/* Header */}
      <HeaderRow>
        <HeaderLeft>
          <LargeAvatar>{getInitials(d.name)}</LargeAvatar>
          <HeaderMeta>
            <h1>{d.name}</h1>
            <StatusBadge $status={d.status}>{statusLabel}</StatusBadge>
            <Stars>
              {Array.from({ length: 5 }, (_, i) => (
                <HiOutlineStar
                  key={i}
                  style={{
                    fill: i < Math.floor(d.rating) ? "currentColor" : "none",
                  }}
                />
              ))}
              <span>
                {d.rating} · {d.totalRatings} reviews
              </span>
            </Stars>
          </HeaderMeta>
        </HeaderLeft>

        <ActionButtons>
          <Button
            $variation="secondary"
            $size="medium"
            onClick={() => exportDistributorCSV(d)}
          >
            <HiOutlineArrowDownTray
              style={{ width: "1.8rem", height: "1.8rem" }}
            />
            Export
          </Button>

          <Modal>
            <Modal.Open opens="edit-distributor">
              <Button $variation="secondary" $size="medium">
                <HiOutlinePencil
                  style={{ width: "1.8rem", height: "1.8rem" }}
                />
                Edit
              </Button>
            </Modal.Open>
            <Modal.Window name="edit-distributor">
              <DistributorForm
                distributorToEdit={{
                  id: d.id,
                  name: d.name,
                  phone: d.phone,
                  email: d.email,
                  zone: d.zone,
                  vehicle: d.vehicle,
                  status: d.status,
                }}
                onCloseModal={() => {}}
              />
            </Modal.Window>
          </Modal>

          <Button
            $variation="danger"
            $size="medium"
            onClick={() => setShowDeleteModal(true)}
          >
            <HiOutlineTrash style={{ width: "1.8rem", height: "1.8rem" }} />
            Delete
          </Button>
        </ActionButtons>
      </HeaderRow>

      {/* Main Grid */}
      <Grid>
        {/* ── Left Column ── */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "2.4rem" }}
        >
          {/* Contact Info */}
          <Card>
            <CardTitle>Contact Information</CardTitle>
            <InfoRow>
              <HiOutlineUser />
              <InfoLabel>Full Name</InfoLabel>
              <InfoValue>{d.name}</InfoValue>
            </InfoRow>
            <InfoRow>
              <HiOutlinePhone />
              <InfoLabel>Phone</InfoLabel>
              <InfoValue>{d.phone}</InfoValue>
            </InfoRow>
            <InfoRow>
              <HiOutlineEnvelope />
              <InfoLabel>Email</InfoLabel>
              <InfoValue>{d.email}</InfoValue>
            </InfoRow>
            <InfoRow>
              <HiOutlineMapPin />
              <InfoLabel>Assigned Zone</InfoLabel>
              <InfoValue>{d.zone}</InfoValue>
            </InfoRow>
            <InfoRow>
              <HiOutlineCalendar />
              <InfoLabel>Joined Date</InfoLabel>
              <InfoValue>{d.joinedDate}</InfoValue>
            </InfoRow>
            <InfoRow>
              <HiOutlineTruck />
              <InfoLabel>Last Delivery</InfoLabel>
              <InfoValue>{d.lastDelivery}</InfoValue>
            </InfoRow>
          </Card>

          {/* Vehicle Info */}
          <Card>
            <CardTitle>Vehicle Information</CardTitle>
            <InfoRow>
              <HiOutlineTruck />
              <InfoLabel>Vehicle Type</InfoLabel>
              <InfoValue>{d.vehicle.type}</InfoValue>
            </InfoRow>
            <InfoRow>
              <HiOutlineTruck />
              <InfoLabel>License Plate</InfoLabel>
              <InfoValue>{d.vehicle.plate}</InfoValue>
            </InfoRow>
            <InfoRow>
              <HiOutlineTruck />
              <InfoLabel>Capacity</InfoLabel>
              <InfoValue>{d.vehicle.capacity}</InfoValue>
            </InfoRow>
          </Card>

          {/* Performance */}
          <Card>
            <CardTitle>Performance Metrics</CardTitle>
            <PerfRow>
              <PerfHeader>
                <span>On-Time Rate</span>
                <span style={{ color: "#16a34a" }}>
                  {d.performance.onTimeRate}%
                </span>
              </PerfHeader>
              <ProgressTrack>
                <ProgressFill
                  $pct={d.performance.onTimeRate}
                  $color="#16a34a"
                />
              </ProgressTrack>
            </PerfRow>
            <PerfRow>
              <PerfHeader>
                <span>Completion Rate</span>
                <span style={{ color: "var(--color-brand-600)" }}>
                  {d.performance.completionRate}%
                </span>
              </PerfHeader>
              <ProgressTrack>
                <ProgressFill $pct={d.performance.completionRate} />
              </ProgressTrack>
            </PerfRow>
            <PerfRow>
              <PerfHeader>
                <span>Average Delivery Time</span>
                <span>{d.performance.averageDeliveryTime}</span>
              </PerfHeader>
              <ProgressTrack>
                <ProgressFill $pct={70} $color="var(--color-yellow-700)" />
              </ProgressTrack>
            </PerfRow>
          </Card>

          {/* Recent Deliveries */}
          <Card>
            <CardTitle>
              Recent Deliveries
              <Button
                $variation="secondary"
                $size="small"
                onClick={() => navigate(`/deliveries?distributor=${d.id}`)}
              >
                View All →
              </Button>
            </CardTitle>

            <DeliveryTableHeader>
              <div>ID</div>
              <div>Client</div>
              <div>Date</div>
              <div>Status</div>
            </DeliveryTableHeader>

            {d.recentDeliveries.map((delivery) => {
              const conf =
                deliveryStatusConfig[delivery.status as DeliveryStatus];
              return (
                <DeliveryRow
                  key={delivery.id}
                  onClick={() => navigate(`/deliveryDetails/${delivery.id}`)}
                >
                  <DeliveryId>#{delivery.id}</DeliveryId>
                  <span
                    style={{
                      fontSize: "1.3rem",
                      color: "var(--color-grey-700)",
                    }}
                  >
                    {delivery.client}
                  </span>
                  <span
                    style={{
                      fontSize: "1.2rem",
                      color: "var(--color-grey-500)",
                    }}
                  >
                    {delivery.date}
                  </span>
                  <DeliveryStatusBadge $color={conf.color}>
                    {conf.icon} {conf.label}
                  </DeliveryStatusBadge>
                </DeliveryRow>
              );
            })}
          </Card>
        </div>

        {/* ── Right Column ── */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "2.4rem" }}
        >
          {/* Stats */}
          <Card>
            <CardTitle>Statistics</CardTitle>
            <StatsGrid>
              <StatBox>
                <h4>{d.totalDeliveries}</h4>
                <p>Total</p>
              </StatBox>
              <StatBox>
                <h4>{d.activeDeliveries}</h4>
                <p>Active Now</p>
              </StatBox>
              <StatBox>
                <h4>{d.completedToday}</h4>
                <p>Today</p>
              </StatBox>
              <StatBox>
                <h4>{d.rating}</h4>
                <p>Rating</p>
              </StatBox>
            </StatsGrid>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardTitle>Quick Actions</CardTitle>
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
                onClick={() => navigate(`/deliveries/new?distributor=${d.id}`)}
              >
                <HiOutlineTruck style={{ width: "1.8rem", height: "1.8rem" }} />
                Assign New Delivery
              </Button>
              <Button
                $variation="secondary"
                $size="medium"
                onClick={() => navigate(`/deliveries?distributor=${d.id}`)}
              >
                <HiOutlineTruck style={{ width: "1.8rem", height: "1.8rem" }} />
                View All Deliveries
              </Button>
              <Button
                $variation="secondary"
                $size="medium"
                onClick={() => window.open(`tel:${d.phone}`)}
              >
                <HiOutlinePhone style={{ width: "1.8rem", height: "1.8rem" }} />
                Call Distributor
              </Button>
              <Button
                $variation="secondary"
                $size="medium"
                onClick={() => window.open(`mailto:${d.email}`)}
              >
                <HiOutlineEnvelope
                  style={{ width: "1.8rem", height: "1.8rem" }}
                />
                Send Email
              </Button>
            </div>
          </Card>
        </div>
      </Grid>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
          }}
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            style={{
              background: "var(--color-grey-0)",
              borderRadius: "var(--border-radius-lg)",
              padding: "3.2rem",
              maxWidth: "44rem",
              width: "100%",
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <HiOutlineTrash
              style={{
                width: "5.6rem",
                height: "5.6rem",
                color: "var(--color-red-500)",
                margin: "0 auto 1.6rem",
                display: "block",
              }}
            />
            <h3
              style={{
                fontSize: "2rem",
                fontWeight: 700,
                marginBottom: "1rem",
              }}
            >
              Delete Distributor?
            </h3>
            <p
              style={{
                fontSize: "1.4rem",
                color: "var(--color-grey-600)",
                marginBottom: "2.4rem",
                lineHeight: 1.6,
              }}
            >
              Are you sure you want to delete <strong>{d.name}</strong>? This
              will remove all their data and delivery history.
            </p>
            <div
              style={{
                display: "flex",
                gap: "1.2rem",
                justifyContent: "center",
              }}
            >
              <Button
                $variation="secondary"
                $size="medium"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button $variation="danger" $size="medium" onClick={handleDelete}>
                <HiOutlineTrash style={{ width: "1.6rem", height: "1.6rem" }} />{" "}
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}

export default DistributorDetails;
