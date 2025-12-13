import { useState } from "react";
import styled from "styled-components";
import {
  //HiOutlineEye,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineCube,
} from "react-icons/hi2";
import Heading from "../UI/Heading";
import Row from "../UI/Row";
import Button from "../UI/Button";
import SearchBar from "../UI/SearchBar";
import Menus from "../UI/Menus";
import Modal from "../UI/Modal";
import ConfirmDelete from "../UI/ConfirmDelete";
import ProductForm from "../components/ProductForm";
import StatsCard from "../UI/StatsCard";

// Styled Components
const ProductsLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
`;

const FiltersBar = styled.div`
  display: flex;
  gap: 1.6rem;
  align-items: center;
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 0.8rem;
`;

const FilterButton = styled.button<{ $active?: boolean }>`
  padding: 0.8rem 1.6rem;
  border: 2px solid
    ${(props) =>
      props.$active ? "var(--color-brand-600)" : "var(--color-grey-300)"};
  background-color: ${(props) =>
    props.$active ? "var(--color-brand-50)" : "var(--color-grey-0)"};
  color: ${(props) =>
    props.$active ? "var(--color-brand-600)" : "var(--color-grey-600)"};
  border-radius: var(--border-radius-sm);
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: var(--color-brand-600);
    color: var(--color-brand-600);
  }
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
  gap: 2.4rem;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(28rem, 1fr));
  gap: 2.4rem;
`;

const ProductCard = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2rem;
  transition: all 0.3s;
  position: relative;

  &:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-4px);
  }
`;

const ProductImage = styled.div`
  width: 100%;
  height: 18rem;
  background: linear-gradient(
    135deg,
    var(--color-brand-100) 0%,
    var(--color-brand-200) 100%
  );
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.6rem;
  font-size: 6rem;
`;

const ProductName = styled.h3`
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--color-grey-900);
  margin-bottom: 0.8rem;
`;

const ProductCategory = styled.span`
  display: inline-block;
  padding: 0.4rem 1rem;
  background-color: var(--color-brand-100);
  color: white;
  border-radius: 100px;
  font-size: 1.2rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 1.2rem;
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-bottom: 1.6rem;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.4rem;
`;

const InfoLabel = styled.span`
  color: var(--color-grey-600);
`;

const InfoValue = styled.span<{ $color?: string }>`
  font-weight: 600;
  color: ${(props) => props.$color || "var(--color-grey-900)"};
`;

const StockBadge = styled.span<{ $level: "low" | "medium" | "high" }>`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 1rem;
  border-radius: 100px;
  font-size: 1.2rem;
  font-weight: 600;
  background-color: ${(props) => {
    if (props.$level === "low") return "var(--color-red-100)";
    if (props.$level === "medium") return "var(--color-yellow-100)";
    return "var(--color-green-100)";
  }};
  color: ${(props) => {
    if (props.$level === "low") return "var(--color-red-700)";
    if (props.$level === "medium") return "var(--color-yellow-700)";
    return "var(--color-green-700)";
  }};
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.8rem;
  margin-top: 1.6rem;
  padding-top: 1.6rem;
  border-top: 1px solid var(--color-grey-200);
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 0.8rem;
  background-color: var(--color-grey-50);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-sm);
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--color-grey-700);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-brand-50);
    border-color: var(--color-brand-600);
    color: var(--color-brand-600);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
  }
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  padding: 6rem 2rem;
  text-align: center;
  color: var(--color-grey-500);

  & p {
    font-size: 1.8rem;
    margin-bottom: 1.6rem;
  }

  & svg {
    width: 8rem;
    height: 8rem;
    margin: 0 auto 2rem;
    color: var(--color-grey-400);
  }
`;
const QuickStockControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-top: 1rem;
  padding: 0.8rem;
  background-color: var(--color-grey-50);
  border-radius: var(--border-radius-sm);
`;

const StockButton = styled.button`
  width: 3rem;
  height: 3rem;
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  font-size: 1.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: var(--color-brand-600);
    color: var(--color-grey-0);
    border-color: var(--color-brand-600);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StockInput = styled.input`
  width: 5rem;
  text-align: center;
  padding: 0.6rem;
  border: 1px solid var(--color-grey-300);
  border-radius: var(--border-radius-sm);
  font-size: 1.4rem;
  font-weight: 600;

  &:focus {
    outline: none;
    border-color: var(--color-brand-600);
  }
`;
// Types
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

// Mock Data
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Full Cream Milk",
    category: "Milk",
    price: 15,
    stock: 250,
    minStock: 50,
    unit: "1L",
    sku: "MLK-001",
    description: "Fresh full cream milk",
  },
  {
    id: "2",
    name: "Greek Yogurt",
    category: "Yogurt",
    price: 8,
    stock: 120,
    minStock: 30,
    unit: "500g",
    sku: "YOG-001",
    description: "Creamy Greek yogurt",
  },
  {
    id: "3",
    name: "Butter",
    category: "Dairy",
    price: 12,
    stock: 80,
    minStock: 20,
    unit: "250g",
    sku: "BTR-001",
    description: "Premium butter",
  },
  {
    id: "4",
    name: "Cheddar Cheese",
    category: "Cheese",
    price: 18,
    stock: 15,
    minStock: 25,
    unit: "200g",
    sku: "CHZ-001",
    description: "Aged cheddar cheese",
  },
  {
    id: "5",
    name: "Skimmed Milk",
    category: "Milk",
    price: 13,
    stock: 180,
    minStock: 40,
    unit: "1L",
    sku: "MLK-002",
    description: "Low-fat skimmed milk",
  },
];

