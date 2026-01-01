import { useState } from "react";
import styled from "styled-components";
import {
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineCurrencyDollar,
  HiOutlineCheckCircle,
  HiOutlineArrowLeft,
  HiOutlineArrowRight,
} from "react-icons/hi2";
import Form from "../UI/Form";
import FormRow from "../UI/FormRow";
import Input from "../UI/Input";
import Textarea from "../UI/Textarea";
import Button from "../UI/Button";
import ButtonGroup from "../UI/ButtonGroup";
import Heading from "../UI/Heading";
import Select from "../UI/Select";

// Styled Components
const WizardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 0;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 3px;
    background-color: var(--color-grey-200);
    transform: translateY(-50%);
    z-index: 0;
  }

  @media (max-width: 768px) {
    padding: 1.6rem 0;
  }
`;

const ProgressLine = styled.div<{ $progress: number }>`
  position: absolute;
  top: 50%;
  left: 0;
  height: 3px;
  background: linear-gradient(
    90deg,
    var(--color-brand-600),
    var(--color-brand-500)
  );
  transform: translateY(-50%);
  width: ${(props) => props.$progress}%;
  transition: width 0.3s ease;
  z-index: 1;
`;

const Step = styled.div<{ $active: boolean; $completed: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  z-index: 2;
  position: relative;
  cursor: ${(props) => (props.$completed ? "pointer" : "default")};
  transition: all 0.2s;

  &:hover {
    transform: ${(props) => (props.$completed ? "translateY(-2px)" : "none")};
  }

  @media (max-width: 768px) {
    flex: 1;
  }
`;

const StepCircle = styled.div<{ $active: boolean; $completed: boolean }>`
  width: 4.8rem;
  height: 4.8rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) =>
    props.$completed
      ? "var(--color-green-600)"
      : props.$active
      ? "var(--color-brand-600)"
      : "var(--color-grey-0)"};
  border: 3px solid
    ${(props) =>
      props.$completed
        ? "var(--color-green-600)"
        : props.$active
        ? "var(--color-brand-600)"
        : "var(--color-grey-300)"};
  color: ${(props) =>
    props.$completed || props.$active
      ? "var(--color-grey-0)"
      : "var(--color-grey-500)"};
  font-weight: 700;
  font-size: 1.8rem;
  transition: all 0.3s;
  box-shadow: ${(props) =>
    props.$active ? "0 4px 12px rgba(0, 0, 0, 0.15)" : "none"};

  & svg {
    width: 2.4rem;
    height: 2.4rem;
  }

  @media (max-width: 768px) {
    width: 4rem;
    height: 4rem;
    font-size: 1.6rem;

    & svg {
      width: 2rem;
      height: 2rem;
    }
  }
`;

const StepLabel = styled.span<{ $active: boolean; $completed: boolean }>`
  font-size: 1.3rem;
  font-weight: ${(props) => (props.$active ? 700 : 600)};
  color: ${(props) =>
    props.$completed
      ? "var(--color-green-700)"
      : props.$active
      ? "var(--color-brand-600)"
      : "var(--color-grey-500)"};
  text-align: center;
  transition: all 0.2s;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const StepContent = styled.div`
  animation: fadeIn 0.3s ease-in;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.4rem;
  margin: 2.4rem 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.6rem;
  }
`;

const FullWidth = styled.div`
  grid-column: 1 / -1;
`;

const InfoBox = styled.div<{ $variant?: "info" | "warning" | "success" }>`
  grid-column: 1 / -1;
  padding: 1.6rem;
  background-color: ${(props) => {
    if (props.$variant === "warning") return "var(--color-yellow-100)";
    if (props.$variant === "success") return "var(--color-green-100)";
    return "var(--color-blue-100)";
  }};
  border-radius: var(--border-radius-sm);
  border-left: 4px solid
    ${(props) => {
      if (props.$variant === "warning") return "var(--color-yellow-600)";
      if (props.$variant === "success") return "var(--color-green-600)";
      return "var(--color-blue-600)";
    }};

  & p {
    font-size: 1.3rem;
    color: ${(props) => {
      if (props.$variant === "warning") return "var(--color-yellow-700)";
      if (props.$variant === "success") return "var(--color-green-700)";
      return "var(--color-blue-700)";
    }};
    margin-bottom: 0;
    line-height: 1.6;
  }
