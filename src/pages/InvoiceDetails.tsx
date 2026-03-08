import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  HiOutlineArrowLeft,
  HiOutlineArrowDownTray,
  HiOutlinePaperAirplane,
  HiOutlineCurrencyDollar,
  HiOutlineCalendar,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineMapPin,
  HiOutlineBuildingOffice,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineXCircle,
  HiOutlineCreditCard,
  HiOutlineChatBubbleLeftEllipsis,
  HiOutlineExclamationTriangle,
} from "react-icons/hi2";
import Heading from "../UI/Heading";
import Row from "../UI/Row";
import Button from "../UI/Button";
import Modal from "../UI/Modal";
import Timeline from "../UI/Timeline";
import PaymentForm from "../components/PaymentForm";
import { useNotifications } from "../hooks/useNotifications";

// ─── Styled Components ────────────────────────────────────────────────────────

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

const InvoiceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 2.4rem;
  border-bottom: 2px solid var(--color-grey-200);
  margin-bottom: 2.4rem;
`;

const CompanyInfo = styled.div`
  & h2 {
    font-size: 2.4rem;
    font-weight: 700;
    color: var(--color-brand-600);
    margin-bottom: 0.8rem;
  }
  & p {
    font-size: 1.3rem;
    color: var(--color-grey-600);
    margin: 0.4rem 0;
  }
`;

const InvoiceInfo = styled.div`
  text-align: right;
  & h3 {
    font-size: 3.2rem;
    font-weight: 700;
    color: var(--color-grey-900);
    margin-bottom: 0.8rem;
  }
  & p {
    font-size: 1.3rem;
    color: var(--color-grey-600);
    margin: 0.4rem 0;
  }
`;

const Section = styled.div`
  margin-bottom: 2.4rem;
`;

const SectionTitle = styled.h4`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-900);
  margin-bottom: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.6rem;
`;

const InfoBlock = styled.div`
  & h5 {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--color-grey-500);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.8rem;
  }
  & p {
    font-size: 1.4rem;
    color: var(--color-grey-900);
    margin: 0.4rem 0;
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }
  & p svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-brand-600);
  }
`;

const ItemsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1.6rem;
`;

const TableHead = styled.thead`
  background-color: var(--color-grey-50);
  & th {
    padding: 1.2rem;
    text-align: left;
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--color-grey-600);
    text-transform: uppercase;
    border-bottom: 2px solid var(--color-grey-200);
  }
`;

const TableBody = styled.tbody`
  & td {
    padding: 1.2rem;
    font-size: 1.4rem;
    color: var(--color-grey-700);
    border-bottom: 1px solid var(--color-grey-100);
  }
  & tr:last-child td {
    border-bottom: none;
  }
`;

const TotalSection = styled.div`
  margin-top: 2.4rem;
  padding-top: 2.4rem;
  border-top: 2px solid var(--color-grey-200);
`;

