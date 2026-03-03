import { useState } from "react";
import styled from "styled-components";
import {
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineCube,
  HiOutlineDocumentDuplicate,
  HiOutlineArrowDownTray,
  HiOutlineExclamationTriangle,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineEye,
  HiOutlineBellAlert,
  HiOutlineArrowsUpDown,
} from "react-icons/hi2";
import Heading from "../UI/Heading";
import Row from "../UI/Row";
import Button from "../UI/Button";
import SearchBar from "../UI/SearchBar";
import Modal from "../UI/Modal";
import ConfirmDelete from "../UI/ConfirmDelete";
import ProductForm from "../components/ProductForm";
import StatsCard from "../UI/StatsCard";

// ─── Styled Components ───────────────────────────────────────────────────────

const ProductsLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
`;

const FiltersBar = styled.div`
  display: flex;
  gap: 1.2rem;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
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

// ── Stock Alerts Banner ──────────────────────────────────────────────────────

const AlertBanner = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.6rem;
  padding: 1.6rem 2rem;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 2px solid var(--color-yellow-700);
  border-radius: var(--border-radius-md);

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-yellow-700);
    flex-shrink: 0;
    margin-top: 0.2rem;
  }
`;

const AlertContent = styled.div`
  flex: 1;

  & h4 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #92400e;
    margin-bottom: 0.8rem;
  }
`;

const AlertItems = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
`;

const AlertItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.4rem 1rem;
  background-color: rgba(255, 255, 255, 0.7);
  border: 1px solid #d97706;
  border-radius: 100px;
  font-size: 1.2rem;
  font-weight: 600;
  color: #92400e;
`;

// ── Table Card (Desktop) ─────────────────────────────────────────────────────

const TableCard = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  overflow: hidden;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const TableControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.6rem 2.4rem;
  background-color: var(--color-grey-50);
  border-bottom: 1px solid var(--color-grey-100);
  gap: 1.2rem;
  flex-wrap: wrap;
`;

const ResultsCount = styled.div`
  font-size: 1.4rem;
  color: var(--color-grey-600);
  font-weight: 500;

  & strong {
    color: var(--color-grey-900);
    font-weight: 700;
  }
`;

const ControlsRight = styled.div`
  display: flex;
  gap: 1.2rem;
  align-items: center;
`;

const ExportButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 1.6rem;
  background-color: var(--color-green-700);
  color: white;
  border: none;
  border-radius: var(--border-radius-sm);
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #047857;
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);
  }

  & svg {
    width: 1.8rem;
    height: 1.8rem;
  }
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 0.4rem;
  background-color: var(--color-grey-100);
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
`;

const ViewButton = styled.button<{ $active: boolean }>`
  padding: 0.6rem 1.2rem;
  border: none;
  background-color: ${(p) =>
    p.$active ? "var(--color-grey-0)" : "transparent"};
  color: ${(p) =>
    p.$active ? "var(--color-brand-600)" : "var(--color-grey-500)"};
  border-radius: var(--border-radius-sm);
  font-size: 1.3rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: ${(p) => (p.$active ? "var(--shadow-sm)" : "none")};
`;

const Table = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2.5fr 1fr 1fr 1.2fr 1.4fr 1fr 1fr;
  gap: 1.6rem;
  padding: 1.4rem 2.4rem;
  background-color: var(--color-grey-50);
  font-weight: 600;
  font-size: 1.3rem;
  text-transform: uppercase;
  color: var(--color-grey-600);
  border-bottom: 2px solid var(--color-grey-200);
`;

const SortableCol = styled.div<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  color: ${(p) =>
    p.$active ? "var(--color-brand-600)" : "var(--color-grey-600)"};
  transition: color 0.2s;
  user-select: none;

  &:hover {
    color: var(--color-brand-600);
  }

  & svg {
    width: 1.4rem;
    height: 1.4rem;
  }
