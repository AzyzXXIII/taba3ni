import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import {
  HiOutlineEye,
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineXCircle,
  HiOutlineCurrencyDollar,
  HiOutlineArrowDownTray,
  HiOutlinePaperAirplane,
  HiOutlineCalendarDays,
  HiOutlineTableCells,
  HiOutlineXMark,
  HiOutlineExclamationTriangle,
  HiOutlineCreditCard,
  HiOutlineBellAlert,
} from "react-icons/hi2";
import Heading from "../UI/Heading";
import Row from "../UI/Row";
import Button from "../UI/Button";
import SearchBar from "../UI/SearchBar";
import Menus from "../UI/Menus";
import Modal from "../UI/Modal";
import StatsCard from "../UI/StatsCard";
import { useNotifications } from "../hooks/useNotifications";
import InvoiceForm from "../components/InvoiceForm";

// ─── Animations ───────────────────────────────────────────────────────────────
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const slideUp = keyframes`
  from { opacity: 0; transform: translateY(20px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;
const overlayIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

// ─── Shared Layout ────────────────────────────────────────────────────────────
const InvoicesLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  animation: ${fadeIn} 0.35s ease both;
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
  gap: 1.6rem;
`;

const FiltersBar = styled.div`
  display: flex;
  gap: 1.2rem;
  align-items: center;
  flex-wrap: wrap;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ $active?: boolean }>`
  padding: 0.7rem 1.4rem;
  border: 2px solid
    ${(p) => (p.$active ? "var(--color-brand-600)" : "var(--color-grey-200)")};
  background: ${(p) =>
    p.$active ? "var(--color-brand-600)" : "var(--color-grey-0)"};
  color: ${(p) => (p.$active ? "#fff" : "var(--color-grey-600)")};
  border-radius: 100px;
  font-size: 1.3rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s ease;
  white-space: nowrap;
  &:hover {
    border-color: var(--color-brand-600);
    color: ${(p) => (p.$active ? "#fff" : "var(--color-brand-600)")};
  }
`;

const DateRangeGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-sm);
  padding: 0.6rem 1.2rem;
  flex-wrap: wrap;
`;

const DateLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.3rem;
  color: var(--color-grey-500);
  font-weight: 500;
  white-space: nowrap;
  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-brand-500);
  }
`;

const DateInput = styled.input`
  border: none;
  outline: none;
  font-size: 1.3rem;
  color: var(--color-grey-700);
  background: transparent;
  cursor: pointer;
  font-family: inherit;
`;

const DateSeparator = styled.span`
  color: var(--color-grey-400);
  font-size: 1.2rem;
`;

const ExportButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.8rem 1.6rem;
  background: var(--color-grey-0);
  border: 1.5px solid var(--color-grey-200);
  border-radius: var(--border-radius-sm);
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--color-grey-700);
  cursor: pointer;
  transition: all 0.18s ease;
  white-space: nowrap;
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

const TableCard = styled.div`
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  overflow: hidden;
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

const ResultCount = styled.span`
  font-size: 1.3rem;
  color: var(--color-grey-500);
  padding: 1.2rem 2.4rem;
  border-bottom: 1px solid var(--color-grey-100);
  display: block;
  background: var(--color-grey-0);
`;

const StatusBadge = styled.span<{
  $status: "paid" | "unpaid" | "overdue" | "partial";
}>`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 1rem;
  border-radius: 100px;
  font-size: 1.15rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  background: ${(p) => {
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
    width: 1.3rem;
    height: 1.3rem;
  }
`;

const EmptyState = styled.div`
  padding: 6rem 2rem;
  text-align: center;
  color: var(--color-grey-500);
  & p {
    font-size: 1.6rem;
    margin-bottom: 0.8rem;
  }
  & svg {
    width: 6rem;
    height: 6rem;
    margin: 0 auto 1.6rem;
    color: var(--color-grey-300);
  }
`;

// ─── Admin-specific styles ────────────────────────────────────────────────────
const adminCols = "1fr 2fr 1.4fr 1fr 1fr 1fr 1.2fr 0.5fr";

