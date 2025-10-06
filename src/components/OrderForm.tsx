import { useState } from "react";
import styled from "styled-components";
import { HiOutlinePlus, HiOutlineTrash } from "react-icons/hi2";
import Heading from "../UI/Heading";
import Form from "../UI/Form";
import FormRow from "../UI/FormRow";
import Input from "../UI/Input";
import Select from "../UI/Select";
import Textarea from "../UI/Textarea";
import Button from "../UI/Button";
import ButtonGroup from "../UI/ButtonGroup";

// Styled Components
const FormContainer = styled.div`
  max-width: 90rem;
  margin: 0 auto;
`;

const Section = styled.div`
  margin-bottom: 3.2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--color-grey-900);
  margin-bottom: 1.6rem;
  padding-bottom: 1.2rem;
  border-bottom: 2px solid var(--color-grey-200);
`;

const ProductsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
`;

const ProductRow = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr 1fr 1fr auto;
  gap: 1.6rem;
  align-items: end;
  padding: 1.6rem;
  background-color: var(--color-grey-50);
  border-radius: var(--border-radius-md);
`;

const ProductInput = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const Label = styled.label`
  font-size: 1.4rem;
  font-weight: 500;
  color: var(--color-grey-700);
`;

const DeleteButton = styled.button`
  padding: 1rem;
  background-color: var(--color-red-100);
  border: none;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-red-700);
  }

  & svg {
    width: 2rem;
    height: 2rem;
    color: var(--color-red-700);
  }

  &:hover svg {
    color: var(--color-grey-0);
  }
`;

const AddProductButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1.2rem 2.4rem;
  background-color: var(--color-grey-0);
  border: 2px dashed var(--color-brand-600);
  color: var(--color-brand-600);
  border-radius: var(--border-radius-md);
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-brand-50);
  }

  & svg {
    width: 2rem;
    height: 2rem;
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

// Mock data
const mockClients = [
  { value: "1", label: "Carrefour Lac 2" },
  { value: "2", label: "Monoprix Menzah" },
  { value: "3", label: "Magasin Général Marsa" },
  { value: "4", label: "Superette Ariana" },
];

const mockProducts = [
  { value: "1", label: "Full Cream Milk (1L)", price: 15 },
  { value: "2", label: "Greek Yogurt (500g)", price: 8 },
  { value: "3", label: "Cheddar Cheese (200g)", price: 20 },
  { value: "4", label: "Butter (250g)", price: 12 },
  { value: "5", label: "Fresh Cream (250ml)", price: 10 },
];

type PaymentType = "cash" | "credit" | "card";

type ProductItem = {
  id: string;
  productId: string;
  quantity: number;
  price: number;
};

type OrderData = {
  clientId: string;
  deliveryDate: string;
  paymentType: PaymentType;
  notes?: string;
  products: ProductItem[];
};

type OrderFormProps = {
  onCloseModal?: () => void;
  editData?: OrderData;
};

function OrderForm({ onCloseModal, editData }: OrderFormProps) {
  const isEditMode = !!editData;

  const [formData, setFormData] = useState<OrderData>({
    clientId: editData?.clientId || "",
    deliveryDate: editData?.deliveryDate || "",
    paymentType: editData?.paymentType || "cash",
    notes: editData?.notes || "",
    products: editData?.products || [],
  });

  const [products, setProducts] = useState<ProductItem[]>(
    editData?.products || [{ id: "1", productId: "", quantity: 1, price: 0 }]
  );

  // Calculate totals
  const subtotal = products.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  const tax = subtotal * 0.19; // 19% TVA
  const total = subtotal + tax;

  const handleAddProduct = () => {
    setProducts([
      ...products,
      { id: Date.now().toString(), productId: "", quantity: 1, price: 0 },
    ]);
  };

  const handleRemoveProduct = (id: string) => {
    if (products.length > 1) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const handleProductChange = (
    id: string,
    field: keyof ProductItem,
    value: string | number
  ) => {
    setProducts(
      products.map((p) => {
        if (p.id === id) {
          if (field === "productId") {
            const selectedProduct = mockProducts.find(
              (prod) => prod.value === value
            );
            return {
              ...p,
              productId: value as string,
              price: selectedProduct?.price || 0,
            };
          }
          return { ...p, [field]: value };
        }
        return p;
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const orderData: OrderData = {
      ...formData,
      products,
    };

    console.log("Order submitted:", {
      ...orderData,
      subtotal,
      tax,
      total,
    });
    // TODO: Call API to create/update order

    if (onCloseModal) onCloseModal();
  };

  return (
    <FormContainer>
      <Heading as="h2" style={{ marginBottom: "3.2rem" }}>
        {isEditMode ? "Edit Order" : "Create New Order"}
      </Heading>

      <Form onSubmit={handleSubmit} type="modal">
        {/* Client Selection */}
        <Section>
          <SectionTitle>Client Information</SectionTitle>
          <FormRow label="Select Client">
            <Select
              id="clientId"
              options={mockClients}
              value={formData.clientId}
              onChange={(e) =>
                setFormData({ ...formData, clientId: e.target.value })
              }
              required
            />
          </FormRow>

          <FormRow label="Delivery Date">
            <Input
              type="datetime-local"
              id="deliveryDate"
              value={formData.deliveryDate}
              onChange={(e) =>
                setFormData({ ...formData, deliveryDate: e.target.value })
              }
              required
            />
          </FormRow>

          <FormRow label="Payment Type">
            <Select
              id="paymentType"
              options={[
                { value: "cash", label: "Cash" },
                { value: "credit", label: "Credit" },
                { value: "card", label: "Card" },
              ]}
              value={formData.paymentType}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  paymentType: e.target.value as PaymentType, // 👈 FIX
                })
              }
            />
          </FormRow>
        </Section>

        {/* Products */}
        <Section>
          <SectionTitle>Products</SectionTitle>
          <ProductsSection>
            {products.map((product) => (
              <ProductRow key={product.id}>
                <ProductInput>
                  <Label>Product</Label>
                  <Select
                    options={[
                      { value: "", label: "Select product..." },
                      ...mockProducts,
                    ]}
                    value={product.productId}
                    onChange={(e) =>
                      handleProductChange(
                        product.id,
                        "productId",
                        e.target.value
                      )
                    }
                    required
                  />
                </ProductInput>

                <ProductInput>
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    min="1"
                    value={product.quantity}
                    onChange={(e) =>
                      handleProductChange(
                        product.id,
                        "quantity",
                        parseInt(e.target.value) || 1
                      )
                    }
                    required
                  />
                </ProductInput>

                <ProductInput>
                  <Label>Price</Label>
                  <Input
                    type="number"
                    value={product.price}
                    readOnly
                    disabled
                  />
                </ProductInput>

                <ProductInput>
                  <Label>Total</Label>
                  <Input
                    type="number"
                    value={product.quantity * product.price}
                    readOnly
                    disabled
                  />
                </ProductInput>

                <DeleteButton
                  type="button"
                  onClick={() => handleRemoveProduct(product.id)}
                  disabled={products.length === 1}
                >
                  <HiOutlineTrash />
                </DeleteButton>
              </ProductRow>
            ))}

            <AddProductButton type="button" onClick={handleAddProduct}>
              <HiOutlinePlus />
              Add Another Product
            </AddProductButton>
          </ProductsSection>

          {/* Summary */}
          <SummaryCard>
            <SummaryRow>
              <span>Subtotal:</span>
              <span>{subtotal.toFixed(2)} TND</span>
            </SummaryRow>
            <SummaryRow>
              <span>Tax (19% TVA):</span>
              <span>{tax.toFixed(2)} TND</span>
            </SummaryRow>
            <SummaryRow $isTotal>
              <span>Total:</span>
              <span>{total.toFixed(2)} TND</span>
            </SummaryRow>
          </SummaryCard>
        </Section>

        {/* Notes */}
        <Section>
          <FormRow label="Notes (Optional)">
            <Textarea
              id="notes"
              placeholder="Add any special instructions or notes..."
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            />
          </FormRow>
        </Section>

        {/* Action Buttons */}
        <FormRow>
          <ButtonGroup>
            <Button type="button" $variation="secondary" onClick={onCloseModal}>
              Cancel
            </Button>
            <Button type="submit" $variation="primary">
              {isEditMode ? "Update Order" : "Create Order"}
            </Button>
          </ButtonGroup>
        </FormRow>
      </Form>
    </FormContainer>
  );
}

export default OrderForm;