`;

const TableRow = styled.div<{ $lowStock?: boolean }>`
  display: grid;
  grid-template-columns: 2.5fr 1fr 1fr 1.2fr 1.4fr 1fr 1fr;
  gap: 1.6rem;
  padding: 1.4rem 2.4rem;
  border-bottom: 1px solid var(--color-grey-100);
  align-items: center;
  transition: background-color 0.2s;
  background-color: ${(p) =>
    p.$lowStock ? "rgba(254, 243, 199, 0.3)" : "transparent"};

  &:hover {
    background-color: ${(p) =>
      p.$lowStock ? "rgba(254, 243, 199, 0.6)" : "var(--color-grey-50)"};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const ProductNameCell = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
`;

const ProductEmoji = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: var(--border-radius-sm);
  background: linear-gradient(
    135deg,
    var(--color-brand-100),
    var(--color-brand-200)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  flex-shrink: 0;
`;

const ProductTextInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const ProductNameText = styled.span`
  font-weight: 600;
  font-size: 1.4rem;
  color: var(--color-grey-900);
`;

const SkuText = styled.span`
  font-size: 1.2rem;
  color: var(--color-grey-500);
`;

const StockBadge = styled.span<{ $level: "low" | "medium" | "high" }>`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 1rem;
  border-radius: 100px;
  font-size: 1.2rem;
  font-weight: 600;
  background-color: ${(p) => {
    if (p.$level === "low") return "var(--color-red-100)";
    if (p.$level === "medium") return "var(--color-yellow-100)";
    return "var(--color-green-100)";
  }};
  color: ${(p) => {
    if (p.$level === "low") return "var(--color-red-700)";
    if (p.$level === "medium") return "var(--color-yellow-700)";
    return "var(--color-green-700)";
  }};

  & svg {
    width: 1.2rem;
    height: 1.2rem;
  }
`;

const CategoryBadge = styled.span`
  display: inline-block;
  padding: 0.4rem 1rem;
  background-color: var(--color-brand-100);
  color: var(--color-brand-700);
  border-radius: 100px;
  font-size: 1.2rem;
  font-weight: 600;
`;

const StatusTogglePill = styled.button<{ $active: boolean }>`
  padding: 0.4rem 1rem;
  border: none;
  border-radius: 100px;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  background: ${(p) =>
    p.$active ? "var(--color-green-100)" : "var(--color-grey-100)"};
  color: ${(p) =>
    p.$active ? "var(--color-green-700)" : "var(--color-grey-600)"};

  &:hover {
    transform: scale(1.05);
  }
`;

const StockControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

const StockBtn = styled.button`
  width: 2.4rem;
  height: 2.4rem;
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  font-size: 1.6rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;

  &:hover {
    background-color: var(--color-brand-600);
    color: white;
    border-color: var(--color-brand-600);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const StockNumber = styled.span`
  font-weight: 700;
  font-size: 1.4rem;
  color: var(--color-grey-900);
  min-width: 3rem;
  text-align: center;
`;

const ActionCell = styled.div`
  display: flex;
  gap: 0.6rem;
`;

const IconBtn = styled.button`
  width: 3.2rem;
  height: 3.2rem;
  border: 1px solid var(--color-grey-200);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-grey-600);

  & svg {
    width: 1.6rem;
    height: 1.6rem;
  }

  &:hover {
    background-color: var(--color-brand-50);
    border-color: var(--color-brand-600);
    color: var(--color-brand-600);
  }

  &.danger:hover {
    background-color: var(--color-red-100);
    border-color: var(--color-red-600);
    color: var(--color-red-700);
  }
`;

// ── Grid Card View (Desktop alternative) ────────────────────────────────────

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(28rem, 1fr));
  gap: 2.4rem;
`;

const ProductCard = styled.div<{ $lowStock?: boolean }>`
  background-color: var(--color-grey-0);
  border: 1px solid
    ${(p) => (p.$lowStock ? "#f59e0b" : "var(--color-grey-100)")};
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
  height: 14rem;
  background: linear-gradient(
    135deg,
    var(--color-brand-100),
    var(--color-brand-200)
  );
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.6rem;
  font-size: 5rem;
`;

const ProductCardName = styled.h3`
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--color-grey-900);
  margin-bottom: 0.4rem;
`;

const ProductCardSku = styled.span`
  font-size: 1.2rem;
  color: var(--color-grey-500);
  display: block;
  margin-bottom: 1.2rem;
`;

const CardInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 0;
  border-bottom: 1px solid var(--color-grey-100);
  font-size: 1.4rem;

  &:last-of-type {
    border-bottom: none;
  }
`;

const CardInfoLabel = styled.span`
  color: var(--color-grey-600);
`;

const CardInfoValue = styled.span<{ $color?: string }>`
  font-weight: 600;
  color: ${(p) => p.$color || "var(--color-grey-900)"};
`;

const QuickStockControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-top: 1.2rem;
  padding: 0.8rem;
  background-color: var(--color-grey-50);
  border-radius: var(--border-radius-sm);
`;

const StockInput = styled.input`
  width: 6rem;
  text-align: center;
  padding: 0.6rem;
  border: 1px solid var(--color-grey-300);
  border-radius: var(--border-radius-sm);
  font-size: 1.4rem;
  font-weight: 600;
  flex: 1;

  &:focus {
    outline: none;
    border-color: var(--color-brand-600);
  }
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.8rem;
  margin-top: 1.6rem;
  padding-top: 1.6rem;
  border-top: 1px solid var(--color-grey-200);
`;

const CardActionBtn = styled.button`
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

  &.danger:hover {
    background-color: var(--color-red-100);
    border-color: var(--color-red-600);
    color: var(--color-red-700);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
  }
`;

