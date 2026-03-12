import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import {
  HiOutlineUsers,
  HiOutlineUserPlus,
  HiOutlineMagnifyingGlass,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineNoSymbol,
  HiOutlineCheckCircle,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineXMark,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineCalendar,
  HiOutlineShieldCheck,
  HiOutlineTruck,
  HiOutlineBuildingStorefront,
  HiOutlineUser,
  HiOutlineArrowDownTray,
  HiOutlineChartBar,
  HiOutlineFunnel,
  HiOutlineEllipsisVertical,
  HiOutlineKey,
  HiOutlineMapPin,
  HiOutlineIdentification,
} from "react-icons/hi2";
import Heading from "../UI/Heading";
import Button from "../UI/Button";
import StatusBadge from "../UI/StatusBadge";
import Modal from "../UI/Modal";
import ConfirmDelete from "../UI/ConfirmDelete";
import { useNotifications } from "../hooks/useNotifications";

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(1rem); }
  to   { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(2rem); }
  to   { opacity: 1; transform: translateX(0); }
`;

// ─── Page Layout ──────────────────────────────────────────────────────────────

const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  animation: ${fadeUp} 0.3s ease-out;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.6rem;
  flex-wrap: wrap;
`;

const TitleBlock = styled.div`
  & h1 {
    margin-bottom: 0.4rem;
  }
  & p {
    font-size: 1.4rem;
    color: var(--color-grey-500);
    margin: 0;
  }
`;

// ─── Stats strip ──────────────────────────────────────────────────────────────

const StatsStrip = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.6rem;
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 500px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const StatBox = styled.div<{ $color: string }>`
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2rem 2.4rem;
  display: flex;
  align-items: center;
  gap: 1.6rem;
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: var(--shadow-sm);
  }
`;

const StatIcon = styled.div<{ $color: string }>`
  width: 4.4rem;
  height: 4.4rem;
  border-radius: var(--border-radius-sm);
  background: ${(p) => p.$color}18;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  & svg {
    width: 2.2rem;
    height: 2.2rem;
    color: ${(p) => p.$color};
  }
`;

const StatBody = styled.div`
  & .val {
    font-size: 2.4rem;
    font-weight: 800;
    color: var(--color-grey-900);
    line-height: 1;
  }
  & .lbl {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--color-grey-500);
    margin-top: 0.3rem;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }
`;

// ─── Filters bar ──────────────────────────────────────────────────────────────

const FiltersBar = styled.div`
  display: flex;
  gap: 1.2rem;
  align-items: center;
  flex-wrap: wrap;
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 1.6rem 2rem;
`;

const SearchWrap = styled.div`
  position: relative;
  flex: 1;
  min-width: 22rem;
  & svg {
    position: absolute;
    left: 1.2rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1.8rem;
    height: 1.8rem;
    color: var(--color-grey-400);
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.9rem 1.4rem 0.9rem 4rem;
  border: 2px solid var(--color-grey-200);
  border-radius: var(--border-radius-sm);
  font-size: 1.4rem;
  font-family: inherit;
  color: var(--color-grey-900);
  background: var(--color-grey-0);
  transition: border-color 0.18s;
  &:focus {
    outline: none;
    border-color: var(--color-brand-600);
  }
  &::placeholder {
    color: var(--color-grey-300);
  }
`;

const Divider = styled.div`
  width: 1px;
  height: 3.2rem;
  background: var(--color-grey-200);
  @media (max-width: 768px) {
    display: none;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
`;

const FilterChip = styled.button<{ $active: boolean; $color?: string }>`
  padding: 0.7rem 1.4rem;
  border: 2px solid
    ${(p) =>
      p.$active
        ? (p.$color ?? "var(--color-brand-600)")
        : "var(--color-grey-200)"};
  border-radius: 100px;
  background: ${(p) =>
    p.$active
      ? p.$color
        ? p.$color + "18"
        : "var(--color-brand-50)"
      : "transparent"};
  color: ${(p) =>
    p.$active
      ? (p.$color ?? "var(--color-brand-700)")
      : "var(--color-grey-600)"};
  font-size: 1.3rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s;
  white-space: nowrap;
  &:hover {
    border-color: ${(p) => p.$color ?? "var(--color-brand-600)"};
    color: ${(p) => p.$color ?? "var(--color-brand-700)"};
  }
`;

// ─── Main layout (table + drawer) ─────────────────────────────────────────────

const MainArea = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: flex-start;
`;

const TableCard = styled.div`
  flex: 1;
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  overflow: hidden;
  min-width: 0;
`;

const TableMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.4rem 2rem;
  border-bottom: 1px solid var(--color-grey-100);
  background: var(--color-grey-50);
  flex-wrap: wrap;
  gap: 1rem;
`;

const ResultCount = styled.div`
  font-size: 1.3rem;
  color: var(--color-grey-600);
  font-weight: 500;
  & strong {
    color: var(--color-grey-900);
    font-weight: 700;
  }
`;

const ExportBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.7rem 1.4rem;
  border: 1.5px solid var(--color-grey-200);
  border-radius: var(--border-radius-sm);
  background: var(--color-grey-0);
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--color-grey-600);
  cursor: pointer;
  transition: all 0.18s;
  & svg {
    width: 1.5rem;
    height: 1.5rem;
  }
  &:hover {
    border-color: var(--color-brand-400);
    color: var(--color-brand-700);
    background: var(--color-brand-50);
  }
