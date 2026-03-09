import { NavLink } from "react-router-dom";
import styled from "styled-components";
import {
  HiOutlineHome,
  HiOutlineShoppingCart,
  HiOutlineTruck,
  HiOutlineUsers,
  HiOutlineBuildingStorefront,
  HiOutlineCube,
  HiOutlineChartBar,
  HiOutlineCog6Tooth,
  HiOutlineUserCircle,
} from "react-icons/hi2";
import { HiOutlineDocumentText, HiOutlineArchiveBox } from "react-icons/hi2";

const NavList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const StyledNavLink = styled(NavLink)`
  &:link,
  &:visited {
    display: flex;
    align-items: center;
    gap: 1.2rem;
    color: var(--color-grey-600);
    font-size: 1.6rem;
    font-weight: 500;
    padding: 1.2rem 2.4rem;
    transition: all 0.3s;
  }

  &:hover,
  &:active,
  &.active:link,
  &.active:visited {
    color: var(--color-grey-800);
    background-color: var(--color-grey-50);
    border-radius: var(--border-radius-sm);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }

  &:hover svg,
  &:active svg,
  &.active:link svg,
  &.active:visited svg {
    color: var(--color-brand-600);
  }
`;

const NavDivider = styled.li`
  height: 1px;
  background: var(--color-grey-100);
  margin: 0.8rem 2.4rem;
  list-style: none;
`;

const NavSectionLabel = styled.li`
  padding: 0.4rem 2.4rem;
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: var(--color-grey-400);
  list-style: none;
`;

type MainNavProps = {
  role?: "admin" | "distributor" | "client";
};

function MainNav({ role = "admin" }: MainNavProps) {
  // ── Admin ──────────────────────────────────────────────────────────────────
  if (role === "admin") {
    return (
      <nav>
        <NavList>
          <li>
            <StyledNavLink to="/dashboard">
              <HiOutlineHome />
              <span>Dashboard</span>
            </StyledNavLink>
          </li>

          <li>
            <StyledNavLink to="/analytics">
              <HiOutlineChartBar />
              <span>Analytics</span>
            </StyledNavLink>
          </li>
          <NavSectionLabel>Operations</NavSectionLabel>

          <li>
            <StyledNavLink to="/orders">
              <HiOutlineShoppingCart />
              <span>Orders</span>
            </StyledNavLink>
          </li>
          <li>
            <StyledNavLink to="/deliveries">
              <HiOutlineTruck />
              <span>Deliveries</span>
            </StyledNavLink>
          </li>
          <li>
            <StyledNavLink to="/history">
              <HiOutlineArchiveBox />
              <span>History</span>
            </StyledNavLink>
          </li>
          <li>
            <StyledNavLink to="/invoices">
              <HiOutlineDocumentText />
              <span>Invoices</span>
            </StyledNavLink>
          </li>

          <NavDivider />
          <NavSectionLabel>Management</NavSectionLabel>

          <li>
            <StyledNavLink to="/clients">
              <HiOutlineBuildingStorefront />
              <span>Clients (Stores)</span>
            </StyledNavLink>
          </li>
          <li>
            <StyledNavLink to="/distributors">
              <HiOutlineUsers />
              <span>Distributors</span>
            </StyledNavLink>
          </li>
          <li>
            <StyledNavLink to="/products">
              <HiOutlineCube />
              <span>Products</span>
            </StyledNavLink>
          </li>

          <NavDivider />

          <li>
            <StyledNavLink to="/profile">
              <HiOutlineUserCircle />
              <span>Profile</span>
            </StyledNavLink>
          </li>
          <li>
            <StyledNavLink to="/settings">
              <HiOutlineCog6Tooth />
              <span>Settings</span>
            </StyledNavLink>
          </li>
        </NavList>
      </nav>
    );
  }

  // ── Distributor ────────────────────────────────────────────────────────────
  if (role === "distributor") {
    return (
      <nav>
        <NavList>
          <li>
            <StyledNavLink to="/dashboard">
              <HiOutlineHome />
              <span>Dashboard</span>
            </StyledNavLink>
          </li>
          <li>
            <StyledNavLink to="/deliveries">
              <HiOutlineTruck />
              <span>Today's Deliveries</span>
            </StyledNavLink>
          </li>
          <li>
            <StyledNavLink to="/orders">
              <HiOutlineShoppingCart />
              <span>My Orders</span>
            </StyledNavLink>
          </li>

          <NavDivider />

          <li>
            <StyledNavLink to="/history">
              <HiOutlineArchiveBox />
              <span>Delivery History</span>
            </StyledNavLink>
          </li>
          <li>
            <StyledNavLink to="/profile">
              <HiOutlineUserCircle />
              <span>My Profile</span>
            </StyledNavLink>
          </li>
        </NavList>
      </nav>
    );
  }

  // ── Client ─────────────────────────────────────────────────────────────────
  if (role === "client") {
    return (
      <nav>
        <NavList>
          <li>
            <StyledNavLink to="/dashboard">
              <HiOutlineHome />
              <span>Dashboard</span>
            </StyledNavLink>
          </li>

          <NavSectionLabel>Orders</NavSectionLabel>

          <li>
            <StyledNavLink to="/new-order">
              <HiOutlineShoppingCart />
              <span>New Order</span>
            </StyledNavLink>
          </li>
          <li>
            <StyledNavLink to="/orders">
              <HiOutlineTruck />
              <span>My Orders</span>
            </StyledNavLink>
          </li>
          <li>
            <StyledNavLink to="/history">
              <HiOutlineArchiveBox />
              <span>Order History</span>
            </StyledNavLink>
          </li>

          <NavDivider />

          <li>
            <StyledNavLink to="/invoices">
              <HiOutlineDocumentText />
              <span>Invoices & Payments</span>
            </StyledNavLink>
          </li>

          <NavDivider />

          <li>
            <StyledNavLink to="/profile">
              <HiOutlineUserCircle />
              <span>My Account</span>
            </StyledNavLink>
          </li>
          <li>
            <StyledNavLink to="/settings">
              <HiOutlineCog6Tooth />
              <span>Settings</span>
            </StyledNavLink>
          </li>
        </NavList>
      </nav>
    );
  }

  return null;
}

export default MainNav;
