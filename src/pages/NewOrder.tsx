import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import {
  HiOutlineShoppingCart,
  HiOutlinePlus,
  HiOutlineMinus,
  HiOutlineTrash,
  HiOutlineCheckCircle,
  HiOutlineTruck,
  HiOutlineDocumentText,
  HiOutlineArrowRight,
  HiOutlineArrowLeft,
  HiOutlineCube,
  HiOutlineMapPin,
  HiOutlineCalendar,
  HiOutlineCurrencyDollar,
  HiOutlineChatBubbleLeftEllipsis,
} from "react-icons/hi2";
import Heading from "../UI/Heading";
import { useNotifications } from "../hooks/useNotifications";

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(1.6rem); }
  to   { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(2rem); }
  to   { opacity: 1; transform: translateX(0); }
`;

const popIn = keyframes`
  0%   { transform: scale(0.8); opacity: 0; }
  70%  { transform: scale(1.05); }
  100% { transform: scale(1); opacity: 1; }
`;

// ─── Layout ───────────────────────────────────────────────────────────────────

const PageLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  animation: ${fadeUp} 0.4s ease-out;
`;

// ─── Stepper ──────────────────────────────────────────────────────────────────

const StepperWrapper = styled.div`
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem;
`;

const StepperTrack = styled.div`
  display: flex;
  align-items: center;
  gap: 0;

  @media (max-width: 768px) {
    gap: 0.8rem;
  }
`;

const StepItem = styled.div<{ $active: boolean; $done: boolean }>`
  display: flex;
  align-items: center;
  flex: 1;
  gap: 1.2rem;
  cursor: ${(p) => (p.$done ? "pointer" : "default")};
`;

const StepCircle = styled.div<{ $active: boolean; $done: boolean }>`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.4rem;
  flex-shrink: 0;
  transition: all 0.3s;
  background: ${(p) =>
    p.$done
      ? "var(--color-green-600)"
      : p.$active
        ? "var(--color-brand-600)"
        : "var(--color-grey-200)"};
  color: ${(p) => (p.$done || p.$active ? "white" : "var(--color-grey-500)")};
  box-shadow: ${(p) =>
    p.$active ? "0 0 0 4px var(--color-brand-100)" : "none"};

  & svg {
    width: 2rem;
    height: 2rem;
  }
`;

const StepLabel = styled.div`
  @media (max-width: 640px) {
    display: none;
  }
`;

const StepTitle = styled.div<{ $active: boolean; $done: boolean }>`
  font-size: 1.4rem;
  font-weight: ${(p) => (p.$active ? 700 : 500)};
  color: ${(p) =>
    p.$active
      ? "var(--color-brand-600)"
      : p.$done
        ? "var(--color-green-700)"
        : "var(--color-grey-500)"};
  transition: color 0.3s;
`;

const StepSub = styled.div`
  font-size: 1.2rem;
  color: var(--color-grey-400);
`;

const StepConnector = styled.div<{ $done: boolean }>`
  flex: 1;
  height: 2px;
  background: ${(p) =>
    p.$done ? "var(--color-green-400)" : "var(--color-grey-200)"};
  margin: 0 1.2rem;
  transition: background 0.4s;

  @media (max-width: 640px) {
    margin: 0 0.4rem;
  }
`;

// ─── Main Content Card ────────────────────────────────────────────────────────

const ContentCard = styled.div`
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  overflow: hidden;
  animation: ${slideIn} 0.3s ease-out;
`;

const CardHeader = styled.div`
  padding: 2.4rem;
  border-bottom: 1px solid var(--color-grey-100);
  background: linear-gradient(
    135deg,
    var(--color-brand-50),
    var(--color-grey-0)
  );
  display: flex;
  align-items: center;
  gap: 1.2rem;

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-brand-600);
  }

  & h2 {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--color-grey-900);
    margin: 0;
  }

  & p {
    font-size: 1.3rem;
    color: var(--color-grey-500);
    margin: 0;
  }
`;

const CardBody = styled.div`
  padding: 2.4rem;
`;

// ─── Product Grid ─────────────────────────────────────────────────────────────

const CategoryTabs = styled.div`
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
  margin-bottom: 2.4rem;
`;

const CategoryTab = styled.button<{ $active: boolean }>`
  padding: 0.8rem 1.6rem;
  border-radius: 100px;
  border: 2px solid
    ${(p) => (p.$active ? "var(--color-brand-600)" : "var(--color-grey-200)")};
  background: ${(p) =>
    p.$active ? "var(--color-brand-600)" : "var(--color-grey-0)"};
  color: ${(p) => (p.$active ? "white" : "var(--color-grey-600)")};
  font-size: 1.3rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: var(--color-brand-600);
    color: ${(p) => (p.$active ? "white" : "var(--color-brand-600)")};
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(22rem, 1fr));
  gap: 1.6rem;
`;

