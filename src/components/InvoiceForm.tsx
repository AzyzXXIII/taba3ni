import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  HiOutlineCheckCircle,
  HiOutlineUser,
  HiOutlineDocumentText,
  HiOutlineCurrencyDollar,
  HiOutlineShoppingCart,
  HiOutlineArrowLeft,
  HiOutlineArrowRight,
} from "react-icons/hi2";
import Button from "../UI/Button";
import Heading from "../UI/Heading";

// ── Styled Components ─────────────────────────────────────────────────────────

const PageLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  max-width: 80rem;
  margin: 0 auto;
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

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
`;

const Stepper = styled.div`
  display: flex;
  align-items: center;
`;

const StepItem = styled.div<{ $status: "done" | "active" | "upcoming" }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  flex: 1;
  position: relative;
  &:not(:last-child)::after {
    content: "";
    position: absolute;
    top: 1.8rem;
    left: calc(50% + 2rem);
    right: calc(-50% + 2rem);
    height: 2px;
    background: ${(p) =>
      p.$status === "done"
        ? "var(--color-brand-600)"
        : "var(--color-grey-200)"};
    transition: background 0.3s;
  }
`;

const StepCircle = styled.div<{ $status: "done" | "active" | "upcoming" }>`
  width: 3.6rem;
  height: 3.6rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.4rem;
  z-index: 1;
  background: ${(p) =>
    p.$status === "upcoming"
      ? "var(--color-grey-200)"
      : "var(--color-brand-600)"};
  color: ${(p) =>
    p.$status === "upcoming" ? "var(--color-grey-600)" : "white"};
  box-shadow: ${(p) =>
    p.$status === "active" ? "0 0 0 4px var(--color-brand-100)" : "none"};
  & svg {
    width: 1.8rem;
    height: 1.8rem;
  }
`;

const StepLabel = styled.span<{ $active: boolean }>`
  font-size: 1.2rem;
  font-weight: ${(p) => (p.$active ? "700" : "500")};
  color: ${(p) =>
    p.$active ? "var(--color-brand-600)" : "var(--color-grey-500)"};
  white-space: nowrap;
`;

const SectionCard = styled.div`
  background-color: var(--color-grey-50);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-md);
  padding: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--color-grey-700);
  margin-bottom: 1.6rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-brand-600);
  }
`;

const ClientList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 36rem;
  overflow-y: auto;
`;

const OptionButton = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 1.6rem;
  padding: 1.4rem 1.6rem;
  background-color: ${(p) =>
    p.$selected ? "var(--color-brand-50)" : "var(--color-grey-0)"};
  border: 2px solid
    ${(p) => (p.$selected ? "var(--color-brand-600)" : "var(--color-grey-200)")};
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  width: 100%;
  &:hover {
    border-color: var(--color-brand-600);
    background-color: var(--color-brand-50);
  }
`;

const Avatar = styled.div`
  width: 4rem;
  height: 4rem;
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
  font-weight: 700;
  font-size: 1.4rem;
  flex-shrink: 0;
`;

const OptionInfo = styled.div`
  flex: 1;
  & h4 {
    font-size: 1.4rem;
    font-weight: 600;
    color: var(--color-grey-900);
    margin-bottom: 0.2rem;
  }
  & span {
    font-size: 1.2rem;
    color: var(--color-grey-500);
    text-transform: capitalize;
  }
`;

const CheckMark = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: var(--color-brand-600);
  display: flex;
  align-items: center;
  justify-content: center;
  & svg {
    width: 1.2rem;
    height: 1.2rem;
    color: white;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.6rem;
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const Label = styled.label`
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--color-grey-700);
`;

const StyledInput = styled.input`
  padding: 1rem 1.4rem;
  border: 1px solid var(--color-grey-300);
  border-radius: var(--border-radius-sm);
  font-size: 1.4rem;
  background-color: var(--color-grey-0);
  &:focus {
    outline: none;
    border-color: var(--color-brand-600);
    box-shadow: 0 0 0 3px var(--color-brand-100);
  }
  &:read-only {
    background: var(--color-grey-100);
    cursor: not-allowed;
  }
`;

const StyledSelect = styled.select`
  padding: 1rem 1.4rem;
  border: 1px solid var(--color-grey-300);
  border-radius: var(--border-radius-sm);
  font-size: 1.4rem;
  background-color: var(--color-grey-0);
  &:focus {
    outline: none;
    border-color: var(--color-brand-600);
  }
`;

const StyledTextarea = styled.textarea`
  padding: 1rem 1.4rem;
  border: 1px solid var(--color-grey-300);
  border-radius: var(--border-radius-sm);
  font-size: 1.4rem;
  background-color: var(--color-grey-0);
  resize: vertical;
  min-height: 8rem;
  font-family: inherit;
  &:focus {
    outline: none;
    border-color: var(--color-brand-600);
  }
`;

const ItemRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 1.2rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-grey-100);
  font-size: 1.3rem;
  align-items: center;
  &:first-child {
    font-weight: 700;
    color: var(--color-grey-500);
    text-transform: uppercase;
    font-size: 1.1rem;
  }
  &:last-child {
    border-bottom: none;
  }
