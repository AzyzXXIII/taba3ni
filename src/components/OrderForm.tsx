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
import { useNotifications } from "../hooks/useNotifications";

const ProductRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr auto;
  gap: 1.2rem;
  align-items: center;
  padding: 1.2rem;
  background-color: var(--color-grey-50);
  border-radius: var(--border-radius-sm);
  margin-bottom: 1.2rem;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: var(--color-red-700);
  cursor: pointer;
  font-size: 2rem;
  padding: 0.4rem;

  &:hover {
    color: var(--color-red-800);
  }
`;

const AddProductButton = styled.button`
  width: 100%;
  padding: 1.2rem;
  border: 2px dashed var(--color-grey-300);
  background: none;
  border-radius: var(--border-radius-sm);
  color: var(--color-brand-600);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: var(--color-brand-600);
    background-color: var(--color-brand-50);
  }
`;

const SummaryCard = styled.div`
  background-color: var(--color-brand-50);
  padding: 2.4rem;
  border-radius: var(--border-radius-md);
  margin-top: 2.4rem;
`;

const SummaryRow = styled.div<{ $isTotal?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 0;
  font-size: ${(props) => (props.$isTotal ? "2rem" : "1.6rem")};
  font-weight: ${(props) => (props.$isTotal ? "700" : "500")};
  color: ${(props) =>
    props.$isTotal ? "var(--color-brand-600)" : "var(--color-grey-700)"};
  border-bottom: ${(props) =>
    props.$isTotal
      ? "2px solid var(--color-brand-600)"
      : "1px solid var(--color-grey-200)"};

  &:last-child {
    border-bottom: none;
  }
`;

const InfoBox = styled.div`
  padding: 1.6rem;
  background-color: var(--color-blue-100);
  border-radius: var(--border-radius-sm);
  margin-bottom: 2.4rem;

  & p {
    font-size: 1.3rem;
    color: var(--color-blue-700);
    margin-bottom: 0;
  }

  & strong {
    font-weight: 600;
  }
`;

type Product = {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
};

type OrderFormProps = {
  orderToEdit?: {
    id: string;
    orderNumber: string;
    client: string;
    deliveryDate: string;
    products: Product[];
    notes?: string;
  };
  onCloseModal: () => void;
  userRole?: "admin" | "client";
  clientId?: string;
  clientName?: string;
};

// Mock data
const mockClients = [
  { value: "", label: "Select a client..." },
  { value: "1", label: "Carrefour Lac 2" },
  { value: "2", label: "Monoprix Menzah" },
  { value: "3", label: "Magasin Général Marsa" },
  { value: "4", label: "Superette Ariana" },
];

const mockProductsData = [
  { id: "1", name: "Full Cream Milk (1L)", price: 15, stock: 250 },
  { id: "2", name: "Greek Yogurt (500g)", price: 8, stock: 120 },
  { id: "3", name: "Butter (250g)", price: 12, stock: 80 },
  { id: "4", name: "Cheese (200g)", price: 18, stock: 15 },
  { id: "5", name: "Skimmed Milk (1L)", price: 13, stock: 180 },
];

const mockProducts = [
  { value: "", label: "Select a product..." },
  ...mockProductsData.map((p) => ({
    value: p.id,
    label: `${p.name} - ${p.price} TND (Stock: ${p.stock})`,
  })),
];

const TAX_RATE = 0.19;

