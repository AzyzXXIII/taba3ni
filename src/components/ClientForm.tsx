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

/* =======================
   Styled Components
======================= */

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

  & p {
    font-size: 1.3rem;
    color: var(--color-blue-700);
    margin: 0;
  }
`;

/* =======================
   Types
======================= */

export type ClientType =
  | "supermarket"
  | "grocery"
  | "restaurant"
  | "cafe"
  | "other";

export type ClientStatus = "active" | "inactive" | "pending";

export type Client = {
  id: string;
  name: string;
  type: ClientType;
  status: ClientStatus;
  phone: string;
  email: string;
  address: string;
  city: string;
  creditLimit: number;
  contactPerson: string;
  taxId?: string;
  paymentTerms: string;
};

type ClientFormProps = {
  clientToEdit?: Client;
  onCloseModal: () => void;
};

/* =======================
   Select Options
======================= */

const clientTypeOptions = [
  { value: "", label: "Select client type..." },
  { value: "supermarket", label: "Supermarket" },
  { value: "grocery", label: "Grocery Store" },
  { value: "restaurant", label: "Restaurant" },
  { value: "cafe", label: "Café" },
  { value: "other", label: "Other" },
];

const statusOptions = [
  { value: "pending", label: "Pending" },
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
  { value: "Sfax", label: "Sfax" },
  { value: "Sousse", label: "Sousse" },
  { value: "Bizerte", label: "Bizerte" },
  { value: "Gabes", label: "Gabès" },
];

/* =======================
   Component
======================= */

function ClientForm({ clientToEdit, onCloseModal }: ClientFormProps) {
  const isEditMode = Boolean(clientToEdit);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: clientToEdit?.name ?? "",
    type: clientToEdit?.type ?? "",
    status: clientToEdit?.status ?? "pending",
    contactPerson: clientToEdit?.contactPerson ?? "",
    phone: clientToEdit?.phone ?? "",
    email: clientToEdit?.email ?? "",
    address: clientToEdit?.address ?? "",
    city: clientToEdit?.city ?? "",
    creditLimit: clientToEdit?.creditLimit?.toString() ?? "10000",
    paymentTerms: clientToEdit?.paymentTerms ?? "",
    taxId: clientToEdit?.taxId ?? "",
  });

  const handleChange =
    (field: keyof typeof formData) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const validate = () => {
    if (
      !formData.name ||
      !formData.type ||
      !formData.phone ||
      !formData.email ||
      !formData.address ||
      !formData.city ||
      !formData.contactPerson ||
      !formData.paymentTerms
    ) {
      alert("Please fill in all required fields");
      return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      alert("Invalid email format");
      return false;
    }

    if (Number(formData.creditLimit) <= 0) {
      alert("Credit limit must be greater than 0");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const payload = {
      ...formData,
      creditLimit: Number(formData.creditLimit),
    };

    console.log(isEditMode ? "Updating client:" : "Creating client:", payload);

    // 🔥 TODO: call API or React Query mutation here

    setTimeout(() => {
      setIsSubmitting(false);
      onCloseModal();
    }, 500);
  };

  return (
    <Form type="modal" onSubmit={handleSubmit}>
      <Heading as="h2">{isEditMode ? "Edit Client" : "Add New Client"}</Heading>

      {!isEditMode && (
        <InfoBox>
          <p>
            📋 New clients are created with <strong>Pending</strong> status.
          </p>
        </InfoBox>
      )}

      <FormGrid>
        <SectionTitle>Basic Information</SectionTitle>

        <FullWidth>
          <FormRow label="Business Name *">
            <Input value={formData.name} onChange={handleChange("name")} />
          </FormRow>
        </FullWidth>

        <FormRow label="Client Type *">
          <Select
            value={formData.type}
            options={clientTypeOptions}
            onChange={handleChange("type")}
          />
        </FormRow>

        <FormRow label="Status *">
          <Select
            value={formData.status}
            options={statusOptions}
            onChange={handleChange("status")}
          />
        </FormRow>

        <FullWidth>
          <FormRow label="Contact Person *">
            <Input
              value={formData.contactPerson}
              onChange={handleChange("contactPerson")}
            />
          </FormRow>
        </FullWidth>

        <SectionTitle>Contact Information</SectionTitle>

        <FormRow label="Phone *">
          <Input value={formData.phone} onChange={handleChange("phone")} />
        </FormRow>

        <FormRow label="Email *">
          <Input
            type="email"
            value={formData.email}
            onChange={handleChange("email")}
          />
        </FormRow>

        <FormRow label="City *">
          <Select
            value={formData.city}
            options={tunisianCities}
            onChange={handleChange("city")}
          />
        </FormRow>

        <FullWidth>
          <FormRow label="Address *">
            <Textarea
              rows={2}
              value={formData.address}
              onChange={handleChange("address")}
            />
          </FormRow>
        </FullWidth>

        <SectionTitle>Financial Information</SectionTitle>

        <FormRow label="Credit Limit (TND) *">
          <Input
            type="number"
            value={formData.creditLimit}
            onChange={handleChange("creditLimit")}
          />
        </FormRow>

        <FormRow label="Payment Terms *">
          <Select
            value={formData.paymentTerms}
            options={paymentTermsOptions}
            onChange={handleChange("paymentTerms")}
          />
        </FormRow>

        <FullWidth>
          <FormRow label="Tax ID">
            <Input value={formData.taxId} onChange={handleChange("taxId")} />
          </FormRow>
        </FullWidth>
      </FormGrid>

      <ButtonGroup>
        <Button type="button" $variation="secondary" onClick={onCloseModal}>
          Cancel
        </Button>
        <Button disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : isEditMode
            ? "Update Client"
            : "Add Client"}
        </Button>
      </ButtonGroup>
    </Form>
  );
}

export default ClientForm;