`;

const SummarySection = styled.div`
  margin: 2.4rem 0;
`;

const SummaryCard = styled.div`
  background-color: var(--color-grey-50);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-md);
  padding: 2rem;
  margin-bottom: 1.6rem;
`;

const SummaryHeader = styled.h3`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-900);
  margin-bottom: 1.6rem;
  padding-bottom: 1.2rem;
  border-bottom: 2px solid var(--color-grey-300);
  display: flex;
  align-items: center;
  gap: 1rem;

  & svg {
    width: 2rem;
    height: 2rem;
    color: var(--color-brand-600);
  }
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.8rem 0;
  border-bottom: 1px solid var(--color-grey-200);

  &:last-child {
    border-bottom: none;
  }
`;

const SummaryLabel = styled.span`
  font-size: 1.3rem;
  color: var(--color-grey-600);
  font-weight: 500;
`;

const SummaryValue = styled.span`
  font-size: 1.4rem;
  color: var(--color-grey-900);
  font-weight: 600;
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1.2rem;
  margin-top: 3.2rem;
  padding-top: 2.4rem;
  border-top: 2px solid var(--color-grey-200);

  @media (max-width: 768px) {
    flex-direction: column-reverse;
  }
`;

const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.4rem;

  & svg {
    width: 2rem;
    height: 2rem;
  }
`;

const ErrorMessage = styled.p`
  color: var(--color-red-700);
  background-color: var(--color-red-100);
  padding: 1.2rem 1.6rem;
  border-radius: var(--border-radius-sm);
  font-size: 1.3rem;
  margin: 1.6rem 0;
  border-left: 4px solid var(--color-red-600);
`;

// Types
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

