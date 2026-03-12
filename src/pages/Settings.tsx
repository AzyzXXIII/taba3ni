import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import {
  HiOutlineBuildingOffice2,
  HiOutlineBell,
  HiOutlineCog6Tooth,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineGlobeAlt,
  HiOutlineMapPin,
  HiOutlineIdentification,
  HiOutlineCurrencyDollar,
  HiOutlineDocumentText,
  HiOutlineCamera,
  HiOutlineCheckCircle,
  HiOutlineArrowPath,
  HiOutlineClock,
  HiOutlineStar,
  HiOutlineTruck,
  HiOutlineShoppingCart,
  HiOutlineExclamationTriangle,
  HiOutlineLockClosed,
} from "react-icons/hi2";
import Heading from "../UI/Heading";
import Button from "../UI/Button";
import StatusBadge from "../UI/StatusBadge";
import { useNotifications } from "../hooks/useNotifications";

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(1rem); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ─── Page Layout ──────────────────────────────────────────────────────────────

const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  animation: ${fadeUp} 0.3s ease-out;
`;

const PageInner = styled.div`
  display: flex;
  gap: 2.8rem;
  align-items: flex-start;
  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const Sidebar = styled.nav`
  width: 23rem;
  flex-shrink: 0;
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  overflow: hidden;
  position: sticky;
  top: 2.4rem;
  @media (max-width: 1024px) {
    width: 100%;
    position: static;
    display: flex;
    overflow-x: auto;
  }
`;

const SidebarTop = styled.div`
  padding: 2rem 2rem 1.6rem;
  border-bottom: 1px solid var(--color-grey-100);
  @media (max-width: 1024px) {
    display: none;
  }
`;

const SidebarLabel = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: var(--color-grey-400);
  margin: 1.4rem 0 0.6rem 1.6rem;
  @media (max-width: 1024px) {
    display: none;
  }
`;

const NavItem = styled.button<{ $active: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1.2rem 1.6rem;
  border: none;
  background: ${(p) => (p.$active ? "var(--color-brand-50)" : "transparent")};
  color: ${(p) =>
    p.$active ? "var(--color-brand-700)" : "var(--color-grey-600)"};
  font-size: 1.4rem;
  font-weight: ${(p) => (p.$active ? 700 : 500)};
  cursor: pointer;
  transition: all 0.18s;
  text-align: left;
  border-left: 3px solid
    ${(p) => (p.$active ? "var(--color-brand-600)" : "transparent")};
  border-radius: 0 var(--border-radius-sm) var(--border-radius-sm) 0;

  & svg {
    width: 1.8rem;
    height: 1.8rem;
    flex-shrink: 0;
  }

  &:hover {
    background: var(--color-brand-50);
    color: var(--color-brand-700);
  }

  @media (max-width: 1024px) {
    width: auto;
    flex-shrink: 0;
    border-left: none;
    border-bottom: 3px solid
      ${(p) => (p.$active ? "var(--color-brand-600)" : "transparent")};
    border-radius: 0;
    padding: 1.4rem 1.8rem;
    white-space: nowrap;
  }
`;

// ─── Content area ─────────────────────────────────────────────────────────────

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  min-width: 0;
`;

// ─── Cards ────────────────────────────────────────────────────────────────────

const Card = styled.div`
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  overflow: hidden;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.8rem 2.4rem;
  border-bottom: 1px solid var(--color-grey-100);
  gap: 1.2rem;
  flex-wrap: wrap;
`;

const CardTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  & svg {
    width: 2rem;
    height: 2rem;
    color: var(--color-brand-600);
  }
  & h2 {
    font-size: 1.7rem;
    font-weight: 700;
    color: var(--color-grey-900);
  }
`;

const CardBody = styled.div`
  padding: 2.4rem;
`;

const CardSection = styled.div`
  padding-top: 2rem;
  margin-top: 2rem;
  border-top: 1px solid var(--color-grey-100);
`;

const SectionLabel = styled.div`
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--color-grey-600);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 1.6rem;
`;

// ─── Form elements ────────────────────────────────────────────────────────────

const FormGrid = styled.div<{ $cols?: number }>`
  display: grid;
  grid-template-columns: repeat(${(p) => p.$cols ?? 2}, 1fr);
  gap: 2rem;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div<{ $span?: number }>`
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  ${(p) => (p.$span ? `grid-column: span ${p.$span};` : "")}
  @media (max-width: 768px) {
    grid-column: span 1;
  }
`;

const Label = styled.label`
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--color-grey-700);
`;

const Hint = styled.span`
  font-size: 1.2rem;
  color: var(--color-grey-400);
  font-weight: 400;
`;

const Input = styled.input`
  padding: 1rem 1.4rem;
  border: 2px solid var(--color-grey-200);
  border-radius: var(--border-radius-sm);
  font-size: 1.4rem;
  font-family: inherit;
  color: var(--color-grey-900);
  background: var(--color-grey-0);
  transition: border-color 0.18s;
  &:focus {
    outline: none;
    border-color: var(--color-brand-600);
  }
  &::placeholder {
    color: var(--color-grey-300);
  }