`;

// ─── Table ────────────────────────────────────────────────────────────────────

const THead = styled.div`
  display: grid;
  grid-template-columns: 2.6fr 1.6fr 1.2fr 1.1fr 1fr 0.5fr;
  gap: 1.6rem;
  padding: 1.2rem 2rem;
  background: var(--color-grey-50);
  border-bottom: 1px solid var(--color-grey-100);
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--color-grey-500);
  letter-spacing: 0.3px;
  @media (max-width: 1100px) {
    display: none;
  }
`;

const TRow = styled.div<{ $selected: boolean }>`
  display: grid;
  grid-template-columns: 2.6fr 1.6fr 1.2fr 1.1fr 1fr 0.5fr;
  gap: 1.6rem;
  padding: 1.4rem 2rem;
  border-bottom: 1px solid var(--color-grey-100);
  align-items: center;
  cursor: pointer;
  background: ${(p) =>
    p.$selected ? "var(--color-brand-50)" : "var(--color-grey-0)"};
  border-left: 3px solid
    ${(p) => (p.$selected ? "var(--color-brand-600)" : "transparent")};
  transition: all 0.15s;
  &:hover {
    background: ${(p) =>
      p.$selected ? "var(--color-brand-50)" : "var(--color-grey-50)"};
  }
  &:last-child {
    border-bottom: none;
  }
  @media (max-width: 1100px) {
    display: none;
  }
`;

const UserCell = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
`;

const Avatar = styled.div<{ $role: string }>`
  width: 3.8rem;
  height: 3.8rem;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.4rem;
  color: white;
  background: ${(p) =>
    p.$role === "admin"
      ? "linear-gradient(135deg, #ef4444, #dc2626)"
      : p.$role === "distributor"
        ? "linear-gradient(135deg, #6366f1, #4f46e5)"
        : "linear-gradient(135deg, #22c55e, #16a34a)"};
`;

const UserMeta = styled.div`
  & .name {
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--color-grey-900);
  }
  & .email {
    font-size: 1.2rem;
    color: var(--color-grey-500);
    margin-top: 0.15rem;
  }
`;

const RolePill = styled.span<{ $role: string }>`
  padding: 0.4rem 1rem;
  border-radius: 100px;
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: capitalize;
  background: ${(p) =>
    p.$role === "admin"
      ? "var(--color-red-50)"
      : p.$role === "distributor"
        ? "#eef2ff"
        : "var(--color-green-50)"};
  color: ${(p) =>
    p.$role === "admin"
      ? "var(--color-red-700)"
      : p.$role === "distributor"
        ? "#4338ca"
        : "var(--color-green-700)"};
  border: 1px solid
    ${(p) =>
      p.$role === "admin"
        ? "var(--color-red-200)"
        : p.$role === "distributor"
          ? "#c7d2fe"
          : "var(--color-green-200)"};
`;

const MenuBtn = styled.button`
  width: 3.2rem;
  height: 3.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid var(--color-grey-200);
  border-radius: var(--border-radius-sm);
  background: var(--color-grey-0);
  color: var(--color-grey-500);
  cursor: pointer;
  transition: all 0.18s;
  & svg {
    width: 1.6rem;
    height: 1.6rem;
  }
  &:hover {
    border-color: var(--color-brand-400);
    color: var(--color-brand-700);
    background: var(--color-brand-50);
  }
`;

// ─── Mobile cards ─────────────────────────────────────────────────────────────

const MobileList = styled.div`
  display: none;
  @media (max-width: 1100px) {
    display: flex;
    flex-direction: column;
    gap: 0;
  }
`;

const MobileCard = styled.div<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 1.4rem;
  padding: 1.6rem 2rem;
  border-bottom: 1px solid var(--color-grey-100);
  cursor: pointer;
  background: ${(p) =>
    p.$selected ? "var(--color-brand-50)" : "var(--color-grey-0)"};
  border-left: 3px solid
    ${(p) => (p.$selected ? "var(--color-brand-600)" : "transparent")};
  transition: background 0.15s;
  &:last-child {
    border-bottom: none;
  }
`;

const MobileInfo = styled.div`
  flex: 1;
  min-width: 0;
  & .name {
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--color-grey-900);
  }
  & .email {
    font-size: 1.2rem;
    color: var(--color-grey-500);
    margin-top: 0.2rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const MobileBadges = styled.div`
  display: flex;
  gap: 0.6rem;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

// ─── Empty state ──────────────────────────────────────────────────────────────

const EmptyState = styled.div`
  padding: 6rem 2rem;
  text-align: center;
  & svg {
    width: 6rem;
    height: 6rem;
    color: var(--color-grey-300);
    margin-bottom: 1.6rem;
  }
  & h3 {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--color-grey-600);
    margin-bottom: 0.6rem;
  }
  & p {
    font-size: 1.4rem;
    color: var(--color-grey-400);
  }
`;

// ─── Drawer ───────────────────────────────────────────────────────────────────

const Drawer = styled.div`
  width: 36rem;
  flex-shrink: 0;
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  overflow: hidden;
  animation: ${slideIn} 0.25s ease-out;
  position: sticky;
  top: 2.4rem;
  @media (max-width: 1300px) {
    display: none;
  }
`;

const DrawerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.8rem 2.4rem;
  border-bottom: 1px solid var(--color-grey-100);
  background: linear-gradient(
    135deg,
    var(--color-brand-50),
    var(--color-grey-0)
  );
`;

const CloseBtn = styled.button`
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1.5px solid var(--color-grey-200);
  background: var(--color-grey-0);
  color: var(--color-grey-500);
  cursor: pointer;
  transition: all 0.18s;
  & svg {
    width: 1.6rem;
    height: 1.6rem;
  }
  &:hover {
    border-color: var(--color-red-300);
    color: var(--color-red-600);
    background: var(--color-red-50);
  }
`;

