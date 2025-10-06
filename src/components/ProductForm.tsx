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
  name: string;
  category: string;
  price: number;
  stock: number;
  minStock: number;
  unit: string;
  sku: string;
  description?: string;
};

type ProductFormProps = {
  productToEdit?: Product;
  onCloseModal: () => void;
};

const categoryOptions = [
  { value: "", label: "Select a category..." },
  { value: "Milk", label: "Milk" },
  { value: "Yogurt", label: "Yogurt" },
  { value: "Cheese", label: "Cheese" },
  { value: "Dairy", label: "Dairy" },
  { value: "Butter", label: "Butter" },
  { value: "Cream", label: "Cream" },
];

const unitOptions = [
  { value: "", label: "Select a unit..." },
  { value: "1L", label: "1 Liter" },
  { value: "500ml", label: "500 Milliliters" },
  { value: "250ml", label: "250 Milliliters" },
  { value: "1kg", label: "1 Kilogram" },
  { value: "500g", label: "500 Grams" },
  { value: "250g", label: "250 Grams" },
  { value: "200g", label: "200 Grams" },
  { value: "100g", label: "100 Grams" },
  { value: "piece", label: "Piece" },
];

function ProductForm({ productToEdit, onCloseModal }: ProductFormProps) {
  const isEditMode = Boolean(productToEdit);

  const [name, setName] = useState(productToEdit?.name || "");
  const [category, setCategory] = useState(productToEdit?.category || "");
  const [price, setPrice] = useState(productToEdit?.price?.toString() || "");
  const [stock, setStock] = useState(productToEdit?.stock?.toString() || "");
  const [minStock, setMinStock] = useState(
    productToEdit?.minStock?.toString() || ""
  );
  const [unit, setUnit] = useState(productToEdit?.unit || "");
  const [sku, setSku] = useState(productToEdit?.sku || "");
  const [description, setDescription] = useState(
    productToEdit?.description || ""
  );

  // Auto-generate SKU based on category and name
  const generateSKU = () => {
    if (!category || !name) return;
    const categoryCode = category.substring(0, 3).toUpperCase();
    const randomNum = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    setSku(`${categoryCode}-${randomNum}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!name || !category || !price || !stock || !minStock || !unit || !sku) {
      alert("Please fill in all required fields");
      return;
    }

    const productData = {
      name,
      category,
      price: parseFloat(price),
      stock: parseInt(stock),
      minStock: parseInt(minStock),
      unit,
      sku,
      description,
    };

    console.log(
      isEditMode ? "Updating product:" : "Creating product:",
      productData
    );

    // TODO: Call API to create/update product
    onCloseModal();
  };

  return (
    <Form type="modal" onSubmit={handleSubmit}>
      <Heading as="h2">
        {isEditMode ? `Edit Product: ${productToEdit.name}` : "Add New Product"}
      </Heading>

      {!isEditMode && (
        <InfoBox>
          <p>
            <strong>Tip:</strong> Fill in the category and product name, then
            click "Generate SKU" to auto-create a unique SKU code.
          </p>
        </InfoBox>
      )}

      <FormGrid>
        {/* Product Name */}
        <FormRow
          label="Product Name *"
          style={{ gridTemplateColumns: "18rem 1fr 1.2fr" }}
        >
          <Input
            type="text"
            id="name"
            placeholder="e.g., Full Cream Milk"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </FormRow>

        {/* Category */}
        <FormRow
          label="Category *"
          style={{ gridTemplateColumns: "18rem 1fr 1.2fr" }}
        >
          <Select
            id="category"
            options={categoryOptions}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </FormRow>

        {/* Price */}
        <FormRow
          label="Price (TND) *"
          style={{ gridTemplateColumns: "18rem 1fr 1.2fr" }}
        >
          <Input
            type="number"
            id="price"
            placeholder="0.00"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </FormRow>

        {/* Unit */}
        <FormRow
          label="Unit *"
          style={{ gridTemplateColumns: "18rem 1fr 1.2fr" }}
        >
          <Select
            id="unit"
            options={unitOptions}
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            required
          />
        </FormRow>

        {/* Current Stock */}
        <FormRow
          label="Current Stock *"
          style={{ gridTemplateColumns: "18rem 1fr 1.2fr" }}
        >
          <Input
            type="number"
            id="stock"
            placeholder="0"
            min="0"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </FormRow>

        {/* Minimum Stock */}
        <FormRow
          label="Minimum Stock *"
          style={{ gridTemplateColumns: "10rem 1fr 1.2fr" }}
        >
          <Input
            type="number"
            id="minStock"
            placeholder="0"
            min="0"
            value={minStock}
            onChange={(e) => setMinStock(e.target.value)}
            required
          />
        </FormRow>

        {/* SKU */}
        <FullWidth>
          <FormRow
            label="SKU Code *"
            style={{ gridTemplateColumns: "10em 1fr 1.2fr" }}
          >
            <div style={{ display: "flex", gap: "1.2rem" }}>
              <Input
                type="text"
                id="sku"
                placeholder="e.g., MLK-001"
                value={sku}
                onChange={(e) => setSku(e.target.value.toUpperCase())}
                required
                style={{ flex: 1 }}
              />
              {!isEditMode && (
                <Button
                  type="button"
                  $variation="primary"
                  onClick={generateSKU}
                >
                  Generate SKU
                </Button>
              )}
            </div>
          </FormRow>
        </FullWidth>

        {/* Description */}
        <FullWidth>
          <FormRow
            label="Description (Optional)"
            style={{ gridTemplateColumns: "18rem 1fr 1.2fr" }}
          >
            <Textarea
              id="description"
              placeholder="Add product details, ingredients, or any notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </FormRow>
        </FullWidth>
      </FormGrid>

      {/* Stock Warning */}
      {parseInt(stock) < parseInt(minStock) && stock && minStock && (
        <InfoBox style={{ backgroundColor: "var(--color-red-100)" }}>
          <p style={{ color: "var(--color-red-700)" }}>
            ⚠️ <strong>Warning:</strong> Current stock is below minimum stock
            level. Consider restocking soon.
          </p>
        </InfoBox>
      )}

      <ButtonGroup>
        <Button type="button" $variation="secondary" onClick={onCloseModal}>
          Cancel
        </Button>
        <Button type="submit">
          {isEditMode ? "Update Product" : "Add Product"}
        </Button>
      </ButtonGroup>
    </Form>
  );
}

export default ProductForm;