`;

const Textarea = styled.textarea`
  padding: 1rem 1.4rem;
  border: 2px solid var(--color-grey-200);
  border-radius: var(--border-radius-sm);
  font-size: 1.4rem;
  font-family: inherit;
  color: var(--color-grey-900);
  background: var(--color-grey-0);
  resize: vertical;
  min-height: 10rem;
  transition: border-color 0.18s;
  &:focus {
    outline: none;
    border-color: var(--color-brand-600);
  }
  &::placeholder {
    color: var(--color-grey-300);
  }
`;

const Select = styled.select`
  padding: 1rem 1.4rem;
  border: 2px solid var(--color-grey-200);
  border-radius: var(--border-radius-sm);
  font-size: 1.4rem;
  font-family: inherit;
  color: var(--color-grey-900);
  background: var(--color-grey-0);
  cursor: pointer;
  &:focus {
    outline: none;
    border-color: var(--color-brand-600);
  }
`;

const SaveRow = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1.2rem;
  margin-top: 2.4rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-grey-100);
`;

const UnsavedDot = styled.span`
  font-size: 1.3rem;
  color: var(--color-yellow-700);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  &::before {
    content: "";
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 50%;
    background: var(--color-yellow-500);
    flex-shrink: 0;
  }
`;

// ─── Toggle ───────────────────────────────────────────────────────────────────

const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 0;
  border-bottom: 1px solid var(--color-grey-50);
  gap: 2rem;
  &:last-child {
    border-bottom: none;
  }
`;

const ToggleInfo = styled.div`
  & .title {
    font-size: 1.4rem;
    font-weight: 600;
    color: var(--color-grey-900);
    margin-bottom: 0.3rem;
  }
  & .desc {
    font-size: 1.3rem;
    color: var(--color-grey-500);
    line-height: 1.5;
  }
`;

const Toggle = styled.button<{ $on: boolean }>`
  width: 4.8rem;
  height: 2.6rem;
  border-radius: 100px;
  border: none;
  background: ${(p) =>
    p.$on ? "var(--color-brand-600)" : "var(--color-grey-300)"};
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.25s;
  &::after {
    content: "";
    position: absolute;
    top: 3px;
    left: ${(p) => (p.$on ? "calc(100% - 23px)" : "3px")};
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    transition: left 0.25s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }
`;

// ─── Logo uploader ────────────────────────────────────────────────────────────

const LogoBox = styled.div`
  display: flex;
  align-items: center;
  gap: 2.4rem;
  padding: 2rem;
  background: var(--color-grey-50);
  border: 2px dashed var(--color-grey-200);
  border-radius: var(--border-radius-md);
  flex-wrap: wrap;
  transition: border-color 0.2s;
  &:hover {
    border-color: var(--color-brand-300);
  }
`;

const LogoPreview = styled.div`
  width: 8rem;
  height: 8rem;
  border-radius: var(--border-radius-md);
  background: linear-gradient(
    135deg,
    var(--color-brand-600),
    var(--color-brand-700)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 900;
  font-size: 3rem;
  flex-shrink: 0;
  box-shadow: var(--shadow-sm);
`;

// ─── Template card ────────────────────────────────────────────────────────────

const TemplateCard = styled.div<{ $expanded: boolean }>`
  border: 2px solid
    ${(p) => (p.$expanded ? "var(--color-brand-400)" : "var(--color-grey-100)")};
  border-radius: var(--border-radius-md);
  overflow: hidden;
  transition: border-color 0.2s;
  margin-bottom: 1.6rem;
  &:last-child {
    margin-bottom: 0;
  }
`;

const TemplateHeader = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.6rem 2rem;
  background: var(--color-grey-0);
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background 0.18s;
  &:hover {
    background: var(--color-grey-50);
  }
`;

const TemplateMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1.4rem;
`;

const TemplateIcon = styled.div`
  width: 3.8rem;
  height: 3.8rem;
  border-radius: var(--border-radius-sm);
  background: var(--color-brand-50);
  display: flex;
  align-items: center;
  justify-content: center;
  & svg {
    width: 1.8rem;
    height: 1.8rem;
    color: var(--color-brand-600);
  }
`;

const TemplateInfo = styled.div`
  & .name {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-grey-900);
  }
  & .trigger {
    font-size: 1.2rem;
    color: var(--color-grey-500);
    margin-top: 0.2rem;
  }
`;

const ExpandChevron = styled.span<{ $open: boolean }>`
  font-size: 1.4rem;
  color: var(--color-grey-400);
  transition: transform 0.25s;
  transform: ${(p) => (p.$open ? "rotate(180deg)" : "rotate(0)")};
`;

const TemplateBody = styled.div<{ $open: boolean }>`
  display: ${(p) => (p.$open ? "block" : "none")};
  padding: 0 2rem 2rem;
  border-top: 1px solid var(--color-grey-100);
  background: var(--color-grey-0);
`;

const VariableChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-bottom: 1.4rem;
  margin-top: 1.4rem;
`;

const VarChip = styled.code`
  padding: 0.3rem 0.9rem;
  background: var(--color-brand-50);
  color: var(--color-brand-700);
  border: 1px solid var(--color-brand-200);
  border-radius: var(--border-radius-sm);
  font-size: 1.2rem;
  font-family: "Courier New", monospace;
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: var(--color-brand-100);
  }
`;

// ─── Notification event toggles ───────────────────────────────────────────────

const EventGroup = styled.div`
  margin-bottom: 2.4rem;
  &:last-child {
    margin-bottom: 0;
  }
`;