const DrawerAvatar = styled.div<{ $role: string }>`
  width: 7.2rem;
  height: 7.2rem;
  border-radius: 50%;
  margin: 2.4rem auto 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 2.6rem;
  color: white;
  background: ${(p) =>
    p.$role === "admin"
      ? "linear-gradient(135deg, #ef4444, #dc2626)"
      : p.$role === "distributor"
        ? "linear-gradient(135deg, #6366f1, #4f46e5)"
        : "linear-gradient(135deg, #22c55e, #16a34a)"};
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  border: 4px solid white;
`;

const DrawerName = styled.div`
  text-align: center;
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--color-grey-900);
  padding: 0 2.4rem;
`;

const DrawerSub = styled.div`
  text-align: center;
  font-size: 1.3rem;
  color: var(--color-grey-500);
  margin-top: 0.4rem;
  padding: 0 2.4rem;
`;

const DrawerBadges = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.8rem;
  margin: 1.2rem 0 0;
  padding: 0 2.4rem 2rem;
  border-bottom: 1px solid var(--color-grey-100);
`;

const DrawerSection = styled.div`
  padding: 1.8rem 2.4rem;
  border-bottom: 1px solid var(--color-grey-100);
  &:last-child {
    border-bottom: none;
  }
`;

const DrawerSectionTitle = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-grey-400);
  margin-bottom: 1.2rem;
`;

const InfoLine = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem 0;
  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-brand-500);
    flex-shrink: 0;
  }
  & .lbl {
    font-size: 1.2rem;
    color: var(--color-grey-500);
    min-width: 9rem;
  }
  & .val {
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--color-grey-900);
  }
`;

const DrawerActions = styled.div`
  padding: 2rem 2.4rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ActionRow = styled.button<{ $danger?: boolean; $warn?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1.2rem 1.6rem;
  border: 1.5px solid
    ${(p) =>
      p.$danger
        ? "var(--color-red-200)"
        : p.$warn
          ? "var(--color-yellow-200)"
          : "var(--color-grey-200)"};
  border-radius: var(--border-radius-sm);
  background: ${(p) =>
    p.$danger
      ? "var(--color-red-50)"
      : p.$warn
        ? "var(--color-yellow-50)"
        : "var(--color-grey-0)"};
  color: ${(p) =>
    p.$danger
      ? "var(--color-red-700)"
      : p.$warn
        ? "var(--color-yellow-700)"
        : "var(--color-grey-700)"};
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  text-align: left;
  transition: all 0.18s;
  & svg {
    width: 1.8rem;
    height: 1.8rem;
    flex-shrink: 0;
  }
  &:hover {
    filter: brightness(0.95);
    transform: translateX(2px);
  }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
  }
`;

// ─── Form Modal ───────────────────────────────────────────────────────────────

const FormWrap = styled.div`
  width: 56rem;
  max-width: 95vw;
`;

const FormHeader = styled.div`
  padding: 2rem 2.4rem;
  border-bottom: 1px solid var(--color-grey-100);
`;

const FormBody = styled.div`
  padding: 2.4rem;
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
`;

const FormGrid = styled.div<{ $cols?: number }>`
  display: grid;
  grid-template-columns: repeat(${(p) => p.$cols ?? 2}, 1fr);
  gap: 1.8rem;
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div<{ $span?: number }>`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  ${(p) => (p.$span ? `grid-column: span ${p.$span};` : "")}
`;

const Label = styled.label`
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--color-grey-700);
`;

const Input = styled.input`
  padding: 1rem 1.4rem;
  border: 2px solid var(--color-grey-200);
  border-radius: var(--border-radius-sm);
  font-size: 1.4rem;
  font-family: inherit;
  color: var(--color-grey-900);
  background: var(--color-grey-0);
  transition: border-color 0.18s;
  &:focus {
    outline: none;
    border-color: var(--color-brand-600);
  }
  &::placeholder {
    color: var(--color-grey-300);
  }
`;

const Select = styled.select`
  padding: 1rem 1.4rem;
  border: 2px solid var(--color-grey-200);
  border-radius: var(--border-radius-sm);
  font-size: 1.4rem;
  font-family: inherit;
  color: var(--color-grey-900);
  background: var(--color-grey-0);
  cursor: pointer;
  &:focus {
    outline: none;
    border-color: var(--color-brand-600);
  }
`;

const FormFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1.2rem;
  padding: 1.8rem 2.4rem;
  border-top: 1px solid var(--color-grey-100);