const ProductCard = styled.div<{ $selected: boolean; $outOfStock: boolean }>`
  border: 2px solid
    ${(p) => (p.$selected ? "var(--color-brand-600)" : "var(--color-grey-200)")};
  border-radius: var(--border-radius-md);
  padding: 1.6rem;
  cursor: ${(p) => (p.$outOfStock ? "not-allowed" : "pointer")};
  transition: all 0.2s;
  position: relative;
  opacity: ${(p) => (p.$outOfStock ? 0.5 : 1)};
  background: ${(p) =>
    p.$selected ? "var(--color-brand-50)" : "var(--color-grey-0)"};

  &:hover {
    ${(p) =>
      !p.$outOfStock &&
      `
      border-color: var(--color-brand-600);
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
    `}
  }
`;

const ProductEmoji = styled.div`
  font-size: 3.2rem;
  margin-bottom: 1.2rem;
  text-align: center;
`;

const ProductName = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-grey-900);
  margin: 0 0 0.4rem 0;
`;

const ProductMeta = styled.div`
  font-size: 1.2rem;
  color: var(--color-grey-500);
  margin-bottom: 1.2rem;
`;

const ProductPrice = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-brand-600);
  margin-bottom: 0.8rem;
`;

const StockIndicator = styled.div<{ $low: boolean }>`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${(p) => (p.$low ? "var(--color-red-600)" : "var(--color-green-600)")};
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const SelectedBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 50%;
  background: var(--color-brand-600);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${popIn} 0.25s ease-out;

  & svg {
    width: 1.4rem;
    height: 1.4rem;
    color: white;
  }
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-top: 1.2rem;
`;

const QtyBtn = styled.button`
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 50%;
  border: 2px solid var(--color-brand-600);
  background: var(--color-grey-0);
  color: var(--color-brand-600);
  font-size: 1.8rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    background: var(--color-brand-600);
    color: white;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    &:hover {
      background: var(--color-grey-0);
      color: var(--color-brand-600);
    }
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
  }
`;

const QtyDisplay = styled.div`
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--color-grey-900);
  min-width: 3rem;
  text-align: center;
`;

const OutOfStockBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.3rem 0.8rem;
  background: var(--color-red-100);
  color: var(--color-red-700);
  border-radius: 100px;
  font-size: 1.1rem;
  font-weight: 700;
`;

// ─── Cart Sidebar ─────────────────────────────────────────────────────────────

const TwoColLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 34rem;
  gap: 2.4rem;
  align-items: start;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const CartPanel = styled.div`
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  overflow: hidden;
  position: sticky;
  top: 2rem;
`;

const CartHeader = styled.div`
  padding: 1.6rem 2rem;
  background: linear-gradient(
    135deg,
    var(--color-brand-600),
    var(--color-brand-700)
  );
  color: white;
  display: flex;
  align-items: center;
  gap: 0.8rem;

  & svg {
    width: 2rem;
    height: 2rem;
  }
  & h3 {
    font-size: 1.6rem;
    font-weight: 700;
    margin: 0;
    flex: 1;
  }
  & span {
    font-size: 1.2rem;
    opacity: 0.85;
  }
`;

const CartItems = styled.div`
  max-height: 36rem;
  overflow-y: auto;
  padding: 1.2rem;

  &::-webkit-scrollbar {
    width: 0.4rem;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--color-grey-300);
    border-radius: 100px;
  }
`;

const CartItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1.2rem;
  border-radius: var(--border-radius-sm);
  transition: background 0.2s;

  &:hover {
    background: var(--color-grey-50);
  }
`;

const CartItemEmoji = styled.div`
  font-size: 2.4rem;
  flex-shrink: 0;
`;

const CartItemInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const CartItemName = styled.div`
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--color-grey-900);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CartItemPrice = styled.div`
  font-size: 1.2rem;
  color: var(--color-grey-500);
`;

const CartItemQty = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

const CartQtyBtn = styled.button`
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 50%;
  border: 1px solid var(--color-grey-300);
  background: var(--color-grey-0);
  color: var(--color-grey-600);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    border-color: var(--color-brand-600);
    color: var(--color-brand-600);
  }

  & svg {
    width: 1.2rem;
    height: 1.2rem;
  }
`;

const CartQtyNum = styled.span`
  font-size: 1.3rem;
  font-weight: 700;
  min-width: 2rem;
  text-align: center;
`;

const CartRemove = styled.button`
  background: none;
  border: none;
  color: var(--color-grey-400);
  cursor: pointer;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  display: flex;
  align-items: center;
  transition: all 0.2s;

  &:hover {
    color: var(--color-red-600);
    background: var(--color-red-50);
  }
  & svg {
    width: 1.6rem;
    height: 1.6rem;
  }
`;

const CartEmpty = styled.div`
  padding: 3.2rem 2rem;
  text-align: center;
  color: var(--color-grey-400);

  & div {
    font-size: 4rem;
    margin-bottom: 0.8rem;
  }
  & p {
    font-size: 1.3rem;
  }
`;

const CartDivider = styled.div`
  height: 1px;
  background: var(--color-grey-100);
  margin: 0;
`;

const CartSummary = styled.div`
  padding: 1.6rem 2rem;
