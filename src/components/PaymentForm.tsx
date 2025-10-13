import { useState } from "react";
import styled from "styled-components";
import Form from "../UI/Form";
import FormRow from "../UI/FormRow";
import Input from "../UI/Input";
import Select from "../UI/Select";
import Textarea from "../UI/Textarea";
import Button from "../UI/Button";
import ButtonGroup from "../UI/ButtonGroup";
import Heading from "../UI/Heading";

const SummarySection = styled.div`
  background-color: var(--color-brand-50);
  border-radius: var(--border-radius-md);
  padding: 2rem;
  margin-bottom: 2.4rem;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 0;
  font-size: 1.4rem;
  color: var(--color-grey-700);

  &:last-child {
    margin-top: 1.2rem;
    padding-top: 1.2rem;
    border-top: 2px solid var(--color-brand-200);
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--color-brand-700);
  }
`;

const AlertBox = styled.div<{ $type: "warning" | "info" | "success" }>`
  padding: 1.6rem;
  border-radius: var(--border-radius-md);
  margin-top: 1.6rem;
  background-color: ${(props) => {
    if (props.$type === "warning") return "var(--color-yellow-100)";
    if (props.$type === "success") return "var(--color-green-100)";
    return "var(--color-blue-100)";
  }};
  color: ${(props) => {
    if (props.$type === "warning") return "var(--color-yellow-700)";
    if (props.$type === "success") return "var(--color-green-700)";
    return "var(--color-blue-700)";
  }};

  & p {
    font-size: 1.3rem;
    margin: 0;
    font-weight: 500;
  }
`;

type PaymentFormProps = {
  invoice?: {
    invoiceNumber: string;
    clientName: string;
    totalAmount: number;
    paidAmount: number;
    remainingAmount: number;
  };
  onCloseModal: () => void;
};

const paymentMethods = [
  { value: "", label: "Select payment method..." },
  { value: "cash", label: "Cash" },
  { value: "bank-transfer", label: "Bank Transfer" },
  { value: "check", label: "Check" },
  { value: "credit-card", label: "Credit Card" },
  { value: "mobile-payment", label: "Mobile Payment (D17, etc.)" },
];

function PaymentForm({ invoice, onCloseModal }: PaymentFormProps) {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const paymentData = {
      invoiceNumber: invoice?.invoiceNumber,
      amount: parseFloat(amount),
      method: paymentMethod,
      date: paymentDate,
      reference,
      notes,
    };

    console.log("Recording payment:", paymentData);
    // TODO: Call API to record payment
    onCloseModal();
  };

  const handleQuickFill = (value: number) => {
    setAmount(value.toString());
  };

  const getPaymentStatus = () => {
    if (!amount || !invoice) return null;

    const paymentAmount = parseFloat(amount);
    const remaining = invoice.remainingAmount;

    if (paymentAmount > remaining) {
      return {
        type: "warning" as const,
        message: `⚠️ Payment amount exceeds remaining balance by ${(
          paymentAmount - remaining
        ).toFixed(2)} TND`,
      };
    } else if (paymentAmount === remaining) {
      return {
        type: "success" as const,
        message: "✅ This payment will fully settle the invoice",
      };
    } else if (paymentAmount < remaining) {
      return {
        type: "info" as const,
        message: `ℹ️ Remaining balance after payment: ${(
          remaining - paymentAmount
        ).toFixed(2)} TND`,
      };
    }
    return null;
  };

  const paymentStatus = getPaymentStatus();

  return (
    <Form type="modal" onSubmit={handleSubmit}>
      <Heading as="h2">Record Payment</Heading>

      {invoice && (
        <SummarySection>
          <h3
            style={{
              fontSize: "1.6rem",
              marginBottom: "1.2rem",
              color: "var(--color-brand-700)",
            }}
          >
            Payment Summary
          </h3>
          <SummaryRow>
            <span>Invoice:</span>
            <strong>#{invoice.invoiceNumber}</strong>
          </SummaryRow>
          <SummaryRow>
            <span>Client:</span>
            <strong>{invoice.clientName}</strong>
          </SummaryRow>
          <SummaryRow>
            <span>Total Amount:</span>
            <strong>{invoice.totalAmount.toLocaleString()} TND</strong>
          </SummaryRow>
          <SummaryRow>
            <span>Already Paid:</span>
            <strong>{invoice.paidAmount.toLocaleString()} TND</strong>
          </SummaryRow>
          <SummaryRow>
            <span>Amount Due:</span>
            <strong>{invoice.remainingAmount.toLocaleString()} TND</strong>
          </SummaryRow>
        </SummarySection>
      )}

      <FormRow label="Payment Amount (TND)">
        <Input
          type="number"
          id="amount"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          step="0.01"
          min="0"
          required
        />
      </FormRow>

      {invoice && (
        <div style={{ display: "flex", gap: "0.8rem", marginBottom: "1.6rem" }}>
          <Button
            type="button"
            $variation="secondary"
            $size="small"
            onClick={() => handleQuickFill(invoice.remainingAmount)}
          >
            Full Amount ({invoice.remainingAmount.toFixed(2)} TND)
          </Button>
          <Button
            type="button"
            $variation="secondary"
            $size="small"
            onClick={() => handleQuickFill(invoice.remainingAmount / 2)}
          >
            Half ({(invoice.remainingAmount / 2).toFixed(2)} TND)
          </Button>
        </div>
      )}

      <FormRow label="Payment Method">
        <Select
          id="paymentMethod"
          options={paymentMethods}
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          required
        />
      </FormRow>

      <FormRow label="Payment Date">
        <Input
          type="date"
          id="paymentDate"
          value={paymentDate}
          onChange={(e) => setPaymentDate(e.target.value)}
          required
        />
      </FormRow>

      <FormRow label="Reference Number">
        <Input
          type="text"
          id="reference"
          placeholder="e.g., TRF-2025-0001, CHK-12345"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
        />
      </FormRow>

      <FormRow label="Notes (Optional)">
        <Textarea
          id="notes"
          placeholder="Add any additional notes about this payment..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </FormRow>

      {paymentStatus && (
        <AlertBox $type={paymentStatus.type}>
          <p>{paymentStatus.message}</p>
        </AlertBox>
      )}

      <ButtonGroup>
        <Button type="button" $variation="secondary" onClick={onCloseModal}>
          Cancel
        </Button>
        <Button type="submit">Record Payment</Button>
      </ButtonGroup>
    </Form>
  );
}

export default PaymentForm;