`;

// ─── Types ────────────────────────────────────────────────────────────────────

type Role = "admin" | "distributor" | "client";
type Status = "active" | "inactive";

type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  status: Status;
  joinedDate: string;
  lastLogin: string;
  city?: string;
  notes?: string;
  // distributor extras
  vehicle?: string;
  zones?: string[];
  // client extras
  storeName?: string;
  taxId?: string;
};

// ─── Mock data ────────────────────────────────────────────────────────────────

const INITIAL_USERS: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@taba3ni.tn",
    phone: "+216 71 000 000",
    role: "admin",
    status: "active",
    joinedDate: "2022-01-10",
    lastLogin: "Today",
    city: "Tunis",
    notes: "Primary system administrator",
  },
  {
    id: "2",
    name: "Ahmed Mahmoudi",
    email: "ahmed.mahmoudi@taba3ni.tn",
    phone: "+216 98 123 456",
    role: "distributor",
    status: "active",
    joinedDate: "2023-03-15",
    lastLogin: "Today",
    city: "Tunis",
    vehicle: "Refrigerated Truck — 123 TU 1234",
    zones: ["Tunis", "Lac 1", "Lac 2", "Les Berges du Lac"],
  },
  {
    id: "3",
    name: "Mohamed Trabelsi",
    email: "mohamed.trabelsi@taba3ni.tn",
    phone: "+216 98 234 567",
    role: "distributor",
    status: "active",
    joinedDate: "2023-05-20",
    lastLogin: "Yesterday",
    city: "Ariana",
    vehicle: "Van — 456 TU 5678",
    zones: ["Ariana", "Manouba", "Ennasr"],
  },
  {
    id: "4",
    name: "Karim Belaid",
    email: "karim.belaid@taba3ni.tn",
    phone: "+216 98 345 678",
    role: "distributor",
    status: "active",
    joinedDate: "2024-01-08",
    lastLogin: "2 days ago",
    city: "Ben Arous",
    vehicle: "Refrigerated Van — 789 TU 9012",
    zones: ["Ben Arous", "La Marsa", "Carthage"],
  },
  {
    id: "5",
    name: "Carrefour Lac 2",
    email: "client@taba3ni.tn",
    phone: "+216 71 123 456",
    role: "client",
    status: "active",
    joinedDate: "2023-06-20",
    lastLogin: "Today",
    city: "Tunis",
    storeName: "Carrefour Lac 2",
    taxId: "TN-123456789",
  },
  {
    id: "6",
    name: "Magasin Général Marsa",
    email: "general.marsa@email.com",
    phone: "+216 71 234 567",
    role: "client",
    status: "inactive",
    joinedDate: "2023-08-14",
    lastLogin: "1 month ago",
    city: "La Marsa",
    storeName: "Magasin Général Marsa",
    taxId: "TN-234567890",
  },
  {
    id: "7",
    name: "Monoprix Menzah",
    email: "monoprix.menzah@email.com",
    phone: "+216 71 345 678",
    role: "client",
    status: "active",
    joinedDate: "2023-11-01",
    lastLogin: "3 days ago",
    city: "Ariana",
    storeName: "Monoprix Menzah",
    taxId: "TN-345678901",
  },
  {
    id: "8",
    name: "Superette Ariana",
    email: "superette.ariana@email.com",
    phone: "+216 71 456 789",
    role: "client",
    status: "active",
    joinedDate: "2024-02-15",
    lastLogin: "1 week ago",
    city: "Ariana",
    storeName: "Superette Ariana",
    taxId: "TN-456789012",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

function formatDate(str: string) {
  return new Date(str).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ─── User Form (Add / Edit) ───────────────────────────────────────────────────

type UserFormProps = {
  initial?: Partial<User>;
  mode: "add" | "edit";
  onSubmit: (data: Partial<User>) => void;
  onClose: () => void;
};

function UserForm({ initial, mode, onSubmit, onClose }: UserFormProps) {
  const [form, setForm] = useState<Partial<User>>({
    name: "",
    email: "",
    phone: "",
    role: "client",
    city: "",
    notes: "",
    vehicle: "",
    taxId: "",
    storeName: "",
    ...initial,
  });

  const set = (k: keyof User, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    if (!form.name?.trim() || !form.email?.trim()) return;
    onSubmit(form);
    onClose();
  };

  return (
    <FormWrap>
      <FormHeader>
        <Heading as="h2">
          {mode === "add" ? "Add New User" : `Edit — ${initial?.name}`}
        </Heading>
      </FormHeader>

      <FormBody>
        {/* Core fields */}
        <FormGrid>
          <FormGroup>
            <Label>Full Name *</Label>
            <Input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Ahmed Mahmoudi"
              autoFocus
            />
          </FormGroup>
          <FormGroup>
            <Label>Email *</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="ahmed@taba3ni.tn"
            />
          </FormGroup>
          <FormGroup>
            <Label>Phone</Label>
            <Input
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="+216 98 000 000"
            />
          </FormGroup>
          <FormGroup>
            <Label>City</Label>
            <Input
              value={form.city}
              onChange={(e) => set("city", e.target.value)}
              placeholder="Tunis"
            />
          </FormGroup>
          <FormGroup>
            <Label>Role *</Label>
            <Select
              value={form.role}
              onChange={(e) => set("role", e.target.value as Role)}
            >
              <option value="admin">Admin</option>
              <option value="distributor">Distributor</option>
              <option value="client">Client</option>
            </Select>
          </FormGroup>
          {mode === "add" && (
            <FormGroup>
              <Label>Temporary Password *</Label>
              <Input type="password" placeholder="Min. 8 characters" />
            </FormGroup>
          )}
        </FormGrid>

        {/* Role-specific extras */}
        {form.role === "distributor" && (
          <div
            style={{
              padding: "1.6rem",
              background: "var(--color-grey-50)",
              borderRadius: "var(--border-radius-sm)",
              border: "1px solid var(--color-grey-100)",
            }}
          >
            <div
              style={{
                fontSize: "1.2rem",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "var(--color-grey-500)",
                marginBottom: "1.4rem",
              }}
            >
              Distributor Details
            </div>
            <FormGrid>
              <FormGroup>
                <Label>Vehicle</Label>
                <Input
                  value={form.vehicle ?? ""}
                  onChange={(e) => set("vehicle", e.target.value)}
                  placeholder="Refrigerated Truck — 123 TU 1234"
                />
              </FormGroup>
              <FormGroup>
                <Label>
                  Delivery Zones{" "}
                  <span
                    style={{ color: "var(--color-grey-400)", fontWeight: 400 }}
                  >
                    (comma-separated)
                  </span>
                </Label>
                <Input
                  value={form.zones?.join(", ") ?? ""}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      zones: e.target.value
                        .split(",")
                        .map((z) => z.trim())
                        .filter(Boolean),
                    }))
                  }
                  placeholder="Tunis, Lac 1, Ariana"
                />
              </FormGroup>
            </FormGrid>
          </div>
        )}

        {form.role === "client" && (
          <div
            style={{
              padding: "1.6rem",
              background: "var(--color-grey-50)",
              borderRadius: "var(--border-radius-sm)",
              border: "1px solid var(--color-grey-100)",
            }}
          >
            <div
              style={{
                fontSize: "1.2rem",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "var(--color-grey-500)",
                marginBottom: "1.4rem",
              }}
            >
              Store Details
            </div>
            <FormGrid>
              <FormGroup>
                <Label>Store Name</Label>
                <Input
                  value={form.storeName ?? ""}
                  onChange={(e) => set("storeName", e.target.value)}
                  placeholder="Carrefour Lac 2"
                />
              </FormGroup>
              <FormGroup>
                <Label>Tax ID / Matricule Fiscal</Label>
                <Input
                  value={form.taxId ?? ""}
                  onChange={(e) => set("taxId", e.target.value)}
                  placeholder="TN-000000000"
                />
              </FormGroup>
            </FormGrid>
          </div>
        )}

        <FormGroup>
          <Label>
            Internal Notes{" "}
            <span style={{ color: "var(--color-grey-400)", fontWeight: 400 }}>
              (admin only)
            </span>
          </Label>
          <Input
            value={form.notes ?? ""}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="Any notes about this user..."
          />
        </FormGroup>
      </FormBody>

      <FormFooter>
        <Button $variation="secondary" $size="medium" onClick={onClose}>
          Cancel
        </Button>
        <Button $variation="primary" $size="medium" onClick={handleSubmit}>
          {mode === "add" ? "Add User" : "Save Changes"}
        </Button>
      </FormFooter>
    </FormWrap>
  );
}

// ─── Reset Password Modal ─────────────────────────────────────────────────────

function ResetPasswordForm({
  user,
  onClose,
}: {
  user: User;
  onClose: () => void;
}) {
  const { addNotification } = useNotifications();
  const [mode, setMode] = useState<"link" | "manual">("link");
  const [newPass, setNewPass] = useState("");

  const handleSubmit = () => {
    if (mode === "link") {
      addNotification(
        "🔑 Reset Link Sent",
        `Password reset email sent to ${user.email}`,
        "success",
        { duration: 4000, persistent: true },
      );
    } else {
      if (!newPass || newPass.length < 8) return;
      addNotification(
        "🔑 Password Updated",
        `Password for ${user.name} has been changed`,
        "success",
        { duration: 4000, persistent: true },
      );
    }
    onClose();
  };

  return (
    <FormWrap style={{ maxWidth: "44rem" }}>
      <FormHeader>
        <Heading as="h2">Reset Password — {user.name}</Heading>
      </FormHeader>
      <FormBody>
        <div style={{ display: "flex", gap: "1rem" }}>
          {(["link", "manual"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                flex: 1,
                padding: "1rem",
                border: `2px solid ${mode === m ? "var(--color-brand-600)" : "var(--color-grey-200)"}`,
                borderRadius: "var(--border-radius-sm)",
                background:
                  mode === m ? "var(--color-brand-50)" : "transparent",
                color:
                  mode === m
                    ? "var(--color-brand-700)"
                    : "var(--color-grey-600)",
                fontSize: "1.3rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.18s",
              }}
            >
              {m === "link" ? "📧 Send Reset Link" : "🔐 Set Manually"}
            </button>
          ))}
        </div>

        {mode === "link" ? (
          <div
            style={{
              padding: "1.6rem",
              background: "var(--color-brand-50)",
              borderRadius: "var(--border-radius-sm)",
              border: "1px solid var(--color-brand-200)",
            }}
          >
            <div
              style={{
                fontSize: "1.4rem",
                fontWeight: 600,
                color: "var(--color-brand-700)",
                marginBottom: "0.4rem",
              }}
            >
              Send reset link to:
            </div>
            <div style={{ fontSize: "1.4rem", color: "var(--color-grey-700)" }}>
              {user.email}
            </div>
            <div
              style={{
                fontSize: "1.2rem",
                color: "var(--color-grey-500)",
                marginTop: "0.8rem",
              }}
            >
              The link will expire in 24 hours.
            </div>
          </div>
        ) : (
          <FormGroup>
            <Label>New Password</Label>
            <Input
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="Min. 8 characters"
              autoFocus
            />
            {newPass.length > 0 && newPass.length < 8 && (
              <span
                style={{ fontSize: "1.2rem", color: "var(--color-red-600)" }}
              >
                Password must be at least 8 characters
              </span>
            )}
          </FormGroup>
        )}
      </FormBody>
      <FormFooter>
        <Button $variation="secondary" $size="medium" onClick={onClose}>
          Cancel
        </Button>
        <Button $variation="primary" $size="medium" onClick={handleSubmit}>
          {mode === "link" ? "Send Reset Link" : "Set Password"}
        </Button>
      </FormFooter>
    </FormWrap>
  );
}

// ─── User Drawer ──────────────────────────────────────────────────────────────

function UserDrawer({
  user,
  onClose,
  onEdit,
  onToggleStatus,
  onResetPassword,
  onDelete,
}: {
  user: User;
  onClose: () => void;
  onEdit: () => void;
  onToggleStatus: () => void;
  onResetPassword: () => void;
  onDelete: () => void;
}) {
  const isAdmin = user.role === "admin";

  return (
    <Drawer>
      <DrawerHeader>
        <div
          style={{
            fontSize: "1.4rem",
            fontWeight: 700,
            color: "var(--color-grey-700)",
          }}
        >
          User Details
        </div>
        <CloseBtn onClick={onClose}>
          <HiOutlineXMark />
        </CloseBtn>
      </DrawerHeader>

      {/* Identity */}
      <DrawerAvatar $role={user.role}>{getInitials(user.name)}</DrawerAvatar>
      <DrawerName>{user.name}</DrawerName>
      <DrawerSub>{user.email}</DrawerSub>
      <DrawerBadges>
        <RolePill $role={user.role}>{user.role}</RolePill>
        <StatusBadge
          $status={user.status === "active" ? "delivered" : "cancelled"}
        >
          {user.status === "active" ? "Active" : "Inactive"}
        </StatusBadge>
      </DrawerBadges>

      {/* Contact info */}
      <DrawerSection>
        <DrawerSectionTitle>Contact</DrawerSectionTitle>
        <InfoLine>
          <HiOutlinePhone />
          <span className="lbl">Phone</span>
          <span className="val">{user.phone}</span>
        </InfoLine>
        {user.city && (
          <InfoLine>
            <HiOutlineMapPin />
            <span className="lbl">City</span>
            <span className="val">{user.city}</span>
          </InfoLine>
        )}
        <InfoLine>
          <HiOutlineCalendar />
          <span className="lbl">Joined</span>
          <span className="val">{formatDate(user.joinedDate)}</span>
        </InfoLine>
        <InfoLine>
          <HiOutlineCalendar />
          <span className="lbl">Last Login</span>
          <span className="val">{user.lastLogin}</span>
        </InfoLine>
      </DrawerSection>

      {/* Role-specific extras */}
      {user.role === "distributor" && user.vehicle && (
        <DrawerSection>
          <DrawerSectionTitle>Distributor Info</DrawerSectionTitle>
          <InfoLine>
            <HiOutlineTruck />
            <span className="lbl">Vehicle</span>
            <span className="val" style={{ fontSize: "1.2rem" }}>
              {user.vehicle}
            </span>
          </InfoLine>
          {user.zones && user.zones.length > 0 && (
            <div style={{ marginTop: "1rem" }}>
              <div
                style={{
                  fontSize: "1.2rem",
                  color: "var(--color-grey-500)",
                  marginBottom: "0.8rem",
                }}
              >
                Delivery Zones
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
                {user.zones.map((z) => (
                  <span
                    key={z}
                    style={{
                      padding: "0.3rem 0.9rem",
                      background: "var(--color-brand-50)",
                      color: "var(--color-brand-700)",
                      borderRadius: "100px",
                      fontSize: "1.2rem",
                      fontWeight: 600,
                      border: "1px solid var(--color-brand-200)",
                    }}
                  >
                    {z}
                  </span>
                ))}
              </div>
            </div>
          )}
        </DrawerSection>
      )}

      {user.role === "client" && (
        <DrawerSection>
          <DrawerSectionTitle>Store Info</DrawerSectionTitle>
          {user.storeName && (
            <InfoLine>
              <HiOutlineBuildingStorefront />
              <span className="lbl">Store</span>
              <span className="val">{user.storeName}</span>
            </InfoLine>
          )}
          {user.taxId && (
            <InfoLine>
              <HiOutlineIdentification />
              <span className="lbl">Tax ID</span>
              <span className="val">{user.taxId}</span>
            </InfoLine>
          )}
        </DrawerSection>
      )}

      {user.notes && (
        <DrawerSection>
          <DrawerSectionTitle>Notes</DrawerSectionTitle>
          <div
            style={{
              fontSize: "1.3rem",
              color: "var(--color-grey-600)",
              lineHeight: "1.6",
            }}
          >
            {user.notes}
          </div>
        </DrawerSection>
      )}

      {/* Actions */}
      <DrawerSection>
        <DrawerSectionTitle>Actions</DrawerSectionTitle>
      </DrawerSection>
      <DrawerActions>
        <ActionRow onClick={onEdit}>
          <HiOutlinePencil />
          Edit User Info
        </ActionRow>
        <ActionRow onClick={onResetPassword}>
          <HiOutlineKey />
          Reset Password
        </ActionRow>
        <ActionRow $warn onClick={onToggleStatus}>
          {user.status === "active" ? (
            <HiOutlineNoSymbol />
          ) : (
            <HiOutlineCheckCircle />
          )}
          {user.status === "active" ? "Deactivate User" : "Reactivate User"}
        </ActionRow>
        <Modal>
          <Modal.Open opens={`delete-drawer-${user.id}`}>
            <ActionRow $danger disabled={isAdmin}>
              <HiOutlineTrash />
              Delete User {isAdmin && "(protected)"}
            </ActionRow>
          </Modal.Open>
          <Modal.Window name={`delete-drawer-${user.id}`}>
            <ConfirmDelete
              resourceName={`user ${user.name}`}
              onConfirm={onDelete}
              onCloseModal={() => {}}
            />
          </Modal.Window>
        </Modal>
      </DrawerActions>
    </Drawer>
  );
}

// ─── Root Component ───────────────────────────────────────────────────────────

type UserManagementProps = {
  userRole?: "admin" | "distributor" | "client";
};

function UserManagement({ userRole = "admin" }: UserManagementProps) {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Modal states
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);

  // Redirect non-admins
  if (userRole !== "admin") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "12rem 2rem",
          textAlign: "center",
          gap: "1.6rem",
        }}
      >
        <div style={{ fontSize: "7rem" }}>🔒</div>
        <h2
          style={{
            fontSize: "2.4rem",
            fontWeight: 800,
            color: "var(--color-grey-700)",
          }}
        >
          Admin Access Only
        </h2>
        <p
          style={{
            fontSize: "1.5rem",
            color: "var(--color-grey-500)",
            maxWidth: "40rem",
          }}
        >
          User Management is only accessible to administrators.
        </p>
        <Button
          $variation="primary"
          $size="medium"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  // Derived data
  const filtered = useMemo(() => {
    return users.filter((u) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.includes(q) ||
        u.city?.toLowerCase().includes(q);
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      const matchesStatus = statusFilter === "all" || u.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const selected = users.find((u) => u.id === selectedId) ?? null;

  // Counts
  const counts = {
    all: users.length,
    admin: users.filter((u) => u.role === "admin").length,
    distributor: users.filter((u) => u.role === "distributor").length,
    client: users.filter((u) => u.role === "client").length,
    active: users.filter((u) => u.status === "active").length,
    inactive: users.filter((u) => u.status === "inactive").length,
  };

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleAdd = (data: Partial<User>) => {
    const u: User = {
      id: String(Date.now()),
      name: data.name!,
      email: data.email!,
      phone: data.phone ?? "",
      role: data.role ?? "client",
      status: "active",
      joinedDate: new Date().toISOString().split("T")[0],
      lastLogin: "Never",
      city: data.city,
      notes: data.notes,
      vehicle: data.vehicle,
      zones: data.zones,
      storeName: data.storeName,
      taxId: data.taxId,
    };
    setUsers((p) => [...p, u]);
    setSelectedId(u.id);
    addNotification(
      "✅ User Added",
      `${u.name} has been added as ${u.role}`,
      "success",
      { duration: 4000, persistent: true },
    );
  };

  const handleEdit = (data: Partial<User>) => {
    setUsers((p) =>
      p.map((u) => (u.id === selectedId ? { ...u, ...data } : u)),
    );
    addNotification(
      "✅ User Updated",
      `${data.name}'s profile has been updated`,
      "success",
      { duration: 3500, persistent: true },
    );
  };

  const handleToggleStatus = (id: string) => {
    const user = users.find((u) => u.id === id)!;
    const next = user.status === "active" ? "inactive" : "active";
    setUsers((p) => p.map((u) => (u.id === id ? { ...u, status: next } : u)));
    addNotification(
      next === "inactive" ? "⚠️ User Deactivated" : "✅ User Reactivated",
      `${user.name} has been ${next === "inactive" ? "deactivated" : "reactivated"}`,
      next === "inactive" ? "warning" : "success",
      { duration: 3500, persistent: true },
    );
  };

  const handleDelete = (id: string) => {
    const user = users.find((u) => u.id === id)!;
    setUsers((p) => p.filter((u) => u.id !== id));
    if (selectedId === id) setSelectedId(null);
    addNotification(
      "User Deleted",
      `${user.name} has been permanently removed`,
      "warning",
      { duration: 4000, persistent: true },
    );
  };

  const handleExport = () => {
    const rows = [
      [
        "Name",
        "Email",
        "Phone",
        "Role",
        "Status",
        "City",
        "Joined",
        "Last Login",
      ],
      ...filtered.map((u) => [
        u.name,
        u.email,
        u.phone,
        u.role,
        u.status,
        u.city ?? "",
        u.joinedDate,
        u.lastLogin,
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `taba3ni-users-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addNotification(
      "📥 Export Ready",
      `${filtered.length} users exported as CSV`,
      "success",
      { duration: 3500 },
    );
  };

  return (
    <Page>
      {/* Header */}
      <TopRow>
        <TitleBlock>
          <Heading as="h1">User Management</Heading>
          <p>Manage all system users — admins, distributors, and clients.</p>
        </TitleBlock>
        <Button
          $variation="primary"
          $size="medium"
          onClick={() => setAddOpen(true)}
        >
          <HiOutlineUserPlus
            style={{ width: "2rem", height: "2rem", marginRight: "0.8rem" }}
          />
          Add User
        </Button>
      </TopRow>

      {/* Stats */}
      <StatsStrip>
        <StatBox $color="var(--color-brand-600)">
          <StatIcon $color="var(--color-brand-600)">
            <HiOutlineUsers />
          </StatIcon>
          <StatBody>
            <div className="val">{counts.all}</div>
            <div className="lbl">Total Users</div>
          </StatBody>
        </StatBox>
        <StatBox $color="#4338ca">
          <StatIcon $color="#4338ca">
            <HiOutlineTruck />
          </StatIcon>
          <StatBody>
            <div className="val">{counts.distributor}</div>
            <div className="lbl">Distributors</div>
          </StatBody>
        </StatBox>
        <StatBox $color="var(--color-green-700)">
          <StatIcon $color="var(--color-green-700)">
            <HiOutlineBuildingStorefront />
          </StatIcon>
          <StatBody>
            <div className="val">{counts.client}</div>
            <div className="lbl">Clients</div>
          </StatBody>
        </StatBox>
        <StatBox $color="var(--color-grey-600)">
          <StatIcon $color="var(--color-grey-600)">
            <HiOutlineNoSymbol />
          </StatIcon>
          <StatBody>
            <div className="val">{counts.inactive}</div>
            <div className="lbl">Inactive</div>
          </StatBody>
        </StatBox>
      </StatsStrip>

      {/* Filters */}
      <FiltersBar>
        <SearchWrap>
          <HiOutlineMagnifyingGlass />
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone or city..."
          />
        </SearchWrap>

        <Divider />

        <FilterGroup>
          {(["all", "admin", "distributor", "client"] as const).map((r) => (
            <FilterChip
              key={r}
              $active={roleFilter === r}
              $color={
                r === "admin"
                  ? "var(--color-red-600)"
                  : r === "distributor"
                    ? "#4338ca"
                    : r === "client"
                      ? "var(--color-green-700)"
                      : undefined
              }
              onClick={() => setRoleFilter(r)}
            >
              {r === "all"
                ? `All (${counts.all})`
                : `${r.charAt(0).toUpperCase() + r.slice(1)} (${counts[r]})`}
            </FilterChip>
          ))}
        </FilterGroup>

        <Divider />

        <FilterGroup>
          {(["all", "active", "inactive"] as const).map((s) => (
            <FilterChip
              key={s}
              $active={statusFilter === s}
              $color={
                s === "active"
                  ? "var(--color-green-700)"
                  : s === "inactive"
                    ? "var(--color-red-600)"
                    : undefined
              }
              onClick={() => setStatusFilter(s)}
            >
              {s === "all"
                ? "Any Status"
                : s.charAt(0).toUpperCase() + s.slice(1)}
            </FilterChip>
          ))}
        </FilterGroup>
      </FiltersBar>

      {/* Table + Drawer */}
      <MainArea>
        <TableCard>
          <TableMeta>
            <ResultCount>
              Showing <strong>{filtered.length}</strong> of{" "}
              <strong>{users.length}</strong> users
            </ResultCount>
            <ExportBtn onClick={handleExport}>
              <HiOutlineArrowDownTray />
              Export CSV
            </ExportBtn>
          </TableMeta>

          {/* Desktop table */}
          <THead>
            <div>User</div>
            <div>Contact</div>
            <div>Role</div>
            <div>Status</div>
            <div>Last Login</div>
            <div />
          </THead>

          {filtered.length === 0 ? (
            <EmptyState>
              <HiOutlineUsers />
              <h3>No users found</h3>
              <p>Try adjusting your search or filters.</p>
            </EmptyState>
          ) : (
            filtered.map((u) => (
              <TRow
                key={u.id}
                $selected={selectedId === u.id}
                onClick={() => setSelectedId(u.id === selectedId ? null : u.id)}
              >
                <UserCell>
                  <Avatar $role={u.role}>{getInitials(u.name)}</Avatar>
                  <UserMeta>
                    <div className="name">{u.name}</div>
                    <div className="email">{u.email}</div>
                  </UserMeta>
                </UserCell>
                <div style={{ fontSize: "1.3rem" }}>
                  <div
                    style={{ color: "var(--color-grey-700)", fontWeight: 500 }}
                  >
                    {u.phone}
                  </div>
                  <div
                    style={{
                      color: "var(--color-grey-400)",
                      marginTop: "0.2rem",
                      fontSize: "1.2rem",
                    }}
                  >
                    {u.city}
                  </div>
                </div>
                <RolePill $role={u.role}>{u.role}</RolePill>
                <StatusBadge
                  $status={u.status === "active" ? "delivered" : "cancelled"}
                >
                  {u.status === "active" ? "Active" : "Inactive"}
                </StatusBadge>
                <div
                  style={{ fontSize: "1.3rem", color: "var(--color-grey-600)" }}
                >
                  {u.lastLogin}
                </div>
                <MenuBtn
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedId(u.id);
                  }}
                >
                  <HiOutlineEllipsisVertical />
                </MenuBtn>
              </TRow>
            ))
          )}

          {/* Mobile cards */}
          <MobileList>
            {filtered.map((u) => (
              <MobileCard
                key={u.id}
                $selected={selectedId === u.id}
                onClick={() => setSelectedId(u.id === selectedId ? null : u.id)}
              >
                <Avatar $role={u.role}>{getInitials(u.name)}</Avatar>
                <MobileInfo>
                  <div className="name">{u.name}</div>
                  <div className="email">{u.email}</div>
                </MobileInfo>
                <MobileBadges>
                  <RolePill $role={u.role}>{u.role}</RolePill>
                  <StatusBadge
                    $status={u.status === "active" ? "delivered" : "cancelled"}
                  >
                    {u.status === "active" ? "●" : "○"}
                  </StatusBadge>
                </MobileBadges>
              </MobileCard>
            ))}
          </MobileList>
        </TableCard>

        {/* Drawer — shows when row selected */}
        {selected && (
          <UserDrawer
            user={selected}
            onClose={() => setSelectedId(null)}
            onEdit={() => setEditOpen(true)}
            onToggleStatus={() => handleToggleStatus(selected.id)}
            onResetPassword={() => setResetOpen(true)}
            onDelete={() => {
              handleDelete(selected.id);
            }}
          />
        )}
      </MainArea>

      {/* Add User Modal */}
      {addOpen && (
        <Modal>
          <Modal.Window
            name="add-user"
            defaultOpen
            onClose={() => setAddOpen(false)}
          >
            <UserForm
              mode="add"
              onSubmit={handleAdd}
              onClose={() => setAddOpen(false)}
            />
          </Modal.Window>
        </Modal>
      )}

      {/* Edit User Modal */}
      {editOpen && selected && (
        <Modal>
          <Modal.Window
            name="edit-user"
            defaultOpen
            onClose={() => setEditOpen(false)}
          >
            <UserForm
              mode="edit"
              initial={selected}
              onSubmit={handleEdit}
              onClose={() => setEditOpen(false)}
            />
          </Modal.Window>
        </Modal>
      )}

      {/* Reset Password Modal */}
      {resetOpen && selected && (
        <Modal>
          <Modal.Window
            name="reset-pw"
            defaultOpen
            onClose={() => setResetOpen(false)}
          >
            <ResetPasswordForm
              user={selected}
              onClose={() => setResetOpen(false)}
            />
          </Modal.Window>
        </Modal>
      )}
    </Page>
  );
}

export default UserManagement;
