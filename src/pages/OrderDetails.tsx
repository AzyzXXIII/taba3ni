import { useParams, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
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
  HiOutlineTruck,
  HiOutlineUser,
  HiOutlineCheckCircle,
  HiOutlineArrowPath,
  HiOutlineSignal,
  HiOutlineChatBubbleLeftEllipsis,
  HiOutlineExclamationTriangle,
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
import DeliveryMap from "../components/DeliveryMap";

// ─── Animations ───────────────────────────────────────────────────────────────

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
`;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(1.2rem); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ─── Shared Styled Components ─────────────────────────────────────────────────

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
  font-size: ${(p) => (p.$isFinal ? "2rem" : "1.6rem")};
  font-weight: ${(p) => (p.$isFinal ? "700" : "500")};
  color: ${(p) =>
    p.$isFinal ? "var(--color-brand-600)" : "var(--color-grey-700)"};
  @media (max-width: 768px) {
    font-size: ${(p) => (p.$isFinal ? "1.8rem" : "1.4rem")};
  }
`;

// ─── Live Tracking Styles ─────────────────────────────────────────────────────

const TrackingCard = styled.div`
  background: linear-gradient(
    135deg,
    var(--color-grey-0),
    var(--color-brand-50)
  );
  border: 2px solid var(--color-brand-200);
  border-radius: var(--border-radius-md);
  overflow: hidden;
  animation: ${fadeUp} 0.4s ease-out;
`;

const TrackingHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem 2.4rem;
  background: linear-gradient(
    135deg,
    var(--color-brand-600),
    var(--color-brand-700)
  );
  color: white;
  flex-wrap: wrap;
  gap: 1.2rem;
`;

const TrackingTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;

  & svg {
    width: 2.4rem;
    height: 2.4rem;
  }

  & h3 {
    font-size: 1.8rem;
    font-weight: 700;
    margin: 0;
  }

  & span {
    font-size: 1.3rem;
    opacity: 0.85;
    margin-top: 0.2rem;
    display: block;
  }
`;

const LivePill = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 1.2rem;
  background: rgba(255, 255, 255, 0.2);
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  border-radius: 100px;
  font-size: 1.3rem;
  font-weight: 700;
  color: white;
`;

const LiveDot = styled.div`
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
  background: #4ade80;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const TrackingBody = styled.div`
  padding: 2.4rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ProgressSteps = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
`;

const StepDot = styled.div<{ $done: boolean; $active: boolean }>`
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  font-weight: 700;
  flex-shrink: 0;
  transition: all 0.3s;
  background: ${(p) =>
    p.$done
      ? "var(--color-green-600)"
      : p.$active
        ? "var(--color-brand-600)"
        : "var(--color-grey-200)"};
  color: ${(p) => (p.$done || p.$active ? "white" : "var(--color-grey-400)")};
  box-shadow: ${(p) =>
    p.$active ? "0 0 0 4px var(--color-brand-100)" : "none"};

  & svg {
    width: 1.6rem;
    height: 1.6rem;
  }
`;

const StepLine = styled.div<{ $done: boolean }>`
  flex: 1;
  height: 3px;
  background: ${(p) =>
    p.$done ? "var(--color-green-400)" : "var(--color-grey-200)"};
  transition: background 0.4s;
`;

const StepLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.8rem;
`;

const StepLabel = styled.span<{ $active: boolean; $done: boolean }>`
  font-size: 1.2rem;
  font-weight: ${(p) => (p.$active || p.$done ? 600 : 400)};
  color: ${(p) =>
    p.$active
      ? "var(--color-brand-600)"
      : p.$done
        ? "var(--color-green-600)"
        : "var(--color-grey-400)"};
  text-align: center;
  flex: 1;

  &:first-child {
    text-align: left;
  }
  &:last-child {
    text-align: right;
  }
`;

const DriverInfoStrip = styled.div`
  display: flex;
  align-items: center;
  gap: 1.6rem;
  padding: 1.6rem;
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-md);
  flex-wrap: wrap;
`;

const DriverAvatar = styled.div`
  width: 5rem;
  height: 5rem;
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
  font-size: 1.8rem;
  flex-shrink: 0;
`;

const DriverDetails = styled.div`
  flex: 1;
  & .name {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-grey-900);
  }
  & .vehicle {
    font-size: 1.2rem;
    color: var(--color-grey-500);
    margin-top: 0.2rem;
  }
`;

const DriverActions = styled.div`
  display: flex;
  gap: 0.8rem;
`;

const IconBtn = styled.a`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.8rem 1.4rem;
  border: 1.5px solid var(--color-grey-200);
  border-radius: var(--border-radius-sm);
  background: var(--color-grey-0);
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--color-grey-700);
  cursor: pointer;
  text-decoration: none;
  transition: all 0.18s;

  & svg {
    width: 1.6rem;
    height: 1.6rem;
  }

  &:hover {
    background: var(--color-brand-50);
    border-color: var(--color-brand-400);
    color: var(--color-brand-700);
  }
`;

const ETABadge = styled.div<{ $delayed: boolean }>`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1.2rem 1.6rem;
  background: ${(p) =>
    p.$delayed ? "var(--color-yellow-50)" : "var(--color-green-50)"};
  border: 1.5px solid
    ${(p) =>
      p.$delayed ? "var(--color-yellow-300)" : "var(--color-green-300)"};
  border-radius: var(--border-radius-md);

  & svg {
    width: 2rem;
    height: 2rem;
    color: ${(p) =>
      p.$delayed ? "var(--color-yellow-600)" : "var(--color-green-600)"};
  }

  & .label {
    font-size: 1.2rem;
    color: var(--color-grey-500);
  }
  & .time {
    font-size: 1.8rem;
    font-weight: 800;
    color: ${(p) =>
      p.$delayed ? "var(--color-yellow-700)" : "var(--color-green-700)"};
  }
  & .delay {
    font-size: 1.2rem;
    color: var(--color-yellow-600);
    margin-top: 0.2rem;
  }
`;

const NoTrackingBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 1.6rem;
  padding: 2rem;
  background: var(--color-grey-50);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-md);

  & svg {
    width: 3.2rem;
    height: 3.2rem;
    color: var(--color-grey-400);
    flex-shrink: 0;
  }
  & h4 {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-grey-700);
    margin: 0 0 0.4rem;
  }
  & p {
    font-size: 1.3rem;
    color: var(--color-grey-500);
    margin: 0;
  }