const TotalRow = styled.div<{ $highlight?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 0;
  font-size: ${(p) => (p.$highlight ? "2rem" : "1.4rem")};
  font-weight: ${(p) => (p.$highlight ? "700" : "500")};
  color: ${(p) =>
    p.$highlight ? "var(--color-brand-600)" : "var(--color-grey-700)"};
`;

const StatusBadge = styled.span<{
  $status: "paid" | "unpaid" | "overdue" | "partial";
}>`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.8rem 1.6rem;
  border-radius: 100px;
  font-size: 1.4rem;
  font-weight: 600;
  text-transform: uppercase;
  background-color: ${(p) => {
    if (p.$status === "paid") return "var(--color-green-100)";
    if (p.$status === "partial") return "var(--color-yellow-100)";
    if (p.$status === "overdue") return "var(--color-red-100)";
    return "var(--color-grey-100)";
  }};
  color: ${(p) => {
    if (p.$status === "paid") return "var(--color-green-700)";
    if (p.$status === "partial") return "var(--color-yellow-700)";
    if (p.$status === "overdue") return "var(--color-red-700)";
    return "var(--color-grey-700)";
  }};
  & svg {
    width: 1.8rem;
    height: 1.8rem;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.6rem;
  border-bottom: 1px solid var(--color-grey-200);
`;

const PaymentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const PaymentCard = styled.div`
  padding: 1.6rem;
  background-color: var(--color-grey-50);
  border-radius: var(--border-radius-sm);
  border-left: 4px solid var(--color-green-600);
`;

const PaymentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
`;

const PaymentAmount = styled.span`
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-green-700);
`;

const PaymentMethod = styled.span`
  padding: 0.4rem 0.8rem;
  background-color: var(--color-grey-200);
  border-radius: var(--border-radius-sm);
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-grey-700);
`;

const PaymentInfo = styled.div`
  font-size: 1.3rem;
  color: var(--color-grey-600);
  & p {
    margin: 0.4rem 0;
  }
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

// ─── Client-only styles ───────────────────────────────────────────────────────

const ClientAlertBox = styled.div<{ $type: "warning" | "danger" | "success" }>`
  display: flex;
  align-items: flex-start;
  gap: 1.6rem;
  padding: 1.6rem 2rem;
  border-radius: var(--border-radius-md);
  background: ${(p) =>
    p.$type === "danger"
      ? "linear-gradient(135deg, #fee2e2, #fecaca)"
      : p.$type === "success"
        ? "linear-gradient(135deg, #dcfce7, #bbf7d0)"
        : "linear-gradient(135deg, #fef3c7, #fde68a)"};
  border: 1.5px solid
    ${(p) =>
      p.$type === "danger"
        ? "var(--color-red-300)"
        : p.$type === "success"
          ? "var(--color-green-300)"
          : "var(--color-yellow-400)"};

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    flex-shrink: 0;
    margin-top: 0.2rem;
    color: ${(p) =>
      p.$type === "danger"
        ? "var(--color-red-600)"
        : p.$type === "success"
          ? "var(--color-green-600)"
          : "var(--color-yellow-700)"};
  }
`;

const AlertText = styled.div`
  & strong {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-grey-900);
    display: block;
    margin-bottom: 0.4rem;
  }
  & span {
    font-size: 1.3rem;
    color: var(--color-grey-700);
  }
`;

const PaymentProgressBar = styled.div<{ $percent: number }>`
  height: 1.2rem;
  background: var(--color-grey-200);
  border-radius: 100px;
  overflow: hidden;
  margin: 1.2rem 0;
  &::after {
    content: "";
    display: block;
    height: 100%;
    width: ${(p) => p.$percent}%;
    border-radius: 100px;
    background: ${(p) =>
      p.$percent === 100
        ? "var(--color-green-500)"
        : p.$percent > 50
          ? "var(--color-yellow-500)"
          : "var(--color-red-400)"};
    transition: width 0.6s ease;
  }
`;

const PaymentProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.2rem;
  color: var(--color-grey-500);
  font-weight: 600;
`;