`;

const CartRow = styled.div<{ $total?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${(p) => (p.$total ? "1.2rem 0 0 0" : "0.6rem 0")};
  font-size: ${(p) => (p.$total ? "1.6rem" : "1.3rem")};
  font-weight: ${(p) => (p.$total ? 700 : 400)};
  color: ${(p) =>
    p.$total ? "var(--color-brand-600)" : "var(--color-grey-600)"};
  border-top: ${(p) => (p.$total ? "2px solid var(--color-grey-200)" : "none")};
`;

// ─── Step 2 — Delivery Details ────────────────────────────────────────────────

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;

  &.full {
    grid-column: 1 / -1;
  }
`;

const Label = styled.label`
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--color-grey-700);
  display: flex;
  align-items: center;
  gap: 0.6rem;

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-brand-600);
  }
`;

const StyledInput = styled.input`
  padding: 1.2rem 1.6rem;
  border: 2px solid var(--color-grey-300);
  border-radius: var(--border-radius-sm);
  font-size: 1.4rem;
  width: 100%;
  transition: border-color 0.2s;
  background: var(--color-grey-0);

  &:focus {
    outline: none;
    border-color: var(--color-brand-600);
    box-shadow: 0 0 0 3px var(--color-brand-100);
  }
`;

const StyledTextarea = styled.textarea`
  padding: 1.2rem 1.6rem;
  border: 2px solid var(--color-grey-300);
  border-radius: var(--border-radius-sm);
  font-size: 1.4rem;
  width: 100%;
  min-height: 10rem;
  resize: vertical;
  transition: border-color 0.2s;
  background: var(--color-grey-0);
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: var(--color-brand-600);
    box-shadow: 0 0 0 3px var(--color-brand-100);
  }
`;

const StyledSelect = styled.select`
  padding: 1.2rem 1.6rem;
  border: 2px solid var(--color-grey-300);
  border-radius: var(--border-radius-sm);
  font-size: 1.4rem;
  width: 100%;
  transition: border-color 0.2s;
  background: var(--color-grey-0);
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: var(--color-brand-600);
    box-shadow: 0 0 0 3px var(--color-brand-100);
  }
`;

const DeliveryOptionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
  gap: 1.2rem;
`;

const DeliveryOption = styled.div<{ $selected: boolean }>`
  padding: 1.6rem;
  border: 2px solid
    ${(p) => (p.$selected ? "var(--color-brand-600)" : "var(--color-grey-200)")};
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all 0.2s;
  background: ${(p) =>
    p.$selected ? "var(--color-brand-50)" : "var(--color-grey-0)"};

  &:hover {
    border-color: var(--color-brand-600);
  }

  & .icon {
    font-size: 2.4rem;
    margin-bottom: 0.8rem;
  }
  & .title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-grey-900);
  }
  & .sub {
    font-size: 1.2rem;
    color: var(--color-grey-500);
    margin-top: 0.4rem;
  }
  & .price {
    font-size: 1.4rem;
    font-weight: 600;
    color: var(--color-brand-600);
    margin-top: 0.8rem;
  }
`;

// ─── Step 3 — Review ──────────────────────────────────────────────────────────

const ReviewSection = styled.div`
  margin-bottom: 2.4rem;
  padding-bottom: 2.4rem;
  border-bottom: 1px solid var(--color-grey-100);

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const ReviewSectionTitle = styled.h4`
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--color-grey-700);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 1.2rem 0;
  display: flex;
  align-items: center;
  gap: 0.8rem;

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-brand-600);
  }
`;

const ReviewGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ReviewItem = styled.div`
  & .label {
    font-size: 1.2rem;
    color: var(--color-grey-500);
    margin-bottom: 0.4rem;
  }
  & .value {
    font-size: 1.4rem;
    font-weight: 600;
    color: var(--color-grey-900);
  }
`;

const ReviewProductRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-grey-100);

  &:last-child {
    border-bottom: none;
  }

  & .emoji {
    font-size: 2rem;
  }
  & .name {
    flex: 1;
    font-size: 1.4rem;
    font-weight: 600;
    color: var(--color-grey-900);
  }
  & .qty {
    font-size: 1.3rem;
    color: var(--color-grey-500);
  }
  & .total {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-brand-600);
  }
`;

const PriceSummaryBox = styled.div`
  background: var(--color-grey-50);
  border-radius: var(--border-radius-md);
  padding: 2rem;
  margin-top: 1.6rem;
`;

const PriceLine = styled.div<{ $total?: boolean }>`
  display: flex;
  justify-content: space-between;
  font-size: ${(p) => (p.$total ? "1.8rem" : "1.4rem")};
  font-weight: ${(p) => (p.$total ? 700 : 400)};
  color: ${(p) =>
    p.$total ? "var(--color-brand-600)" : "var(--color-grey-700)"};
  padding: ${(p) => (p.$total ? "1.2rem 0 0 0" : "0.6rem 0")};
  border-top: ${(p) => (p.$total ? "2px solid var(--color-grey-300)" : "none")};
  margin-top: ${(p) => (p.$total ? "0.8rem" : "0")};
`;