// Options
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
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<string[]>([]);

  // Step 1: Basic Information
  const [name, setName] = useState(clientToEdit?.name || "");
  const [type, setType] = useState(clientToEdit?.type || "");
  const [status, setStatus] = useState(clientToEdit?.status || "pending");
  const [contactPerson, setContactPerson] = useState(
    clientToEdit?.contactPerson || ""
  );

  // Step 2: Contact Information
  const [phone, setPhone] = useState(clientToEdit?.phone || "");
  const [email, setEmail] = useState(clientToEdit?.email || "");
  const [address, setAddress] = useState(clientToEdit?.address || "");
  const [city, setCity] = useState(clientToEdit?.city || "");

  // Step 3: Financial Information
  const [creditLimit, setCreditLimit] = useState(
    clientToEdit?.creditLimit?.toString() || "10000"
  );
  const [paymentTerms, setPaymentTerms] = useState(
    clientToEdit?.paymentTerms || ""
  );
  const [taxId, setTaxId] = useState(clientToEdit?.taxId || "");

  const steps = [
    { number: 1, label: "Basic Info", icon: <HiOutlineUser /> },
    { number: 2, label: "Contact", icon: <HiOutlinePhone /> },
    { number: 3, label: "Financial", icon: <HiOutlineCurrencyDollar /> },
    { number: 4, label: "Review", icon: <HiOutlineCheckCircle /> },
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: string[] = [];

    switch (step) {
      case 1:
        if (!name.trim()) newErrors.push("Business name is required");
        if (!type) newErrors.push("Client type is required");
        if (!contactPerson.trim()) newErrors.push("Contact person is required");
        break;
      case 2:
        if (!phone.trim()) newErrors.push("Phone number is required");
        if (!email.trim()) newErrors.push("Email address is required");
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          newErrors.push("Please enter a valid email address");
        }
        if (!city) newErrors.push("City is required");
        if (!address.trim()) newErrors.push("Address is required");
        break;
      case 3:
        if (!creditLimit || parseFloat(creditLimit) <= 0) {
          newErrors.push("Credit limit must be greater than 0");
        }
        if (!paymentTerms) newErrors.push("Payment terms are required");
        break;
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
      setErrors([]);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setErrors([]);
  };

  const handleStepClick = (stepNumber: number) => {
    if (stepNumber < currentStep) {
      setCurrentStep(stepNumber);
      setErrors([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(3)) return;

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

  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <Form type="modal" onSubmit={handleSubmit}>
      <WizardContainer>
        <Heading as="h2">
          {isEditMode ? `Edit Client: ${clientToEdit.name}` : "Add New Client"}
        </Heading>

        {/* Step Indicator */}
        <StepIndicator>
          <ProgressLine $progress={progress} />
          {steps.map((step) => (
            <Step
              key={step.number}
              $active={currentStep === step.number}
              $completed={currentStep > step.number}
              onClick={() => handleStepClick(step.number)}
            >
              <StepCircle
                $active={currentStep === step.number}
                $completed={currentStep > step.number}
              >
                {currentStep > step.number ? (
                  <HiOutlineCheckCircle />
                ) : (
                  step.icon
                )}
              </StepCircle>
              <StepLabel
                $active={currentStep === step.number}
                $completed={currentStep > step.number}
              >
                {step.label}
              </StepLabel>
            </Step>
          ))}
        </StepIndicator>

        {/* Error Messages */}
        {errors.length > 0 && (
          <ErrorMessage>
            <strong>⚠️ Please fix the following errors:</strong>
            <ul style={{ marginTop: "0.8rem", paddingLeft: "2rem" }}>
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </ErrorMessage>
        )}

        {/* Step Content */}
        <StepContent>
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <>
              <InfoBox>
                <p>
                  <strong>📋 Step 1 of 4:</strong> Let's start with the basic
                  information about your client. This helps us identify and
                  categorize them in the system.
                </p>
              </InfoBox>

              <FormGrid>
                <FullWidth>
                  <FormRow label="Business Name *">
                    <Input
                      type="text"
                      id="name"
                      placeholder="e.g., Carrefour Lac 2"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoFocus
                    />
                  </FormRow>
                </FullWidth>

                <FormRow label="Client Type *">
                  <Select
                    id="type"
                    options={clientTypeOptions}
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  />
                </FormRow>

                <FormRow label="Status *">
                  <Select
                    id="status"
                    options={statusOptions}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  />
                </FormRow>

                <FullWidth>
                  <FormRow label="Contact Person *">
                    <Input
                      type="text"
                      id="contactPerson"
                      placeholder="e.g., Ahmed Ben Ali"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                    />
                  </FormRow>
                </FullWidth>
              </FormGrid>

              {!isEditMode && status === "pending" && (
                <InfoBox $variant="info">
                  <p>
                    ℹ️ New clients start with <strong>"Pending"</strong> status
                    and require approval before they can place orders.
                  </p>
                </InfoBox>
              )}
            </>
          )}

          {/* Step 2: Contact Information */}
          {currentStep === 2 && (
            <>
              <InfoBox>
                <p>
                  <strong>📞 Step 2 of 4:</strong> Provide contact details so we
                  can reach your client for orders, deliveries, and important
                  updates.
                </p>
              </InfoBox>

              <FormGrid>
                <FormRow label="Phone Number *">
                  <Input
                    type="tel"
                    id="phone"
                    placeholder="+216 71 123 456"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoFocus
                  />
                </FormRow>

                <FormRow label="Email Address *">
                  <Input
                    type="email"
                    id="email"
                    placeholder="client@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormRow>

                <FormRow label="City *">
                  <Select
                    id="city"
                    options={tunisianCities}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </FormRow>

                <FullWidth>
                  <FormRow label="Full Address *">
                    <Textarea
                      id="address"
                      placeholder="Street address, building number, floor..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={3}
                    />
                  </FormRow>
                </FullWidth>
              </FormGrid>
            </>
          )}

          {/* Step 3: Financial Information */}
          {currentStep === 3 && (
            <>
              <InfoBox>
                <p>
                  <strong>💰 Step 3 of 4:</strong> Set up financial terms
                  including credit limits and payment conditions. These help
                  manage transactions and prevent overdue payments.
                </p>
              </InfoBox>

              <FormGrid>
                <FormRow label="Credit Limit (TND) *">
                  <Input
                    type="number"
                    id="creditLimit"
                    placeholder="10000"
                    min="0"
                    step="100"
                    value={creditLimit}
                    onChange={(e) => setCreditLimit(e.target.value)}
                    autoFocus
                  />
                </FormRow>

                <FormRow label="Payment Terms *">
                  <Select
                    id="paymentTerms"
                    options={paymentTermsOptions}
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
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

              {parseFloat(creditLimit) > 50000 && (
                <InfoBox $variant="warning">
                  <p>
                    ⚠️ <strong>High Credit Limit:</strong> This client will have
                    a credit limit above 50,000 TND. Please ensure this is
                    approved by management before proceeding.
                  </p>
                </InfoBox>
              )}

              {paymentTerms === "Cash" && (
                <InfoBox $variant="info">
                  <p>
                    💵 <strong>Cash Payment:</strong> Client must pay upon
                    delivery. No credit terms will apply.
                  </p>
                </InfoBox>
              )}
            </>
          )}

          {/* Step 4: Review & Submit */}
          {currentStep === 4 && (
            <>
              <InfoBox $variant="success">
                <p>
                  <strong>✅ Step 4 of 4:</strong> Review all information before
                  submitting. You can go back to edit any section by clicking on
                  the step indicators above.
                </p>
              </InfoBox>

              <SummarySection>
                <SummaryCard>
                  <SummaryHeader>
                    <HiOutlineUser />
                    Basic Information
                  </SummaryHeader>
                  <SummaryRow>
                    <SummaryLabel>Business Name:</SummaryLabel>
                    <SummaryValue>{name}</SummaryValue>
                  </SummaryRow>
                  <SummaryRow>
                    <SummaryLabel>Client Type:</SummaryLabel>
                    <SummaryValue style={{ textTransform: "capitalize" }}>
                      {type}
                    </SummaryValue>
                  </SummaryRow>
                  <SummaryRow>
                    <SummaryLabel>Status:</SummaryLabel>
                    <SummaryValue style={{ textTransform: "capitalize" }}>
                      {status}
                    </SummaryValue>
                  </SummaryRow>
                  <SummaryRow>
                    <SummaryLabel>Contact Person:</SummaryLabel>
                    <SummaryValue>{contactPerson}</SummaryValue>
                  </SummaryRow>
                </SummaryCard>

                <SummaryCard>
                  <SummaryHeader>
                    <HiOutlinePhone />
                    Contact Information
                  </SummaryHeader>
                  <SummaryRow>
                    <SummaryLabel>Phone:</SummaryLabel>
                    <SummaryValue>{phone}</SummaryValue>
                  </SummaryRow>
                  <SummaryRow>
                    <SummaryLabel>Email:</SummaryLabel>
                    <SummaryValue>{email}</SummaryValue>
                  </SummaryRow>
                  <SummaryRow>
                    <SummaryLabel>City:</SummaryLabel>
                    <SummaryValue>{city}</SummaryValue>
                  </SummaryRow>
                  <SummaryRow>
                    <SummaryLabel>Address:</SummaryLabel>
                    <SummaryValue>{address}</SummaryValue>
                  </SummaryRow>
                </SummaryCard>

                <SummaryCard>
                  <SummaryHeader>
                    <HiOutlineCurrencyDollar />
                    Financial Information
                  </SummaryHeader>
                  <SummaryRow>
                    <SummaryLabel>Credit Limit:</SummaryLabel>
                    <SummaryValue>
                      {parseFloat(creditLimit).toLocaleString()} TND
                    </SummaryValue>
                  </SummaryRow>
                  <SummaryRow>
                    <SummaryLabel>Payment Terms:</SummaryLabel>
                    <SummaryValue>{paymentTerms}</SummaryValue>
                  </SummaryRow>
                  <SummaryRow>
                    <SummaryLabel>Tax ID:</SummaryLabel>
                    <SummaryValue>{taxId || "Not provided"}</SummaryValue>
                  </SummaryRow>
                </SummaryCard>
              </SummarySection>
            </>
          )}
        </StepContent>

        {/* Navigation Buttons */}
        <NavigationButtons>
          <div style={{ display: "flex", gap: "1.2rem" }}>
            <StyledButton
              type="button"
              $variation="secondary"
              onClick={onCloseModal}
            >
              Cancel
            </StyledButton>
            {currentStep > 1 && (
              <StyledButton
                type="button"
                $variation="secondary"
                onClick={handleBack}
              >
                <HiOutlineArrowLeft />
                Back
              </StyledButton>
            )}
          </div>

          {currentStep < 4 ? (
            <StyledButton type="button" onClick={handleNext}>
              Next
              <HiOutlineArrowRight />
            </StyledButton>
          ) : (
            <StyledButton type="submit">
              <HiOutlineCheckCircle />
              {isEditMode ? "Update Client" : "Create Client"}
            </StyledButton>
          )}
        </NavigationButtons>
      </WizardContainer>
    </Form>
  );
}

export default ClientForm;
