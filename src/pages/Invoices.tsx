import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  HiOutlineEye,
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineXCircle,
  HiOutlineCurrencyDollar,
  HiOutlineArrowDownTray,
  HiOutlinePaperAirplane,
} from "react-icons/hi2";
import Heading from "../UI/Heading";
import Row from "../UI/Row";
import Button from "../UI/Button";
import SearchBar from "../UI/SearchBar";
import Menus from "../UI/Menus";
import Modal from "../UI/Modal";
import StatsCard from "../UI/StatsCard";
import { useNotifications } from "../hooks/useNotifications";

// Styled Components
const InvoicesLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
`;

const FiltersBar = styled.div`
  display: flex;
  gap: 1.6rem;
  align-items: center;
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 0.8rem;
`;

const FilterButton = styled.button<{ $active?: boolean }>`
  padding: 0.8rem 1.6rem;
  border: 2px solid
    ${(props) =>
      props.$active ? "var(--color-brand-600)" : "var(--color-grey-300)"};
  background-color: ${(props) =>
    props.$active ? "var(--color-brand-50)" : "var(--color-grey-0)"};
  color: ${(props) =>
    props.$active ? "var(--color-brand-600)" : "var(--color-grey-600)"};
  border-radius: var(--border-radius-sm);
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: var(--color-brand-600);
    color: var(--color-brand-600);
  }
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(24rem, 1fr));
  gap: 2.4rem;
`;

const TableCard = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  overflow: hidden;
`;

const Table = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1.5fr 1fr 1fr 1fr 1fr 0.5fr;
  gap: 1.6rem;
  padding: 1.6rem 2.4rem;
  background-color: var(--color-grey-50);
  font-weight: 600;
  font-size: 1.3rem;
  text-transform: uppercase;
  color: var(--color-grey-600);
  border-bottom: 1px solid var(--color-grey-100);
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1.5fr 1fr 1fr 1fr 1fr 0.5fr;
  gap: 1.6rem;
  padding: 1.6rem 2.4rem;
  border-bottom: 1px solid var(--color-grey-100);
  align-items: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--color-grey-50);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const InvoiceId = styled.span`
  font-weight: 600;
  color: var(--color-brand-600);
`;

const ClientName = styled.span`
  font-weight: 500;
`;

const Amount = styled.span<{ $highlight?: boolean }>`
  font-weight: 600;
  color: ${(props) =>
    props.$highlight ? "var(--color-red-700)" : "var(--color-grey-900)"};
`;

const StatusBadge = styled.span<{
  $status: "paid" | "unpaid" | "overdue" | "partial";
}>`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 1rem;
  border-radius: 100px;
  font-size: 1.2rem;
  font-weight: 600;
  text-transform: uppercase;
  background-color: ${(props) => {
    if (props.$status === "paid") return "var(--color-green-100)";
    if (props.$status === "partial") return "var(--color-yellow-100)";
    if (props.$status === "overdue") return "var(--color-red-100)";
    return "var(--color-grey-100)";
  }};
  color: ${(props) => {
    if (props.$status === "paid") return "var(--color-green-700)";
    if (props.$status === "partial") return "var(--color-yellow-700)";
    if (props.$status === "overdue") return "var(--color-red-700)";
    return "var(--color-grey-700)";
  }};

  & svg {
    width: 1.4rem;
    height: 1.4rem;
  }
`;