// ─── Step 4 — Success ─────────────────────────────────────────────────────────

const SuccessWrapper = styled.div`
  padding: 4rem 2rem;
  text-align: center;
  animation: ${fadeUp} 0.5s ease-out;
`;

const SuccessIcon = styled.div`
  width: 10rem;
  height: 10rem;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    var(--color-green-100),
    var(--color-green-200)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2.4rem;
  animation: ${popIn} 0.5s 0.2s both;

  & svg {
    width: 5rem;
    height: 5rem;
    color: var(--color-green-600);
  }
`;

const SuccessTitle = styled.h2`
  font-size: 2.8rem;
  font-weight: 800;
  color: var(--color-grey-900);
  margin: 0 0 0.8rem 0;
`;

const SuccessOrderId = styled.div`
  display: inline-block;
  padding: 0.6rem 2rem;
  background: var(--color-brand-50);
  border: 2px solid var(--color-brand-200);
  border-radius: 100px;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-brand-600);
  margin: 1.2rem 0 2.4rem;
`;

const SuccessDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: 1.6rem;
  max-width: 60rem;
  margin: 0 auto 3.2rem;
`;

const SuccessDetailCard = styled.div`
  padding: 1.6rem;
  background: var(--color-grey-50);
  border-radius: var(--border-radius-md);
  text-align: center;

  & .icon {
    font-size: 2.4rem;
    margin-bottom: 0.8rem;
  }
  & .label {
    font-size: 1.2rem;
    color: var(--color-grey-500);
    margin-bottom: 0.4rem;
  }
  & .value {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-grey-900);
  }
`;

const SuccessActions = styled.div`
  display: flex;
  gap: 1.2rem;
  justify-content: center;
  flex-wrap: wrap;
`;

// ─── Navigation Buttons ───────────────────────────────────────────────────────

const NavBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2.4rem;
  border-top: 1px solid var(--color-grey-100);
  background: var(--color-grey-50);
`;

const NavBtn = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1.2rem 2.4rem;
  border-radius: var(--border-radius-sm);
  font-size: 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid
    ${(p) => (p.$primary ? "var(--color-brand-600)" : "var(--color-grey-300)")};
  background: ${(p) =>
    p.$primary ? "var(--color-brand-600)" : "var(--color-grey-0)"};
  color: ${(p) => (p.$primary ? "white" : "var(--color-grey-700)")};

  &:hover {
    background: ${(p) =>
      p.$primary ? "var(--color-brand-700)" : "var(--color-grey-100)"};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
  }

  & svg {
    width: 1.8rem;
    height: 1.8rem;
  }
