import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  HiOutlineArrowLeft,
  HiOutlinePlus,
  HiOutlineTrash,
} from "react-icons/hi2";
import Heading from "../UI/Heading";
import Row from "../UI/Row";
import Button from "../UI/Button";
import Input from "../UI/Input";
import Select from "../UI/Select";
import Textarea from "../UI/Textarea";

// Styled Components
const FormLayout = styled.div`
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

const Card = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--color-grey-900);
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--color-grey-200);
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.6rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const FormLabel = styled.label`
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--color-grey-700);
`;

const ItemsSection = styled.div`
  margin-top: 2.4rem;
  padding-top: 2.4rem;
  border-top: 2px solid var(--color-grey-200);
`;

const ItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  margin-bottom: 1.6rem;
`;

const ItemRow = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr 1fr 1fr 0.2fr;
  gap: 1.2rem;
  padding: 1.6rem;
  background-color: var(--color-grey-50);
  border-radius: var(--border-radius-sm);
  align-items: flex-end;
`;

const ItemTotal = styled.div`
  padding: 0.8rem;
  background-color: var(--color-brand-50);
  border-radius: var(--border-radius-sm);
  font-weight: 600;
  color: var(--color-brand-600);
  text-align: center;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: var(--color-red-700);
  cursor: pointer;
  padding: 0.8rem;
  transition: all 0.2s;

  &:hover {
    color: var(--color-red-800);
    transform: scale(1.1);
  }

  & svg {
    width: 1.8rem;
    height: 1.8rem;
  }
`;

const AddItemButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 1.6rem;
  background-color: var(--color-brand-50);
  border: 2px dashed var(--color-brand-600);
  color: var(--color-brand-600);
  border-radius: var(--border-radius-sm);
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-brand-100);
  }

  & svg {
    width: 1.8rem;
    height: 1.8rem;
  }
`;

const SummaryBox = styled.div`
  background-color: var(--color-blue-50);
  border: 2px solid var(--color-blue-200);
  border-radius: var(--border-radius-md);
  padding: 2rem;
  margin-top: 2rem;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 0;
  font-size: 1.4rem;
  color: var(--color-grey-700);

  &.total {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--color-brand-600);
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 2px solid var(--color-blue-200);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1.2rem;
  justify-content: flex-end;
  margin-top: 2.4rem;
`;

// Mock product data
const mockProducts = [
  { id: "1", name: "Full Cream Milk (1L)", price: 15 },
  { id: "2", name: "Greek Yogurt (500g)", price: 8 },
  { id: "3", name: "Cheddar Cheese (200g)", price: 18 },
  { id: "4", name: "Butter (250g)", price: 12 },
  { id: "5", name: "Skimmed Milk (1L)", price: 13 },
];

// Mock client data
const mockClients = [
  { id: "1", name: "Carrefour Lac 2", email: "carrefour.lac2@email.com" },
  { id: "2", name: "Monoprix Menzah", email: "monoprix.menzah@email.com" },
  { id: "3", name: "Magasin Général Marsa", email: "general.marsa@email.com" },
  { id: "4", name: "Superette Ariana", email: "superette.ariana@email.com" },
  { id: "5", name: "Café des Arts", email: "cafe.arts@email.com" },
];

type InvoiceItem = {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
};