const CardStatusBadge = styled.div<{ $active: boolean }>`
  position: absolute;
  top: 1.2rem;
  right: 1.2rem;
  padding: 0.4rem 1rem;
  border-radius: 100px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  background: ${(p) =>
    p.$active ? "var(--color-green-100)" : "var(--color-grey-200)"};
  color: ${(p) =>
    p.$active ? "var(--color-green-700)" : "var(--color-grey-600)"};

  &:hover {
    transform: scale(1.05);
  }
`;

const LowStockWarning = styled.div`
  position: absolute;
  top: 1.2rem;
  left: 1.2rem;
  padding: 0.4rem 0.8rem;
  border-radius: 100px;
  font-size: 1.1rem;
  font-weight: 700;
  background: var(--color-yellow-100);
  color: var(--color-yellow-700);
  display: flex;
  align-items: center;
  gap: 0.4rem;

  & svg {
    width: 1.2rem;
    height: 1.2rem;
  }
`;

// ── Mobile Card View ─────────────────────────────────────────────────────────

const MobileCardList = styled.div`
  display: none;
  flex-direction: column;
  gap: 1.6rem;

  @media (max-width: 1024px) {
    display: flex;
  }
`;

const MobileCard = styled.div<{ $lowStock?: boolean }>`
  background-color: var(--color-grey-0);
  border: 1px solid
    ${(p) => (p.$lowStock ? "#f59e0b" : "var(--color-grey-100)")};
  border-radius: var(--border-radius-md);
  padding: 2rem;
  box-shadow: var(--shadow-sm);
  position: relative;
`;

const MobileCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.4rem;
  margin-bottom: 1.6rem;
  padding-bottom: 1.6rem;
  border-bottom: 1px solid var(--color-grey-200);
`;

const MobileProductEmoji = styled.div`
  width: 5rem;
  height: 5rem;
  border-radius: var(--border-radius-md);
  background: linear-gradient(
    135deg,
    var(--color-brand-100),
    var(--color-brand-200)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.4rem;
  flex-shrink: 0;
`;

const MobileProductInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const MobileProductName = styled.h3`
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--color-grey-900);
  margin: 0 0 0.4rem 0;
`;

const MobileProductSku = styled.span`
  font-size: 1.2rem;
  color: var(--color-grey-500);
`;

const MobileRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 0;
  border-bottom: 1px solid var(--color-grey-100);
  font-size: 1.3rem;

  &:last-child {
    border-bottom: none;
  }
`;

const MobileLabel = styled.span`
  color: var(--color-grey-600);
  font-weight: 500;
`;

const MobileValue = styled.span`
  font-weight: 600;
  color: var(--color-grey-900);
`;

const MobileStockSection = styled.div`
  margin-top: 1.2rem;
  padding-top: 1.2rem;
  border-top: 2px solid var(--color-grey-200);
`;

const MobileStockControl = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.8rem;
`;

const MobileActionsRow = styled.div`
  display: flex;
  gap: 0.8rem;
  margin-top: 1.6rem;
  padding-top: 1.6rem;
  border-top: 1px solid var(--color-grey-200);
`;

const MobileActionBtn = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 1rem 1.6rem;
  background-color: var(--color-grey-0);
  border: 2px solid var(--color-grey-300);
  border-radius: var(--border-radius-sm);
  color: var(--color-grey-700);
  font-size: 1.3rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  & svg {
    width: 1.6rem;
    height: 1.6rem;
  }

  &:hover {
    border-color: var(--color-brand-600);
    color: var(--color-brand-600);
    background-color: var(--color-brand-50);
  }

  &.danger:hover {
    border-color: var(--color-red-600);
    color: var(--color-red-700);
    background-color: var(--color-red-100);
  }
`;

const MobileLowStockBadge = styled.span`
  position: absolute;
  top: 1.2rem;
  right: 1.2rem;
  padding: 0.4rem 0.8rem;
  background: var(--color-yellow-100);
  color: var(--color-yellow-700);
  border-radius: 100px;
  font-size: 1.1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.4rem;

  & svg {
    width: 1.2rem;
    height: 1.2rem;
  }
`;

// ── Bulk Action Bar ──────────────────────────────────────────────────────────

const BulkBar = styled.div`
  display: flex;
  align-items: center;
  gap: 1.6rem;
  padding: 1.2rem 1.6rem;
  background: linear-gradient(135deg, var(--color-brand-50), #dbeafe);
  border: 2px solid var(--color-brand-600);
  border-radius: var(--border-radius-md);
  flex-wrap: wrap;
`;

const BulkCount = styled.span`
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--color-brand-700);
  flex: 1;
`;

// ── Sort Select ──────────────────────────────────────────────────────────────

const SortSelect = styled.select`
  padding: 0.8rem 1.6rem;
  border: 2px solid var(--color-grey-300);
  border-radius: var(--border-radius-sm);
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  background-color: var(--color-grey-0);

  &:focus {
    outline: none;
    border-color: var(--color-brand-600);
  }
`;

