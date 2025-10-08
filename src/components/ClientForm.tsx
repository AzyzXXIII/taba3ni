import { useState } from "react";
import styled from "styled-components";
import Form from "../UI/Form";
import FormRow from "../UI/FormRow";
import Input from "../UI/Input";
import Textarea from "../UI/Textarea";
import Button from "../UI/Button";
import ButtonGroup from "../UI/ButtonGroup";
import Heading from "../UI/Heading";
import Select from "../UI/Select";

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.4rem;
  margin: 2.4rem 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FullWidth = styled.div`
  grid-column: 1 / -1;
`;

const SectionTitle = styled.h3`
  grid-column: 1 / -1;
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-brand-600);
  margin-top: 1.6rem;
  padding-top: 1.6rem;
  border-top: 2px solid var(--color-grey-200);
`;

const InfoBox = styled.div`
  grid-column: 1 / -1;
  padding: 1.6rem;
  background-color: var(--color-blue-100);
  border-radius: var(--border-radius-sm);
  margin-bottom: 1.6rem;

  & p {
    font-size: 1.3rem;
    color: var(--color-blue-700);
    margin-bottom: 0;
  }
`;

type ClientType = "supermarket" | "grocery" | "restaurant" | "cafe" | "other";
type ClientStatus = "active" | "inactive" | "pending";

type Client = {
  id: string;
  name: string;
  type: ClientType;
  status: ClientStatus;
  phone: string;
  email: string;
  address: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  creditLimit: number;
  balance: number;
  contactPerson: string;
  taxId?: string;
  paymentTerms: string;
};

type ClientFormProps = {
  clientToEdit?: Client;
  onCloseModal: () => void;
};

const clientTypeOptions = [
  { value: "", label: "Select client type..." },
  { value: "supermarket", label: "Supermarket" },
  { value: "grocery", label: "Grocery Store" },
  { value: "restaurant", label: "Restaurant" },
  { value: "cafe", label: "Café" },
  { value: "other", label: "Other" },
];