const ContactCard = styled.div`
  padding: 2rem;
  background: linear-gradient(
    135deg,
    var(--color-brand-50),
    var(--color-grey-0)
  );
  border: 1px solid var(--color-brand-100);
  border-radius: var(--border-radius-md);

  & h4 {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-grey-900);
    margin-bottom: 1.2rem;
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }
  & h4 svg {
    width: 1.8rem;
    height: 1.8rem;
    color: var(--color-brand-600);
  }
  & p {
    font-size: 1.3rem;
    color: var(--color-grey-600);
    margin: 0.6rem 0;
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }
  & p svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-brand-500);
  }
  & strong {
    color: var(--color-grey-900);
  }
`;

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockInvoiceDetails: Record<string, any> = {
  "1": {
    id: "1",
    invoiceNumber: "INV-2025-001",
    status: "overdue" as const,
    clientEmail: "client@taba3ni.tn",
    issueDate: "2025-09-15",
    dueDate: "2025-10-15",
    client: {
      name: "Carrefour Lac 2",
      email: "client@taba3ni.tn",
      phone: "+216 71 123 456",
      address: "Avenue de la Bourse, Lac 2",
      city: "Tunis",
      taxId: "123456789",
    },
    orderId: "ORD-001",
    items: [
      { name: "Full Cream Milk (1L)", quantity: 50, price: 15, total: 750 },
      { name: "Greek Yogurt (500g)", quantity: 30, price: 8, total: 240 },
      { name: "Cheddar Cheese (200g)", quantity: 20, price: 18, total: 360 },
    ],
    subtotal: 1350,
    tax: 243,
    total: 1593,
    paidAmount: 0,
    remainingAmount: 1593,
    payments: [],
    timeline: [
      { action: "Invoice generated", date: "2025-09-15 10:00" },
      { action: "Invoice sent to client", date: "2025-09-15 10:15" },
      { action: "Payment reminder sent", date: "2025-10-16 09:00" },
    ],
  },
  "4": {
    id: "4",
    invoiceNumber: "INV-2025-004",
    status: "partial" as const,
    clientEmail: "client@taba3ni.tn",
    issueDate: "2025-10-10",
    dueDate: "2025-11-10",
    client: {
      name: "Carrefour Lac 2",
      email: "client@taba3ni.tn",
      phone: "+216 71 123 456",
      address: "Avenue de la Bourse, Lac 2",
      city: "Tunis",
      taxId: "123456789",
    },
    orderId: "ORD-004",
    items: [
      { name: "Skimmed Milk (1L)", quantity: 30, price: 13, total: 390 },
      { name: "Greek Yogurt (500g)", quantity: 20, price: 8, total: 160 },
    ],
    subtotal: 550,
    tax: 99,
    total: 649,
    paidAmount: 450,
    remainingAmount: 199,
    payments: [
      {
        id: "1",
        amount: 450,
        method: "Bank Transfer",
        date: "2025-10-20",
        reference: "TRF-2025-0008",
      },
    ],
    timeline: [
      { action: "Invoice generated", date: "2025-10-10 09:00" },
      { action: "Invoice sent to client", date: "2025-10-10 09:15" },
      {
        action: "Partial payment received (450 TND)",
        date: "2025-10-20 14:00",
      },
    ],
  },
  "6": {
    id: "6",
    invoiceNumber: "INV-2025-006",
    status: "paid" as const,
    clientEmail: "client@taba3ni.tn",
    issueDate: "2025-11-01",
    dueDate: "2025-12-01",
    client: {
      name: "Carrefour Lac 2",
      email: "client@taba3ni.tn",
      phone: "+216 71 123 456",
      address: "Avenue de la Bourse, Lac 2",
      city: "Tunis",
      taxId: "123456789",
    },
    orderId: "ORD-008",
    items: [
      { name: "Full Cream Milk (1L)", quantity: 100, price: 15, total: 1500 },
      { name: "Butter (250g)", quantity: 50, price: 12, total: 600 },
    ],
    subtotal: 2100,
    tax: 378,
    total: 2478,
    paidAmount: 2478,
    remainingAmount: 0,
    payments: [
      {
        id: "1",
        amount: 2478,
        method: "Bank Transfer",
        date: "2025-11-20",
        reference: "TRF-2025-0015",
      },
    ],
    timeline: [
      { action: "Invoice generated", date: "2025-11-01 08:00" },
      { action: "Invoice sent to client", date: "2025-11-01 08:15" },
      { action: "Full payment received (2,478 TND)", date: "2025-11-20 11:00" },
      { action: "Invoice marked as paid", date: "2025-11-20 11:05" },
    ],
  },
};