`;

// ─── Delivery tracking data — linked by orderId ───────────────────────────────
// Mirrors the deliveries in Deliveries.tsx — keyed by orderId

const DELIVERY_TRACKING: Record<
  string,
  {
    deliveryId: string;
    status: "scheduled" | "in-progress" | "completed" | "failed";
    distributor: { name: string; phone: string; vehicle: string };
    scheduledTime: string;
    estimatedArrival: string;
    etaDelay: number; // minutes
    startedTime?: string;
    distributorLocation: { lat: number; lng: number };
    clientLocation: { lat: number; lng: number };
    timeline: { action: string; date: string }[];
  }
> = {
  "ORD-001": {
    deliveryId: "DEL-001",
    status: "in-progress",
    distributor: {
      name: "Ahmed Mahmoudi",
      phone: "+216 98 123 456",
      vehicle: "Refrigerated Truck — 123 TU 1234",
    },
    scheduledTime: "2025-12-29 14:00",
    estimatedArrival: "2025-12-29 14:20",
    etaDelay: 5,
    startedTime: "2025-12-29 13:45",
    distributorLocation: { lat: 36.8065, lng: 10.1815 },
    clientLocation: { lat: 36.8189, lng: 10.1658 },
    timeline: [
      { action: "Delivery scheduled", date: "2025-12-28 16:30" },
      { action: "Assigned to Ahmed Mahmoudi", date: "2025-12-28 16:45" },
      { action: "Delivery started", date: "2025-12-29 13:45" },
      { action: "En route to destination", date: "2025-12-29 13:50" },
    ],
  },
  "ORD-004": {
    deliveryId: "DEL-002",
    status: "scheduled",
    distributor: {
      name: "Karim Belaid",
      phone: "+216 98 234 567",
      vehicle: "Van — 456 TU 5678",
    },
    scheduledTime: "2025-12-30 09:00",
    estimatedArrival: "2025-12-30 09:25",
    etaDelay: 0,
    distributorLocation: { lat: 36.8, lng: 10.18 },
    clientLocation: { lat: 36.8189, lng: 10.1658 },
    timeline: [
      { action: "Delivery scheduled", date: "2025-12-29 11:00" },
      { action: "Assigned to Karim Belaid", date: "2025-12-29 11:15" },
    ],
  },
};

// ─── Mock order details ───────────────────────────────────────────────────────

const ORDERS_MAP: Record<string, any> = {
  "1": {
    id: "1",
    orderNumber: "ORD-001",
    status: "out-for-delivery" as OrderStatus,
    paymentStatus: "unpaid" as PaymentStatus,
    clientId: "client@taba3ni.tn",
    createdDate: "2025-12-28 10:30",
    deliveryDate: "2025-12-29 14:00",
    client: {
      name: "Carrefour Lac 2",
      address: "Avenue de la Bourse, Lac 2, Tunis 1053",
      phone: "+216 71 123 456",
      email: "client@taba3ni.tn",
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
      { action: "Order created", date: "2025-12-28 10:30" },
      { action: "Order confirmed", date: "2025-12-28 10:45" },
      {
        action: "Assigned to distributor: Ahmed Mahmoudi",
        date: "2025-12-28 11:00",
      },
      { action: "Out for delivery", date: "2025-12-29 13:45" },
    ],
  },
  "4": {
    id: "4",
    orderNumber: "ORD-004",
    status: "pending" as OrderStatus,
    paymentStatus: "unpaid" as PaymentStatus,
    clientId: "client@taba3ni.tn",
    createdDate: "2025-12-29 11:00",
    deliveryDate: "2025-12-30 09:00",
    client: {
      name: "Carrefour Lac 2",
      address: "Avenue de la Bourse, Lac 2, Tunis 1053",
      phone: "+216 71 123 456",
      email: "client@taba3ni.tn",
    },
    products: [
      { id: "3", name: "Butter (250g)", quantity: 15, price: 12, total: 180 },
      {
        id: "6",
        name: "Whipping Cream (500ml)",
        quantity: 20,
        price: 22,
        total: 440,
      },
    ],
    subtotal: 620,
    tax: 30,
    total: 650,
    paidAmount: 0,
    notes: "",
    timeline: [
      { action: "Order created", date: "2025-12-29 11:00" },
      { action: "Order confirmed", date: "2025-12-29 11:15" },
    ],
  },
  "7": {
    id: "7",
    orderNumber: "ORD-007",
    status: "delivered" as OrderStatus,
    paymentStatus: "paid" as PaymentStatus,
    clientId: "client@taba3ni.tn",
    createdDate: "2025-12-15 09:00",
    deliveryDate: "2025-12-16 10:00",
    client: {
      name: "Carrefour Lac 2",
      address: "Avenue de la Bourse, Lac 2, Tunis 1053",
      phone: "+216 71 123 456",
      email: "client@taba3ni.tn",
    },
    products: [
      {
        id: "2",
        name: "Greek Yogurt (500g)",
        quantity: 100,
        price: 8,
        total: 800,
      },
      {
        id: "1",
        name: "Full Cream Milk (1L)",
        quantity: 30,
        price: 15,
        total: 450,
      },
    ],
    subtotal: 1250,
    tax: 0,
    total: 980,
    paidAmount: 980,
    notes: "",
    timeline: [
      { action: "Order created", date: "2025-12-15 09:00" },
      { action: "Order confirmed", date: "2025-12-15 09:30" },
      { action: "Out for delivery", date: "2025-12-16 09:45" },
      { action: "Delivered successfully", date: "2025-12-16 10:20" },
    ],
  },
};

// Fallback for other order IDs (admin demo)
const DEFAULT_ORDER = ORDERS_MAP["1"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name
    .trim()
    .split(" ")
    .map((n) => n[0]?.toUpperCase())
    .join("")
    .slice(0, 2);
}

function getDeliveryStep(status: string): number {
  switch (status) {
    case "scheduled":
      return 1;
    case "in-progress":
      return 2;
    case "completed":
      return 4;
    default:
      return 0;
  }
}

// ─── Live Tracking Section ────────────────────────────────────────────────────

function LiveTrackingSection({ orderNumber }: { orderNumber: string }) {
  const tracking = DELIVERY_TRACKING[orderNumber];

  if (!tracking) {
    return (
      <NoTrackingBanner>
        <HiOutlineTruck />
        <div>
          <h4>Delivery not yet assigned</h4>
          <p>
            Tracking will appear here once a distributor is assigned to your
            order.
          </p>
        </div>
      </NoTrackingBanner>
    );
  }

  const step = getDeliveryStep(tracking.status);
  const steps = [
    { label: "Scheduled", icon: <HiOutlineCalendar /> },
    { label: "En Route", icon: <HiOutlineTruck /> },
    { label: "At Location", icon: <HiOutlineMapPin /> },
    { label: "Delivered", icon: <HiOutlineCheckCircle /> },
  ];

  return (
    <TrackingCard>
      {/* Header */}
      <TrackingHeader>
        <TrackingTitle>
          <HiOutlineSignal />
          <div>
            <h3>Live Delivery Tracking</h3>
            <span>Delivery #{tracking.deliveryId}</span>
          </div>
        </TrackingTitle>
        {tracking.status === "in-progress" && (
          <LivePill>
            <LiveDot />
            LIVE
          </LivePill>
        )}
        {tracking.status === "scheduled" && (
          <LivePill
            style={{
              background: "rgba(255,255,255,0.15)",
              borderColor: "rgba(255,255,255,0.3)",
            }}
          >
            <HiOutlineClock style={{ width: "1.4rem", height: "1.4rem" }} />
            SCHEDULED
          </LivePill>
        )}
      </TrackingHeader>

      <TrackingBody>
        {/* Progress steps */}
        <div>
          <ProgressSteps>
            {steps.map((s, i) => (
              <>
                <StepDot
                  key={s.label}
                  $done={step > i + 1}
                  $active={step === i + 1}
                >
                  {step > i + 1 ? <HiOutlineCheckCircle /> : s.icon}
                </StepDot>
                {i < steps.length - 1 && (
                  <StepLine key={`line-${i}`} $done={step > i + 1} />
                )}
              </>
            ))}
          </ProgressSteps>
          <StepLabels>
            {steps.map((s, i) => (
              <StepLabel
                key={s.label}
                $active={step === i + 1}
                $done={step > i + 1}
              >
                {s.label}
              </StepLabel>
            ))}
          </StepLabels>
        </div>

        {/* ETA */}
        <ETABadge $delayed={tracking.etaDelay > 0}>
          <HiOutlineClock />
          <div>
            <div className="label">Estimated Arrival</div>
            <div className="time">{tracking.estimatedArrival}</div>
            {tracking.etaDelay > 0 && (
              <div className="delay">
                +{tracking.etaDelay} min delay due to traffic
              </div>
            )}
          </div>
        </ETABadge>

        {/* Driver info */}
        <DriverInfoStrip>
          <DriverAvatar>{getInitials(tracking.distributor.name)}</DriverAvatar>
          <DriverDetails>
            <div className="name">{tracking.distributor.name}</div>
            <div className="vehicle">{tracking.distributor.vehicle}</div>
          </DriverDetails>
          <DriverActions>
            <IconBtn href={`tel:${tracking.distributor.phone}`}>
              <HiOutlinePhone />
              Call Driver
            </IconBtn>
            <IconBtn href={`sms:${tracking.distributor.phone}`}>
              <HiOutlineChatBubbleLeftEllipsis />
              Message
            </IconBtn>
          </DriverActions>
        </DriverInfoStrip>

        {/* Map */}
        <DeliveryMap
          distributorLocation={tracking.distributorLocation}
          clientLocation={tracking.clientLocation}
          distributorName={tracking.distributor.name}
          clientName="Your Store"
        />

        {/* Mini timeline */}
        <div>
          <h4
            style={{
              fontSize: "1.4rem",
              fontWeight: 700,
              color: "var(--color-grey-700)",
              marginBottom: "1.2rem",
            }}
          >
            Delivery Updates
          </h4>
          <Timeline actions={tracking.timeline} />
        </div>
      </TrackingBody>
    </TrackingCard>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

type OrderDetailsProps = {
  userRole?: "admin" | "distributor" | "client";
  userId?: string;
};

function OrderDetails({ userRole = "admin", userId }: OrderDetailsProps) {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const order = ORDERS_MAP[orderId ?? ""] ?? DEFAULT_ORDER;
  const isClient = userRole === "client";

  // Block client from seeing other clients' orders
  if (isClient && order.clientId !== userId) {
    return (
      <DetailsLayout>
        <BackButton onClick={() => navigate("/orders")}>
          <HiOutlineArrowLeft /> Back to My Orders
        </BackButton>
        <div style={{ textAlign: "center", padding: "8rem 2rem" }}>
          <div style={{ fontSize: "6rem", marginBottom: "1.6rem" }}>🔒</div>
          <h2
            style={{
              fontSize: "2.4rem",
              fontWeight: 700,
              marginBottom: "0.8rem",
            }}
          >
            Access Denied
          </h2>
          <p style={{ fontSize: "1.5rem", color: "var(--color-grey-500)" }}>
            You don't have permission to view this order.
          </p>
        </div>
      </DetailsLayout>
    );
  }

  const orderStatus = getStatusDisplay(order.status);
  const paymentStatus = getStatusDisplay(order.paymentStatus);

  const isOutForDelivery = order.status === "out-for-delivery";
  const isDelivered = order.status === "delivered";

  const handleDelete = () => {
    navigate("/orders");
  };

  return (
    <DetailsLayout>
      {/* Back */}
      <BackButton onClick={() => navigate("/orders")}>
        <HiOutlineArrowLeft />
        {isClient ? "Back to My Orders" : "Back to Orders"}
      </BackButton>

      {/* Header */}
      <HeaderRow type="horizontal">
        <HeaderContent>
          <Heading as="h1">Order #{order.orderNumber}</Heading>
          <div
            style={{
              display: "flex",
              gap: "1.2rem",
              marginTop: "1.2rem",
              flexWrap: "wrap",
            }}
          >
            <StatusBadge $status={order.status}>
              {orderStatus.icon} {orderStatus.label}
            </StatusBadge>
            <StatusBadge $status={order.paymentStatus}>
              {paymentStatus.icon} {paymentStatus.label}
            </StatusBadge>
          </div>
        </HeaderContent>

        <ActionButtons>
          <Button
            $variation="secondary"
            $size="medium"
            onClick={() => window.print()}
          >
            <HiOutlinePrinter style={{ width: "2rem", height: "2rem" }} />
            Print
          </Button>

          {/* Admin-only actions */}
          {!isClient && (
            <>
              <Modal>
                <Modal.Open opens="edit-order">
                  <Button $variation="secondary" $size="medium">
                    <HiOutlinePencil
                      style={{ width: "2rem", height: "2rem" }}
                    />
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
                      products: order.products.map((p: any) => ({
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
            </>
          )}

          {/* Client: cancel only if pending */}
          {isClient && order.status === "pending" && (
            <Modal>
              <Modal.Open opens="cancel-order">
                <Button $variation="danger" $size="medium">
                  <HiOutlineTrash style={{ width: "2rem", height: "2rem" }} />
                  Cancel Order
                </Button>
              </Modal.Open>
              <Modal.Window name="cancel-order">
                <ConfirmDelete
                  resourceName={`order ${order.orderNumber}`}
                  onConfirm={handleDelete}
                  onCloseModal={() => {}}
                />
              </Modal.Window>
            </Modal>
          )}
        </ActionButtons>
      </HeaderRow>

      {/* ── Live Tracking Banner — client only, when out for delivery ── */}
      {isClient && isOutForDelivery && (
        <LiveTrackingSection orderNumber={order.orderNumber} />
      )}

      {/* ── Delivered confirmation banner — client only ── */}
      {isClient && isDelivered && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.6rem",
            padding: "1.6rem 2rem",
            background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
            border: "1.5px solid var(--color-green-300)",
            borderRadius: "var(--border-radius-md)",
          }}
        >
          <HiOutlineCheckCircle
            style={{
              width: "2.8rem",
              height: "2.8rem",
              color: "var(--color-green-600)",
              flexShrink: 0,
            }}
          />
          <div>
            <strong
              style={{
                fontSize: "1.5rem",
                color: "var(--color-grey-900)",
                display: "block",
                marginBottom: "0.2rem",
              }}
            >
              Order Delivered ✓
            </strong>
            <span
              style={{ fontSize: "1.3rem", color: "var(--color-grey-600)" }}
            >
              Your order was successfully delivered. Thank you for choosing
              Taba3ni!
            </span>
          </div>
        </div>
      )}

      {/* ── Processing/Scheduled status hint for client ── */}
      {isClient &&
        (order.status === "pending" || order.status === "processing") && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.6rem",
              padding: "1.6rem 2rem",
              background: "var(--color-grey-50)",
              border: "1.5px solid var(--color-grey-200)",
              borderRadius: "var(--border-radius-md)",
            }}
          >
            <HiOutlineArrowPath
              style={{
                width: "2.4rem",
                height: "2.4rem",
                color: "var(--color-brand-600)",
                flexShrink: 0,
              }}
            />
            <div>
              <strong
                style={{
                  fontSize: "1.5rem",
                  color: "var(--color-grey-900)",
                  display: "block",
                  marginBottom: "0.2rem",
                }}
              >
                {order.status === "pending"
                  ? "Order Confirmed"
                  : "Being Prepared"}
              </strong>
              <span
                style={{ fontSize: "1.3rem", color: "var(--color-grey-600)" }}
              >
                {order.status === "pending"
                  ? "Your order has been received. We'll notify you when it's out for delivery."
                  : "Your order is being prepared. Live tracking will appear here once your delivery is en route."}
              </span>
            </div>
          </div>
        )}

      {/* Main Grid */}
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

          {/* Client Information — hidden from client (they know who they are) */}
          {!isClient && (
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
          )}

          {/* Delivery address — shown to client instead */}
          {isClient && (
            <Card>
              <CardHeader>
                <Heading as="h2">Delivery Address</Heading>
              </CardHeader>
              <InfoRow>
                <InfoLabel>
                  <HiOutlineMapPin />
                  Address:
                </InfoLabel>
                <InfoValue>{order.client.address}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>
                  <HiOutlineClock />
                  Scheduled:
                </InfoLabel>
                <InfoValue>{order.deliveryDate}</InfoValue>
              </InfoRow>
            </Card>
          )}

          {/* Products */}
          <Card>
            <CardHeader>
              <Heading as="h2">Products</Heading>
            </CardHeader>
            <ProductsTable>
              <TableHeader>
                <div>Product</div>
                <div>Quantity</div>
                <div>Price</div>
                <div>Total</div>
              </TableHeader>
              {order.products.map((product: any) => (
                <TableRow key={product.id}>
                  <div style={{ fontWeight: 500 }}>{product.name}</div>
                  <div>{product.quantity}</div>
                  <div>{product.price} TND</div>
                  <div style={{ fontWeight: 600 }}>{product.total} TND</div>
                </TableRow>
              ))}
            </ProductsTable>
            <MobileProductList>
              {order.products.map((product: any) => (
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

        {/* Right Column — Timeline */}
        <Card>
          <CardHeader>
            <Heading as="h2">Order Timeline</Heading>
          </CardHeader>
          <Timeline actions={order.timeline} />

          {/* Admin: show tracking link if out for delivery */}
          {!isClient && isOutForDelivery && (
            <div
              style={{
                marginTop: "2rem",
                paddingTop: "2rem",
                borderTop: "1px solid var(--color-grey-200)",
              }}
            >
              <Button
                $variation="secondary"
                $size="medium"
                onClick={() => navigate("/deliveries")}
                style={{ width: "100%" }}
              >
                <HiOutlineTruck style={{ width: "1.8rem", height: "1.8rem" }} />
                View in Deliveries
              </Button>
            </div>
          )}
        </Card>
      </Grid>
    </DetailsLayout>
  );
}

export default OrderDetails;
