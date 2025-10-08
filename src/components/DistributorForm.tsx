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

const SectionDivider = styled.div`
  display: flex;
  align-items: center;
  gap: 1.6rem;
  margin: 2.4rem 0 1.6rem;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background-color: var(--color-grey-200);
  }

  & span {
    color: var(--color-brand-600);
    font-size: 1.4rem;
    font-weight: 600;
  }
`;

const GridRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.6rem;
`;

type DistributorFormProps = {
  distributorToEdit?: {
    id: string;
    name: string;
    phone: string;
    email: string;
    zone: string;
    vehicle: {
      type: string;
      plate: string;
      capacity: string;
    };
    status: string;
  };
  onCloseModal: () => void;
};

// Mock data
const vehicleTypes = [
  { value: "", label: "Select vehicle type..." },
  { value: "refrigerated-truck", label: "Refrigerated Truck" },
  { value: "van", label: "Van" },
  { value: "refrigerated-van", label: "Refrigerated Van" },
  { value: "pickup-truck", label: "Pickup Truck" },
  { value: "small-truck", label: "Small Truck" },
];

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

// Tunisian cities and zones
const zones = [
  { value: "", label: "Select delivery zone..." },
  { value: "tunis-center", label: "Tunis Center, Medina, Bab Bhar" },
  { value: "tunis-north", label: "Tunis North, Lac 2, Berges du Lac" },
  { value: "tunis-south", label: "Tunis South, Kram, La Goulette" },
  { value: "ariana", label: "Ariana, Menzah, Ennasr" },
  { value: "ben-arous", label: "Ben Arous, Rades, Mégrine" },
  { value: "la-marsa", label: "La Marsa, Sidi Bou Said, Gammarth" },
  { value: "bizerte", label: "Bizerte, Menzel Bourguiba" },
  { value: "nabeul", label: "Nabeul, Hammamet, Korba" },
  { value: "sousse", label: "Sousse, Monastir, Mahdia" },
  { value: "sfax", label: "Sfax and surrounding areas" },
];

function DistributorForm({
  distributorToEdit,
  onCloseModal,
}: DistributorFormProps) {
  const isEditMode = Boolean(distributorToEdit);

  // Basic Information
  const [name, setName] = useState(distributorToEdit?.name || "");
  const [phone, setPhone] = useState(distributorToEdit?.phone || "");
  const [email, setEmail] = useState(distributorToEdit?.email || "");
  const [zone, setZone] = useState(distributorToEdit?.zone || "");
  const [status, setStatus] = useState(distributorToEdit?.status || "active");

  // Vehicle Information
  const [vehicleType, setVehicleType] = useState(
    distributorToEdit?.vehicle?.type || ""
  );
  const [vehiclePlate, setVehiclePlate] = useState(
    distributorToEdit?.vehicle?.plate || ""
  );
  const [vehicleCapacity, setVehicleCapacity] = useState(
    distributorToEdit?.vehicle?.capacity || ""
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const distributorData = {
      name,
      phone,
      email,
      zone,
      status,
      vehicle: {
        type: vehicleType,
        plate: vehiclePlate,
        capacity: vehicleCapacity,
      },
    };

    console.log(
      isEditMode ? "Updating distributor:" : "Creating distributor:",
      distributorData
    );
    onCloseModal();
  };

  return (
    <Form type="modal" onSubmit={handleSubmit}>
      <Heading as="h2">
        {isEditMode ? "Edit Distributor" : "Add New Distributor"}
      </Heading>

      <SectionDivider>
        <span>👤 Basic Information</span>
      </SectionDivider>

      <FormRow label="Full Name">
        <Input
          type="text"
          id="name"
          placeholder="e.g., Ahmed Mahmoudi"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </FormRow>

      <GridRow>
        <FormRow label="Phone Number">
          <Input
            type="tel"
            id="phone"
            placeholder="+216 98 123 456"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </FormRow>

        <FormRow label="Email Address">
          <Input
            type="email"
            id="email"
            placeholder="distributor@taba3ni.tn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormRow>
      </GridRow>

      <GridRow>
        <FormRow label="Assigned Delivery Zone">
          <Select
            id="zone"
            options={zones}
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            required
          />
        </FormRow>

        <FormRow label="Status">
          <Select
            id="status"
            options={statusOptions}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          />
        </FormRow>
      </GridRow>

      <SectionDivider>
        <span>🚛 Vehicle Information</span>
      </SectionDivider>

      <FormRow label="Vehicle Type">
        <Select
          id="vehicleType"
          options={vehicleTypes}
          value={vehicleType}
          onChange={(e) => setVehicleType(e.target.value)}
          required
        />
      </FormRow>

      <GridRow>
        <FormRow label="License Plate">
          <Input
            type="text"
            id="vehiclePlate"
            placeholder="e.g., 123 TU 1234"
            value={vehiclePlate}
            onChange={(e) => setVehiclePlate(e.target.value)}
            required
          />
        </FormRow>

        <FormRow label="Capacity">
          <Input
            type="text"
            id="vehicleCapacity"
            placeholder="e.g., 2 tons"
            value={vehicleCapacity}
            onChange={(e) => setVehicleCapacity(e.target.value)}
            required
          />
        </FormRow>
      </GridRow>

      <div
        style={{
          backgroundColor: "var(--color-blue-50)",
          padding: "1.6rem",
          borderRadius: "var(--border-radius-md)",
          marginTop: "1.6rem",
        }}
      >
        <p
          style={{
            fontSize: "1.3rem",
            color: "var(--color-blue-700)",
            margin: 0,
          }}
        >
          💡 <strong>Note:</strong> New distributors will need to complete
          onboarding training before receiving delivery assignments.
        </p>
      </div>

      <ButtonGroup>
        <Button type="button" $variation="secondary" onClick={onCloseModal}>
          Cancel
        </Button>
        <Button type="submit">
          {isEditMode ? "Update Distributor" : "Add Distributor"}
        </Button>
      </ButtonGroup>
    </Form>
  );
}

export default DistributorForm;