const EventGroupTitle = styled.div`
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--color-grey-500);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.6rem;
  padding-bottom: 0.6rem;
  border-bottom: 2px solid var(--color-grey-100);
`;

// ─── Access denied ────────────────────────────────────────────────────────────

const AccessDenied = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12rem 2rem;
  text-align: center;
  gap: 1.6rem;
  & .icon {
    font-size: 7rem;
  }
  & h2 {
    font-size: 2.4rem;
    font-weight: 800;
    color: var(--color-grey-700);
  }
  & p {
    font-size: 1.5rem;
    color: var(--color-grey-500);
    max-width: 40rem;
  }
`;

// ─── Mock initial state ───────────────────────────────────────────────────────

type CompanyForm = {
  name: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  taxId: string;
  website: string;
  registrationNumber: string;
};

type PrefsForm = {
  currency: string;
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  orderPrefix: string;
  deliveryPrefix: string;
  invoicePrefix: string;
  defaultTaxRate: string;
  paymentTerms: string;
  lateFee: string;
  maxOrderValue: string;
  lowStockThreshold: string;
  bankAccount: string;
  invoiceFooter: string;
  requireApproval: boolean;
  autoAssign: boolean;
};

type NotifSettings = {
  // Channels
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  senderEmail: string;
  senderName: string;
  // Events
  orderCreated: boolean;
  orderStatusChange: boolean;
  deliveryAssigned: boolean;
  deliveryCompleted: boolean;
  deliveryFailed: boolean;
  invoiceDue: boolean;
  invoiceOverdue: boolean;
  lowStock: boolean;
  newClient: boolean;
};

type Template = {
  id: string;
  name: string;
  trigger: string;
  icon: React.ReactNode;
  variables: string[];
  subject: string;
  body: string;
};

const INITIAL_TEMPLATES: Template[] = [
  {
    id: "order-confirmed",
    name: "Order Confirmed",
    trigger: "Sent to client when their order is confirmed",
    icon: <HiOutlineCheckCircle />,
    variables: [
      "{{client_name}}",
      "{{order_id}}",
      "{{order_total}}",
      "{{delivery_date}}",
    ],
    subject: "Your order {{order_id}} has been confirmed ✓",
    body: `Dear {{client_name}},

Your order {{order_id}} has been confirmed and is being prepared for delivery.

Order Total: {{order_total}} TND
Estimated Delivery: {{delivery_date}}

You'll receive another notification when your order is out for delivery.

Thank you for choosing Taba3ni Dairy!`,
  },
  {
    id: "out-for-delivery",
    name: "Out for Delivery",
    trigger: "Sent to client when order is dispatched",
    icon: <HiOutlineTruck />,
    variables: [
      "{{client_name}}",
      "{{order_id}}",
      "{{driver_name}}",
      "{{driver_phone}}",
      "{{eta}}",
    ],
    subject: "Your order is on its way! 🚚",
    body: `Dear {{client_name}},

Great news! Your order {{order_id}} is out for delivery.

Driver: {{driver_name}}
Driver Phone: {{driver_phone}}
Estimated Arrival: {{eta}}

You can track your delivery in real-time through the Taba3ni app.

Taba3ni Dairy`,
  },
  {
    id: "delivery-assigned",
    name: "Delivery Assigned",
    trigger: "Sent to distributor when assigned a new delivery",
    icon: <HiOutlineShoppingCart />,
    variables: [
      "{{distributor_name}}",
      "{{delivery_id}}",
      "{{client_name}}",
      "{{client_address}}",
      "{{scheduled_time}}",
    ],
    subject: "New delivery assigned: {{delivery_id}}",
    body: `Hi {{distributor_name}},

A new delivery has been assigned to you.

Delivery ID: {{delivery_id}}
Client: {{client_name}}
Address: {{client_address}}
Scheduled Time: {{scheduled_time}}

Please confirm pickup before {{scheduled_time}}.

Taba3ni Operations`,
  },
  {
    id: "invoice-due",
    name: "Invoice Due Reminder",
    trigger: "Sent to client 3 days before invoice due date",
    icon: <HiOutlineClock />,
    variables: [
      "{{client_name}}",
      "{{invoice_id}}",
      "{{amount_due}}",
      "{{due_date}}",
    ],
    subject: "Payment reminder: Invoice {{invoice_id}} due soon",
    body: `Dear {{client_name}},

This is a friendly reminder that invoice {{invoice_id}} is due in 3 days.

Amount Due: {{amount_due}} TND
Due Date: {{due_date}}

To avoid late fees, please arrange payment before the due date.

For any queries, contact billing@taba3ni.tn

Taba3ni Dairy`,
  },
  {
    id: "invoice-overdue",
    name: "Invoice Overdue",
    trigger: "Sent when invoice passes due date unpaid",
    icon: <HiOutlineExclamationTriangle />,
    variables: [
      "{{client_name}}",
      "{{invoice_id}}",
      "{{amount_due}}",
      "{{days_overdue}}",
      "{{late_fee}}",
    ],
    subject: "⚠️ Invoice {{invoice_id}} is overdue",
    body: `Dear {{client_name}},

Invoice {{invoice_id}} is now {{days_overdue}} days overdue.

Original Amount: {{amount_due}} TND
Late Fee: {{late_fee}} TND
Total Now Due: {{total_due}} TND

Please settle this immediately to avoid service suspension.

Contact: billing@taba3ni.tn | +216 71 000 000