const AdminTableHeader = styled.div`
  display: grid;
  grid-template-columns: ${adminCols};
  gap: 1.6rem;
  padding: 1.4rem 2.4rem;
  background: var(--color-grey-50);
  font-weight: 700;
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-grey-500);
  border-bottom: 1px solid var(--color-grey-100);
  min-width: 800px;
`;

const AdminTableRow = styled.div`
  display: grid;
  grid-template-columns: ${adminCols};
  gap: 1.6rem;
  padding: 1.5rem 2.4rem;
  border-bottom: 1px solid var(--color-grey-100);
  align-items: center;
  transition: background 0.15s;
  min-width: 800px;
  &:hover {
    background: var(--color-grey-50);
  }
  &:last-child {
    border-bottom: none;
  }
`;

const InvoiceId = styled.span`
  font-weight: 700;
  color: var(--color-brand-600);
  font-size: 1.3rem;
`;

const ClientName = styled.div`
  font-weight: 600;
  font-size: 1.4rem;
  color: var(--color-grey-800);
`;

const ClientEmail = styled.div`
  font-size: 1.2rem;
  color: var(--color-grey-500);
  margin-top: 0.2rem;
`;

const Amount = styled.span<{ $highlight?: boolean }>`
  font-weight: 700;
  font-size: 1.4rem;
  color: ${(p) =>
    p.$highlight ? "var(--color-red-700)" : "var(--color-grey-900)"};
`;

const ProgressBar = styled.div<{ $percent: number }>`
  height: 4px;
  background: var(--color-grey-150, #e5e7eb);
  border-radius: 99px;
  margin-top: 0.4rem;
  overflow: hidden;
  &::after {
    content: "";
    display: block;
    height: 100%;
    width: ${(p) => p.$percent}%;
    border-radius: 99px;
    background: ${(p) =>
      p.$percent === 100
        ? "var(--color-green-500, #22c55e)"
        : p.$percent > 0
          ? "var(--color-yellow-500, #eab308)"
          : "var(--color-red-400, #f87171)"};
    transition: width 0.4s ease;
  }
`;

const DueDateBadge = styled.span<{ $overdue?: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 0.4rem 0.8rem;
  border-radius: var(--border-radius-sm);
  font-size: 1.2rem;
  font-weight: 600;
  background: ${(p) =>
    p.$overdue ? "var(--color-red-100)" : "var(--color-grey-100)"};
  color: ${(p) =>
    p.$overdue ? "var(--color-red-700)" : "var(--color-grey-700)"};
`;

// ─── Client-specific styles ───────────────────────────────────────────────────

const AlertBanner = styled.div<{ $type: "warning" | "danger" | "info" }>`
  display: flex;
  align-items: center;
  gap: 1.6rem;
  padding: 1.6rem 2rem;
  border-radius: var(--border-radius-md);
  background: ${(p) =>
    p.$type === "danger"
      ? "linear-gradient(135deg, #fee2e2, #fecaca)"
      : p.$type === "warning"
        ? "linear-gradient(135deg, #fef3c7, #fde68a)"
        : "linear-gradient(135deg, var(--color-brand-50), var(--color-brand-100))"};
  border: 1.5px solid
    ${(p) =>
      p.$type === "danger"
        ? "var(--color-red-300)"
        : p.$type === "warning"
          ? "var(--color-yellow-400)"
          : "var(--color-brand-200)"};

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    flex-shrink: 0;
    color: ${(p) =>
      p.$type === "danger"
        ? "var(--color-red-600)"
        : p.$type === "warning"
          ? "var(--color-yellow-700)"
          : "var(--color-brand-600)"};
  }
`;

const AlertText = styled.div`
  flex: 1;
  & strong {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-grey-900);
    display: block;
    margin-bottom: 0.2rem;
  }
  & span {
    font-size: 1.3rem;
    color: var(--color-grey-700);
  }