// Default fallback for invoices not explicitly mocked (admin-side ones)
const defaultInvoice = {
  id: "2",
  invoiceNumber: "INV-2025-002",
  status: "paid" as const,
  clientEmail: "monoprix.menzah@email.com",
  issueDate: "2025-10-01",
  dueDate: "2025-10-31",
  client: {
    name: "Monoprix Menzah",
    email: "monoprix.menzah@email.com",
    phone: "+216 71 456 789",
    address: "Avenue Habib Bourguiba, Ariana",
    city: "Ariana",
    taxId: "987654321",
  },
  orderId: "ORD-002",
  items: [
    { name: "Cheddar Cheese (200g)", quantity: 20, price: 18, total: 360 },
    { name: "Butter (250g)", quantity: 10, price: 12, total: 120 },
  ],
  subtotal: 480,
  tax: 86.4,
  total: 566.4,
  paidAmount: 566.4,
  remainingAmount: 0,
  payments: [
    {
      id: "1",
      amount: 566.4,
      method: "Bank Transfer",
      date: "2025-10-05",
      reference: "TRF-2025-0002",
    },
  ],
  timeline: [
    { action: "Invoice generated", date: "2025-10-01 09:00" },
    { action: "Invoice sent to client", date: "2025-10-01 09:15" },
    { action: "Full payment received", date: "2025-10-05 10:00" },
  ],
};

// ─── PDF Generation ───────────────────────────────────────────────────────────
function handleDownloadPDF(invoice: any) {
  import("jspdf").then(({ default: jsPDF }) => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 20;
    let y = 20;

    doc.setFillColor(20, 93, 160);
    doc.rect(0, 0, pageW, 38, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Taba3ni Dairy", margin, 16);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Distribution Management  |  Avenue Habib Bourguiba, Tunis",
      margin,
      23,
    );
    doc.text("Tel: +216 71 000 000  |  Tax ID: TN-123456789", margin, 29);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", pageW - margin, 16, { align: "right" });
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`#${invoice.invoiceNumber}`, pageW - margin, 23, {
      align: "right",
    });
    doc.text(`Issue: ${invoice.issueDate}`, pageW - margin, 29, {
      align: "right",
    });
    doc.text(`Due:   ${invoice.dueDate}`, pageW - margin, 35, {
      align: "right",
    });

    y = 50;
    doc.setTextColor(20, 93, 160);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("BILL TO", margin, y);
    doc.setDrawColor(20, 93, 160);
    doc.setLineWidth(0.5);
    doc.line(margin, y + 2, margin + 30, y + 2);
    y += 8;
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(invoice.client.name, margin, y);
    y += 6;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(90, 90, 90);
    doc.text(`${invoice.client.address}, ${invoice.client.city}`, margin, y);
    y += 5;
    doc.text(`Email: ${invoice.client.email}`, margin, y);
    y += 12;

    const col = { desc: margin + 2, qty: 120, unit: 145, total: 175 };
    doc.setFillColor(245, 247, 250);
    doc.rect(margin, y, pageW - margin * 2, 8, "F");
    doc.setTextColor(90, 90, 90);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("DESCRIPTION", col.desc, y + 5.5);
    doc.text("QTY", col.qty, y + 5.5, { align: "right" });
    doc.text("UNIT PRICE", col.unit + 10, y + 5.5, { align: "right" });
    doc.text("TOTAL", col.total, y + 5.5, { align: "right" });
    y += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    for (const item of invoice.items) {
      doc.setTextColor(30, 30, 30);
      doc.text(item.name, col.desc, y + 5);
      doc.text(String(item.quantity), col.qty, y + 5, { align: "right" });
      doc.text(`${item.price.toFixed(2)} TND`, col.unit + 10, y + 5, {
        align: "right",
      });
      doc.setFont("helvetica", "bold");
      doc.text(`${item.total.toFixed(2)} TND`, col.total, y + 5, {
        align: "right",
      });
      doc.setFont("helvetica", "normal");
      y += 7;
    }

    y += 4;
    const totalsX = pageW - margin - 60;
    const totalsValueX = pageW - margin;
    const drawTR = (
      label: string,
      value: string,
      bold = false,
      color?: [number, number, number],
    ) => {
      doc.setFontSize(bold ? 10 : 9);
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.setTextColor(
        ...(color ?? ([90, 90, 90] as [number, number, number])),
      );
      doc.text(label, totalsX, y);
      doc.setTextColor(
        ...(color ?? ([30, 30, 30] as [number, number, number])),
      );
      doc.text(value, totalsValueX, y, { align: "right" });
      y += bold ? 7 : 6;
    };
    drawTR("Subtotal:", `${invoice.subtotal.toFixed(2)} TND`);
    drawTR("Tax (19% TVA):", `${invoice.tax.toFixed(2)} TND`);
    doc.setDrawColor(20, 93, 160);
    doc.line(totalsX, y, totalsValueX, y);
    y += 4;
    drawTR("Total:", `${invoice.total.toFixed(2)} TND`, true, [20, 93, 160]);
    if (invoice.paidAmount > 0) {
      drawTR(
        "Paid:",
        `-${invoice.paidAmount.toFixed(2)} TND`,
        false,
        [22, 163, 74],
      );
    }
    if (invoice.remainingAmount > 0) {
      drawTR(
        "Amount Due:",
        `${invoice.remainingAmount.toFixed(2)} TND`,
        true,
        [220, 38, 38],
      );
    }

    doc.save(`Invoice_${invoice.invoiceNumber}.pdf`);
  });
}