function Products() {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  // Filter products
  const filteredProducts = mockProducts.filter((product) => {
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate stats
  const stats = {
    total: mockProducts.length,
    lowStock: mockProducts.filter((p) => p.stock < p.minStock).length,
    totalValue: mockProducts.reduce((sum, p) => sum + p.price * p.stock, 0),
    categories: new Set(mockProducts.map((p) => p.category)).size,
  };

  const getStockLevel = (stock: number, minStock: number) => {
    if (stock < minStock) return "low";
    if (stock < minStock * 2) return "medium";
    return "high";
  };

  const handleEdit = (product: Product) => {
    setProductToEdit(product);
  };

  const handleDelete = (productId: string) => {
    console.log("Delete product:", productId);
    // TODO: Call API to delete product
  };
  const handleStockChange = (productId: string, change: number) => {
    console.log(`Adjust stock for ${productId} by ${change}`);
    // TODO: Update stock in state/backend
  };

  const categories = [
    "all",
    ...Array.from(new Set(mockProducts.map((p) => p.category))),
  ];

  return (
    <ProductsLayout>
      {/* Header */}
      <Row type="horizontal">
        <Heading as="h1">Products Management</Heading>
        <Modal>
          <Modal.Open opens="create-product">
            <Button $size="medium">+ Add Product</Button>
          </Modal.Open>
          <Modal.Window name="create-product">
            <ProductForm onCloseModal={() => {}} />
          </Modal.Window>
        </Modal>
      </Row>

      {/* Stats */}
      <StatsRow>
        <StatsCard
          title="Total Products"
          value={stats.total}
          icon={<HiOutlineCube />}
          color="var(--color-blue-700)"
        />
        <StatsCard
          title="Low Stock Items"
          value={stats.lowStock}
          icon={<HiOutlineCube />}
          color="var(--color-red-700)"
        />
        <StatsCard
          title="Total Inventory Value"
          value={`${stats.totalValue.toLocaleString()} TND`}
          icon={<HiOutlineCube />}
          color="var(--color-green-700)"
        />
        <StatsCard
          title="Categories"
          value={stats.categories}
          icon={<HiOutlineCube />}
          color="var(--color-brand-600)"
        />
      </StatsRow>

      <FiltersBar>
        <SearchBar
          placeholder="Search by name or SKU..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FilterGroup>
          {categories.map((category) => (
            <FilterButton
              key={category}
              $active={categoryFilter === category}
              onClick={() => setCategoryFilter(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </FilterButton>
          ))}
        </FilterGroup>
      </FiltersBar>

      <ProductsGrid>
        {filteredProducts.length === 0 ? (
          <EmptyState>
            <HiOutlineCube />
            <p>🔍 No products found</p>
            <p style={{ fontSize: "1.4rem" }}>
              Try adjusting your filters or search query
            </p>
          </EmptyState>
        ) : (
          filteredProducts.map((product) => (
            <Modal key={product.id}>
              <ProductCard>
                <ProductImage>🥛</ProductImage>

                <ProductCategory>{product.category}</ProductCategory>
                <ProductName>{product.name}</ProductName>

                <ProductInfo>
                  <InfoRow>
                    <InfoLabel>SKU:</InfoLabel>
                    <InfoValue>{product.sku}</InfoValue>
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel>Price:</InfoLabel>
                    <InfoValue $color="var(--color-brand-600)">
                      {product.price} TND/{product.unit}
                    </InfoValue>
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel>Stock:</InfoLabel>
                    <StockBadge
                      $level={getStockLevel(product.stock, product.minStock)}
                    >
                      {product.stock} {product.unit}
                    </StockBadge>
                  </InfoRow>
                </ProductInfo>
                <QuickStockControl>
                  <StockButton
                    onClick={() => handleStockChange(product.id, -10)}
                    disabled={product.stock < 10}
                  >
                    −
                  </StockButton>
                  <StockInput
                    type="number"
                    value={product.stock}
                    onChange={(e) =>
                      handleStockChange(
                        product.id,
                        parseInt(e.target.value) - product.stock
                      )
                    }
                    min="0"
                  />
                  <StockButton
                    onClick={() => handleStockChange(product.id, 10)}
                  >
                    +
                  </StockButton>
                </QuickStockControl>

                <CardActions>
                  <Modal.Open opens={`edit-${product.id}`}>
                    <ActionButton>
                      <HiOutlinePencil />
                      Edit
                    </ActionButton>
                  </Modal.Open>
                  <Modal.Open opens={`delete-${product.id}`}>
                    <ActionButton>
                      <HiOutlineTrash />
                      Delete
                    </ActionButton>
                  </Modal.Open>
                </CardActions>

                <Modal.Window name={`edit-${product.id}`}>
                  <ProductForm
                    productToEdit={product}
                    onCloseModal={() => {}}
                  />
                </Modal.Window>

                <Modal.Window name={`delete-${product.id}`}>
                  <ConfirmDelete
                    resourceName={`product ${product.name}`}
                    onConfirm={() => handleDelete(product.id)}
                    onCloseModal={() => {}}
                  />
                </Modal.Window>
              </ProductCard>
            </Modal>
          ))
        )}
      </ProductsGrid>
    </ProductsLayout>
  );
}

export default Products;