`;

const ReviewCard = styled.div`
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-md);
  padding: 1.6rem;
`;

const ReviewRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 0;
  font-size: 1.4rem;
  border-bottom: 1px solid var(--color-grey-100);
  &:last-child {
    border-bottom: none;
  }
  & .label {
    color: var(--color-grey-600);
    font-weight: 500;
  }
  & .value {
    font-weight: 600;
    color: var(--color-grey-900);
  }
`;

const TotalBox = styled.div`
  background: linear-gradient(
    135deg,
    var(--color-brand-600),
    var(--color-brand-700)
  );
  border-radius: var(--border-radius-md);
  padding: 2rem;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  & .label {
    font-size: 1.5rem;
    font-weight: 600;
    opacity: 0.9;
  }
  & .amount {
    font-size: 2.8rem;
    font-weight: 800;
  }
`;

const NavigationRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.8rem;
`;

const SuccessWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.6rem;
  padding: 6rem 2rem;
  text-align: center;
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  & svg {
    width: 6.4rem;
    height: 6.4rem;
    color: #16a34a;
  }
  & h3 {
    font-size: 2.4rem;
    font-weight: 700;
    color: var(--color-grey-900);
  }
  & p {
    font-size: 1.5rem;
    color: var(--color-grey-600);
  }
`;

// ── Mock Data ─────────────────────────────────────────────────────────────────

const CLIENTS = [
  {
    id: "1",
    name: "Carrefour Lac 2",
    type: "supermarket",
    email: "carrefour.lac2@email.com",
    city: "Tunis",
  },
  {
    id: "2",
    name: "Monoprix Menzah",
    type: "supermarket",
    email: "monoprix.menzah@email.com",
    city: "Ariana",
  },
  {
    id: "3",
    name: "Magasin Général Marsa",
    type: "grocery",
    email: "general.marsa@email.com",
    city: "La Marsa",
  },
  {
    id: "4",
    name: "Superette Ariana",
    type: "grocery",
    email: "superette.ariana@email.com",
    city: "Ariana",
  },
  {
    id: "5",
    name: "Restaurant Le Gourmet",
    type: "restaurant",
    email: "legourmet@email.com",
    city: "Tunis",
  },
];

const ORDERS_BY_CLIENT: Record<string, any[]> = {
  "1": [
    {
      id: "ORD-001",
      date: "2025-12-28",
      products: [
        { name: "Full Cream Milk (1L)", qty: 50, price: 15 },
        { name: "Greek Yogurt (500g)", qty: 30, price: 8 },
      ],
    },
    {
      id: "ORD-004",
      date: "2025-12-29",
      products: [
        { name: "Butter (250g)", qty: 15, price: 12 },
        { name: "Cream (500ml)", qty: 20, price: 22 },
      ],
    },
  ],
  "2": [
    {
      id: "ORD-002",
      date: "2025-12-27",
      products: [
        { name: "Cheddar Cheese (200g)", qty: 20, price: 18 },
        { name: "Butter (250g)", qty: 10, price: 12 },
      ],
    },
  ],
  "3": [
    {
      id: "ORD-003",
      date: "2025-12-25",
      products: [
        { name: "Full Cream Milk (1L)", qty: 100, price: 15 },
        { name: "Greek Yogurt (500g)", qty: 50, price: 8 },
      ],
    },
  ],
  "4": [
    {
      id: "ORD-005",
      date: "2025-12-28",
      products: [
        { name: "Skimmed Milk (1L)", qty: 30, price: 13 },
        { name: "Greek Yogurt (500g)", qty: 20, price: 8 },
      ],
    },
  ],
  "5": [
    {
      id: "ORD-006",
      date: "2025-12-20",
      products: [
        { name: "Full Cream Milk (1L)", qty: 20, price: 15 },
        { name: "Whipping Cream (500ml)", qty: 10, price: 22 },
      ],
    },
  ],
};