`;

// ─── Mock Data ────────────────────────────────────────────────────────────────

const PRODUCTS = [
  {
    id: "1",
    name: "Full Cream Milk",
    category: "Milk",
    price: 15,
    stock: 250,
    unit: "1L",
    sku: "MLK-001",
    emoji: "🥛",
  },
  {
    id: "2",
    name: "Greek Yogurt",
    category: "Yogurt",
    price: 8,
    stock: 120,
    unit: "500g",
    sku: "YOG-001",
    emoji: "🍶",
  },
  {
    id: "3",
    name: "Butter",
    category: "Dairy",
    price: 12,
    stock: 80,
    unit: "250g",
    sku: "BTR-001",
    emoji: "🧈",
  },
  {
    id: "4",
    name: "Cheddar Cheese",
    category: "Cheese",
    price: 18,
    stock: 15,
    unit: "200g",
    sku: "CHZ-001",
    emoji: "🧀",
  },
  {
    id: "5",
    name: "Skimmed Milk",
    category: "Milk",
    price: 13,
    stock: 180,
    unit: "1L",
    sku: "MLK-002",
    emoji: "🥛",
  },
  {
    id: "6",
    name: "Whipping Cream",
    category: "Cream",
    price: 22,
    stock: 8,
    unit: "500ml",
    sku: "CRM-001",
    emoji: "🫙",
  },
  {
    id: "7",
    name: "Labneh",
    category: "Dairy",
    price: 10,
    stock: 95,
    unit: "400g",
    sku: "LBN-001",
    emoji: "🥣",
  },
  {
    id: "8",
    name: "Mozzarella",
    category: "Cheese",
    price: 24,
    stock: 0,
    unit: "250g",
    sku: "CHZ-002",
    emoji: "🧀",
  },
];

const DELIVERY_OPTIONS = [
  {
    id: "standard",
    icon: "🚛",
    title: "Standard",
    sub: "2–3 business days",
    price: 0,
    priceLabel: "Free",
  },
  {
    id: "express",
    icon: "⚡",
    title: "Express",
    sub: "Next business day",
    price: 15,
    priceLabel: "15 TND",
  },
  {
    id: "same_day",
    icon: "🔥",
    title: "Same Day",
    sub: "Within 4–6 hours",
    price: 30,
    priceLabel: "30 TND",
  },
];

const PAYMENT_METHODS = [
  { value: "invoice", label: "Invoice (Pay on delivery)" },
  { value: "cash", label: "Cash on delivery" },
  { value: "bank", label: "Bank transfer" },
];

// ─── Types ────────────────────────────────────────────────────────────────────

type CartEntry = { productId: string; qty: number };

type DeliveryDetails = {
  address: string;
  city: string;
  preferredDate: string;
  preferredTime: string;
  deliveryType: string;
  paymentMethod: string;
  notes: string;
};

// ─── Step Components ──────────────────────────────────────────────────────────

function StepSelectProducts({
  cart,
  onCartChange,
}: {
  cart: CartEntry[];
  onCartChange: (cart: CartEntry[]) => void;
}) {
  const [categoryFilter, setCategoryFilter] = useState("All");

  const categories = [
    "All",
    ...Array.from(new Set(PRODUCTS.map((p) => p.category))),
  ];

  const filtered =
    categoryFilter === "All"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === categoryFilter);

  const getQty = (productId: string) =>
    cart.find((c) => c.productId === productId)?.qty ?? 0;

  const setQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      onCartChange(cart.filter((c) => c.productId !== productId));
    } else {
      const exists = cart.find((c) => c.productId === productId);
      if (exists) {
        onCartChange(
          cart.map((c) => (c.productId === productId ? { ...c, qty } : c)),
        );
      } else {
        onCartChange([...cart, { productId, qty }]);
      }
    }
  };

  const totalItems = cart.reduce((s, c) => s + c.qty, 0);
  const subtotal = cart.reduce((s, c) => {
    const p = PRODUCTS.find((pr) => pr.id === c.productId);
    return s + (p?.price ?? 0) * c.qty;
  }, 0);

  return (
    <TwoColLayout>
      {/* Product selection */}
      <ContentCard>
        <CardHeader>
          <HiOutlineCube />
          <div>
            <h2>Select Products</h2>
            <p>Browse and add products to your order</p>
          </div>
        </CardHeader>
        <CardBody>
          <CategoryTabs>
            {categories.map((cat) => (
              <CategoryTab
                key={cat}
                $active={categoryFilter === cat}
                onClick={() => setCategoryFilter(cat)}
              >
                {cat}
              </CategoryTab>
            ))}
          </CategoryTabs>

          <ProductGrid>
            {filtered.map((product) => {
              const qty = getQty(product.id);
              const outOfStock = product.stock === 0;
              const isSelected = qty > 0;

              return (
                <ProductCard
                  key={product.id}
                  $selected={isSelected}
                  $outOfStock={outOfStock}
                  onClick={() =>
                    !outOfStock && !isSelected && setQty(product.id, 1)
                  }
                >
                  {outOfStock && (
                    <OutOfStockBadge>Out of stock</OutOfStockBadge>
                  )}
                  {isSelected && (
                    <SelectedBadge>
                      <HiOutlineCheckCircle />
                    </SelectedBadge>
                  )}
                  <ProductEmoji>{product.emoji}</ProductEmoji>
                  <ProductName>{product.name}</ProductName>
                  <ProductMeta>
                    {product.unit} · SKU: {product.sku}
                  </ProductMeta>
                  <ProductPrice>
                    {product.price} TND
                    <span
                      style={{
                        fontSize: "1.2rem",
                        fontWeight: 400,
                        color: "var(--color-grey-400)",
                      }}
                    >
                      /{product.unit}
                    </span>
                  </ProductPrice>
                  <StockIndicator $low={product.stock < 20}>
                    {product.stock < 20 ? "⚠️" : "✅"} {product.stock} in stock
                  </StockIndicator>

                  {isSelected && (
                    <QuantityControl onClick={(e) => e.stopPropagation()}>
                      <QtyBtn onClick={() => setQty(product.id, qty - 1)}>
                        <HiOutlineMinus />
                      </QtyBtn>
                      <QtyDisplay>{qty}</QtyDisplay>
                      <QtyBtn
                        onClick={() => setQty(product.id, qty + 1)}
                        disabled={qty >= product.stock}
                      >
                        <HiOutlinePlus />
                      </QtyBtn>
                    </QuantityControl>
                  )}
                </ProductCard>
              );
            })}
          </ProductGrid>
        </CardBody>
      </ContentCard>

      {/* Cart */}
      <CartPanel>
        <CartHeader>
          <HiOutlineShoppingCart />
          <h3>Your Cart</h3>
          <span>
            {totalItems} item{totalItems !== 1 ? "s" : ""}
          </span>
        </CartHeader>

        <CartItems>
          {cart.length === 0 ? (
            <CartEmpty>
              <div>🛒</div>
              <p>
                No products added yet.
                <br />
                Click a product to add it.
              </p>
            </CartEmpty>
          ) : (
            cart.map((entry) => {
              const p = PRODUCTS.find((pr) => pr.id === entry.productId)!;
              return (
                <CartItem key={entry.productId}>
                  <CartItemEmoji>{p.emoji}</CartItemEmoji>
                  <CartItemInfo>
                    <CartItemName>{p.name}</CartItemName>
                    <CartItemPrice>
                      {p.price} TND × {entry.qty} ={" "}
                      <strong>
                        {(p.price * entry.qty).toLocaleString()} TND
                      </strong>
                    </CartItemPrice>
                  </CartItemInfo>
                  <CartItemQty>
                    <CartQtyBtn
                      onClick={() => setQty(entry.productId, entry.qty - 1)}
                    >
                      <HiOutlineMinus />
                    </CartQtyBtn>
                    <CartQtyNum>{entry.qty}</CartQtyNum>
                    <CartQtyBtn
                      onClick={() => setQty(entry.productId, entry.qty + 1)}
                      disabled={entry.qty >= p.stock}
                    >
                      <HiOutlinePlus />
                    </CartQtyBtn>
                  </CartItemQty>
                  <CartRemove onClick={() => setQty(entry.productId, 0)}>
                    <HiOutlineTrash />
                  </CartRemove>
                </CartItem>
              );
            })
          )}
        </CartItems>

        <CartDivider />
        <CartSummary>
          <CartRow>
            <span>Subtotal ({totalItems} items)</span>
            <span>{subtotal.toLocaleString()} TND</span>
          </CartRow>
          <CartRow>
            <span>Delivery</span>
            <span>Calculated next</span>
          </CartRow>
          <CartRow $total>
            <span>Estimated Total</span>
            <span>{subtotal.toLocaleString()} TND</span>
          </CartRow>
        </CartSummary>
      </CartPanel>
    </TwoColLayout>
  );
}

function StepDeliveryDetails({
  details,
  onChange,
}: {
  details: DeliveryDetails;
  onChange: (d: DeliveryDetails) => void;
}) {
  const set = (key: keyof DeliveryDetails, val: string) =>
    onChange({ ...details, [key]: val });

  const selectedDelivery = DELIVERY_OPTIONS.find(
    (o) => o.id === details.deliveryType,
  );

  return (
    <ContentCard>
      <CardHeader>
        <HiOutlineTruck />
        <div>
          <h2>Delivery Details</h2>
          <p>Where and when should we deliver?</p>
        </div>
      </CardHeader>
      <CardBody>
        <FormGrid>
          <FormGroup className="full">
            <Label>
              <HiOutlineMapPin />
              Delivery Address
            </Label>
            <StyledInput
              type="text"
              placeholder="Street address, building, floor..."
              value={details.address}
              onChange={(e) => set("address", e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>City</Label>
            <StyledSelect
              value={details.city}
              onChange={(e) => set("city", e.target.value)}
            >
              <option value="">Select city...</option>
              <option>Tunis</option>
              <option>Ariana</option>
              <option>La Marsa</option>
              <option>Ben Arous</option>
              <option>Bizerte</option>
              <option>Sousse</option>
              <option>Nabeul</option>
            </StyledSelect>
          </FormGroup>

          <FormGroup>
            <Label>
              <HiOutlineCalendar />
              Preferred Date
            </Label>
            <StyledInput
              type="date"
              value={details.preferredDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => set("preferredDate", e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label>Preferred Time Window</Label>
            <StyledSelect
              value={details.preferredTime}
              onChange={(e) => set("preferredTime", e.target.value)}
            >
              <option value="">Any time</option>
              <option value="morning">Morning (8:00 – 12:00)</option>
              <option value="afternoon">Afternoon (12:00 – 17:00)</option>
              <option value="evening">Evening (17:00 – 20:00)</option>
            </StyledSelect>
          </FormGroup>

          <FormGroup>
            <Label>
              <HiOutlineCurrencyDollar />
              Payment Method
            </Label>
            <StyledSelect
              value={details.paymentMethod}
              onChange={(e) => set("paymentMethod", e.target.value)}
            >
              {PAYMENT_METHODS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </StyledSelect>
          </FormGroup>
        </FormGrid>

        <div style={{ marginTop: "2.4rem" }}>
          <Label style={{ marginBottom: "1.2rem", display: "block" }}>
            <HiOutlineTruck />
            Delivery Speed
          </Label>
          <DeliveryOptionGrid>
            {DELIVERY_OPTIONS.map((opt) => (
              <DeliveryOption
                key={opt.id}
                $selected={details.deliveryType === opt.id}
                onClick={() => set("deliveryType", opt.id)}
              >
                <div className="icon">{opt.icon}</div>
                <div className="title">{opt.title}</div>
                <div className="sub">{opt.sub}</div>
                <div className="price">{opt.priceLabel}</div>
              </DeliveryOption>
            ))}
          </DeliveryOptionGrid>
        </div>

        <div style={{ marginTop: "2.4rem" }}>
          <FormGroup className="full">
            <Label>
              <HiOutlineChatBubbleLeftEllipsis />
              Special Instructions (optional)
            </Label>
            <StyledTextarea
              placeholder="Gate code, contact number, cold storage requirements..."
              value={details.notes}
              onChange={(e) => set("notes", e.target.value)}
            />
          </FormGroup>
        </div>
      </CardBody>
    </ContentCard>
  );
}

function StepReview({
  cart,
  details,
}: {
  cart: CartEntry[];
  details: DeliveryDetails;
}) {
  const deliveryFee =
    DELIVERY_OPTIONS.find((o) => o.id === details.deliveryType)?.price ?? 0;
  const subtotal = cart.reduce((s, c) => {
    const p = PRODUCTS.find((pr) => pr.id === c.productId);
    return s + (p?.price ?? 0) * c.qty;
  }, 0);
  const total = subtotal + deliveryFee;

  return (
    <ContentCard>
      <CardHeader>
        <HiOutlineDocumentText />
        <div>
          <h2>Review Your Order</h2>
          <p>Please verify all details before submitting</p>
        </div>
      </CardHeader>
      <CardBody>
        <ReviewSection>
          <ReviewSectionTitle>
            <HiOutlineCube />
            Products ({cart.length})
          </ReviewSectionTitle>
          {cart.map((entry) => {
            const p = PRODUCTS.find((pr) => pr.id === entry.productId)!;
            return (
              <ReviewProductRow key={entry.productId}>
                <span className="emoji">{p.emoji}</span>
                <div className="name">
                  {p.name}
                  <br />
                  <span
                    style={{
                      fontSize: "1.2rem",
                      color: "var(--color-grey-400)",
                      fontWeight: 400,
                    }}
                  >
                    {p.unit} · {p.price} TND each
                  </span>
                </div>
                <span className="qty">× {entry.qty}</span>
                <span className="total">
                  {(p.price * entry.qty).toLocaleString()} TND
                </span>
              </ReviewProductRow>
            );
          })}
          <PriceSummaryBox>
            <PriceLine>
              <span>Subtotal</span>
              <span>{subtotal.toLocaleString()} TND</span>
            </PriceLine>
            <PriceLine>
              <span>
                Delivery (
                {
                  DELIVERY_OPTIONS.find((o) => o.id === details.deliveryType)
                    ?.title
                }
                )
              </span>
              <span>{deliveryFee === 0 ? "Free" : `${deliveryFee} TND`}</span>
            </PriceLine>
            <PriceLine $total>
              <span>Total</span>
              <span>{total.toLocaleString()} TND</span>
            </PriceLine>
          </PriceSummaryBox>
        </ReviewSection>

        <ReviewSection>
          <ReviewSectionTitle>
            <HiOutlineTruck />
            Delivery Information
          </ReviewSectionTitle>
          <ReviewGrid>
            <ReviewItem>
              <div className="label">Address</div>
              <div className="value">{details.address || "—"}</div>
            </ReviewItem>
            <ReviewItem>
              <div className="label">City</div>
              <div className="value">{details.city || "—"}</div>
            </ReviewItem>
            <ReviewItem>
              <div className="label">Preferred Date</div>
              <div className="value">{details.preferredDate || "Flexible"}</div>
            </ReviewItem>
            <ReviewItem>
              <div className="label">Time Window</div>
              <div className="value">{details.preferredTime || "Any time"}</div>
            </ReviewItem>
            <ReviewItem>
              <div className="label">Delivery Speed</div>
              <div className="value">
                {
                  DELIVERY_OPTIONS.find((o) => o.id === details.deliveryType)
                    ?.title
                }
              </div>
            </ReviewItem>
            <ReviewItem>
              <div className="label">Payment</div>
              <div className="value">
                {
                  PAYMENT_METHODS.find((m) => m.value === details.paymentMethod)
                    ?.label
                }
              </div>
            </ReviewItem>
          </ReviewGrid>
          {details.notes && (
            <div
              style={{
                marginTop: "1.2rem",
                padding: "1.2rem",
                background: "var(--color-grey-50)",
                borderRadius: "var(--border-radius-sm)",
                fontSize: "1.3rem",
                color: "var(--color-grey-700)",
              }}
            >
              <strong>Notes:</strong> {details.notes}
            </div>
          )}
        </ReviewSection>
      </CardBody>
    </ContentCard>
  );
}

function StepSuccess({
  orderId,
  total,
  deliveryType,
  navigate,
}: {
  orderId: string;
  total: number;
  deliveryType: string;
  navigate: (path: string) => void;
}) {
  const option = DELIVERY_OPTIONS.find((o) => o.id === deliveryType);

  return (
    <ContentCard>
      <SuccessWrapper>
        <SuccessIcon>
          <HiOutlineCheckCircle />
        </SuccessIcon>
        <SuccessTitle>Order Placed! 🎉</SuccessTitle>
        <p
          style={{
            fontSize: "1.6rem",
            color: "var(--color-grey-600)",
            margin: "0 0 0.8rem 0",
          }}
        >
          Your order has been successfully submitted.
        </p>
        <SuccessOrderId>#{orderId}</SuccessOrderId>

        <SuccessDetails>
          <SuccessDetailCard>
            <div className="icon">💰</div>
            <div className="label">Total Amount</div>
            <div className="value">{total.toLocaleString()} TND</div>
          </SuccessDetailCard>
          <SuccessDetailCard>
            <div className="icon">{option?.icon}</div>
            <div className="label">Delivery</div>
            <div className="value">{option?.title}</div>
          </SuccessDetailCard>
          <SuccessDetailCard>
            <div className="icon">📋</div>
            <div className="label">Status</div>
            <div className="value">Confirmed</div>
          </SuccessDetailCard>
        </SuccessDetails>

        <SuccessActions>
          <NavBtn onClick={() => navigate("/orders")} $primary>
            <HiOutlineDocumentText />
            View My Orders
          </NavBtn>
          <NavBtn onClick={() => navigate("/orders")}>
            <HiOutlineTruck />
            Track My Order
          </NavBtn>
        </SuccessActions>
      </SuccessWrapper>
    </ContentCard>
  );
}

// ─── Steps Config ─────────────────────────────────────────────────────────────

const STEPS = [
  { label: "Products", sub: "Select items" },
  { label: "Delivery", sub: "Where & when" },
  { label: "Review", sub: "Confirm order" },
  { label: "Done", sub: "Order placed" },
];

// ─── Main Component ───────────────────────────────────────────────────────────

function NewOrder() {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const [step, setStep] = useState(0);
  const [cart, setCart] = useState<CartEntry[]>([]);
  const [details, setDetails] = useState<DeliveryDetails>({
    address: "",
    city: "",
    preferredDate: "",
    preferredTime: "",
    deliveryType: "standard",
    paymentMethod: "invoice",
    notes: "",
  });
  const [orderId, setOrderId] = useState("");

  const deliveryFee =
    DELIVERY_OPTIONS.find((o) => o.id === details.deliveryType)?.price ?? 0;
  const subtotal = cart.reduce((s, c) => {
    const p = PRODUCTS.find((pr) => pr.id === c.productId);
    return s + (p?.price ?? 0) * c.qty;
  }, 0);
  const total = subtotal + deliveryFee;

  const canProceed = () => {
    if (step === 0) return cart.length > 0;
    if (step === 1) return details.address.trim() !== "" && details.city !== "";
    return true;
  };

  const handleNext = () => {
    if (step === 2) {
      // Submit order
      const id = `ORD-${String(Math.floor(Math.random() * 900) + 100)}`;
      setOrderId(id);
      addNotification(
        "✅ Order Placed Successfully",
        `Order ${id} has been submitted for ${total.toLocaleString()} TND`,
        "success",
        { priority: "high", playSound: true, persistent: true },
      );
    }
    setStep((s) => s + 1);
  };

  return (
    <PageLayout>
      {/* Page Header */}
      <div>
        <Heading as="h1">Place New Order</Heading>
        <p
          style={{
            color: "var(--color-grey-600)",
            marginTop: "0.4rem",
            fontSize: "1.5rem",
          }}
        >
          Browse products and schedule your delivery
        </p>
      </div>

      {/* Stepper */}
      <StepperWrapper>
        <StepperTrack>
          {STEPS.map((s, i) => (
            <>
              <StepItem
                key={s.label}
                $active={step === i}
                $done={step > i}
                onClick={() => step > i && setStep(i)}
              >
                <StepCircle $active={step === i} $done={step > i}>
                  {step > i ? <HiOutlineCheckCircle /> : i + 1}
                </StepCircle>
                <StepLabel>
                  <StepTitle $active={step === i} $done={step > i}>
                    {s.label}
                  </StepTitle>
                  <StepSub>{s.sub}</StepSub>
                </StepLabel>
              </StepItem>
              {i < STEPS.length - 1 && (
                <StepConnector key={`conn-${i}`} $done={step > i} />
              )}
            </>
          ))}
        </StepperTrack>
      </StepperWrapper>

      {/* Step Content */}
      {step === 0 && <StepSelectProducts cart={cart} onCartChange={setCart} />}
      {step === 1 && (
        <StepDeliveryDetails details={details} onChange={setDetails} />
      )}
      {step === 2 && <StepReview cart={cart} details={details} />}
      {step === 3 && (
        <StepSuccess
          orderId={orderId}
          total={total}
          deliveryType={details.deliveryType}
          navigate={navigate}
        />
      )}

      {/* Navigation */}
      {step < 3 && (
        <ContentCard>
          <NavBar>
            <NavBtn
              onClick={() =>
                step === 0 ? navigate("/dashboard") : setStep((s) => s - 1)
              }
              disabled={false}
            >
              <HiOutlineArrowLeft />
              {step === 0 ? "Back to Dashboard" : "Back"}
            </NavBtn>

            <div style={{ fontSize: "1.3rem", color: "var(--color-grey-500)" }}>
              Step {step + 1} of {STEPS.length - 1}
            </div>

            <NavBtn $primary onClick={handleNext} disabled={!canProceed()}>
              {step === 2 ? "Place Order" : "Continue"}
              <HiOutlineArrowRight />
            </NavBtn>
          </NavBar>
        </ContentCard>
      )}
    </PageLayout>
  );
}

export default NewOrder;
