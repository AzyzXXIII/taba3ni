import { useState } from "react";
import styled from "styled-components";
import Form from "../UI/Form";
import FormRow from "../UI/FormRow";
import Input from "../UI/Input";
import Button from "../UI/Button";
import ButtonGroup from "../UI/ButtonGroup";
import Heading from "../UI/Heading";
import Select from "../UI/Select";

const OrderSelectionCard = styled.div`
  background-color: var(--color-grey-50);
  border: 2px solid var(--color-grey-200);
  border-radius: var(--border-radius-sm);
  padding: 1.2rem;
  margin-bottom: 1.2rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: var(--color-brand-600);
    background-color: var(--color-brand-50);
  }
`;

const OrderCheckbox = styled.input`
  width: 1.8rem;
  height: 1.8rem;
  cursor: pointer;
`;

const OrderInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.2rem;
`;

const OrderDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  flex: 1;
`;

const OrderId = styled.span`
  font-weight: 600;
  color: var(--color-brand-600);
`;

const ClientName = styled.span`
  font-weight: 500;
  color: var(--color-grey-700);
`;

const OrderAmount = styled.span`
  font-weight: 600;
  color: var(--color-grey-900);
`;

const SelectedOrdersSummary = styled.div`
  background-color: var(--color-brand-50);
  padding: 1.6rem;
  border-radius: var(--border-radius-md);
  margin-top: 1.6rem;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 0;
  font-size: 1.4rem;

  &:last-child {
    border-top: 2px solid var(--color-brand-600);
    margin-top: 0.8rem;
    padding-top: 0.8rem;
    font-weight: 700;
    font-size: 1.6rem;
    color: var(--color-brand-600);
  }
`;

const RouteInfo = styled.div`
  background-color: var(--color-blue-50);
  padding: 1.6rem;
  border-radius: var(--border-radius-md);
  margin-top: 1.6rem;

  & h4 {
    font-size: 1.4rem;
    margin-bottom: 0.8rem;
    color: var(--color-blue-700);
  }

  & p {
    font-size: 1.3rem;
    color: var(--color-blue-700);
    margin: 0.4rem 0;
  }
`;

type Order = {
  id: string;
  orderNumber: string;
  client: string;
  clientAddress: string;
  amount: number;
  status: string;
};

type DeliveryFormProps = {
  deliveryToEdit?: {
    id: string;
    deliveryId: string;
    distributor: string;
    scheduledDate: string;
    scheduledTime: string;
    orders: string[];
  };
  onCloseModal: () => void;
};

// Mock data
const mockDistributors = [
  { value: "", label: "Select a distributor..." },
  { value: "1", label: "Ahmed Mahmoudi - Refrigerated Truck (123 TU 1234)" },
  { value: "2", label: "Karim Belaid - Van (456 TU 5678)" },
  { value: "3", label: "Mohamed Trabelsi - Pickup Truck (789 TU 9012)" },
  { value: "4", label: "Slim Gharbi - Refrigerated Van (321 TU 3456)" },
];

// Mock pending orders that need delivery
const mockPendingOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-001",
    client: "Carrefour Lac 2",
    clientAddress: "Avenue de la Bourse, Lac 2, Tunis",
    amount: 1250,
    status: "confirmed",
  },
  {
    id: "2",
    orderNumber: "ORD-012",
    client: "Carrefour Lac 2",
    clientAddress: "Avenue de la Bourse, Lac 2, Tunis",
    amount: 1300,
    status: "confirmed",
  },
  {
    id: "3",
    orderNumber: "ORD-015",
    client: "Monoprix Menzah",
    clientAddress: "Avenue Habib Bourguiba, Ariana",
    amount: 890,
    status: "confirmed",
  },
  {
    id: "4",
    orderNumber: "ORD-018",
    client: "Magasin Général Marsa",
    clientAddress: "Rue de la République, La Marsa",
    amount: 1500,
    status: "confirmed",
  },
  {
    id: "5",
    orderNumber: "ORD-020",
    client: "Superette Ariana",
    clientAddress: "Avenue de la Liberté, Ariana",
    amount: 450,
    status: "confirmed",
  },
];