const TAX = 0.19;
const orderTotal = (o: any) =>
  o.products.reduce((s: number, p: any) => s + p.qty * p.price, 0);
const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
const newInvNum = () =>
  `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 900) + 100}`;
const STEPS = ["Client", "Order", "Details", "Review"];

// ── Component ─────────────────────────────────────────────────────────────────

type Props = {
  onCloseModal?: () => void;
};

function InvoiceForm({ onCloseModal }: Props) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [clientId, setClientId] = useState("");
  const [orderId, setOrderId] = useState("");

  const today = new Date().toISOString().split("T")[0];
  const plus30 = new Date(Date.now() + 30 * 864e5).toISOString().split("T")[0];

  const [invNum] = useState(newInvNum);
  const [issueDate, setIssueDate] = useState(today);
  const [dueDate, setDueDate] = useState(plus30);
  const [terms, setTerms] = useState("30");
  const [notes, setNotes] = useState("");

  const client = CLIENTS.find((c) => c.id === clientId);
  const orders = clientId ? ORDERS_BY_CLIENT[clientId] || [] : [];
  const order = orders.find((o) => o.id === orderId);
  const subtotal = order ? orderTotal(order) : 0;
  const tax = Math.round(subtotal * TAX * 100) / 100;
  const total = subtotal + tax;

  const canNext = [!!clientId, !!orderId, !!issueDate && !!dueDate, true][step];

  // When used as a modal, "go back to invoices" just closes the modal
  const handleCancel = () => {
    if (onCloseModal) onCloseModal();
    else navigate("/invoices");
  };

  const handleDone = () => {
    if (onCloseModal) onCloseModal();
    else navigate("/invoices");
  };

  const handleCreateAnother = () => {
    setStep(0);
    setDone(false);
    setClientId("");
    setOrderId("");
  };

  if (done)
    return (
      <PageLayout>
        {/* Only show back button when used as a standalone page */}
        {!onCloseModal && (
          <BackButton onClick={handleCancel}>
            <HiOutlineArrowLeft /> Back to Invoices
          </BackButton>
        )}
        <SuccessWrapper>
          <HiOutlineCheckCircle />
          <h3>Invoice Created!</h3>
          <p>
            <strong>{invNum}</strong> generated for{" "}
            <strong>{client?.name}</strong>
          </p>
          <p
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              color: "var(--color-brand-600)",
            }}
          >
            {total.toLocaleString()} TND
          </p>
          <div style={{ display: "flex", gap: "1.2rem" }}>
            <Button $variation="secondary" $size="medium" onClick={handleDone}>
              {onCloseModal ? "Close" : "Go to Invoices"}
            </Button>
            <Button $size="medium" onClick={handleCreateAnother}>
              Create Another
            </Button>
          </div>
        </SuccessWrapper>
      </PageLayout>
    );

  return (
    <PageLayout>
      {/* Only show back button when used as a standalone page */}
      {!onCloseModal && (
        <BackButton onClick={handleCancel}>
          <HiOutlineArrowLeft /> Back to Invoices
        </BackButton>
      )}

      <Heading as="h1">Generate New Invoice</Heading>

      <FormWrapper>
        {/* Stepper */}
        <Stepper>
          {STEPS.map((label, i) => {
            const status =
              i < step ? "done" : i === step ? "active" : "upcoming";
            return (
              <StepItem key={label} $status={status}>
                <StepCircle
                  $status={status}
                  style={{ cursor: i < step ? "pointer" : "default" }}
                  onClick={() => i < step && setStep(i)}
                >
                  {status === "done" ? <HiOutlineCheckCircle /> : i + 1}
                </StepCircle>
                <StepLabel $active={status === "active"}>{label}</StepLabel>
              </StepItem>
            );
          })}
        </Stepper>

        {/* Step 0 — Client */}
        {step === 0 && (
          <SectionCard>
            <SectionTitle>
              <HiOutlineUser /> Select Client
            </SectionTitle>
            <ClientList>
              {CLIENTS.map((c) => (
                <OptionButton
                  key={c.id}
                  $selected={clientId === c.id}
                  type="button"
                  onClick={() => {
                    setClientId(c.id);
                    setOrderId("");
                  }}
                >
                  <Avatar>{initials(c.name)}</Avatar>
                  <OptionInfo>
                    <h4>{c.name}</h4>
                    <span>
                      {c.type} · {c.city}
                    </span>
                  </OptionInfo>
                  {clientId === c.id && (
                    <CheckMark>
                      <HiOutlineCheckCircle />
                    </CheckMark>
                  )}
                </OptionButton>
              ))}
            </ClientList>
          </SectionCard>
        )}

        {/* Step 1 — Order */}
        {step === 1 && (
          <SectionCard>
            <SectionTitle>
              <HiOutlineShoppingCart /> Select Order — {client?.name}
            </SectionTitle>
            {orders.length === 0 ? (
              <p
                style={{
                  color: "var(--color-grey-500)",
                  fontSize: "1.4rem",
                  textAlign: "center",
                  padding: "2rem",
                }}
              >
                No orders found for this client.
              </p>
            ) : (
              orders.map((o) => (
                <OptionButton
                  key={o.id}
                  $selected={orderId === o.id}
                  type="button"
                  onClick={() => setOrderId(o.id)}
                  style={{ marginBottom: "1rem", alignItems: "flex-start" }}
                >
                  <OptionInfo>
                    <h4 style={{ color: "var(--color-brand-600)" }}>#{o.id}</h4>
                    <span style={{ fontSize: "1.3rem" }}>
                      {o.products.map((p: any) => p.name).join(", ")}
                    </span>
                    <br />
                    <span>{o.date}</span>
                  </OptionInfo>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "1.6rem",
                      color: "var(--color-grey-900)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {orderTotal(o).toLocaleString()} TND
                  </div>
                  {orderId === o.id && (
                    <CheckMark>
                      <HiOutlineCheckCircle />
                    </CheckMark>
                  )}
                </OptionButton>
              ))
            )}
          </SectionCard>
        )}

        {/* Step 2 — Details */}
        {step === 2 && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.6rem" }}
          >
            <SectionCard>
              <SectionTitle>
                <HiOutlineDocumentText /> Invoice Information
              </SectionTitle>
              <FormGrid>
                <FormField>
                  <Label>Invoice Number</Label>
                  <StyledInput value={invNum} readOnly />
                </FormField>
                <FormField>
                  <Label>Payment Terms</Label>
                  <StyledSelect
                    value={terms}
                    onChange={(e) => setTerms(e.target.value)}
                  >
                    <option value="0">Due on Receipt</option>
                    <option value="15">Net 15 days</option>
                    <option value="30">Net 30 days</option>
                    <option value="60">Net 60 days</option>
                    <option value="90">Net 90 days</option>
                  </StyledSelect>
                </FormField>
                <FormField>
                  <Label>Issue Date</Label>
                  <StyledInput
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                  />
                </FormField>
                <FormField>
                  <Label>Due Date</Label>
                  <StyledInput
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </FormField>
              </FormGrid>
            </SectionCard>

            {order && (
              <SectionCard>
                <SectionTitle>
                  <HiOutlineShoppingCart /> Items — #{order.id}
                </SectionTitle>
                <ItemRow>
                  <div>Product</div>
                  <div>Qty</div>
                  <div>Unit Price</div>
                  <div>Total</div>
                </ItemRow>
                {order.products.map((p: any, i: number) => (
                  <ItemRow key={i}>
                    <div style={{ fontWeight: 500 }}>{p.name}</div>
                    <div>{p.qty}</div>
                    <div>{p.price} TND</div>
                    <div style={{ fontWeight: 600 }}>
                      {(p.qty * p.price).toLocaleString()} TND
                    </div>
                  </ItemRow>
                ))}
                <ItemRow
                  style={{
                    borderTop: "2px solid var(--color-grey-200)",
                    marginTop: "0.8rem",
                  }}
                >
                  <div
                    style={{
                      gridColumn: "1/3",
                      color: "var(--color-grey-600)",
                    }}
                  >
                    Subtotal
                  </div>
                  <div />
                  <div style={{ fontWeight: 600 }}>
                    {subtotal.toLocaleString()} TND
                  </div>
                </ItemRow>
                <ItemRow>
                  <div
                    style={{
                      gridColumn: "1/3",
                      color: "var(--color-grey-600)",
                    }}
                  >
                    TVA (19%)
                  </div>
                  <div />
                  <div style={{ fontWeight: 600 }}>
                    {tax.toLocaleString()} TND
                  </div>
                </ItemRow>
                <ItemRow>
                  <div
                    style={{
                      gridColumn: "1/3",
                      fontWeight: 700,
                      color: "var(--color-brand-600)",
                    }}
                  >
                    Total
                  </div>
                  <div />
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: "1.6rem",
                      color: "var(--color-brand-600)",
                    }}
                  >
                    {total.toLocaleString()} TND
                  </div>
                </ItemRow>
              </SectionCard>
            )}

            <SectionCard>
              <SectionTitle>
                <HiOutlineDocumentText /> Notes (Optional)
              </SectionTitle>
              <StyledTextarea
                placeholder="Payment instructions, special terms, or notes for the client..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </SectionCard>
          </div>
        )}

        {/* Step 3 — Review */}
        {step === 3 && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.6rem" }}
          >
            <ReviewCard>
              <SectionTitle>
                <HiOutlineUser /> Client
              </SectionTitle>
              <ReviewRow>
                <span className="label">Name</span>
                <span className="value">{client?.name}</span>
              </ReviewRow>
              <ReviewRow>
                <span className="label">Email</span>
                <span className="value">{client?.email}</span>
              </ReviewRow>
              <ReviewRow>
                <span className="label">City</span>
                <span className="value">{client?.city}</span>
              </ReviewRow>
            </ReviewCard>
            <ReviewCard>
              <SectionTitle>
                <HiOutlineDocumentText /> Invoice Details
              </SectionTitle>
              <ReviewRow>
                <span className="label">Invoice #</span>
                <span
                  className="value"
                  style={{ color: "var(--color-brand-600)" }}
                >
                  {invNum}
                </span>
              </ReviewRow>
              <ReviewRow>
                <span className="label">Order</span>
                <span className="value">#{orderId}</span>
              </ReviewRow>
              <ReviewRow>
                <span className="label">Issue Date</span>
                <span className="value">{issueDate}</span>
              </ReviewRow>
              <ReviewRow>
                <span className="label">Due Date</span>
                <span className="value">{dueDate}</span>
              </ReviewRow>
              <ReviewRow>
                <span className="label">Terms</span>
                <span className="value">
                  {terms === "0" ? "Due on Receipt" : `Net ${terms} days`}
                </span>
              </ReviewRow>
            </ReviewCard>
            <ReviewCard>
              <SectionTitle>
                <HiOutlineCurrencyDollar /> Summary
              </SectionTitle>
              <ReviewRow>
                <span className="label">Subtotal</span>
                <span className="value">{subtotal.toLocaleString()} TND</span>
              </ReviewRow>
              <ReviewRow>
                <span className="label">TVA (19%)</span>
                <span className="value">{tax.toLocaleString()} TND</span>
              </ReviewRow>
              {notes && (
                <ReviewRow>
                  <span className="label">Notes</span>
                  <span
                    className="value"
                    style={{
                      maxWidth: "40rem",
                      textAlign: "right",
                      fontSize: "1.3rem",
                    }}
                  >
                    {notes}
                  </span>
                </ReviewRow>
              )}
            </ReviewCard>
            <TotalBox>
              <span className="label">Total Amount Due</span>
              <span className="amount">{total.toLocaleString()} TND</span>
            </TotalBox>
          </div>
        )}

        {/* Navigation */}
        <NavigationRow>
          {step > 0 ? (
            <Button
              type="button"
              $variation="secondary"
              $size="medium"
              onClick={() => setStep((s) => s - 1)}
            >
              <HiOutlineArrowLeft
                style={{ width: "1.8rem", height: "1.8rem" }}
              />{" "}
              Back
            </Button>
          ) : (
            <Button
              type="button"
              $variation="secondary"
              $size="medium"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          )}
          {step < 3 ? (
            <Button
              type="button"
              $size="medium"
              onClick={() => canNext && setStep((s) => s + 1)}
              disabled={!canNext}
            >
              Next{" "}
              <HiOutlineArrowRight
                style={{ width: "1.8rem", height: "1.8rem" }}
              />
            </Button>
          ) : (
            <Button type="button" $size="medium" onClick={() => setDone(true)}>
              <HiOutlineCheckCircle
                style={{ width: "1.8rem", height: "1.8rem" }}
              />{" "}
              Create Invoice
            </Button>
          )}
        </NavigationRow>
      </FormWrapper>
    </PageLayout>
  );
}

export default InvoiceForm;
