import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import {
  HiOutlineUsers,
  HiOutlineUserPlus,
  HiOutlineMagnifyingGlass,
  HiOutlineNoSymbol,
  HiOutlineTruck,
  HiOutlineBuildingStorefront,
  HiOutlineArrowDownTray,
  HiOutlineEllipsisVertical,
} from "react-icons/hi2";
import Heading from "../UI/Heading";
import Button from "../UI/Button";
import StatusBadge from "../UI/StatusBadge";
import { useNotifications } from "../hooks/useNotifications";
import {
  UserFormModal,
  ResetPasswordModal,
} from "./../features/users/UserManagementModals";
import { UserDrawer } from "./../features/users/UserManagementDrawer";
import {
  INITIAL_USERS,
  getInitials,
} from "./../features/users/userManagementTypes";
import type {
  User,
  UserFormData,
} from "./../features/users/userManagementTypes";

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(1rem) }
  to   { opacity: 1; transform: translateY(0) }
`;

// ─── Page layout ──────────────────────────────────────────────────────────────

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

// ─── Stats ────────────────────────────────────────────────────────────────────

const StatsStrip = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.6rem;
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatBox = styled.div`
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

const StatIcon = styled.div<{ $c: string }>`
  width: 4.4rem;
  height: 4.4rem;
  border-radius: var(--border-radius-sm);
  background: ${(p) => p.$c}18;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  & svg {
    width: 2.2rem;
    height: 2.2rem;
    color: ${(p) => p.$c};
  }
`;

const StatBody = styled.div`
  & .v {
    font-size: 2.4rem;
    font-weight: 800;
    color: var(--color-grey-900);
    line-height: 1;
  }
  & .l {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--color-grey-500);
    margin-top: 0.3rem;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }
`;

// ─── Filters ──────────────────────────────────────────────────────────────────

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
    pointer-events: none;
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

const FilterDivider = styled.div`
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

const FilterChip = styled.button<{ $on: boolean; $c?: string }>`
  padding: 0.7rem 1.4rem;
  border-radius: 100px;
  font-size: 1.3rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  font-family: inherit;
  transition: all 0.18s;
  border: 2px solid
    ${(p) =>
      p.$on ? (p.$c ?? "var(--color-brand-600)") : "var(--color-grey-200)"};
  background: ${(p) =>
    p.$on ? (p.$c ? p.$c + "15" : "var(--color-brand-50)") : "transparent"};
  color: ${(p) =>
    p.$on ? (p.$c ?? "var(--color-brand-700)") : "var(--color-grey-600)"};
  &:hover {
    border-color: ${(p) => p.$c ?? "var(--color-brand-600)"};
    color: ${(p) => p.$c ?? "var(--color-brand-700)"};
  }
`;

// ─── Table ────────────────────────────────────────────────────────────────────

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
  font-family: inherit;
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

const THead = styled.div`
  display: grid;
  grid-template-columns: 2.4fr 1.6fr 1.2fr 1.1fr 1fr 4.4rem;
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

const TRow = styled.div<{ $sel: boolean }>`
  display: grid;
  grid-template-columns: 2.4fr 1.6fr 1.2fr 1.1fr 1fr 4.4rem;
  gap: 1.6rem;
  padding: 1.4rem 2rem;
  border-bottom: 1px solid var(--color-grey-100);
  align-items: center;
  cursor: pointer;
  background: ${(p) =>
    p.$sel ? "var(--color-brand-50)" : "var(--color-grey-0)"};
  border-left: 3px solid
    ${(p) => (p.$sel ? "var(--color-brand-600)" : "transparent")};
  transition: all 0.15s;
  &:hover {
    background: ${(p) =>
      p.$sel ? "var(--color-brand-50)" : "var(--color-grey-50)"};
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
  & .n {
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--color-grey-900);
  }
  & .e {
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
  font-family: inherit;
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

const MobileList = styled.div`
  display: none;
  @media (max-width: 1100px) {
    display: flex;
    flex-direction: column;
  }
`;

const MobileCard = styled.div<{ $sel: boolean }>`
  display: flex;
  align-items: center;
  gap: 1.4rem;
  padding: 1.6rem 2rem;
  border-bottom: 1px solid var(--color-grey-100);
  cursor: pointer;
  background: ${(p) =>
    p.$sel ? "var(--color-brand-50)" : "var(--color-grey-0)"};
  border-left: 3px solid
    ${(p) => (p.$sel ? "var(--color-brand-600)" : "transparent")};
  transition: background 0.15s;
  &:last-child {
    border-bottom: none;
  }