function OrderForm({
  orderToEdit,
  onCloseModal,
  userRole = "admin",
  clientId,
  clientName,
}: OrderFormProps) {
  const isEditMode = Boolean(orderToEdit);
  const isClientMode = userRole === "client";
  const { addNotification } = useNotifications();

  const [client, setClient] = useState(orderToEdit?.client || clientId || "");
  const [deliveryDate, setDeliveryDate] = useState(
    orderToEdit?.deliveryDate?.split(" ")[0] || ""
  );
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [notes, setNotes] = useState(orderToEdit?.notes || "");
  const [products, setProducts] = useState<Product[]>(
    orderToEdit?.products || [
      {
        id: Date.now().toString(),
        productId: "",
        name: "",
        quantity: 1,
        price: 0,
      },
    ]
  );

  const handleAddProduct = () => {
    setProducts([
      ...products,
      {
        id: Date.now().toString(),
        productId: "",
        name: "",
        quantity: 1,
        price: 0,
      },
    ]);
  };

  const handleRemoveProduct = (id: string) => {
    if (products.length === 1) return;
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleProductSelect = (id: string, productId: string) => {
    const selectedProduct = mockProductsData.find((p) => p.id === productId);
    if (selectedProduct) {
      setProducts(
        products.map((p) =>
          p.id === id
            ? {
                ...p,
                productId,
                name: selectedProduct.name,
                price: selectedProduct.price,
              }
            : p
        )
      );
    }
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    const productData = mockProductsData.find(
      (p) => p.id === product.productId
    );
    const maxStock = productData?.stock || 999;

    setProducts(
      products.map((p) =>
        p.id === id
          ? { ...p, quantity: Math.max(1, Math.min(quantity, maxStock)) }
          : p
      )
    );
  };

  const calculateSubtotal = () =>
    products.reduce((sum, p) => sum + p.quantity * p.price, 0);

  const calculateTax = () => calculateSubtotal() * TAX_RATE;

  const calculateTotal = () => calculateSubtotal() + calculateTax();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validProducts = products.filter((p) => p.productId && p.quantity > 0);

    if (validProducts.length === 0) {
      addNotification(
        "⚠️ No Products",
        "Please add at least one product to your order",
        "warning",
        { duration: 5000, persistent: true }
      );
      return;
    }

    if (!deliveryDate) {
      addNotification(
        "⚠️ Missing Date",
        "Please select a delivery date",
        "warning",
        { duration: 5000, persistent: true }
      );
      return;
    }

    if (isClientMode && !deliveryAddress) {
      addNotification(
        "⚠️ Missing Address",
        "Please enter a delivery address",
        "warning",
        { duration: 5000, persistent: true }
      );
      return;
    }

    const orderData = {
      client: isClientMode ? clientId : client,
      deliveryDate,
      deliveryAddress: isClientMode ? deliveryAddress : undefined,
      products: validProducts,
      notes,
      subtotal: calculateSubtotal(),
      tax: calculateTax(),
      total: calculateTotal(),
    };

    console.log(isEditMode ? "Updating order:" : "Creating order:", orderData);

    addNotification(
      "✅ Order " + (isEditMode ? "Updated" : "Placed") + " Successfully!",
      `Your order for ${calculateTotal().toFixed(2)} TND has been ${
        isEditMode ? "updated" : "submitted"
      }`,
      "success",
      { duration: 6000, persistent: true }
    );

    onCloseModal();
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  return (
    <Form type="modal" onSubmit={handleSubmit}>
      <Heading as="h2">
        {isEditMode
          ? `Edit Order ${orderToEdit?.orderNumber}`
          : isClientMode
          ? "Place New Order"
          : "Create New Order"}
      </Heading>

      {isClientMode && !isEditMode && (
        <InfoBox>
          <p>
            <strong>💡 Quick Order:</strong> Select your products and delivery
            date. We'll process your order within 24 hours.
          </p>
        </InfoBox>
      )}

      {/* Client Selection (Admin only) */}
      {!isClientMode && (
        <FormRow label="Client">
          <Select
            id="client"
            options={mockClients}
            value={client}
            onChange={(e) => setClient(e.target.value)}
            required
          />
        </FormRow>
      )}

      {/* Client Info Display (for clients) */}
      {isClientMode && clientName && (
        <FormRow label="Ordering As">
          <Input
            type="text"
            value={clientName}
            disabled
            style={{ backgroundColor: "var(--color-grey-100)" }}
          />
        </FormRow>
      )}

      <FormRow label="Delivery Date">
        <Input
          type="date"
          id="deliveryDate"
          value={deliveryDate}
          onChange={(e) => setDeliveryDate(e.target.value)}
          min={today}
          required
        />
      </FormRow>

      {/* Delivery Address (Client only) */}
      {isClientMode && (
        <FormRow label="Delivery Address">
          <Textarea
            id="deliveryAddress"
            placeholder="Enter full delivery address..."
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            rows={2}
            required
          />
        </FormRow>
      )}

      {/* Products */}
      <div style={{ padding: "1.2rem 0" }}>
        <label
          style={{ fontWeight: 500, display: "block", marginBottom: "1.2rem" }}
        >
          Products
        </label>
        {products.map((product) => (
          <ProductRow key={product.id}>
            <Select
              options={mockProducts}
              value={product.productId}
              onChange={(e) => handleProductSelect(product.id, e.target.value)}
              required
            />
            <Input
              type="number"
              placeholder="Qty"
              min="1"
              value={product.quantity}
              onChange={(e) =>
                handleQuantityChange(product.id, parseInt(e.target.value) || 1)
              }
              required
            />
            <div
              style={{
                padding: "0.8rem 1.2rem",
                background: "var(--color-grey-100)",
                borderRadius: "var(--border-radius-sm)",
                textAlign: "center",
                fontWeight: 500,
              }}
            >
              {product.price} TND
            </div>
            <div style={{ fontWeight: 600, textAlign: "right" }}>
              {(product.quantity * product.price).toFixed(2)} TND
            </div>
            {products.length > 1 && (
              <RemoveButton
                type="button"
                onClick={() => handleRemoveProduct(product.id)}
                title="Remove product"
              >
                ×
              </RemoveButton>
            )}
          </ProductRow>
        ))}
        <AddProductButton type="button" onClick={handleAddProduct}>
          + Add Product
        </AddProductButton>

        {/* Summary */}
        <SummaryCard>
          <SummaryRow>
            <span>Subtotal:</span>
            <span>{calculateSubtotal().toFixed(2)} TND</span>
          </SummaryRow>
          <SummaryRow>
            <span>Tax (19% TVA):</span>
            <span>{calculateTax().toFixed(2)} TND</span>
          </SummaryRow>
          <SummaryRow $isTotal>
            <span>Total:</span>
            <span>{calculateTotal().toFixed(2)} TND</span>
          </SummaryRow>
        </SummaryCard>
      </div>

      <FormRow label="Notes (Optional)">
        <Textarea
          id="notes"
          placeholder="Add any special instructions..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </FormRow>

      <ButtonGroup>
        <Button type="button" $variation="secondary" onClick={onCloseModal}>
          Cancel
        </Button>
        <Button type="submit">
          {isEditMode
            ? "Update Order"
            : isClientMode
            ? "Place Order"
            : "Create Order"}
        </Button>
      </ButtonGroup>
    </Form>
  );
}

export default OrderForm;