// ─── Main Component ───────────────────────────────────────────────────────────
type InvoiceDetailsProps = {
  userRole?: string;
  userId?: string;
};

function InvoiceDetails({ userRole = "admin", userId }: InvoiceDetailsProps) {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const invoice = mockInvoiceDetails[invoiceId ?? ""] ?? defaultInvoice;
  const isClient = userRole === "client";

  // Block client from seeing other clients' invoices
  if (isClient && invoice.clientEmail !== userId) {
    return (
      <DetailsLayout>
        <BackButton onClick={() => navigate("/invoices")}>
          <HiOutlineArrowLeft /> Back to My Invoices
        </BackButton>
        <div style={{ textAlign: "center", padding: "8rem 2rem" }}>
          <div style={{ fontSize: "6rem", marginBottom: "1.6rem" }}>🔒</div>
          <h2
            style={{
              fontSize: "2.4rem",
              fontWeight: 700,
              color: "var(--color-grey-900)",
              marginBottom: "0.8rem",
            }}
          >
            Access Denied
          </h2>
          <p style={{ fontSize: "1.5rem", color: "var(--color-grey-500)" }}>
            You don't have permission to view this invoice.
          </p>
        </div>
      </DetailsLayout>
    );
  }

  const paidPercent =
    invoice.total > 0
      ? Math.round((invoice.paidAmount / invoice.total) * 100)
      : 0;

  const handleSendReminder = () => {
    addNotification(
      "Sending Reminder",
      `Sending to ${invoice.client.email}...`,
      "info",
    );
    setTimeout(() => {
      addNotification(
        "Reminder Sent ✅",
        `Payment reminder sent to ${invoice.client.name}`,
        "success",
      );
    }, 1500);
  };

  const handleContactAdmin = () => {
    addNotification(
      "Message Sent",
      "Your payment query has been sent to billing@taba3ni.tn",
      "success",
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <HiOutlineCheckCircle />;
      case "overdue":
        return <HiOutlineXCircle />;
      default:
        return <HiOutlineClock />;
    }
  };

  return (
    <DetailsLayout>
      {/* Back */}
      <BackButton onClick={() => navigate("/invoices")}>
        <HiOutlineArrowLeft />
        {isClient ? "Back to My Invoices" : "Back to Invoices"}
      </BackButton>

      {/* Header row */}
      <Row type="horizontal">
        <div>
          <Heading as="h1">Invoice #{invoice.invoiceNumber}</Heading>
          <div style={{ display: "flex", gap: "1.2rem", marginTop: "1.2rem" }}>
            <StatusBadge $status={invoice.status}>
              {getStatusIcon(invoice.status)}
              {invoice.status}
            </StatusBadge>
          </div>
        </div>

        <ActionButtons>
          <Button
            $variation="secondary"
            $size="medium"
            onClick={() => handleDownloadPDF(invoice)}
          >
            <HiOutlineArrowDownTray style={{ width: "2rem", height: "2rem" }} />
            Download PDF
          </Button>

          {/* Admin-only actions */}
          {!isClient && invoice.status !== "paid" && (
            <>
              <Button
                $variation="secondary"
                $size="medium"
                onClick={handleSendReminder}
              >
                <HiOutlinePaperAirplane
                  style={{ width: "2rem", height: "2rem" }}
                />
                Send Reminder
              </Button>
              <Modal>
                <Modal.Open opens="record-payment">
                  <Button $variation="primary" $size="medium">
                    <HiOutlineCurrencyDollar
                      style={{ width: "2rem", height: "2rem" }}
                    />
                    Record Payment
                  </Button>
                </Modal.Open>
                <Modal.Window name="record-payment">
                  <PaymentForm
                    invoice={{
                      invoiceNumber: invoice.invoiceNumber,
                      clientName: invoice.client.name,
                      totalAmount: invoice.total,
                      paidAmount: invoice.paidAmount,
                      remainingAmount: invoice.remainingAmount,
                    }}
                    onCloseModal={() => {}}
                  />
                </Modal.Window>
              </Modal>
            </>
          )}

          {/* Client-only: contact button if unpaid */}
          {isClient && invoice.status !== "paid" && (
            <Button
              $variation="primary"
              $size="medium"
              onClick={handleContactAdmin}
            >
              <HiOutlineCreditCard style={{ width: "2rem", height: "2rem" }} />
              Contact for Payment
            </Button>
          )}
        </ActionButtons>
      </Row>

      {/* Client-only status alerts */}
      {isClient && invoice.status === "overdue" && (
        <ClientAlertBox $type="danger">
          <HiOutlineExclamationTriangle />
          <AlertText>
            <strong>This invoice is overdue</strong>
            <span>
              Payment was due on {invoice.dueDate}. Please contact us at
              billing@taba3ni.tn to arrange payment and avoid any service
              disruption.
            </span>
          </AlertText>
        </ClientAlertBox>
      )}
      {isClient && invoice.status === "partial" && (
        <ClientAlertBox $type="warning">
          <HiOutlineClock />
          <AlertText>
            <strong>Partial payment received</strong>
            <span>
              {invoice.remainingAmount.toLocaleString()} TND is still
              outstanding. Please arrange the remaining payment before{" "}
              {invoice.dueDate}.
            </span>
          </AlertText>
        </ClientAlertBox>
      )}
      {isClient && invoice.status === "paid" && (
        <ClientAlertBox $type="success">
          <HiOutlineCheckCircle />
          <AlertText>
            <strong>Invoice fully paid</strong>
            <span>
              Thank you! This invoice has been settled. You can download a copy
              for your records.
            </span>
          </AlertText>
        </ClientAlertBox>
      )}

      {/* Main grid */}
      <Grid>
        {/* Left — Invoice document */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "2.4rem" }}
        >
          <Card>
            <InvoiceHeader>
              <CompanyInfo>
                <h2>🥛 Taba3ni Dairy</h2>
                <p>Distribution Management</p>
                <p>Avenue Habib Bourguiba, Tunis</p>
                <p>Phone: +216 71 000 000</p>
                <p>Tax ID: TN-123456789</p>
              </CompanyInfo>
              <InvoiceInfo>
                <h3>INVOICE</h3>
                <p>
                  <strong>Invoice #:</strong> {invoice.invoiceNumber}
                </p>
                <p>
                  <strong>Issue Date:</strong> {invoice.issueDate}
                </p>
                <p>
                  <strong>Due Date:</strong> {invoice.dueDate}
                </p>
              </InvoiceInfo>
            </InvoiceHeader>

            <Section>
              <SectionTitle>Bill To</SectionTitle>
              <InfoGrid>
                <InfoBlock>
                  <h5>Client Information</h5>
                  <p>
                    <HiOutlineBuildingOffice />
                    {invoice.client.name}
                  </p>
                  <p>
                    <HiOutlineMapPin />
                    {invoice.client.address}, {invoice.client.city}
                  </p>
                </InfoBlock>
                <InfoBlock>
                  <h5>Contact Details</h5>
                  <p>
                    <HiOutlinePhone />
                    {invoice.client.phone}
                  </p>
                  <p>
                    <HiOutlineEnvelope />
                    {invoice.client.email}
                  </p>
                  {invoice.client.taxId && (
                    <p>Tax ID: {invoice.client.taxId}</p>
                  )}
                </InfoBlock>
              </InfoGrid>
            </Section>

            <Section>
              <SectionTitle>Order Details</SectionTitle>
              <p style={{ fontSize: "1.4rem", color: "var(--color-grey-600)" }}>
                Related Order: <strong>#{invoice.orderId}</strong>
              </p>
            </Section>

            <Section>
              <SectionTitle>Items</SectionTitle>
              <ItemsTable>
                <TableHead>
                  <tr>
                    <th>Description</th>
                    <th style={{ textAlign: "right" }}>Qty</th>
                    <th style={{ textAlign: "right" }}>Unit Price</th>
                    <th style={{ textAlign: "right" }}>Total</th>
                  </tr>
                </TableHead>
                <TableBody>
                  {invoice.items.map((item: any, index: number) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td style={{ textAlign: "right" }}>{item.quantity}</td>
                      <td style={{ textAlign: "right" }}>
                        {item.price.toFixed(2)} TND
                      </td>
                      <td style={{ textAlign: "right", fontWeight: 600 }}>
                        {item.total.toFixed(2)} TND
                      </td>
                    </tr>
                  ))}
                </TableBody>
              </ItemsTable>

              <TotalSection>
                <TotalRow>
                  <span>Subtotal:</span>
                  <span>{invoice.subtotal.toFixed(2)} TND</span>
                </TotalRow>
                <TotalRow>
                  <span>Tax (19% TVA):</span>
                  <span>{invoice.tax.toFixed(2)} TND</span>
                </TotalRow>
                <TotalRow $highlight>
                  <span>Total Amount:</span>
                  <span>{invoice.total.toFixed(2)} TND</span>
                </TotalRow>
                {invoice.paidAmount > 0 && (
                  <TotalRow style={{ color: "var(--color-green-700)" }}>
                    <span>Paid Amount:</span>
                    <span>-{invoice.paidAmount.toFixed(2)} TND</span>
                  </TotalRow>
                )}
                {invoice.remainingAmount > 0 && (
                  <TotalRow
                    $highlight
                    style={{
                      color: "var(--color-red-700)",
                      marginTop: "1.2rem",
                    }}
                  >
                    <span>Amount Due:</span>
                    <span>{invoice.remainingAmount.toFixed(2)} TND</span>
                  </TotalRow>
                )}
              </TotalSection>
            </Section>

            <Section
              style={{
                marginTop: "3.2rem",
                paddingTop: "2.4rem",
                borderTop: "2px solid var(--color-grey-200)",
              }}
            >
              <p
                style={{
                  fontSize: "1.3rem",
                  color: "var(--color-grey-600)",
                  fontStyle: "italic",
                }}
              >
                <strong>Payment Terms:</strong> Payment is due within 30 days of
                invoice date.
              </p>
              <p
                style={{
                  fontSize: "1.3rem",
                  color: "var(--color-grey-600)",
                  marginTop: "0.8rem",
                }}
              >
                <strong>Bank Details:</strong> IBAN: TN59 1000 0000 0000 0000
                0000 | BIC: BFTNTNTT
              </p>
            </Section>
          </Card>
        </div>

        {/* Right sidebar */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "2.4rem" }}
        >
          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <Heading as="h2">Payment Summary</Heading>
            </CardHeader>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.6rem",
              }}
            >
              <StatBox>
                <h4>{invoice.total.toLocaleString()} TND</h4>
                <p>Total Invoice</p>
              </StatBox>
              <StatBox>
                <h4 style={{ color: "var(--color-green-700)" }}>
                  {invoice.paidAmount.toLocaleString()} TND
                </h4>
                <p>Paid</p>
              </StatBox>
              {invoice.remainingAmount > 0 && (
                <StatBox>
                  <h4 style={{ color: "var(--color-red-700)" }}>
                    {invoice.remainingAmount.toLocaleString()} TND
                  </h4>
                  <p>Outstanding</p>
                </StatBox>
              )}

              {/* Payment progress bar */}
              <div>
                <PaymentProgressLabel>
                  <span>Payment Progress</span>
                  <span>{paidPercent}%</span>
                </PaymentProgressLabel>
                <PaymentProgressBar $percent={paidPercent} />
              </div>
            </div>
          </Card>

          {/* Payment History */}
          <Card>
            <CardHeader>
              <Heading as="h2">Payment History</Heading>
            </CardHeader>
            {invoice.payments.length === 0 ? (
              <p
                style={{
                  fontSize: "1.4rem",
                  color: "var(--color-grey-500)",
                  textAlign: "center",
                  padding: "2rem",
                }}
              >
                No payments recorded yet
              </p>
            ) : (
              <PaymentsList>
                {invoice.payments.map((payment: any) => (
                  <PaymentCard key={payment.id}>
                    <PaymentHeader>
                      <PaymentAmount>
                        {payment.amount.toLocaleString()} TND
                      </PaymentAmount>
                      <PaymentMethod>{payment.method}</PaymentMethod>
                    </PaymentHeader>
                    <PaymentInfo>
                      <p>Date: {payment.date}</p>
                      <p>Reference: {payment.reference}</p>
                    </PaymentInfo>
                  </PaymentCard>
                ))}
              </PaymentsList>
            )}
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <Heading as="h2">Invoice Timeline</Heading>
            </CardHeader>
            <Timeline actions={invoice.timeline} />
          </Card>

          {/* Admin quick actions */}
          {!isClient && invoice.status !== "paid" && (
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
                <Modal>
                  <Modal.Open opens="record-payment-quick">
                    <Button $variation="primary" $size="medium">
                      <HiOutlineCurrencyDollar
                        style={{ width: "2rem", height: "2rem" }}
                      />
                      Record Payment
                    </Button>
                  </Modal.Open>
                  <Modal.Window name="record-payment-quick">
                    <PaymentForm
                      invoice={{
                        invoiceNumber: invoice.invoiceNumber,
                        clientName: invoice.client.name,
                        totalAmount: invoice.total,
                        paidAmount: invoice.paidAmount,
                        remainingAmount: invoice.remainingAmount,
                      }}
                      onCloseModal={() => {}}
                    />
                  </Modal.Window>
                </Modal>
                <Button
                  $variation="secondary"
                  $size="medium"
                  onClick={handleSendReminder}
                >
                  <HiOutlinePaperAirplane
                    style={{ width: "2rem", height: "2rem" }}
                  />
                  Send Payment Reminder
                </Button>
                <Button
                  $variation="secondary"
                  $size="medium"
                  onClick={() => handleDownloadPDF(invoice)}
                >
                  <HiOutlineArrowDownTray
                    style={{ width: "2rem", height: "2rem" }}
                  />
                  Download & Share
                </Button>
              </div>
            </Card>
          )}

          {/* Client contact card */}
          {isClient && invoice.status !== "paid" && (
            <ContactCard>
              <h4>
                <HiOutlineChatBubbleLeftEllipsis />
                Need Help with Payment?
              </h4>
              <p>
                <HiOutlineEnvelope />
                <span>
                  Email: <strong>billing@taba3ni.tn</strong>
                </span>
              </p>
              <p>
                <HiOutlinePhone />
                <span>
                  Call: <strong>+216 71 000 000</strong>
                </span>
              </p>
              <p>
                <HiOutlineCalendar />
                <span>Mon–Fri, 8:00–17:00</span>
              </p>
              <Button
                $variation="secondary"
                $size="medium"
                onClick={handleContactAdmin}
                style={{ marginTop: "1.2rem", width: "100%" }}
              >
                Send Payment Query
              </Button>
            </ContactCard>
          )}
        </div>
      </Grid>
    </DetailsLayout>
  );
}

export default InvoiceDetails;