Taba3ni Dairy`,
  },
  {
    id: "delivery-failed",
    name: "Delivery Failed",
    trigger: "Sent to client and admin when delivery cannot be completed",
    icon: <HiOutlineExclamationTriangle />,
    variables: [
      "{{client_name}}",
      "{{order_id}}",
      "{{reason}}",
      "{{reschedule_link}}",
    ],
    subject: "Delivery attempt failed for order {{order_id}}",
    body: `Dear {{client_name}},

Unfortunately, we were unable to complete your delivery for order {{order_id}}.

Reason: {{reason}}

Our team will contact you shortly to reschedule. Alternatively, you can reschedule directly: {{reschedule_link}}

We apologise for the inconvenience.

Taba3ni Dairy`,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function useDirty<T>(init: T) {
  const [value, setValue] = useState<T>(init);
  const [dirty, setDirty] = useState(false);

  const set = (updater: Partial<T> | ((prev: T) => T)) => {
    if (typeof updater === "function") {
      setValue(updater);
    } else {
      setValue((p) => ({ ...p, ...updater }));
    }
    setDirty(true);
  };

  const clean = () => setDirty(false);
  return { value, set, dirty, clean };
}

// ─── Section: Company Info ────────────────────────────────────────────────────

function CompanySection() {
  const { addNotification } = useNotifications();
  const {
    value: form,
    set,
    dirty,
    clean,
  } = useDirty<CompanyForm>({
    name: "Taba3ni Dairy",
    tagline: "Fresh dairy products, delivered to your door",
    email: "contact@taba3ni.tn",
    phone: "+216 71 000 000",
    address: "Zone Industrielle, Ben Arous",
    city: "Tunis",
    country: "Tunisia",
    taxId: "TN-000000001",
    website: "www.taba3ni.tn",
    registrationNumber: "B0123456789",
  });

  const handleSave = () => {
    clean();
    addNotification(
      "✅ Company Info Saved",
      "Company settings have been updated successfully",
      "success",
      { duration: 4000, persistent: true },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <HiOutlineBuildingOffice2 />
          <h2>Company Information</h2>
        </CardTitle>
        {dirty && <UnsavedDot>Unsaved changes</UnsavedDot>}
      </CardHeader>

      <CardBody>
        {/* Logo */}
        <SectionLabel>Logo & Branding</SectionLabel>
        <LogoBox>
          <LogoPreview>T</LogoPreview>
          <div>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "var(--color-grey-800)",
                marginBottom: "0.4rem",
              }}
            >
              Company Logo
            </div>
            <div
              style={{
                fontSize: "1.3rem",
                color: "var(--color-grey-500)",
                marginBottom: "1.4rem",
              }}
            >
              PNG or SVG, minimum 256×256px, max 2MB. Shown in reports, invoices
              and emails.
            </div>
            <Button $variation="secondary" $size="small">
              <HiOutlineCamera
                style={{
                  width: "1.6rem",
                  height: "1.6rem",
                  marginRight: "0.6rem",
                }}
              />
              Upload Logo
            </Button>
          </div>
        </LogoBox>

        {/* Basic info */}
        <CardSection>
          <SectionLabel>Basic Details</SectionLabel>
          <FormGrid>
            <FormGroup>
              <Label>Company Name</Label>
              <Input
                value={form.name}
                onChange={(e) => set({ name: e.target.value })}
                placeholder="Taba3ni Dairy"
              />
            </FormGroup>
            <FormGroup>
              <Label>
                Tagline <Hint>(shown on invoices)</Hint>
              </Label>
              <Input
                value={form.tagline}
                onChange={(e) => set({ tagline: e.target.value })}
                placeholder="Your tagline here"
              />
            </FormGroup>
            <FormGroup>
              <Label>Tax ID / Matricule Fiscal</Label>
              <Input
                value={form.taxId}
                onChange={(e) => set({ taxId: e.target.value })}
                placeholder="TN-000000000"
              />
            </FormGroup>
            <FormGroup>
              <Label>Registration Number</Label>
              <Input
                value={form.registrationNumber}
                onChange={(e) => set({ registrationNumber: e.target.value })}
                placeholder="B0000000000"
              />
            </FormGroup>
            <FormGroup>
              <Label>Website</Label>
              <Input
                value={form.website}
                onChange={(e) => set({ website: e.target.value })}
                placeholder="www.example.tn"
              />
            </FormGroup>
          </FormGrid>
        </CardSection>

        {/* Contact */}
        <CardSection>
          <SectionLabel>Contact Information</SectionLabel>
          <FormGrid>
            <FormGroup>
              <Label>Contact Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => set({ email: e.target.value })}
              />
            </FormGroup>
            <FormGroup>
              <Label>Contact Phone</Label>
              <Input
                value={form.phone}
                onChange={(e) => set({ phone: e.target.value })}
              />
            </FormGroup>
            <FormGroup $span={2}>
              <Label>Street Address</Label>
              <Input
                value={form.address}
                onChange={(e) => set({ address: e.target.value })}
              />
            </FormGroup>
            <FormGroup>
              <Label>City</Label>
              <Input
                value={form.city}
                onChange={(e) => set({ city: e.target.value })}
              />
            </FormGroup>
            <FormGroup>
              <Label>Country</Label>
              <Input
                value={form.country}
                onChange={(e) => set({ country: e.target.value })}
              />
            </FormGroup>
          </FormGrid>
        </CardSection>

        <SaveRow>
          <Button $variation="secondary" $size="medium" onClick={clean}>
            Discard
          </Button>
          <Button $variation="primary" $size="medium" onClick={handleSave}>
            Save Company Info
          </Button>
        </SaveRow>
      </CardBody>
    </Card>
  );
}

// ─── Section: App Preferences ─────────────────────────────────────────────────

function PreferencesSection() {
  const { addNotification } = useNotifications();
  const {
    value: prefs,
    set,
    dirty,
    clean,
  } = useDirty<PrefsForm>({
    currency: "TND",
    language: "en",
    timezone: "Africa/Tunis",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    orderPrefix: "ORD",
    deliveryPrefix: "DEL",
    invoicePrefix: "INV",
    defaultTaxRate: "19",
    paymentTerms: "30",
    lateFee: "1.5",
    maxOrderValue: "50000",
    lowStockThreshold: "10",
    bankAccount: "BNA — IBAN: TN59 0000 0000 0000 0000",
    invoiceFooter:
      "Thank you for your business. Please contact billing@taba3ni.tn for any payment queries.",
    requireApproval: true,
    autoAssign: false,
  });

  const toggle = (k: keyof PrefsForm) => set({ [k]: !prefs[k] } as any);

  const handleSave = () => {
    clean();
    addNotification(
      "✅ Preferences Saved",
      "App preferences have been updated",
      "success",
      { duration: 4000, persistent: true },
    );
  };

  return (
    <>
      {/* Display & Locale */}
      <Card>
        <CardHeader>
          <CardTitle>
            <HiOutlineGlobeAlt />
            <h2>Display & Locale</h2>
          </CardTitle>
          {dirty && <UnsavedDot>Unsaved changes</UnsavedDot>}
        </CardHeader>
        <CardBody>
          <FormGrid>
            <FormGroup>
              <Label>Currency</Label>
              <Select
                value={prefs.currency}
                onChange={(e) => set({ currency: e.target.value })}
              >
                <option value="TND">TND — Tunisian Dinar</option>
                <option value="EUR">EUR — Euro</option>
                <option value="USD">USD — US Dollar</option>
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Language</Label>
              <Select
                value={prefs.language}
                onChange={(e) => set({ language: e.target.value })}
              >
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="ar">العربية</option>
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Timezone</Label>
              <Select
                value={prefs.timezone}
                onChange={(e) => set({ timezone: e.target.value })}
              >
                <option value="Africa/Tunis">Africa/Tunis (UTC+1)</option>
                <option value="Europe/Paris">Europe/Paris (UTC+1/+2)</option>
                <option value="UTC">UTC</option>
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Date Format</Label>
              <Select
                value={prefs.dateFormat}
                onChange={(e) => set({ dateFormat: e.target.value })}
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Time Format</Label>
              <Select
                value={prefs.timeFormat}
                onChange={(e) => set({ timeFormat: e.target.value })}
              >
                <option value="24h">24-hour (14:30)</option>
                <option value="12h">12-hour (2:30 PM)</option>
              </Select>
            </FormGroup>
          </FormGrid>

          <CardSection>
            <SectionLabel>
              ID Prefixes <Hint>— used when generating new record IDs</Hint>
            </SectionLabel>
            <FormGrid $cols={3}>
              <FormGroup>
                <Label>Orders</Label>
                <Input
                  value={prefs.orderPrefix}
                  onChange={(e) => set({ orderPrefix: e.target.value })}
                  placeholder="ORD"
                  maxLength={5}
                />
              </FormGroup>
              <FormGroup>
                <Label>Deliveries</Label>
                <Input
                  value={prefs.deliveryPrefix}
                  onChange={(e) => set({ deliveryPrefix: e.target.value })}
                  placeholder="DEL"
                  maxLength={5}
                />
              </FormGroup>
              <FormGroup>
                <Label>Invoices</Label>
                <Input
                  value={prefs.invoicePrefix}
                  onChange={(e) => set({ invoicePrefix: e.target.value })}
                  placeholder="INV"
                  maxLength={5}
                />
              </FormGroup>
            </FormGrid>
          </CardSection>

          <SaveRow>
            <Button $variation="secondary" $size="medium" onClick={clean}>
              Discard
            </Button>
            <Button $variation="primary" $size="medium" onClick={handleSave}>
              Save Display Settings
            </Button>
          </SaveRow>
        </CardBody>
      </Card>

      {/* Order & Delivery rules */}
      <Card>
        <CardHeader>
          <CardTitle>
            <HiOutlineCog6Tooth />
            <h2>Order & Delivery Rules</h2>
          </CardTitle>
          {dirty && <UnsavedDot>Unsaved changes</UnsavedDot>}
        </CardHeader>
        <CardBody>
          <FormGrid>
            <FormGroup>
              <Label>Default Tax Rate (%)</Label>
              <Input
                type="number"
                value={prefs.defaultTaxRate}
                onChange={(e) => set({ defaultTaxRate: e.target.value })}
                min="0"
                max="100"
                step="0.5"
              />
            </FormGroup>
            <FormGroup>
              <Label>
                Low Stock Alert Threshold <Hint>(units)</Hint>
              </Label>
              <Input
                type="number"
                value={prefs.lowStockThreshold}
                onChange={(e) => set({ lowStockThreshold: e.target.value })}
                min="1"
              />
            </FormGroup>
            <FormGroup>
              <Label>
                Max Order Value <Hint>(TND)</Hint>
              </Label>
              <Input
                type="number"
                value={prefs.maxOrderValue}
                onChange={(e) => set({ maxOrderValue: e.target.value })}
              />
            </FormGroup>
          </FormGrid>

          <CardSection>
            <ToggleRow>
              <ToggleInfo>
                <div className="title">
                  Require Admin Approval for Large Orders
                </div>
                <div className="desc">
                  Orders exceeding the max order value must be manually approved
                  before processing
                </div>
              </ToggleInfo>
              <Toggle
                $on={prefs.requireApproval}
                onClick={() => toggle("requireApproval")}
              />
            </ToggleRow>
            <ToggleRow>
              <ToggleInfo>
                <div className="title">Auto-Assign Deliveries</div>
                <div className="desc">
                  Automatically assign new orders to the nearest available
                  distributor
                </div>
              </ToggleInfo>
              <Toggle
                $on={prefs.autoAssign}
                onClick={() => toggle("autoAssign")}
              />
            </ToggleRow>
          </CardSection>

          <SaveRow>
            <Button $variation="secondary" $size="medium" onClick={clean}>
              Discard
            </Button>
            <Button $variation="primary" $size="medium" onClick={handleSave}>
              Save Rules
            </Button>
          </SaveRow>
        </CardBody>
      </Card>

      {/* Invoice & Payment */}
      <Card>
        <CardHeader>
          <CardTitle>
            <HiOutlineCurrencyDollar />
            <h2>Invoice & Payment Settings</h2>
          </CardTitle>
        </CardHeader>
        <CardBody>
          <FormGrid>
            <FormGroup>
              <Label>Default Payment Terms</Label>
              <Select
                value={prefs.paymentTerms}
                onChange={(e) => set({ paymentTerms: e.target.value })}
              >
                <option value="7">Net 7 days</option>
                <option value="14">Net 14 days</option>
                <option value="30">Net 30 days</option>
                <option value="60">Net 60 days</option>
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>
                Late Payment Fee <Hint>(% per month)</Hint>
              </Label>
              <Input
                type="number"
                value={prefs.lateFee}
                onChange={(e) => set({ lateFee: e.target.value })}
                step="0.5"
                min="0"
              />
            </FormGroup>
            <FormGroup $span={2}>
              <Label>
                Bank Account <Hint>(shown on invoices)</Hint>
              </Label>
              <Input
                value={prefs.bankAccount}
                onChange={(e) => set({ bankAccount: e.target.value })}
              />
            </FormGroup>
            <FormGroup $span={2}>
              <Label>Invoice Footer Note</Label>
              <Textarea
                value={prefs.invoiceFooter}
                onChange={(e) => set({ invoiceFooter: e.target.value })}
                placeholder="Thank you for your business..."
                style={{ minHeight: "8rem" }}
              />
            </FormGroup>
          </FormGrid>

          <SaveRow>
            <Button $variation="secondary" $size="medium" onClick={clean}>
              Discard
            </Button>
            <Button $variation="primary" $size="medium" onClick={handleSave}>
              Save Invoice Settings
            </Button>
          </SaveRow>
        </CardBody>
      </Card>
    </>
  );
}

// ─── Section: Notification Settings ──────────────────────────────────────────

function NotificationsSection() {
  const { addNotification } = useNotifications();
  const {
    value: s,
    set,
    dirty,
    clean,
  } = useDirty<NotifSettings>({
    emailEnabled: true,
    smsEnabled: false,
    pushEnabled: true,
    senderEmail: "noreply@taba3ni.tn",
    senderName: "Taba3ni Dairy",
    orderCreated: true,
    orderStatusChange: true,
    deliveryAssigned: true,
    deliveryCompleted: true,
    deliveryFailed: true,
    invoiceDue: true,
    invoiceOverdue: true,
    lowStock: true,
    newClient: false,
  });

  const [openTemplate, setOpenTemplate] = useState<string | null>(null);
  const [templates, setTemplates] = useState<Template[]>(INITIAL_TEMPLATES);

  const toggle = (k: keyof NotifSettings) => set({ [k]: !s[k] } as any);

  const updateTemplate = (
    id: string,
    field: "subject" | "body",
    value: string,
  ) => {
    setTemplates((p) =>
      p.map((t) => (t.id === id ? { ...t, [field]: value } : t)),
    );
  };

  const handleSaveChannels = () => {
    clean();
    addNotification(
      "✅ Notification Settings Saved",
      "Channel preferences updated",
      "success",
      { duration: 3500, persistent: true },
    );
  };

  const handleSaveTemplate = (id: string) => {
    addNotification(
      "✅ Template Saved",
      "Email template has been updated",
      "success",
      { duration: 3000, persistent: true },
    );
  };

  const insertVariable = (templateId: string, variable: string) => {
    setTemplates((p) =>
      p.map((t) =>
        t.id === templateId ? { ...t, body: t.body + " " + variable } : t,
      ),
    );
  };

  return (
    <>
      {/* Channels */}
      <Card>
        <CardHeader>
          <CardTitle>
            <HiOutlineBell />
            <h2>Notification Channels</h2>
          </CardTitle>
          {dirty && <UnsavedDot>Unsaved changes</UnsavedDot>}
        </CardHeader>
        <CardBody>
          <ToggleRow>
            <ToggleInfo>
              <div className="title">In-App Notifications</div>
              <div className="desc">
                Bell icon alerts inside the dashboard for all users
              </div>
            </ToggleInfo>
            <Toggle $on={s.pushEnabled} onClick={() => toggle("pushEnabled")} />
          </ToggleRow>
          <ToggleRow>
            <ToggleInfo>
              <div className="title">Email Notifications</div>
              <div className="desc">
                Send event-triggered emails to clients, distributors, and admins
              </div>
            </ToggleInfo>
            <Toggle
              $on={s.emailEnabled}
              onClick={() => toggle("emailEnabled")}
            />
          </ToggleRow>
          <ToggleRow>
            <ToggleInfo>
              <div className="title">SMS Notifications</div>
              <div className="desc">
                Critical alerts via SMS (delivery status, overdue invoices)
              </div>
            </ToggleInfo>
            <Toggle $on={s.smsEnabled} onClick={() => toggle("smsEnabled")} />
          </ToggleRow>

          {s.emailEnabled && (
            <CardSection>
              <SectionLabel>Email Sender Configuration</SectionLabel>
              <FormGrid>
                <FormGroup>
                  <Label>Sender Name</Label>
                  <Input
                    value={s.senderName}
                    onChange={(e) => set({ senderName: e.target.value })}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Sender Email</Label>
                  <Input
                    type="email"
                    value={s.senderEmail}
                    onChange={(e) => set({ senderEmail: e.target.value })}
                  />
                </FormGroup>
              </FormGrid>
            </CardSection>
          )}

          <SaveRow>
            <Button $variation="secondary" $size="medium" onClick={clean}>
              Discard
            </Button>
            <Button
              $variation="primary"
              $size="medium"
              onClick={handleSaveChannels}
            >
              Save Channel Settings
            </Button>
          </SaveRow>
        </CardBody>
      </Card>

      {/* Event toggles */}
      <Card>
        <CardHeader>
          <CardTitle>
            <HiOutlineBell />
            <h2>Notification Events</h2>
          </CardTitle>
        </CardHeader>
        <CardBody>
          <EventGroup>
            <EventGroupTitle>Orders</EventGroupTitle>
            <ToggleRow>
              <ToggleInfo>
                <div className="title">New Order Created</div>
                <div className="desc">
                  Notify admin when a client places a new order
                </div>
              </ToggleInfo>
              <Toggle
                $on={s.orderCreated}
                onClick={() => toggle("orderCreated")}
              />
            </ToggleRow>
            <ToggleRow>
              <ToggleInfo>
                <div className="title">Order Status Change</div>
                <div className="desc">
                  Notify client whenever their order status is updated
                </div>
              </ToggleInfo>
              <Toggle
                $on={s.orderStatusChange}
                onClick={() => toggle("orderStatusChange")}
              />
            </ToggleRow>
          </EventGroup>

          <EventGroup>
            <EventGroupTitle>Deliveries</EventGroupTitle>
            <ToggleRow>
              <ToggleInfo>
                <div className="title">Delivery Assigned</div>
                <div className="desc">
                  Notify distributor when a delivery is assigned to them
                </div>
              </ToggleInfo>
              <Toggle
                $on={s.deliveryAssigned}
                onClick={() => toggle("deliveryAssigned")}
              />
            </ToggleRow>
            <ToggleRow>
              <ToggleInfo>
                <div className="title">Delivery Completed</div>
                <div className="desc">
                  Notify client and admin when a delivery is confirmed
                  successful
                </div>
              </ToggleInfo>
              <Toggle
                $on={s.deliveryCompleted}
                onClick={() => toggle("deliveryCompleted")}
              />
            </ToggleRow>
            <ToggleRow>
              <ToggleInfo>
                <div className="title">Delivery Failed</div>
                <div className="desc">
                  Alert admin and client when a delivery attempt fails
                </div>
              </ToggleInfo>
              <Toggle
                $on={s.deliveryFailed}
                onClick={() => toggle("deliveryFailed")}
              />
            </ToggleRow>
          </EventGroup>

          <EventGroup>
            <EventGroupTitle>Invoices & Payments</EventGroupTitle>
            <ToggleRow>
              <ToggleInfo>
                <div className="title">Invoice Due Soon</div>
                <div className="desc">
                  Remind client 3 days before their invoice due date
                </div>
              </ToggleInfo>
              <Toggle $on={s.invoiceDue} onClick={() => toggle("invoiceDue")} />
            </ToggleRow>
            <ToggleRow>
              <ToggleInfo>
                <div className="title">Invoice Overdue</div>
                <div className="desc">
                  Alert admin and client the day after a payment is missed
                </div>
              </ToggleInfo>
              <Toggle
                $on={s.invoiceOverdue}
                onClick={() => toggle("invoiceOverdue")}
              />
            </ToggleRow>
          </EventGroup>

          <EventGroup>
            <EventGroupTitle>System</EventGroupTitle>
            <ToggleRow>
              <ToggleInfo>
                <div className="title">Low Stock Alert</div>
                <div className="desc">
                  Notify admin when a product falls below the stock threshold
                </div>
              </ToggleInfo>
              <Toggle $on={s.lowStock} onClick={() => toggle("lowStock")} />
            </ToggleRow>
            <ToggleRow>
              <ToggleInfo>
                <div className="title">New Client Registered</div>
                <div className="desc">
                  Notify admin when a new client account is created
                </div>
              </ToggleInfo>
              <Toggle $on={s.newClient} onClick={() => toggle("newClient")} />
            </ToggleRow>
          </EventGroup>
        </CardBody>
      </Card>

      {/* Email Templates */}
      <Card>
        <CardHeader>
          <CardTitle>
            <HiOutlineEnvelope />
            <h2>Email Templates</h2>
          </CardTitle>
          <span style={{ fontSize: "1.3rem", color: "var(--color-grey-500)" }}>
            Click a template to expand and edit
          </span>
        </CardHeader>
        <CardBody>
          {templates.map((t) => (
            <TemplateCard key={t.id} $expanded={openTemplate === t.id}>
              <TemplateHeader
                onClick={() =>
                  setOpenTemplate(openTemplate === t.id ? null : t.id)
                }
              >
                <TemplateMeta>
                  <TemplateIcon>{t.icon}</TemplateIcon>
                  <TemplateInfo>
                    <div className="name">{t.name}</div>
                    <div className="trigger">{t.trigger}</div>
                  </TemplateInfo>
                </TemplateMeta>
                <ExpandChevron $open={openTemplate === t.id}>▼</ExpandChevron>
              </TemplateHeader>

              <TemplateBody $open={openTemplate === t.id}>
                <div style={{ marginTop: "1.6rem" }}>
                  <Label>
                    Available Variables <Hint>— click to insert into body</Hint>
                  </Label>
                  <VariableChips>
                    {t.variables.map((v) => (
                      <VarChip key={v} onClick={() => insertVariable(t.id, v)}>
                        {v}
                      </VarChip>
                    ))}
                  </VariableChips>
                </div>

                <FormGroup style={{ marginBottom: "1.4rem" }}>
                  <Label>Subject Line</Label>
                  <Input
                    value={t.subject}
                    onChange={(e) =>
                      updateTemplate(t.id, "subject", e.target.value)
                    }
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Email Body</Label>
                  <Textarea
                    value={t.body}
                    onChange={(e) =>
                      updateTemplate(t.id, "body", e.target.value)
                    }
                    style={{
                      minHeight: "22rem",
                      fontFamily: "monospace",
                      fontSize: "1.3rem",
                    }}
                  />
                </FormGroup>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "1.2rem",
                    marginTop: "1.6rem",
                  }}
                >
                  <Button
                    $variation="secondary"
                    $size="small"
                    onClick={() => {
                      setTemplates((p) =>
                        p.map((tmpl) =>
                          tmpl.id === t.id
                            ? INITIAL_TEMPLATES.find((x) => x.id === t.id)!
                            : tmpl,
                        ),
                      );
                    }}
                  >
                    <HiOutlineArrowPath
                      style={{
                        width: "1.5rem",
                        height: "1.5rem",
                        marginRight: "0.4rem",
                      }}
                    />
                    Reset to Default
                  </Button>
                  <Button
                    $variation="primary"
                    $size="small"
                    onClick={() => handleSaveTemplate(t.id)}
                  >
                    Save Template
                  </Button>
                </div>
              </TemplateBody>
            </TemplateCard>
          ))}
        </CardBody>
      </Card>
    </>
  );
}

// ─── Nav config ───────────────────────────────────────────────────────────────

const NAV = [
  { id: "company", label: "Company Info", icon: <HiOutlineBuildingOffice2 /> },
  { id: "preferences", label: "Preferences", icon: <HiOutlineCog6Tooth /> },
  { id: "notifications", label: "Notifications", icon: <HiOutlineBell /> },
];

// ─── Root ─────────────────────────────────────────────────────────────────────

type SettingsProps = {
  userRole?: "admin" | "distributor" | "client";
};

function Settings({ userRole = "admin" }: SettingsProps) {
  const navigate = useNavigate();
  const [active, setActive] = useState("company");

  if (userRole !== "admin") {
    return (
      <AccessDenied>
        <div className="icon">🔒</div>
        <h2>Admin Access Only</h2>
        <p>
          The Settings page is only accessible to administrators. Contact your
          admin if you need to make changes.
        </p>
        <Button
          $variation="primary"
          $size="medium"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </Button>
      </AccessDenied>
    );
  }

  return (
    <Page>
      <div>
        <Heading as="h1">Settings</Heading>
        <p
          style={{
            fontSize: "1.4rem",
            color: "var(--color-grey-500)",
            marginTop: "0.6rem",
          }}
        >
          Configure your company, application preferences, and notification
          settings.
        </p>
      </div>

      <PageInner>
        <Sidebar>
          <SidebarTop>
            <div
              style={{
                fontSize: "1.2rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.6px",
                color: "var(--color-grey-400)",
              }}
            >
              Settings
            </div>
          </SidebarTop>

          {NAV.map((n) => (
            <NavItem
              key={n.id}
              $active={active === n.id}
              onClick={() => setActive(n.id)}
            >
              {n.icon}
              {n.label}
            </NavItem>
          ))}
        </Sidebar>

        <Content>
          {active === "company" && <CompanySection />}
          {active === "preferences" && <PreferencesSection />}
          {active === "notifications" && <NotificationsSection />}
        </Content>
      </PageInner>
    </Page>
  );
}

export default Settings;
