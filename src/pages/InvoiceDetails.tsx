import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  HiOutlineArrowLeft,
  HiOutlineArrowDownTray,
  HiOutlinePaperAirplane,
  HiOutlineCurrencyDollar,
  HiOutlineCalendar,
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineMapPin,
  HiOutlineBuildingOffice,
  HiOutlineCheckCircle,
  HiOutlineClock,
} from "react-icons/hi2";
import Heading from "../UI/Heading";
import Row from "../UI/Row";
import Button from "../UI/Button";
import Modal from "../UI/Modal";
import Timeline from "../UI/Timeline";

import PaymentForm from "../components/PaymentForm";

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

    & svg {
      width: 1.6rem;
      height: 1.6rem;
      color: var(--color-brand-600);
    }
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
  font-size: ${(props) => (props.$highlight ? "2rem" : "1.4rem")};
  font-weight: ${(props) => (props.$highlight ? "700" : "500")};
  color: ${(props) =>
    props.$highlight ? "var(--color-brand-600)" : "var(--color-grey-700)"};
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

// Mock invoice data
const mockInvoiceDetails = {
  id: "1",
  invoiceNumber: "INV-2025-001",
  status: "partial" as const,
  issueDate: "2025-09-15",
  dueDate: "2025-10-15",
  client: {
    name: "Carrefour Lac 2",
    email: "carrefour.lac2@email.com",
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
  tax: 243, // 18% TVA
  total: 1593,
  paidAmount: 800,
  remainingAmount: 793,
  payments: [
    {
      id: "1",
      amount: 800,
      method: "Bank Transfer",
      date: "2025-10-01",
      reference: "TRF-2025-0001",
    },
  ],
  timeline: [
    { action: "Invoice generated", date: "2025-09-15 10:00" },
    { action: "Invoice sent to client", date: "2025-09-15 10:15" },
    { action: "Partial payment received (800 TND)", date: "2025-10-01 14:30" },
    { action: "Payment reminder sent", date: "2025-10-10 09:00" },
  ],
};

function InvoiceDetails() {
  const { invoiceId } = useParams();
  const navigate = useNavigate();

  const invoice = mockInvoiceDetails;

  const handleDownloadPDF = () => {
    console.log("Downloading PDF for:", invoice.invoiceNumber);
    // TODO: Generate and download PDF
  };

  const handleSendReminder = () => {
    console.log("Sending reminder to:", invoice.client.email);
    // TODO: Send email reminder
  };

  const handleRecordPayment = () => {
    console.log("Recording payment for:", invoice.invoiceNumber);
    // TODO: Open payment modal
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <HiOutlineCheckCircle />;
      case "partial":
        return <HiOutlineClock />;
      default:
        return <HiOutlineClock />;
    }
  };

  return (
    <DetailsLayout>
      {/* Back Button */}
      <BackButton onClick={() => navigate("/invoices")}>
        <HiOutlineArrowLeft />
        Back to Invoices
      </BackButton>

      {/* Header */}
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
            onClick={handleDownloadPDF}
          >
            <HiOutlineArrowDownTray style={{ width: "2rem", height: "2rem" }} />
            Download PDF
          </Button>
          {invoice.status !== "paid" && (
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
        </ActionButtons>
      </Row>

      {/* Main Content Grid */}
      <Grid>
        {/* Left Column - Invoice Details */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "2.4rem" }}
        >
          {/* Invoice Document */}
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
                    <th style={{ textAlign: "right" }}>Quantity</th>
                    <th style={{ textAlign: "right" }}>Unit Price</th>
                    <th style={{ textAlign: "right" }}>Total</th>
                  </tr>
                </TableHead>
                <TableBody>
                  {invoice.items.map((item, index) => (
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
                  <span>Tax (18% TVA):</span>
                  <span>{invoice.tax.toFixed(2)} TND</span>
                </TotalRow>
                <TotalRow $highlight>
                  <span>Total Amount:</span>
                  <span>{invoice.total.toFixed(2)} TND</span>
                </TotalRow>
                <TotalRow style={{ color: "var(--color-green-700)" }}>
                  <span>Paid Amount:</span>
                  <span>-{invoice.paidAmount.toFixed(2)} TND</span>
                </TotalRow>
                <TotalRow
                  $highlight
                  style={{ color: "var(--color-red-700)", marginTop: "1.2rem" }}
                >
                  <span>Amount Due:</span>
                  <span>{invoice.remainingAmount.toFixed(2)} TND</span>
                </TotalRow>
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
                invoice date. Late payments may be subject to additional
                charges.
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

        {/* Right Column - Payment Info & Timeline */}
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
              <StatBox>
                <h4 style={{ color: "var(--color-red-700)" }}>
                  {invoice.remainingAmount.toLocaleString()} TND
                </h4>
                <p>Outstanding</p>
              </StatBox>
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
                {invoice.payments.map((payment) => (
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

          {/* Quick Actions */}
          {invoice.status !== "paid" && (
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
                  onClick={handleRecordPayment}
                >
                  <HiOutlineCurrencyDollar
                    style={{ width: "2rem", height: "2rem" }}
                  />
                  Record Payment
                </Button>
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
                  onClick={handleDownloadPDF}
                >
                  <HiOutlineArrowDownTray
                    style={{ width: "2rem", height: "2rem" }}
                  />
                  Download & Share
                </Button>
              </div>
            </Card>
          )}
        </div>
      </Grid>
    </DetailsLayout>
  );
}

export default InvoiceDetails;