const statusOptions = [
  { value: "pending", label: "Pending Approval" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const paymentTermsOptions = [
  { value: "", label: "Select payment terms..." },
  { value: "Cash", label: "Cash on Delivery" },
  { value: "15 days", label: "Net 15 Days" },
  { value: "30 days", label: "Net 30 Days" },
  { value: "45 days", label: "Net 45 Days" },
  { value: "60 days", label: "Net 60 Days" },
];

const tunisianCities = [
  { value: "", label: "Select city..." },
  { value: "Tunis", label: "Tunis" },
  { value: "Ariana", label: "Ariana" },
  { value: "Ben Arous", label: "Ben Arous" },
  { value: "La Marsa", label: "La Marsa" },
  { value: "Carthage", label: "Carthage" },
  { value: "Sfax", label: "Sfax" },
  { value: "Sousse", label: "Sousse" },
  { value: "Bizerte", label: "Bizerte" },
  { value: "Gabes", label: "Gabès" },
  { value: "Kairouan", label: "Kairouan" },
];

function ClientForm({ clientToEdit, onCloseModal }: ClientFormProps) {
  const isEditMode = Boolean(clientToEdit);

  // Basic Information
  const [name, setName] = useState(clientToEdit?.name || "");
  const [type, setType] = useState(clientToEdit?.type || "");
  const [status, setStatus] = useState(clientToEdit?.status || "pending");
  const [contactPerson, setContactPerson] = useState(
    clientToEdit?.contactPerson || ""
  );

  // Contact Information
  const [phone, setPhone] = useState(clientToEdit?.phone || "");
  const [email, setEmail] = useState(clientToEdit?.email || "");
  const [address, setAddress] = useState(clientToEdit?.address || "");
  const [city, setCity] = useState(clientToEdit?.city || "");

  // Financial Information
  const [creditLimit, setCreditLimit] = useState(
    clientToEdit?.creditLimit?.toString() || "10000"
  );
  const [paymentTerms, setPaymentTerms] = useState(
    clientToEdit?.paymentTerms || ""
  );
  const [taxId, setTaxId] = useState(clientToEdit?.taxId || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !name ||
      !type ||
      !phone ||
      !email ||
      !address ||
      !city ||
      !contactPerson
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const clientData = {
      name,
      type,
      status,
      phone,
      email,
      address,
      city,
      contactPerson,
      creditLimit: parseFloat(creditLimit),
      paymentTerms,
      taxId,
    };

    console.log(
      isEditMode ? "Updating client:" : "Creating client:",
      clientData
    );

    // TODO: Call API to create/update client
    onCloseModal();
  };

  return (
    <Form type="modal" onSubmit={handleSubmit}>
      <Heading as="h2">
        {isEditMode ? `Edit Client: ${clientToEdit.name}` : "Add New Client"}
      </Heading>

      {!isEditMode && (
        <InfoBox>
          <p>
            <strong>📋 Note:</strong> New clients will be created with "Pending"
            status and require approval before they can place orders.
          </p>
        </InfoBox>
      )}

      <FormGrid>
        {/* Basic Information Section */}
        <SectionTitle>📋 Basic Information</SectionTitle>

        <FullWidth>
          <FormRow
            label="Business Name *"
            style={{ gridTemplateColumns: "18rem 1fr 1.2fr" }}
          >
            <Input
              type="text"
              id="name"
              placeholder="e.g., Carrefour Lac 2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </FormRow>
        </FullWidth>

        <FormRow
          label="Client Type *"
          style={{ gridTemplateColumns: "18rem 1fr 1.2fr" }}
        >
          <Select
            id="type"
            options={clientTypeOptions}
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          />
        </FormRow>

        <FormRow
          label="Status *"
          style={{ gridTemplateColumns: "10rem 1fr 1.2fr" }}
        >
          <Select
            id="status"
            options={statusOptions}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          />
        </FormRow>

        <FullWidth>
          <FormRow
            label="Contact Person *"
            style={{ gridTemplateColumns: "18rem 1fr 1.2fr" }}
          >
            <Input
              type="text"
              id="contactPerson"
              placeholder="e.g., Ahmed Ben Ali"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              required
            />
          </FormRow>
        </FullWidth>

        {/* Contact Information Section */}
        <SectionTitle>📞 Contact Information</SectionTitle>

        <FormRow
          label="Phone Number *"
          style={{ gridTemplateColumns: "15rem 1fr 1.2fr" }}
        >
          <Input
            type="tel"
            id="phone"
            placeholder="+216 71 123 456"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </FormRow>

        <FormRow
          label="Email Address *"
          style={{ gridTemplateColumns: "12rem 1fr 1.2fr" }}
        >
          <Input
            type="email"
            id="email"
            placeholder="client@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormRow>

        <FormRow
          label="City *"
          style={{ gridTemplateColumns: "18rem 1fr 1.2fr" }}
        >
          <Select
            id="city"
            options={tunisianCities}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </FormRow>

        <FullWidth>
          <FormRow
            label="Full Address *"
            style={{ gridTemplateColumns: "18rem 1fr 1.2fr" }}
          >
            <Textarea
              id="address"
              placeholder="Street address, building number, floor..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
              required
            />
          </FormRow>
        </FullWidth>

        {/* Financial Information Section */}
        <SectionTitle>💰 Financial Information</SectionTitle>

        <FormRow
          label="Credit Limit (TND) *"
          style={{ gridTemplateColumns: "18rem 1fr 1.2fr" }}
        >
          <Input
            type="number"
            id="creditLimit"
            placeholder="10000"
            min="0"
            step="100"
            value={creditLimit}
            onChange={(e) => setCreditLimit(e.target.value)}
            required
          />
        </FormRow>

        <FormRow
          label="Payment Terms *"
          style={{ gridTemplateColumns: "15rem 1fr 1.2fr" }}
        >
          <Select
            id="paymentTerms"
            options={paymentTermsOptions}
            value={paymentTerms}
            onChange={(e) => setPaymentTerms(e.target.value)}
            required
          />
        </FormRow>

        <FullWidth>
          <FormRow label="Tax ID / Registration Number">
            <Input
              type="text"
              id="taxId"
              placeholder="e.g., 123456789"
              value={taxId}
              onChange={(e) => setTaxId(e.target.value)}
            />
          </FormRow>
        </FullWidth>
      </FormGrid>

      {/* Credit Limit Warning */}
      {parseFloat(creditLimit) > 50000 && (
        <InfoBox style={{ backgroundColor: "var(--color-yellow-100)" }}>
          <p style={{ color: "var(--color-yellow-700)" }}>
            ⚠️ <strong>High Credit Limit:</strong> This client will have a
            credit limit above 50,000 TND. Make sure this is approved by
            management.
          </p>
        </InfoBox>
      )}

      <ButtonGroup>
        <Button type="button" $variation="secondary" onClick={onCloseModal}>
          Cancel
        </Button>
        <Button type="submit">
          {isEditMode ? "Update Client" : "Add Client"}
        </Button>
      </ButtonGroup>
    </Form>
  );
}

export default ClientForm;