function InvoiceForm() {
  const navigate = useNavigate();
  const [clientId, setClientId] = useState("");
  const [issueDate, setIssueDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [dueDate, setDueDate] = useState("");
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [currentProduct, setCurrentProduct] = useState("");
  const [currentQuantity, setCurrentQuantity] = useState("1");
  const [notes, setNotes] = useState("");

  // Calculate totals
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  const tax = subtotal * 0.18; // 18% TVA
  const total = subtotal + tax;

  const handleAddItem = () => {
    if (!currentProduct || !currentQuantity) {
      alert("Please select a product and enter quantity");
      return;
    }

    const product = mockProducts.find((p) => p.id === currentProduct);
    if (!product) return;

    const newItem: InvoiceItem = {
      id: `${Date.now()}`,
      productId: product.id,
      productName: product.name,
      quantity: parseInt(currentQuantity),
      price: product.price,
    };

    setItems([...items, newItem]);
    setCurrentProduct("");
    setCurrentQuantity("1");
  };

  const handleRemoveItem = (itemId: string) => {
    setItems(items.filter((item) => item.id !== itemId));
  };

  const handleGenerateInvoice = () => {
    if (!clientId) {
      alert("Please select a client");
      return;
    }

    if (items.length === 0) {
      alert("Please add at least one item");
      return;
    }

    if (!dueDate) {
      alert("Please set a due date");
      return;
    }

    const invoiceData = {
      client: mockClients.find((c) => c.id === clientId),
      issueDate,
      dueDate,
      items,
      subtotal,
      tax,
      total,
      notes,
    };

    console.log("Generated invoice:", invoiceData);
    alert(
      `✅ Invoice generated!\n\nTotal: ${total.toFixed(
        2
      )} TND\n\nRedirecting to invoice details...`
    );

    // Redirect to invoices list
    navigate("/invoices");
  };

  const productOptions = mockProducts.map((p) => ({
    value: p.id,
    label: `${p.name} (${p.price} TND)`,
  }));

  const clientOptions = mockClients.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  return (
    <FormLayout>
      {/* Back Button */}
      <BackButton onClick={() => navigate("/invoices")}>
        <HiOutlineArrowLeft />
        Back to Invoices
      </BackButton>

      {/* Header */}
      <Row type="horizontal">
        <Heading as="h1">Generate New Invoice</Heading>
      </Row>

      {/* Invoice Details Card */}
      <Card>
        <SectionTitle>Invoice Information</SectionTitle>
        <FormGrid>
          <FormGroup>
            <FormLabel>Select Client *</FormLabel>
            <Select
              options={[
                { value: "", label: "Choose a client..." },
                ...clientOptions,
              ]}
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <FormLabel>Order ID (Optional)</FormLabel>
            <Input type="text" placeholder="e.g., ORD-001" />
          </FormGroup>
          <FormGroup>
            <FormLabel>Issue Date *</FormLabel>
            <Input
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <FormLabel>Due Date *</FormLabel>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </FormGroup>
        </FormGrid>
      </Card>

      {/* Items Card */}
      <Card>
        <SectionTitle>Invoice Items</SectionTitle>

        {/* Add Item Section */}
        <div style={{ marginBottom: "2rem" }}>
          <FormGrid>
            <FormGroup>
              <FormLabel>Select Product</FormLabel>
              <Select
                options={[
                  { value: "", label: "Choose a product..." },
                  ...productOptions,
                ]}
                value={currentProduct}
                onChange={(e) => setCurrentProduct(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Quantity</FormLabel>
              <Input
                type="number"
                value={currentQuantity}
                onChange={(e) => setCurrentQuantity(e.target.value)}
                min="1"
                placeholder="1"
              />
            </FormGroup>
          </FormGrid>
          <AddItemButton onClick={handleAddItem}>
            <HiOutlinePlus />
            Add Item
          </AddItemButton>
        </div>

        {/* Items List */}
        {items.length > 0 && (
          <ItemsContainer>
            {items.map((item) => (
              <ItemRow key={item.id}>
                <Input
                  type="text"
                  value={item.productName}
                  disabled
                  style={{ cursor: "not-allowed" }}
                />
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => {
                    const updated = items.map((it) =>
                      it.id === item.id
                        ? { ...it, quantity: parseInt(e.target.value) || 0 }
                        : it
                    );
                    setItems(updated);
                  }}
                  min="1"
                />
                <Input
                  type="text"
                  value={`${item.price} TND`}
                  disabled
                  style={{ cursor: "not-allowed" }}
                />
                <ItemTotal>
                  {(item.quantity * item.price).toFixed(2)} TND
                </ItemTotal>
                <DeleteButton onClick={() => handleRemoveItem(item.id)}>
                  <HiOutlineTrash />
                </DeleteButton>
              </ItemRow>
            ))}
          </ItemsContainer>
        )}

        {/* Summary */}
        <SummaryBox>
          <SummaryRow>
            <span>Subtotal:</span>
            <span>{subtotal.toFixed(2)} TND</span>
          </SummaryRow>
          <SummaryRow>
            <span>Tax (18% TVA):</span>
            <span>{tax.toFixed(2)} TND</span>
          </SummaryRow>
          <SummaryRow className="total">
            <span>Total:</span>
            <span>{total.toFixed(2)} TND</span>
          </SummaryRow>
        </SummaryBox>
      </Card>

      {/* Notes Card */}
      <Card>
        <SectionTitle>Additional Information</SectionTitle>
        <FormGroup>
          <FormLabel>Notes (Optional)</FormLabel>
          <Textarea
            placeholder="Add any additional notes or terms for this invoice..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </FormGroup>
      </Card>

      {/* Action Buttons */}
      <ActionButtons>
        <Button
          $variation="secondary"
          $size="medium"
          onClick={() => navigate("/invoices")}
        >
          Cancel
        </Button>
        <Button
          $variation="primary"
          $size="medium"
          onClick={handleGenerateInvoice}
        >
          Generate Invoice
        </Button>
      </ActionButtons>
    </FormLayout>
  );
}

export default InvoiceForm;