`;

// Client card-based invoice list
const ClientCardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const ClientInvoiceCard = styled.div<{ $status: string }>`
  background: var(--color-grey-0);
  border: 1.5px solid
    ${(p) =>
      p.$status === "overdue"
        ? "var(--color-red-200)"
        : p.$status === "paid"
          ? "var(--color-green-200)"
          : "var(--color-grey-200)"};
  border-radius: var(--border-radius-md);
  padding: 2rem 2.4rem;
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  align-items: center;
  gap: 2rem;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr auto;
    grid-template-rows: auto auto;
  }
`;

const CardInvoiceInfo = styled.div`
  & .inv-num {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-brand-600);
    margin-bottom: 0.4rem;
  }
  & .inv-order {
    font-size: 1.2rem;
    color: var(--color-grey-500);
  }
  & .inv-date {
    font-size: 1.2rem;
    color: var(--color-grey-400);
    margin-top: 0.2rem;
  }
`;

const CardAmountBlock = styled.div`
  text-align: right;
  & .total {
    font-size: 2rem;
    font-weight: 800;
    color: var(--color-grey-900);
  }
  & .due {
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--color-red-600);
    margin-top: 0.2rem;
  }
  & .paid-label {
    font-size: 1.2rem;
    color: var(--color-green-600);
    margin-top: 0.2rem;
  }

  @media (max-width: 768px) {
    grid-column: 2;
    grid-row: 1;
  }
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.8rem;
  flex-shrink: 0;

  @media (max-width: 768px) {
    grid-column: 1 / -1;
    grid-row: 2;
  }
`;

const IconActionBtn = styled.button`
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
  transition: all 0.18s;
  white-space: nowrap;

  & svg {
    width: 1.6rem;
    height: 1.6rem;
  }

  &:hover {
    background: var(--color-brand-50);
    border-color: var(--color-brand-400);
    color: var(--color-brand-700);
  }

  &.pay:hover {
    background: var(--color-green-50);
    border-color: var(--color-green-500);
    color: var(--color-green-700);
  }
`;

const ClientSummaryBox = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: 1.6rem;
  padding: 2rem;
  background: linear-gradient(
    135deg,
    var(--color-brand-50),
    var(--color-grey-0)
  );
  border: 1px solid var(--color-brand-100);
  border-radius: var(--border-radius-md);
`;

const SummaryBlock = styled.div`
  text-align: center;
  padding: 1.2rem;

  & .label {
    font-size: 1.2rem;
    color: var(--color-grey-500);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.6rem;
  }
  & .value {
    font-size: 2.4rem;
    font-weight: 800;
    color: var(--color-grey-900);
  }
  & .sub {
    font-size: 1.2rem;
    color: var(--color-grey-400);
    margin-top: 0.2rem;
  }
`;

// ─── Modal styles ─────────────────────────────────────────────────────────────
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(3px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  animation: ${overlayIn} 0.2s ease both;
`;

const ModalBox = styled.div`
  background: var(--color-grey-0);
  border-radius: var(--border-radius-lg, 1.2rem);
  width: 100%;
  max-width: 56rem;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.2);
  animation: ${slideUp} 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) both;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2.4rem 2.8rem 0;
`;

const ModalTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-grey-900);
`;

const ModalClose = styled.button`
  background: var(--color-grey-100);
  border: none;
  border-radius: 50%;
  width: 3.2rem;
  height: 3.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--color-grey-600);
  transition: all 0.15s;
  flex-shrink: 0;
  &:hover {
    background: var(--color-grey-200);
    color: var(--color-grey-900);
  }
  & svg {
    width: 1.8rem;
    height: 1.8rem;
  }
`;

const ModalBody = styled.div`
  padding: 2.4rem 2.8rem;
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
`;

// ─── Types ────────────────────────────────────────────────────────────────────
type PaymentStatus = "paid" | "unpaid" | "overdue" | "partial";