`;

const MobileInfo = styled.div`
  flex: 1;
  min-width: 0;
  & .n {
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--color-grey-900);
  }
  & .e {
    font-size: 1.2rem;
    color: var(--color-grey-500);
    margin-top: 0.2rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const EmptyState = styled.div`
  padding: 6rem 2rem;
  text-align: center;
  & svg {
    width: 6rem;
    height: 6rem;
    color: var(--color-grey-300);
    display: block;
    margin: 0 auto 1.6rem;
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

// ─── Component ────────────────────────────────────────────────────────────────

type Props = { userRole?: "admin" | "distributor" | "client" };

export default function UserManagement({ userRole = "admin" }: Props) {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);

  // ── Derived state ───────────────────────────────────────────────────────────

  const filtered = useMemo(
    () =>
      users.filter((u) => {
        const q = search.toLowerCase();
        return (
          (!q ||
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            u.phone.includes(q) ||
            (u.city ?? "").toLowerCase().includes(q)) &&
          (roleFilter === "all" || u.role === roleFilter) &&
          (statusFilter === "all" || u.status === statusFilter)
        );
      }),
    [users, search, roleFilter, statusFilter],
  );

  const selected = users.find((u) => u.id === selectedId) ?? null;

  const counts = {
    all: users.length,
    admin: users.filter((u) => u.role === "admin").length,
    distributor: users.filter((u) => u.role === "distributor").length,
    client: users.filter((u) => u.role === "client").length,
    inactive: users.filter((u) => u.status === "inactive").length,
  };

  // ── Access guard ────────────────────────────────────────────────────────────

  if (userRole !== "admin")
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

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleAdd = (d: UserFormData) => {
    const u: User = {
      id: String(Date.now()),
      name: d.name,
      email: d.email,
      phone: d.phone,
      role: d.role,
      status: "active",
      joinedDate: new Date().toISOString().split("T")[0],
      lastLogin: "Never",
      city: d.city || undefined,
      notes: d.notes || undefined,
      vehicle: d.vehicle || undefined,
      zones: d.zonesRaw
        ? d.zonesRaw
            .split(",")
            .map((z) => z.trim())
            .filter(Boolean)
        : undefined,
      storeName: d.storeName || undefined,
      taxId: d.taxId || undefined,
    };
    setUsers((p) => [...p, u]);
    setSelectedId(u.id);
    addNotification(
      "✅ User Added",
      `${u.name} added as ${u.role}`,
      "success",
      { duration: 4000, persistent: true },
    );
  };

  const handleEdit = (d: UserFormData) => {
    setUsers((p) =>
      p.map((u) =>
        u.id !== selectedId
          ? u
          : {
              ...u,
              name: d.name,
              email: d.email,
              phone: d.phone,
              city: d.city || undefined,
              notes: d.notes || undefined,
              role: d.role,
              vehicle: d.vehicle || undefined,
              zones: d.zonesRaw
                ? d.zonesRaw
                    .split(",")
                    .map((z) => z.trim())
                    .filter(Boolean)
                : undefined,
              storeName: d.storeName || undefined,
              taxId: d.taxId || undefined,
            },
      ),
    );
    addNotification(
      "✅ User Updated",
      `${d.name}'s profile updated`,
      "success",
      { duration: 3500, persistent: true },
    );
  };

  const handleToggleStatus = (id: string) => {
    const u = users.find((u) => u.id === id)!;
    const next = u.status === "active" ? "inactive" : "active";
    setUsers((p) => p.map((u) => (u.id === id ? { ...u, status: next } : u)));
    addNotification(
      next === "inactive" ? "⚠️ User Deactivated" : "✅ User Reactivated",
      `${u.name} has been ${next === "inactive" ? "deactivated" : "reactivated"}`,
      next === "inactive" ? "warning" : "success",
      { duration: 3500, persistent: true },
    );
  };

  const handleDelete = (id: string) => {
    const u = users.find((u) => u.id === id)!;
    setUsers((p) => p.filter((u) => u.id !== id));
    setSelectedId(null);
    addNotification("User Deleted", `${u.name} has been removed`, "warning", {
      duration: 4000,
      persistent: true,
    });
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
    const csv = rows.map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
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
      `${filtered.length} users exported`,
      "success",
      { duration: 3000 },
    );
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      <Page>
        {/* Header */}
        <TopRow>
          <div>
            <Heading as="h1">User Management</Heading>
            <p
              style={{
                fontSize: "1.4rem",
                color: "var(--color-grey-500)",
                marginTop: "0.4rem",
              }}
            >
              Manage all system users — admins, distributors, and clients.
            </p>
          </div>
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
          <StatBox>
            <StatIcon $c="var(--color-brand-600)">
              <HiOutlineUsers />
            </StatIcon>
            <StatBody>
              <div className="v">{counts.all}</div>
              <div className="l">Total Users</div>
            </StatBody>
          </StatBox>
          <StatBox>
            <StatIcon $c="#4338ca">
              <HiOutlineTruck />
            </StatIcon>
            <StatBody>
              <div className="v">{counts.distributor}</div>
              <div className="l">Distributors</div>
            </StatBody>
          </StatBox>
          <StatBox>
            <StatIcon $c="var(--color-green-700)">
              <HiOutlineBuildingStorefront />
            </StatIcon>
            <StatBody>
              <div className="v">{counts.client}</div>
              <div className="l">Clients</div>
            </StatBody>
          </StatBox>
          <StatBox>
            <StatIcon $c="var(--color-red-600)">
              <HiOutlineNoSymbol />
            </StatIcon>
            <StatBody>
              <div className="v">{counts.inactive}</div>
              <div className="l">Inactive</div>
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

          <FilterDivider />

          <FilterGroup>
            {(["all", "admin", "distributor", "client"] as const).map((r) => (
              <FilterChip
                key={r}
                $on={roleFilter === r}
                $c={
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

          <FilterDivider />

          <FilterGroup>
            {(["all", "active", "inactive"] as const).map((s) => (
              <FilterChip
                key={s}
                $on={statusFilter === s}
                $c={
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
                <HiOutlineArrowDownTray /> Export CSV
              </ExportBtn>
            </TableMeta>

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
                  $sel={selectedId === u.id}
                  onClick={() =>
                    setSelectedId(u.id === selectedId ? null : u.id)
                  }
                >
                  <UserCell>
                    <Avatar $role={u.role}>{getInitials(u.name)}</Avatar>
                    <UserMeta>
                      <div className="n">{u.name}</div>
                      <div className="e">{u.email}</div>
                    </UserMeta>
                  </UserCell>
                  <div style={{ fontSize: "1.3rem" }}>
                    <div
                      style={{
                        color: "var(--color-grey-700)",
                        fontWeight: 500,
                      }}
                    >
                      {u.phone}
                    </div>
                    <div
                      style={{
                        color: "var(--color-grey-400)",
                        fontSize: "1.2rem",
                        marginTop: "0.2rem",
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
                    style={{
                      fontSize: "1.3rem",
                      color: "var(--color-grey-600)",
                    }}
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

            <MobileList>
              {filtered.map((u) => (
                <MobileCard
                  key={u.id}
                  $sel={selectedId === u.id}
                  onClick={() =>
                    setSelectedId(u.id === selectedId ? null : u.id)
                  }
                >
                  <Avatar $role={u.role}>{getInitials(u.name)}</Avatar>
                  <MobileInfo>
                    <div className="n">{u.name}</div>
                    <div className="e">{u.email}</div>
                  </MobileInfo>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.6rem",
                      alignItems: "center",
                    }}
                  >
                    <RolePill $role={u.role}>{u.role}</RolePill>
                    <StatusBadge
                      $status={
                        u.status === "active" ? "delivered" : "cancelled"
                      }
                    >
                      {u.status === "active" ? "●" : "○"}
                    </StatusBadge>
                  </div>
                </MobileCard>
              ))}
            </MobileList>
          </TableCard>

          {selected && (
            <UserDrawer
              user={selected}
              onClose={() => setSelectedId(null)}
              onEdit={() => setEditOpen(true)}
              onToggleStatus={() => handleToggleStatus(selected.id)}
              onResetPassword={() => setResetOpen(true)}
              onDelete={() => handleDelete(selected.id)}
            />
          )}
        </MainArea>
      </Page>

      {/* Modals — rendered outside Page for clean z-index stacking */}
      {addOpen && (
        <UserFormModal
          mode="add"
          onSubmit={handleAdd}
          onClose={() => setAddOpen(false)}
        />
      )}
      {editOpen && selected && (
        <UserFormModal
          mode="edit"
          initial={selected}
          onSubmit={handleEdit}
          onClose={() => setEditOpen(false)}
        />
      )}
      {resetOpen && selected && (
        <ResetPasswordModal
          user={selected}
          onClose={() => setResetOpen(false)}
        />
      )}
    </>
  );
}