function DeliveryForm({ deliveryToEdit, onCloseModal }: DeliveryFormProps) {
  const isEditMode = Boolean(deliveryToEdit);

  const [distributor, setDistributor] = useState(
    deliveryToEdit?.distributor || ""
  );
  const [scheduledDate, setScheduledDate] = useState(
    deliveryToEdit?.scheduledDate || ""
  );
  const [scheduledTime, setScheduledTime] = useState(
    deliveryToEdit?.scheduledTime || ""
  );
  const [selectedOrders, setSelectedOrders] = useState<string[]>(
    deliveryToEdit?.orders || []
  );

  const handleOrderToggle = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const calculateTotalAmount = () => {
    return mockPendingOrders
      .filter((order) => selectedOrders.includes(order.id))
      .reduce((sum, order) => sum + order.amount, 0);
  };

  const calculateEstimatedDistance = () => {
    // Group orders by client to avoid counting same address multiple times
    const uniqueClients = new Set(
      mockPendingOrders
        .filter((order) => selectedOrders.includes(order.id))
        .map((order) => order.client)
    );

    // Rough estimate: 5km per stop + 3km base
    return uniqueClients.size > 0 ? 3 + uniqueClients.size * 5 : 0;
  };

  const calculateEstimatedDuration = () => {
    const stops = selectedOrders.length;
    // Estimate: 20 min per stop + 15 min travel time per stop
    return stops > 0 ? stops * 35 : 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedOrders.length === 0) {
      alert("Please select at least one order for delivery");
      return;
    }

    const deliveryData = {
      distributor,
      scheduledDate,
      scheduledTime,
      selectedOrders,
      totalAmount: calculateTotalAmount(),
      estimatedDistance: calculateEstimatedDistance(),
      estimatedDuration: calculateEstimatedDuration(),
    };

    console.log(
      isEditMode ? "Updating delivery:" : "Creating delivery:",
      deliveryData
    );
    onCloseModal();
  };

  return (
    <Form type="modal" onSubmit={handleSubmit}>
      <Heading as="h2">
        {isEditMode
          ? `Edit Delivery ${deliveryToEdit?.deliveryId}`
          : "Schedule New Delivery"}
      </Heading>

      <FormRow label="Assign to Distributor">
        <Select
          id="distributor"
          options={mockDistributors}
          value={distributor}
          onChange={(e) => setDistributor(e.target.value)}
          required
        />
      </FormRow>

      <FormRow label="Scheduled Date">
        <Input
          type="date"
          id="scheduledDate"
          value={scheduledDate}
          onChange={(e) => setScheduledDate(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
          required
        />
      </FormRow>

      <FormRow label="Scheduled Time">
        <Input
          type="time"
          id="scheduledTime"
          value={scheduledTime}
          onChange={(e) => setScheduledTime(e.target.value)}
          required
        />
      </FormRow>

      {/* Select Orders */}
      <div style={{ padding: "1.2rem 0" }}>
        <label
          style={{
            fontWeight: 500,
            display: "block",
            marginBottom: "1.2rem",
            fontSize: "1.4rem",
          }}
        >
          Select Orders to Include ({selectedOrders.length} selected)
        </label>

        {mockPendingOrders.map((order) => (
          <OrderSelectionCard
            key={order.id}
            onClick={() => handleOrderToggle(order.id)}
          >
            <OrderInfo>
              <OrderCheckbox
                type="checkbox"
                checked={selectedOrders.includes(order.id)}
                onChange={() => handleOrderToggle(order.id)}
              />
              <OrderDetails>
                <OrderId>#{order.orderNumber}</OrderId>
                <div>
                  <ClientName>{order.client}</ClientName>
                  <div
                    style={{
                      fontSize: "1.2rem",
                      color: "var(--color-grey-500)",
                    }}
                  >
                    {order.clientAddress}
                  </div>
                </div>
              </OrderDetails>
              <OrderAmount>{order.amount} TND</OrderAmount>
            </OrderInfo>
          </OrderSelectionCard>
        ))}

        {selectedOrders.length > 0 && (
          <>
            <SelectedOrdersSummary>
              <SummaryRow>
                <span>Total Orders:</span>
                <span>{selectedOrders.length}</span>
              </SummaryRow>
              <SummaryRow>
                <span>Total Amount:</span>
                <span>{calculateTotalAmount().toLocaleString()} TND</span>
              </SummaryRow>
            </SelectedOrdersSummary>

            <RouteInfo>
              <h4>📍 Estimated Route Information</h4>
              <p>
                <strong>Distance:</strong> ~{calculateEstimatedDistance()} km
              </p>
              <p>
                <strong>Duration:</strong> ~{calculateEstimatedDuration()}{" "}
                minutes
              </p>
              <p>
                <strong>Stops:</strong>{" "}
                {
                  new Set(
                    mockPendingOrders
                      .filter((order) => selectedOrders.includes(order.id))
                      .map((order) => order.client)
                  ).size
                }{" "}
                locations
              </p>
            </RouteInfo>
          </>
        )}
      </div>

      <ButtonGroup>
        <Button type="button" $variation="secondary" onClick={onCloseModal}>
          Cancel
        </Button>
        <Button type="submit">
          {isEditMode ? "Update Delivery" : "Schedule Delivery"}
        </Button>
      </ButtonGroup>
    </Form>
  );
}

export default DeliveryForm;