type Invoice = {
  id: string;
  invoiceNumber: string;
  clientEmail: string;
  client: { name: string; email: string };
  orderId: string;
  amount: number;
  paidAmount: number;
  status: PaymentStatus;
  issueDate: string;
  dueDate: string;
  paymentDate?: string;
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const mockInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-2025-001",
    clientEmail: "client@taba3ni.tn",
    client: { name: "Carrefour Lac 2", email: "client@taba3ni.tn" },
    orderId: "ORD-001",
    amount: 3450,
    paidAmount: 0,
    status: "overdue",
    issueDate: "2025-09-15",
    dueDate: "2025-10-15",
  },
  {
    id: "2",
    invoiceNumber: "INV-2025-002",
    clientEmail: "monoprix.menzah@email.com",
    client: { name: "Monoprix Menzah", email: "monoprix.menzah@email.com" },
    orderId: "ORD-002",
    amount: 2100,
    paidAmount: 2100,
    status: "paid",
    issueDate: "2025-10-01",
    dueDate: "2025-10-31",
    paymentDate: "2025-10-05",
  },
  {
    id: "3",
    invoiceNumber: "INV-2025-003",
    clientEmail: "general.marsa@email.com",
    client: { name: "Magasin General Marsa", email: "general.marsa@email.com" },
    orderId: "ORD-003",
    amount: 1500,
    paidAmount: 0,
    status: "unpaid",
    issueDate: "2025-10-08",
    dueDate: "2025-11-08",
  },
  {
    id: "4",
    invoiceNumber: "INV-2025-004",
    clientEmail: "client@taba3ni.tn",
    client: { name: "Carrefour Lac 2", email: "client@taba3ni.tn" },
    orderId: "ORD-004",
    amount: 890,
    paidAmount: 450,
    status: "partial",
    issueDate: "2025-10-10",
    dueDate: "2025-11-10",
  },
  {
    id: "5",
    invoiceNumber: "INV-2025-005",
    clientEmail: "cafe.arts@email.com",
    client: { name: "Cafe des Arts", email: "cafe.arts@email.com" },
    orderId: "ORD-005",
    amount: 1200,
    paidAmount: 1200,
    status: "paid",
    issueDate: "2025-10-12",
    dueDate: "2025-11-12",
    paymentDate: "2025-10-12",
  },
  {
    id: "6",
    invoiceNumber: "INV-2025-006",
    clientEmail: "client@taba3ni.tn",
    client: { name: "Carrefour Lac 2", email: "client@taba3ni.tn" },
    orderId: "ORD-008",
    amount: 2750,
    paidAmount: 2750,
    status: "paid",
    issueDate: "2025-11-01",
    dueDate: "2025-12-01",
    paymentDate: "2025-11-20",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function exportToCSV(invoices: Invoice[]) {
  const headers = [
    "Invoice #",
    "Client",
    "Email",
    "Order ID",
    "Amount (TND)",
    "Paid (TND)",
    "Outstanding (TND)",
    "Status",
    "Issue Date",
    "Due Date",
    "Payment Date",
  ];
  const rows = invoices.map((inv) => [
    inv.invoiceNumber,
    inv.client.name,
    inv.client.email,
    inv.orderId,
    inv.amount,
    inv.paidAmount,
    inv.amount - inv.paidAmount,
    inv.status,
    inv.issueDate,
    inv.dueDate,
    inv.paymentDate ?? "",
  ]);
  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `invoices_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

const getStatusIcon = (status: PaymentStatus) => {
  switch (status) {
    case "paid":
      return <HiOutlineCheckCircle />;
    case "partial":
      return <HiOutlineClock />;
    case "overdue":
      return <HiOutlineXCircle />;
    default:
      return <HiOutlineClock />;
  }
};

const paidPercent = (invoice: Invoice) =>
  invoice.amount === 0
    ? 0
    : Math.round((invoice.paidAmount / invoice.amount) * 100);

const isOverdue = (dueDate: string, status: PaymentStatus) =>
  status !== "paid" && new Date(dueDate) < new Date();

// ─── Admin View ───────────────────────────────────────────────────────────────
function AdminInvoices() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const { addNotification } = useNotifications();

  const filteredInvoices = mockInvoices.filter((invoice) => {
    const matchesStatus =
      statusFilter === "all" || invoice.status === statusFilter;
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.client.name.toLowerCase().includes(searchQuery.toLowerCase());
    let matchesDate = true;
    if (dateFrom) matchesDate = matchesDate && invoice.issueDate >= dateFrom;
    if (dateTo) matchesDate = matchesDate && invoice.issueDate <= dateTo;
    return matchesStatus && matchesSearch && matchesDate;
  });

  const stats = {
    totalInvoices: mockInvoices.length,
    totalAmount: mockInvoices.reduce((s, i) => s + i.amount, 0),
    paidAmount: mockInvoices.reduce((s, i) => s + i.paidAmount, 0),
    outstanding: mockInvoices.reduce(
      (s, i) => s + (i.amount - i.paidAmount),
      0,
    ),
    overdue: mockInvoices.filter((i) => i.status === "overdue").length,
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    addNotification(
      "Downloading",
      `Preparing ${invoice.invoiceNumber}...`,
      "info",
    );
    setTimeout(() => {
      addNotification(
        "Download Complete",
        `${invoice.invoiceNumber} downloaded`,
        "success",
      );
    }, 2000);
  };

  const handleSendReminder = (invoice: Invoice) => {
    addNotification(
      "Sending Reminder",
      `Sending to ${invoice.client.email}...`,
      "info",
    );
    setTimeout(() => {
      addNotification(
        "Reminder Sent",
        `Sent to ${invoice.client.name}`,
        "success",
      );
    }, 1500);
  };

  const handleExportCSV = () => {
    exportToCSV(filteredInvoices);
    addNotification(
      "CSV Exported",
      `${filteredInvoices.length} invoice(s) exported`,
      "success",
    );
  };

  return (
    <>
      {showGenerateModal && (
        <ModalOverlay onClick={() => setShowGenerateModal(false)}>
          <ModalBox
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "86rem" }}
          >
            <ModalHeader>
              <ModalTitle>Generate Invoice</ModalTitle>
              <ModalClose onClick={() => setShowGenerateModal(false)}>
                <HiOutlineXMark />
              </ModalClose>
            </ModalHeader>
            <ModalBody>
              <InvoiceForm onCloseModal={() => setShowGenerateModal(false)} />
            </ModalBody>
          </ModalBox>
        </ModalOverlay>
      )}

      <InvoicesLayout>
        <Row type="horizontal">
          <Heading as="h1">Invoices & Payments</Heading>
          <Button $size="medium" onClick={() => setShowGenerateModal(true)}>
            + Generate Invoice
          </Button>
        </Row>

        <StatsRow>
          <StatsCard
            title="Total Invoices"
            value={stats.totalInvoices}
            icon={<HiOutlineDocumentText />}
            color="var(--color-blue-700)"
          />
          <StatsCard
            title="Total Amount"
            value={`${stats.totalAmount.toLocaleString()} TND`}
            icon={<HiOutlineCurrencyDollar />}
            color="var(--color-brand-600)"
          />
          <StatsCard
            title="Collected"
            value={`${stats.paidAmount.toLocaleString()} TND`}
            icon={<HiOutlineCheckCircle />}
            color="var(--color-green-700)"
          />
          <StatsCard
            title="Outstanding"
            value={`${stats.outstanding.toLocaleString()} TND`}
            icon={<HiOutlineCurrencyDollar />}
            color="var(--color-red-700)"
          />
          <StatsCard
            title="Overdue"
            value={stats.overdue}
            icon={<HiOutlineXCircle />}
            color="var(--color-red-700)"
          />
        </StatsRow>

        <FiltersBar>
          <SearchBar
            placeholder="Search invoice # or client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <DateRangeGroup>
            <DateLabel>
              <HiOutlineCalendarDays />
              From
            </DateLabel>
            <DateInput
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
            <DateSeparator>to</DateSeparator>
            <DateLabel>To</DateLabel>
            <DateInput
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
            {(dateFrom || dateTo) && (
              <button
                onClick={() => {
                  setDateFrom("");
                  setDateTo("");
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--color-grey-400)",
                  fontSize: "1.4rem",
                }}
              >
                ×
              </button>
            )}
          </DateRangeGroup>

          <FilterGroup>
            {(["all", "paid", "unpaid", "partial", "overdue"] as const).map(
              (s) => (
                <FilterButton
                  key={s}
                  $active={statusFilter === s}
                  onClick={() => setStatusFilter(s)}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </FilterButton>
              ),
            )}
          </FilterGroup>

          <ExportButton onClick={handleExportCSV}>
            <HiOutlineTableCells />
            Export CSV
          </ExportButton>
        </FiltersBar>

        <TableCard>
          {filteredInvoices.length > 0 && (
            <ResultCount>
              Showing <strong>{filteredInvoices.length}</strong> of{" "}
              <strong>{mockInvoices.length}</strong> invoices
            </ResultCount>
          )}
          <TableWrapper>
            <AdminTableHeader>
              <div>Invoice #</div>
              <div>Client</div>
              <div>Order</div>
              <div>Amount</div>
              <div>Paid</div>
              <div>Status</div>
              <div>Due Date</div>
              <div />
            </AdminTableHeader>

            {filteredInvoices.length === 0 ? (
              <EmptyState>
                <HiOutlineDocumentText />
                <p>No invoices found</p>
                <p
                  style={{ fontSize: "1.4rem", color: "var(--color-grey-400)" }}
                >
                  Try adjusting your filters
                </p>
              </EmptyState>
            ) : (
              <Menus>
                {filteredInvoices.map((invoice) => (
                  <AdminTableRow key={invoice.id}>
                    <InvoiceId>#{invoice.invoiceNumber}</InvoiceId>

                    <div>
                      <ClientName>{invoice.client.name}</ClientName>
                      <ClientEmail>{invoice.client.email}</ClientEmail>
                    </div>

                    <span
                      style={{
                        fontSize: "1.3rem",
                        color: "var(--color-grey-500)",
                      }}
                    >
                      #{invoice.orderId}
                    </span>

                    <Amount>{invoice.amount.toLocaleString()} TND</Amount>

                    <div>
                      <Amount $highlight={invoice.paidAmount < invoice.amount}>
                        {invoice.paidAmount.toLocaleString()} TND
                      </Amount>
                      <ProgressBar $percent={paidPercent(invoice)} />
                    </div>

                    <StatusBadge $status={invoice.status}>
                      {getStatusIcon(invoice.status)}
                      {invoice.status}
                    </StatusBadge>

                    <DueDateBadge
                      $overdue={isOverdue(invoice.dueDate, invoice.status)}
                    >
                      {invoice.dueDate}
                    </DueDateBadge>

                    <div>
                      <Modal>
                        <Menus.Menu>
                          <Menus.Toggle id={invoice.id} />
                          <Menus.List id={invoice.id}>
                            <Menus.Button
                              icon={<HiOutlineEye />}
                              onClick={() =>
                                navigate(`/invoices/${invoice.id}`)
                              }
                            >
                              View Details
                            </Menus.Button>
                            <Menus.Button
                              icon={<HiOutlineArrowDownTray />}
                              onClick={() => handleDownloadInvoice(invoice)}
                            >
                              Download PDF
                            </Menus.Button>
                            {invoice.status !== "paid" && (
                              <Menus.Button
                                icon={<HiOutlinePaperAirplane />}
                                onClick={() => handleSendReminder(invoice)}
                              >
                                Send Reminder
                              </Menus.Button>
                            )}
                          </Menus.List>
                        </Menus.Menu>
                      </Modal>
                    </div>
                  </AdminTableRow>
                ))}
              </Menus>
            )}
          </TableWrapper>
        </TableCard>
      </InvoicesLayout>
    </>
  );
}

// ─── Client View ──────────────────────────────────────────────────────────────
function ClientInvoices({ userId }: { userId?: string }) {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { addNotification } = useNotifications();

  // Filter only this client's invoices
  const myInvoices = mockInvoices.filter((inv) => inv.clientEmail === userId);

  const filtered = myInvoices.filter(
    (inv) => statusFilter === "all" || inv.status === statusFilter,
  );

  const stats = {
    total: myInvoices.reduce((s, i) => s + i.amount, 0),
    paid: myInvoices.reduce((s, i) => s + i.paidAmount, 0),
    outstanding: myInvoices.reduce((s, i) => s + (i.amount - i.paidAmount), 0),
    overdueCount: myInvoices.filter((i) => i.status === "overdue").length,
    invoiceCount: myInvoices.length,
  };

  const hasOverdue = myInvoices.some((i) => i.status === "overdue");
  const hasUnpaid = myInvoices.some(
    (i) => i.status === "unpaid" || i.status === "partial",
  );

  const handleDownload = (invoice: Invoice) => {
    addNotification(
      "Preparing Download",
      `${invoice.invoiceNumber} is being prepared...`,
      "info",
    );
    setTimeout(() => {
      addNotification(
        "Download Ready",
        `${invoice.invoiceNumber} downloaded successfully`,
        "success",
      );
    }, 2000);
  };

  const handleContactAdmin = (invoice: Invoice) => {
    addNotification(
      "Request Sent",
      `Payment query for ${invoice.invoiceNumber} sent to admin`,
      "success",
    );
  };

  return (
    <InvoicesLayout>
      {/* Header */}
      <div>
        <Heading as="h1">My Invoices</Heading>
        <p
          style={{
            fontSize: "1.5rem",
            color: "var(--color-grey-500)",
            marginTop: "0.4rem",
          }}
        >
          View and download your invoices and payment history
        </p>
      </div>

      {/* Alert banners */}
      {hasOverdue && (
        <AlertBanner $type="danger">
          <HiOutlineExclamationTriangle />
          <AlertText>
            <strong>Payment Overdue</strong>
            <span>
              You have {stats.overdueCount} overdue invoice
              {stats.overdueCount > 1 ? "s" : ""}. Please contact us to arrange
              payment and avoid service interruption.
            </span>
          </AlertText>
          <Button
            $variation="secondary"
            $size="small"
            onClick={() => setStatusFilter("overdue")}
          >
            View Overdue
          </Button>
        </AlertBanner>
      )}

      {!hasOverdue && hasUnpaid && (
        <AlertBanner $type="warning">
          <HiOutlineBellAlert />
          <AlertText>
            <strong>Pending Payments</strong>
            <span>
              You have unpaid invoices. Please review them below and contact us
              to process payment.
            </span>
          </AlertText>
        </AlertBanner>
      )}

      {/* Account summary */}
      <ClientSummaryBox>
        <SummaryBlock>
          <div className="label">Total Invoiced</div>
          <div className="value">{stats.total.toLocaleString()}</div>
          <div className="sub">TND · {stats.invoiceCount} invoices</div>
        </SummaryBlock>
        <SummaryBlock>
          <div className="label">Total Paid</div>
          <div className="value" style={{ color: "var(--color-green-600)" }}>
            {stats.paid.toLocaleString()}
          </div>
          <div className="sub">TND</div>
        </SummaryBlock>
        <SummaryBlock>
          <div className="label">Outstanding</div>
          <div
            className="value"
            style={{
              color:
                stats.outstanding > 0
                  ? "var(--color-red-600)"
                  : "var(--color-green-600)",
            }}
          >
            {stats.outstanding.toLocaleString()}
          </div>
          <div className="sub">TND</div>
        </SummaryBlock>
        <SummaryBlock>
          <div className="label">Payment Rate</div>
          <div className="value" style={{ color: "var(--color-brand-600)" }}>
            {stats.total > 0
              ? Math.round((stats.paid / stats.total) * 100)
              : 100}
            %
          </div>
          <div className="sub">collected</div>
        </SummaryBlock>
      </ClientSummaryBox>

      {/* Status filter */}
      <FilterGroup>
        {(["all", "paid", "unpaid", "partial", "overdue"] as const).map((s) => (
          <FilterButton
            key={s}
            $active={statusFilter === s}
            onClick={() => setStatusFilter(s)}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
            {s !== "all" && (
              <span style={{ marginLeft: "0.4rem", opacity: 0.75 }}>
                ({myInvoices.filter((i) => i.status === s).length})
              </span>
            )}
          </FilterButton>
        ))}
      </FilterGroup>

      {/* Invoice cards */}
      {filtered.length === 0 ? (
        <TableCard>
          <EmptyState>
            <HiOutlineDocumentText />
            <p>No invoices found</p>
            <p style={{ fontSize: "1.4rem", color: "var(--color-grey-400)" }}>
              {statusFilter === "all"
                ? "Your invoices will appear here once generated."
                : `No ${statusFilter} invoices.`}
            </p>
          </EmptyState>
        </TableCard>
      ) : (
        <ClientCardList>
          {filtered.map((invoice) => {
            const outstanding = invoice.amount - invoice.paidAmount;
            const overdue = isOverdue(invoice.dueDate, invoice.status);

            return (
              <ClientInvoiceCard
                key={invoice.id}
                $status={invoice.status}
                onClick={() => navigate(`/invoices/${invoice.id}`)}
              >
                {/* Invoice info */}
                <CardInvoiceInfo>
                  <div className="inv-num">#{invoice.invoiceNumber}</div>
                  <div className="inv-order">Order #{invoice.orderId}</div>
                  <div className="inv-date">
                    Issued {invoice.issueDate} · Due{" "}
                    <span
                      style={{
                        color: overdue ? "var(--color-red-600)" : "inherit",
                        fontWeight: overdue ? 700 : 400,
                      }}
                    >
                      {invoice.dueDate}
                    </span>
                    {overdue && " ⚠️"}
                  </div>
                </CardInvoiceInfo>

                {/* Status badge */}
                <StatusBadge $status={invoice.status}>
                  {getStatusIcon(invoice.status)}
                  {invoice.status}
                </StatusBadge>

                {/* Amount */}
                <CardAmountBlock onClick={(e) => e.stopPropagation()}>
                  <div className="total">
                    {invoice.amount.toLocaleString()} TND
                  </div>
                  {outstanding > 0 && (
                    <div className="due">
                      {outstanding.toLocaleString()} TND due
                    </div>
                  )}
                  {invoice.status === "paid" && (
                    <div className="paid-label">✓ Fully paid</div>
                  )}
                </CardAmountBlock>

                {/* Actions */}
                <CardActions onClick={(e) => e.stopPropagation()}>
                  <IconActionBtn
                    onClick={() => navigate(`/invoices/${invoice.id}`)}
                  >
                    <HiOutlineEye />
                    View
                  </IconActionBtn>
                  <IconActionBtn onClick={() => handleDownload(invoice)}>
                    <HiOutlineArrowDownTray />
                    PDF
                  </IconActionBtn>
                  {invoice.status !== "paid" && (
                    <IconActionBtn
                      className="pay"
                      onClick={() => handleContactAdmin(invoice)}
                    >
                      <HiOutlineCreditCard />
                      Pay Now
                    </IconActionBtn>
                  )}
                </CardActions>
              </ClientInvoiceCard>
            );
          })}
        </ClientCardList>
      )}

      {/* Help note */}
      <div
        style={{
          padding: "1.6rem 2rem",
          background: "var(--color-grey-50)",
          borderRadius: "var(--border-radius-md)",
          border: "1px solid var(--color-grey-200)",
          fontSize: "1.3rem",
          color: "var(--color-grey-600)",
        }}
      >
        💬 Questions about an invoice? Contact your account manager at{" "}
        <strong>billing@taba3ni.tn</strong> or call{" "}
        <strong>+216 71 000 000</strong>.
      </div>
    </InvoicesLayout>
  );
}

// ─── Root Export — role switcher ──────────────────────────────────────────────
type InvoicesProps = {
  userRole?: string;
  userId?: string;
};

function Invoices({ userRole = "admin", userId }: InvoicesProps) {
  if (userRole === "client") return <ClientInvoices userId={userId} />;
  return <AdminInvoices />;
}

export default Invoices;