const DueDateBadge = styled.span<{ $overdue?: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 0.4rem 0.8rem;
  border-radius: var(--border-radius-sm);
  font-size: 1.2rem;
  font-weight: 600;
  background-color: ${(props) =>
    props.$overdue ? "var(--color-red-100)" : "var(--color-grey-100)"};
  color: ${(props) =>
    props.$overdue ? "var(--color-red-700)" : "var(--color-grey-700)"};
`;

const EmptyState = styled.div`
  padding: 6rem 2rem;
  text-align: center;
  color: var(--color-grey-500);

  & p {
    font-size: 1.8rem;
    margin-bottom: 1.6rem;
  }

  & svg {
    width: 8rem;
    height: 8rem;
    margin: 0 auto 2rem;
    color: var(--color-grey-400);
  }
`;

// Types
type PaymentStatus = "paid" | "unpaid" | "overdue" | "partial";

type Invoice = {
  id: string;
  invoiceNumber: string;
  client: {
    name: string;
    email: string;
  };
  orderId: string;
  amount: number;
  paidAmount: number;
  status: PaymentStatus;
  issueDate: string;
  dueDate: string;
  paymentDate?: string;
};

// Mock Data
const mockInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-2025-001",
    client: {
      name: "Carrefour Lac 2",
      email: "carrefour.lac2@email.com",
    },
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
    client: {
      name: "Monoprix Menzah",
      email: "monoprix.menzah@email.com",
    },
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
    client: {
      name: "Magasin Général Marsa",
      email: "general.marsa@email.com",
    },
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
    client: {
      name: "Superette Ariana",
      email: "superette.ariana@email.com",
    },
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
    client: {
      name: "Café des Arts",
      email: "cafe.arts@email.com",
    },
    orderId: "ORD-005",
    amount: 1200,
    paidAmount: 1200,
    status: "paid",
    issueDate: "2025-10-12",
    dueDate: "2025-11-12",
    paymentDate: "2025-10-12",
  },
];

function Invoices() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { addNotification } = useNotifications(); // ← Add this

  const handleViewInvoice = (invoiceId: string) => {
    addNotification("📄 Opening Invoice", `Loading invoice details...`, "info");
    navigate(`/invoices/${invoiceId}`);
  };
  // Filter invoices
  const filteredInvoices = mockInvoices.filter((invoice) => {
    const matchesStatus =
      statusFilter === "all" || invoice.status === statusFilter;
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.client.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate stats
  const stats = {
    totalInvoices: mockInvoices.length,
    totalAmount: mockInvoices.reduce((sum, inv) => sum + inv.amount, 0),
    paidAmount: mockInvoices.reduce((sum, inv) => sum + inv.paidAmount, 0),
    outstanding: mockInvoices.reduce(
      (sum, inv) => sum + (inv.amount - inv.paidAmount),
      0
    ),
    overdue: mockInvoices.filter((inv) => inv.status === "overdue").length,
  };

  // (Removed duplicate handleViewInvoice)

  const handleDownloadInvoice = (invoice: Invoice) => {
    addNotification(
      "⬇️ Downloading",
      `Invoice ${invoice.invoiceNumber} is being prepared...`,
      "info"
    );
    console.log("Download invoice:", invoice.invoiceNumber);

    // After download completes:
    setTimeout(() => {
      addNotification(
        "✅ Download Complete",
        `Invoice ${invoice.invoiceNumber} downloaded successfully`,
        "success"
      );
    }, 2000);
  };

  const handleSendReminder = (invoice: Invoice) => {
    addNotification(
      "📧 Sending Reminder",
      `Payment reminder being sent to ${invoice.client.email}...`,
      "info"
    );

    // Simulate sending
    setTimeout(() => {
      addNotification(
        "✅ Reminder Sent",
        `Payment reminder sent to ${invoice.client.name}`,
        "success",
        5000
      );
    }, 1500);
  };

  const isOverdue = (dueDate: string, status: PaymentStatus) => {
    if (status === "paid") return false;
    return new Date(dueDate) < new Date();
  };

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

  return (
    <InvoicesLayout>
      {/* Header */}
      <Row type="horizontal">
        <Heading as="h1">Invoices & Payments</Heading>
        <Button $size="medium" onClick={() => navigate("/invoices/new")}>
          + Generate Invoice
        </Button>
      </Row>

      {/* Stats */}
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
          title="Overdue Invoices"
          value={stats.overdue}
          icon={<HiOutlineXCircle />}
          color="var(--color-red-700)"
        />
      </StatsRow>

      {/* Filters & Search */}
      <FiltersBar>
        <SearchBar
          placeholder="Search by invoice number or client..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FilterGroup>
          <FilterButton
            $active={statusFilter === "all"}
            onClick={() => setStatusFilter("all")}
          >
            All
          </FilterButton>
          <FilterButton
            $active={statusFilter === "paid"}
            onClick={() => setStatusFilter("paid")}
          >
            Paid
          </FilterButton>
          <FilterButton
            $active={statusFilter === "unpaid"}
            onClick={() => setStatusFilter("unpaid")}
          >
            Unpaid
          </FilterButton>
          <FilterButton
            $active={statusFilter === "partial"}
            onClick={() => setStatusFilter("partial")}
          >
            Partial
          </FilterButton>
          <FilterButton
            $active={statusFilter === "overdue"}
            onClick={() => setStatusFilter("overdue")}
          >
            Overdue
          </FilterButton>
        </FilterGroup>
      </FiltersBar>

      {/* Invoices Table */}
      <TableCard>
        <Table>
          <TableHeader>
            <div>Invoice #</div>
            <div>Client</div>
            <div>Order ID</div>
            <div>Amount</div>
            <div>Paid</div>
            <div>Status</div>
            <div>Due Date</div>
            <div></div>
          </TableHeader>

          {filteredInvoices.length === 0 ? (
            <EmptyState>
              <HiOutlineDocumentText />
              <p>🔍 No invoices found</p>
              <p style={{ fontSize: "1.4rem" }}>
                Try adjusting your filters or search query
              </p>
            </EmptyState>
          ) : (
            <Menus>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <InvoiceId>#{invoice.invoiceNumber}</InvoiceId>
                  <ClientName>{invoice.client.name}</ClientName>
                  <span
                    style={{
                      fontSize: "1.3rem",
                      color: "var(--color-grey-600)",
                    }}
                  >
                    #{invoice.orderId}
                  </span>
                  <Amount>{invoice.amount.toLocaleString()} TND</Amount>
                  <Amount $highlight={invoice.paidAmount < invoice.amount}>
                    {invoice.paidAmount.toLocaleString()} TND
                  </Amount>
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
        </Table>
      </TableCard>
    </InvoicesLayout>
  );
}

export default Invoices;