// ── Empty State ──────────────────────────────────────────────────────────────

const EmptyState = styled.div`
  padding: 8rem 2rem;
  text-align: center;
  color: var(--color-grey-500);
  grid-column: 1 / -1;

  & svg {
    width: 8rem;
    height: 8rem;
    margin: 0 auto 2rem;
    color: var(--color-grey-300);
  }

  & h3 {
    font-size: 2rem;
    font-weight: 600;
    color: var(--color-grey-700);
    margin-bottom: 0.8rem;
  }

  & p {
    font-size: 1.5rem;
    margin-bottom: 2.4rem;
  }
`;

// ── Types & Mock Data ────────────────────────────────────────────────────────

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
  active: boolean;
};

const initialProducts: Product[] = [
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
    active: true,
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
    active: true,
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
    active: true,
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
    active: false,
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
    active: true,
  },
  {
    id: "6",
    name: "Whipping Cream",
    category: "Cream",
    price: 22,
    stock: 8,
    minStock: 20,
    unit: "500ml",
    sku: "CRM-001",
    description: "Heavy whipping cream",
    active: true,
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function getStockLevel(
  stock: number,
  minStock: number,
): "low" | "medium" | "high" {
  if (stock < minStock) return "low";
  if (stock < minStock * 2) return "medium";
  return "high";
}

function getCategoryEmoji(category: string): string {
  const emojis: Record<string, string> = {
    Milk: "🥛",
    Yogurt: "🍶",
    Cheese: "🧀",
    Butter: "🧈",
    Cream: "🥛",
    Dairy: "🫙",
  };
  return emojis[category] || "📦";
}

// ── Main Component ────────────────────────────────────────────────────────────

function Products() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set(),
  );
  const [bulkMode, setBulkMode] = useState(false);
  const [sortBy, setSortBy] = useState<string>("name");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // ── Derived Data ────────────────────────────────────────────────────────────

  const lowStockProducts = products.filter((p) => p.stock < p.minStock);

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      categoryFilter === "all"
        ? true
        : categoryFilter === "lowStock"
          ? product.stock < product.minStock
          : product.category === categoryFilter;

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
          ? product.active
          : !product.active;

    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesStatus && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "stock-low":
        return a.stock - b.stock;
      case "stock-high":
        return b.stock - a.stock;
      case "category":
        return a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });

  const stats = {
    total: products.length,
    active: products.filter((p) => p.active).length,
    lowStock: lowStockProducts.length,
    totalValue: products.reduce((sum, p) => sum + p.price * p.stock, 0),
    categories: new Set(products.map((p) => p.category)).size,
  };

  const categories = [
    "all",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleStockChange = (productId: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, stock: Math.max(0, p.stock + delta) } : p,
      ),
    );
  };

  const handleStockSet = (productId: string, value: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, stock: Math.max(0, value) } : p,
      ),
    );
  };

  const handleToggleStatus = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, active: !p.active } : p)),
    );
  };

  const handleDelete = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    const newSelected = new Set(selectedProducts);
    newSelected.delete(productId);
    setSelectedProducts(newSelected);
  };

  const handleDuplicate = (product: Product) => {
    const copy: Product = {
      ...product,
      id: `${product.id}-copy-${Date.now()}`,
      name: `${product.name} (Copy)`,
      sku: `${product.sku}-COPY`,
    };
    setProducts((prev) => [...prev, copy]);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(new Set(sortedProducts.map((p) => p.id)));
    } else {
      setSelectedProducts(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedProducts);
    if (checked) newSelected.add(id);
    else newSelected.delete(id);
    setSelectedProducts(newSelected);
  };

  const handleBulkDelete = () => {
    setProducts((prev) => prev.filter((p) => !selectedProducts.has(p.id)));
    setSelectedProducts(new Set());
  };

  const handleExportCSV = (productsToExport = sortedProducts) => {
    const headers = [
      "SKU",
      "Name",
      "Category",
      "Price (TND)",
      "Unit",
      "Stock",
      "Min Stock",
      "Stock Level",
      "Status",
      "Inventory Value (TND)",
    ];

    const rows = productsToExport.map((p) => [
      p.sku,
      p.name,
      p.category,
      p.price,
      p.unit,
      p.stock,
      p.minStock,
      getStockLevel(p.stock, p.minStock),
      p.active ? "Active" : "Inactive",
      (p.price * p.stock).toFixed(2),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `taba3ni-products-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportSelected = () => {
    const selected = products.filter((p) => selectedProducts.has(p.id));
    handleExportCSV(selected);
  };

  // ── Render ──────────────────────────────────────────────────────────────────

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

      {/* Stock Alerts Banner */}
      {lowStockProducts.length > 0 && (
        <AlertBanner>
          <HiOutlineBellAlert />
          <AlertContent>
            <h4>
              ⚠️ {lowStockProducts.length} product
              {lowStockProducts.length > 1 ? "s are" : " is"} below minimum
              stock level
            </h4>
            <AlertItems>
              {lowStockProducts.map((p) => (
                <AlertItem key={p.id}>
                  <HiOutlineExclamationTriangle />
                  {p.name} — {p.stock}/{p.minStock} {p.unit}
                </AlertItem>
              ))}
            </AlertItems>
          </AlertContent>
        </AlertBanner>
      )}

      {/* Stats */}
      <StatsRow>
        <StatsCard
          title="Total Products"
          value={stats.total}
          icon={<HiOutlineCube />}
          color="var(--color-blue-700)"
        />
        <StatsCard
          title="Active Products"
          value={stats.active}
          icon={<HiOutlineCheckCircle />}
          color="var(--color-green-700)"
        />
        <StatsCard
          title="Low Stock Alerts"
          value={stats.lowStock}
          icon={<HiOutlineExclamationTriangle />}
          color="var(--color-red-700)"
        />
        <StatsCard
          title="Inventory Value"
          value={`${stats.totalValue.toLocaleString()} TND`}
          icon={<HiOutlineCube />}
          color="var(--color-brand-600)"
        />
      </StatsRow>

      {/* Filters & Toolbar */}
      <FiltersBar>
        <SearchBar
          placeholder="Search by name, SKU or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Status filter */}
        <FilterGroup>
          <FilterButton
            $active={statusFilter === "all"}
            onClick={() => setStatusFilter("all")}
          >
            All Status
          </FilterButton>
          <FilterButton
            $active={statusFilter === "active"}
            onClick={() => setStatusFilter("active")}
          >
            ✅ Active
          </FilterButton>
          <FilterButton
            $active={statusFilter === "inactive"}
            onClick={() => setStatusFilter("inactive")}
          >
            ○ Inactive
          </FilterButton>
        </FilterGroup>

        {/* Category + low stock filters */}
        <FilterGroup>
          <FilterButton
            $active={categoryFilter === "lowStock"}
            onClick={() => setCategoryFilter("lowStock")}
            style={{
              background:
                categoryFilter === "lowStock"
                  ? "var(--color-red-100)"
                  : undefined,
              color:
                categoryFilter === "lowStock"
                  ? "var(--color-red-700)"
                  : undefined,
              borderColor:
                categoryFilter === "lowStock"
                  ? "var(--color-red-600)"
                  : undefined,
            }}
          >
            ⚠️ Low Stock ({stats.lowStock})
          </FilterButton>
          {categories.map((cat) => (
            <FilterButton
              key={cat}
              $active={categoryFilter === cat}
              onClick={() => setCategoryFilter(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </FilterButton>
          ))}
        </FilterGroup>

        <SortSelect value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="name">Sort: Name A–Z</option>
          <option value="category">Sort: Category</option>
          <option value="price-low">Sort: Price ↑</option>
          <option value="price-high">Sort: Price ↓</option>
          <option value="stock-low">Sort: Stock ↑</option>
          <option value="stock-high">Sort: Stock ↓</option>
        </SortSelect>

        <Button
          $variation={bulkMode ? "primary" : "secondary"}
          $size="small"
          onClick={() => {
            setBulkMode((v) => !v);
            setSelectedProducts(new Set());
          }}
        >
          {bulkMode ? "✓ Bulk Mode ON" : "Bulk Select"}
        </Button>
      </FiltersBar>

      {/* Bulk Action Bar */}
      {bulkMode && selectedProducts.size > 0 && (
        <BulkBar>
          <BulkCount>
            {selectedProducts.size} product
            {selectedProducts.size !== 1 ? "s" : ""} selected
          </BulkCount>
          <Button
            $size="small"
            $variation="secondary"
            onClick={handleExportSelected}
          >
            <HiOutlineArrowDownTray />
            Export Selected
          </Button>
          <Modal>
            <Modal.Open opens="bulk-delete">
              <Button
                $size="small"
                style={{
                  backgroundColor: "var(--color-red-700)",
                  color: "white",
                }}
              >
                <HiOutlineTrash />
                Delete Selected
              </Button>
            </Modal.Open>
            <Modal.Window name="bulk-delete">
              <ConfirmDelete
                resourceName={`${selectedProducts.size} products`}
                onConfirm={handleBulkDelete}
                onCloseModal={() => {}}
              />
            </Modal.Window>
          </Modal>
        </BulkBar>
      )}

      {/* ── Desktop TABLE view ── */}
      <TableCard>
        <TableControls>
          <ResultsCount>
            Showing <strong>{sortedProducts.length}</strong> of{" "}
            <strong>{products.length}</strong> products
          </ResultsCount>
          <ControlsRight>
            <ViewToggle>
              <ViewButton
                $active={viewMode === "table"}
                onClick={() => setViewMode("table")}
              >
                ☰ Table
              </ViewButton>
              <ViewButton
                $active={viewMode === "grid"}
                onClick={() => setViewMode("grid")}
              >
                ⊞ Grid
              </ViewButton>
            </ViewToggle>
            <ExportButton onClick={() => handleExportCSV()}>
              <HiOutlineArrowDownTray />
              Export CSV
            </ExportButton>
          </ControlsRight>
        </TableControls>

        {viewMode === "table" ? (
          <Table>
            <TableHeader>
              {bulkMode && (
                <div style={{ gridColumn: "1" }}>
                  <input
                    type="checkbox"
                    style={{
                      width: "1.6rem",
                      height: "1.6rem",
                      cursor: "pointer",
                    }}
                    checked={
                      sortedProducts.length > 0 &&
                      selectedProducts.size === sortedProducts.length
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </div>
              )}
              <SortableCol
                $active={sortBy === "name"}
                onClick={() => setSortBy("name")}
              >
                Product <HiOutlineArrowsUpDown />
              </SortableCol>
              <SortableCol
                $active={sortBy === "category"}
                onClick={() => setSortBy("category")}
              >
                Category <HiOutlineArrowsUpDown />
              </SortableCol>
              <SortableCol
                $active={sortBy.startsWith("price")}
                onClick={() => setSortBy("price-low")}
              >
                Price <HiOutlineArrowsUpDown />
              </SortableCol>
              <SortableCol
                $active={sortBy.startsWith("stock")}
                onClick={() => setSortBy("stock-low")}
              >
                Stock <HiOutlineArrowsUpDown />
              </SortableCol>
              <div>Adjust Stock</div>
              <div>Status</div>
              <div>Actions</div>
            </TableHeader>

            {sortedProducts.length === 0 ? (
              <div
                style={{
                  padding: "6rem 2rem",
                  textAlign: "center",
                  color: "var(--color-grey-500)",
                }}
              >
                <p style={{ fontSize: "1.6rem" }}>
                  No products found. Try adjusting your filters.
                </p>
              </div>
            ) : (
              sortedProducts.map((product) => {
                const stockLevel = getStockLevel(
                  product.stock,
                  product.minStock,
                );
                const isLow = stockLevel === "low";
                return (
                  <TableRow key={product.id} $lowStock={isLow}>
                    {bulkMode && (
                      <div>
                        <input
                          type="checkbox"
                          style={{
                            width: "1.6rem",
                            height: "1.6rem",
                            cursor: "pointer",
                          }}
                          checked={selectedProducts.has(product.id)}
                          onChange={(e) =>
                            handleSelectOne(product.id, e.target.checked)
                          }
                        />
                      </div>
                    )}
                    <ProductNameCell>
                      <ProductEmoji>
                        {getCategoryEmoji(product.category)}
                      </ProductEmoji>
                      <ProductTextInfo>
                        <ProductNameText>
                          {product.name}
                          {isLow && (
                            <span
                              style={{
                                marginLeft: "0.8rem",
                                fontSize: "1.1rem",
                                color: "var(--color-yellow-700)",
                                fontWeight: 700,
                              }}
                            >
                              ⚠️ LOW STOCK
                            </span>
                          )}
                        </ProductNameText>
                        <SkuText>
                          SKU: {product.sku} · {product.unit}
                        </SkuText>
                      </ProductTextInfo>
                    </ProductNameCell>

                    <CategoryBadge>{product.category}</CategoryBadge>

                    <span
                      style={{
                        fontWeight: 600,
                        color: "var(--color-brand-600)",
                      }}
                    >
                      {product.price} TND
                    </span>

                    <StockBadge $level={stockLevel}>
                      {isLow ? (
                        <HiOutlineExclamationTriangle />
                      ) : (
                        <HiOutlineCheckCircle />
                      )}
                      {product.stock} / {product.minStock}
                    </StockBadge>

                    <StockControls>
                      <StockBtn
                        onClick={() => handleStockChange(product.id, -10)}
                        disabled={product.stock < 10}
                      >
                        −
                      </StockBtn>
                      <StockNumber>{product.stock}</StockNumber>
                      <StockBtn
                        onClick={() => handleStockChange(product.id, 10)}
                      >
                        +
                      </StockBtn>
                    </StockControls>

                    <StatusTogglePill
                      $active={product.active}
                      onClick={() => handleToggleStatus(product.id)}
                      title="Click to toggle status"
                    >
                      {product.active ? "● Active" : "○ Inactive"}
                    </StatusTogglePill>

                    <Modal>
                      <ActionCell>
                        <Modal.Open opens={`edit-${product.id}`}>
                          <IconBtn title="Edit">
                            <HiOutlinePencil />
                          </IconBtn>
                        </Modal.Open>
                        <IconBtn
                          title="Duplicate"
                          onClick={() => handleDuplicate(product)}
                        >
                          <HiOutlineDocumentDuplicate />
                        </IconBtn>
                        <Modal.Open opens={`delete-${product.id}`}>
                          <IconBtn className="danger" title="Delete">
                            <HiOutlineTrash />
                          </IconBtn>
                        </Modal.Open>
                      </ActionCell>

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
                    </Modal>
                  </TableRow>
                );
              })
            )}
          </Table>
        ) : (
          // Grid view inside table card
          <div style={{ padding: "2.4rem" }}>
            <ProductsGrid>
              {sortedProducts.length === 0 ? (
                <EmptyState>
                  <HiOutlineCube />
                  <h3>No products found</h3>
                  <p>Try adjusting your filters or search query</p>
                </EmptyState>
              ) : (
                sortedProducts.map((product) => {
                  const stockLevel = getStockLevel(
                    product.stock,
                    product.minStock,
                  );
                  const isLow = stockLevel === "low";
                  return (
                    <Modal key={product.id}>
                      <ProductCard $lowStock={isLow}>
                        {isLow && (
                          <LowStockWarning>
                            <HiOutlineExclamationTriangle />
                            Low Stock
                          </LowStockWarning>
                        )}
                        <CardStatusBadge
                          $active={product.active}
                          onClick={() => handleToggleStatus(product.id)}
                        >
                          {product.active ? "● Active" : "○ Inactive"}
                        </CardStatusBadge>
                        <ProductImage>
                          {getCategoryEmoji(product.category)}
                        </ProductImage>
                        <CategoryBadge style={{ marginBottom: "0.8rem" }}>
                          {product.category}
                        </CategoryBadge>
                        <ProductCardName>{product.name}</ProductCardName>
                        <ProductCardSku>SKU: {product.sku}</ProductCardSku>

                        <CardInfoRow>
                          <CardInfoLabel>Price:</CardInfoLabel>
                          <CardInfoValue $color="var(--color-brand-600)">
                            {product.price} TND/{product.unit}
                          </CardInfoValue>
                        </CardInfoRow>
                        <CardInfoRow>
                          <CardInfoLabel>Stock:</CardInfoLabel>
                          <StockBadge $level={stockLevel}>
                            {isLow && <HiOutlineExclamationTriangle />}
                            {product.stock} {product.unit}
                          </StockBadge>
                        </CardInfoRow>
                        <CardInfoRow>
                          <CardInfoLabel>Min Stock:</CardInfoLabel>
                          <CardInfoValue>
                            {product.minStock} {product.unit}
                          </CardInfoValue>
                        </CardInfoRow>

                        <QuickStockControl>
                          <StockBtn
                            onClick={() => handleStockChange(product.id, -10)}
                            disabled={product.stock < 10}
                            style={{ width: "3rem", height: "3rem" }}
                          >
                            −
                          </StockBtn>
                          <StockInput
                            type="number"
                            value={product.stock}
                            onChange={(e) =>
                              handleStockSet(
                                product.id,
                                parseInt(e.target.value) || 0,
                              )
                            }
                            min="0"
                          />
                          <StockBtn
                            onClick={() => handleStockChange(product.id, 10)}
                            style={{ width: "3rem", height: "3rem" }}
                          >
                            +
                          </StockBtn>
                        </QuickStockControl>

                        <CardActions>
                          <Modal.Open opens={`grid-edit-${product.id}`}>
                            <CardActionBtn>
                              <HiOutlinePencil /> Edit
                            </CardActionBtn>
                          </Modal.Open>
                          <CardActionBtn
                            onClick={() => handleDuplicate(product)}
                          >
                            <HiOutlineDocumentDuplicate /> Copy
                          </CardActionBtn>
                          <Modal.Open opens={`grid-delete-${product.id}`}>
                            <CardActionBtn className="danger">
                              <HiOutlineTrash /> Delete
                            </CardActionBtn>
                          </Modal.Open>
                        </CardActions>

                        <Modal.Window name={`grid-edit-${product.id}`}>
                          <ProductForm
                            productToEdit={product}
                            onCloseModal={() => {}}
                          />
                        </Modal.Window>
                        <Modal.Window name={`grid-delete-${product.id}`}>
                          <ConfirmDelete
                            resourceName={`product ${product.name}`}
                            onConfirm={() => handleDelete(product.id)}
                            onCloseModal={() => {}}
                          />
                        </Modal.Window>
                      </ProductCard>
                    </Modal>
                  );
                })
              )}
            </ProductsGrid>
          </div>
        )}
      </TableCard>

      {/* ── Mobile Card View ── */}
      <MobileCardList>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1.2rem",
          }}
        >
          <span
            style={{
              fontSize: "1.4rem",
              color: "var(--color-grey-600)",
              fontWeight: 500,
            }}
          >
            Showing{" "}
            <strong style={{ color: "var(--color-grey-900)" }}>
              {sortedProducts.length}
            </strong>{" "}
            products
          </span>
          <ExportButton onClick={() => handleExportCSV()}>
            <HiOutlineArrowDownTray />
            Export CSV
          </ExportButton>
        </div>

        {sortedProducts.length === 0 ? (
          <div
            style={{
              padding: "4rem 2rem",
              textAlign: "center",
              color: "var(--color-grey-500)",
              fontSize: "1.5rem",
            }}
          >
            No products found.
          </div>
        ) : (
          sortedProducts.map((product) => {
            const stockLevel = getStockLevel(product.stock, product.minStock);
            const isLow = stockLevel === "low";
            return (
              <Modal key={product.id}>
                <MobileCard $lowStock={isLow}>
                  {isLow && (
                    <MobileLowStockBadge>
                      <HiOutlineExclamationTriangle />
                      Low Stock
                    </MobileLowStockBadge>
                  )}

                  <MobileCardHeader>
                    <MobileProductEmoji>
                      {getCategoryEmoji(product.category)}
                    </MobileProductEmoji>
                    <MobileProductInfo>
                      <MobileProductName>{product.name}</MobileProductName>
                      <MobileProductSku>SKU: {product.sku}</MobileProductSku>
                      <CategoryBadge style={{ marginTop: "0.4rem" }}>
                        {product.category}
                      </CategoryBadge>
                    </MobileProductInfo>
                  </MobileCardHeader>

                  <MobileRow>
                    <MobileLabel>Price</MobileLabel>
                    <MobileValue style={{ color: "var(--color-brand-600)" }}>
                      {product.price} TND / {product.unit}
                    </MobileValue>
                  </MobileRow>
                  <MobileRow>
                    <MobileLabel>Current Stock</MobileLabel>
                    <StockBadge $level={stockLevel}>
                      {isLow && <HiOutlineExclamationTriangle />}
                      {product.stock} {product.unit}
                    </StockBadge>
                  </MobileRow>
                  <MobileRow>
                    <MobileLabel>Min Stock</MobileLabel>
                    <MobileValue>
                      {product.minStock} {product.unit}
                    </MobileValue>
                  </MobileRow>
                  <MobileRow>
                    <MobileLabel>Inventory Value</MobileLabel>
                    <MobileValue>
                      {(product.price * product.stock).toLocaleString()} TND
                    </MobileValue>
                  </MobileRow>
                  <MobileRow>
                    <MobileLabel>Status</MobileLabel>
                    <StatusTogglePill
                      $active={product.active}
                      onClick={() => handleToggleStatus(product.id)}
                    >
                      {product.active ? "● Active" : "○ Inactive"}
                    </StatusTogglePill>
                  </MobileRow>

                  <MobileStockSection>
                    <MobileLabel>Adjust Stock:</MobileLabel>
                    <MobileStockControl>
                      <StockBtn
                        onClick={() => handleStockChange(product.id, -10)}
                        disabled={product.stock < 10}
                        style={{
                          width: "3.2rem",
                          height: "3.2rem",
                          fontSize: "1.8rem",
                        }}
                      >
                        −
                      </StockBtn>
                      <StockInput
                        type="number"
                        value={product.stock}
                        onChange={(e) =>
                          handleStockSet(
                            product.id,
                            parseInt(e.target.value) || 0,
                          )
                        }
                        min="0"
                        style={{ flex: 1 }}
                      />
                      <StockBtn
                        onClick={() => handleStockChange(product.id, 10)}
                        style={{
                          width: "3.2rem",
                          height: "3.2rem",
                          fontSize: "1.8rem",
                        }}
                      >
                        +
                      </StockBtn>
                    </MobileStockControl>
                  </MobileStockSection>

                  <MobileActionsRow>
                    <Modal.Open opens={`mobile-edit-${product.id}`}>
                      <MobileActionBtn>
                        <HiOutlinePencil />
                        Edit
                      </MobileActionBtn>
                    </Modal.Open>
                    <MobileActionBtn onClick={() => handleDuplicate(product)}>
                      <HiOutlineDocumentDuplicate />
                      Copy
                    </MobileActionBtn>
                    <Modal.Open opens={`mobile-delete-${product.id}`}>
                      <MobileActionBtn className="danger">
                        <HiOutlineTrash />
                        Delete
                      </MobileActionBtn>
                    </Modal.Open>
                  </MobileActionsRow>

                  <Modal.Window name={`mobile-edit-${product.id}`}>
                    <ProductForm
                      productToEdit={product}
                      onCloseModal={() => {}}
                    />
                  </Modal.Window>
                  <Modal.Window name={`mobile-delete-${product.id}`}>
                    <ConfirmDelete
                      resourceName={`product ${product.name}`}
                      onConfirm={() => handleDelete(product.id)}
                      onCloseModal={() => {}}
                    />
                  </Modal.Window>
                </MobileCard>
              </Modal>
            );
          })
        )}
      </MobileCardList>
    </ProductsLayout>
  );
}

export default Products;
