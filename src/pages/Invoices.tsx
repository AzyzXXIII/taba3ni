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
  HiOutlinePlus,
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
// ─── Animations ──────────────────────────────────────────────────────────────
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

// ─── Layout ───────────────────────────────────────────────────────────────────
const InvoicesLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  animation: ${fadeIn} 0.35s ease both;
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1.6rem;
  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

// ─── Filters ──────────────────────────────────────────────────────────────────
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
  @media (max-width: 600px) {
    width: 100%;
    justify-content: space-between;
  }
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

// ─── Table ────────────────────────────────────────────────────────────────────
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

const cols = "1fr 2fr 1.4fr 1fr 1fr 1fr 1.2fr 0.5fr";

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: ${cols};
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

const TableRow = styled.div`
  display: grid;
  grid-template-columns: ${cols};
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

const ResultCount = styled.span`
  font-size: 1.3rem;
  color: var(--color-grey-500);
  padding: 1.2rem 2.4rem;
  border-bottom: 1px solid var(--color-grey-100);
  display: block;
  background: var(--color-grey-0);
`;

// ─── Modal Styles ─────────────────────────────────────────────────────────────
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

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.6rem;
  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const FormLabel = styled.label`
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--color-grey-700);
`;

const FormInput = styled.input`
  padding: 1rem 1.4rem;
  border: 1.5px solid var(--color-grey-200);
  border-radius: var(--border-radius-sm);
  font-size: 1.4rem;
  color: var(--color-grey-800);
  background: var(--color-grey-0);
  font-family: inherit;
  transition: border-color 0.15s;
  &:focus {
    outline: none;
    border-color: var(--color-brand-500);
    box-shadow: 0 0 0 3px var(--color-brand-50, #eff6ff);
  }
`;

const FormSelect = styled.select`
  padding: 1rem 1.4rem;
  border: 1.5px solid var(--color-grey-200);
  border-radius: var(--border-radius-sm);
  font-size: 1.4rem;
  color: var(--color-grey-800);
  background: var(--color-grey-0);
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.15s;
  &:focus {
    outline: none;
    border-color: var(--color-brand-500);
    box-shadow: 0 0 0 3px var(--color-brand-50, #eff6ff);
  }
`;

const FormTextarea = styled.textarea`
  padding: 1rem 1.4rem;
  border: 1.5px solid var(--color-grey-200);
  border-radius: var(--border-radius-sm);
  font-size: 1.4rem;
  color: var(--color-grey-800);
  background: var(--color-grey-0);
  font-family: inherit;
  resize: vertical;
  min-height: 8rem;
  transition: border-color 0.15s;
  &:focus {
    outline: none;
    border-color: var(--color-brand-500);
    box-shadow: 0 0 0 3px var(--color-brand-50, #eff6ff);
  }
`;

const SectionDivider = styled.div`
  border-top: 1px solid var(--color-grey-100);
  padding-top: 1.8rem;
  margin-top: 0.4rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--color-grey-700);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 1.2rem;
`;

const LineItemGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto;
  gap: 1rem;
  align-items: center;
  @media (max-width: 520px) {
    grid-template-columns: 1fr 1fr;
    & > :first-child {
      grid-column: 1 / -1;
    }
  }
`;

const RemoveItemBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-red-500);
  padding: 0.4rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  transition: color 0.15s;
  &:hover {
    color: var(--color-red-700);
  }
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  & svg {
    width: 1.6rem;
    height: 1.6rem;
  }
`;

const AddItemBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: none;
  border: 1.5px dashed var(--color-brand-300);
  border-radius: var(--border-radius-sm);
  padding: 0.9rem 1.4rem;
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--color-brand-600);
  cursor: pointer;
  width: 100%;
  justify-content: center;
  transition: all 0.15s;
  &:hover {
    background: var(--color-brand-50);
    border-color: var(--color-brand-500);
  }
  & svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 2rem;
  padding: 1.2rem 0 0;
  border-top: 2px solid var(--color-grey-100);
`;

const TotalLabel = styled.span`
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--color-grey-600);
`;

const TotalAmount = styled.span`
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-brand-700);
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1.2rem;
  padding: 0 2.8rem 2.4rem;
`;

const CancelBtn = styled.button`
  padding: 1rem 2rem;
  border: 1.5px solid var(--color-grey-200);
  background: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--color-grey-700);
  cursor: pointer;
  transition: all 0.15s;
  &:hover {
    background: var(--color-grey-100);
  }
`;

const SubmitBtn = styled.button`
  padding: 1rem 2.4rem;
  background: var(--color-brand-600);
  border: none;
  border-radius: var(--border-radius-sm);
  font-size: 1.4rem;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  transition: all 0.15s;
  &:hover {
    background: var(--color-brand-700);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// ─── Types ────────────────────────────────────────────────────────────────────
type PaymentStatus = "paid" | "unpaid" | "overdue" | "partial";

type Invoice = {
  id: string;
  invoiceNumber: string;
  client: { name: string; email: string };
  orderId: string;
  amount: number;
  paidAmount: number;
  status: PaymentStatus;
  issueDate: string;
  dueDate: string;
  paymentDate?: string;
};

type LineItemType = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const mockInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-2025-001",
    client: { name: "Carrefour Lac 2", email: "carrefour.lac2@email.com" },
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
    client: { name: "Superette Ariana", email: "superette.ariana@email.com" },
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
    client: { name: "Cafe des Arts", email: "cafe.arts@email.com" },
    orderId: "ORD-005",
    amount: 1200,
    paidAmount: 1200,
    status: "paid",
    issueDate: "2025-10-12",
    dueDate: "2025-11-12",
    paymentDate: "2025-10-12",
  },
];

const mockClients = [
  "Carrefour Lac 2",
  "Monoprix Menzah",
  "Magasin General Marsa",
  "Superette Ariana",
  "Cafe des Arts",
  "Distribution Centre Nord",
];

// ─── CSV Export ───────────────────────────────────────────────────────────────
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

// ─── Generate Invoice Modal ───────────────────────────────────────────────────

// ─── Main Page ────────────────────────────────────────────────────────────────
function Invoices() {
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

  const handleViewInvoice = (invoiceId: string) =>
    navigate(`/invoices/${invoiceId}`);

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
        5000,
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

  const isOverdue = (dueDate: string, status: PaymentStatus) =>
    status !== "paid" && new Date(dueDate) < new Date();

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
            title="Paid Amount"
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
                  lineHeight: "1",
                  padding: "0 0.2rem",
                }}
                title="Clear dates"
              >
                x
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
            <TableHeader>
              <div>Invoice #</div>
              <div>Client</div>
              <div>Order</div>
              <div>Amount</div>
              <div>Paid</div>
              <div>Status</div>
              <div>Due Date</div>
              <div />
            </TableHeader>

            {filteredInvoices.length === 0 ? (
              <EmptyState>
                <HiOutlineDocumentText />
                <p>No invoices found</p>
                <p
                  style={{ fontSize: "1.4rem", color: "var(--color-grey-400)" }}
                >
                  Try adjusting your filters or date range
                </p>
              </EmptyState>
            ) : (
              <Menus>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
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
                              onClick={() => handleViewInvoice(invoice.id)}
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
                  </TableRow>
                ))}
              </Menus>
            )}
          </TableWrapper>
        </TableCard>
      </InvoicesLayout>
    </>
  );
}

export default Invoices;
