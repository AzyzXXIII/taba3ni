import { useState } from "react";
import styled, { keyframes } from "styled-components";
import {
  HiOutlineXMark,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineNoSymbol,
  HiOutlineCheckCircle,
  HiOutlinePhone,
  HiOutlineCalendar,
  HiOutlineTruck,
  HiOutlineBuildingStorefront,
  HiOutlineKey,
  HiOutlineMapPin,
  HiOutlineIdentification,
  HiOutlineClock,
} from "react-icons/hi2";
import StatusBadge from "../../UI/StatusBadge";
import { ConfirmDeleteModal } from "./UserManagementModals";
import { getInitials, formatDate } from "./userManagementTypes";
import type { User } from "./userManagementTypes";

// ─── Animation ────────────────────────────────────────────────────────────────

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(2rem) }
  to   { opacity: 1; transform: translateX(0) }
`;

// ─── Styled components ────────────────────────────────────────────────────────

const DrawerWrap = styled.div`
  width: 35rem;
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

const DHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.6rem 2rem;
  border-bottom: 1px solid var(--color-grey-100);
  background: linear-gradient(
    135deg,
    var(--color-brand-50),
    var(--color-grey-0)
  );
`;

const DTitle = styled.span`
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--color-grey-700);
`;

const CloseBtn = styled.button`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: 1.5px solid var(--color-grey-200);
  background: var(--color-grey-0);
  color: var(--color-grey-500);
  cursor: pointer;
  transition: all 0.18s;
  display: flex;
  align-items: center;
  justify-content: center;
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

const AvatarLg = styled.div<{ $role: string }>`
  width: 7rem;
  height: 7rem;
  border-radius: 50%;
  margin: 2.4rem auto 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 2.4rem;
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

const DName = styled.div`
  text-align: center;
  font-size: 1.7rem;
  font-weight: 800;
  color: var(--color-grey-900);
  padding: 0 2rem;
`;

const DSub = styled.div`
  text-align: center;
  font-size: 1.3rem;
  color: var(--color-grey-500);
  margin-top: 0.4rem;
  padding: 0 2rem;
`;

const DBadges = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.8rem;
  margin: 1.2rem 0 0;
  padding: 0 2rem 1.8rem;
  border-bottom: 1px solid var(--color-grey-100);
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

const Section = styled.div`
  padding: 1.6rem 2rem;
  border-bottom: 1px solid var(--color-grey-100);
  &:last-child {
    border-bottom: none;
  }
`;

const SectionTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-grey-400);
  margin-bottom: 1rem;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 0.6rem 0;
  & svg {
    width: 1.5rem;
    height: 1.5rem;
    color: var(--color-brand-500);
    flex-shrink: 0;
    margin-top: 0.1rem;
  }
  & .lb {
    font-size: 1.2rem;
    color: var(--color-grey-500);
    min-width: 8.5rem;
    flex-shrink: 0;
  }
  & .vl {
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--color-grey-900);
  }
`;

const ZoneTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.6rem;
`;

const ZoneTag = styled.span`
  padding: 0.3rem 0.9rem;
  background: var(--color-brand-50);
  color: var(--color-brand-700);
  border-radius: 100px;
  font-size: 1.2rem;
  font-weight: 600;
  border: 1px solid var(--color-brand-200);
`;

const Actions = styled.div`
  padding: 1.6rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const ActionBtn = styled.button<{ $variant?: "warn" | "danger" }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1.1rem 1.4rem;
  border: 1.5px solid
    ${(p) =>
      p.$variant === "danger"
        ? "var(--color-red-200)"
        : p.$variant === "warn"
          ? "var(--color-yellow-300)"
          : "var(--color-grey-200)"};
  border-radius: var(--border-radius-sm);
  background: ${(p) =>
    p.$variant === "danger"
      ? "var(--color-red-50)"
      : p.$variant === "warn"
        ? "var(--color-yellow-50)"
        : "var(--color-grey-0)"};
  color: ${(p) =>
    p.$variant === "danger"
      ? "var(--color-red-700)"
      : p.$variant === "warn"
        ? "var(--color-yellow-800)"
        : "var(--color-grey-700)"};
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  text-align: left;
  transition: all 0.18s;
  font-family: inherit;
  & svg {
    width: 1.8rem;
    height: 1.8rem;
    flex-shrink: 0;
  }
  &:hover:not(:disabled) {
    filter: brightness(0.95);
    transform: translateX(2px);
  }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────

type UserDrawerProps = {
  user: User;
  onClose: () => void;
  onEdit: () => void;
  onToggleStatus: () => void;
  onResetPassword: () => void;
  onDelete: () => void;
};

export function UserDrawer({
  user,
  onClose,
  onEdit,
  onToggleStatus,
  onResetPassword,
  onDelete,
}: UserDrawerProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const isAdmin = user.role === "admin";

  return (
    <>
      <DrawerWrap>
        <DHead>
          <DTitle>User Details</DTitle>
          <CloseBtn onClick={onClose}>
            <HiOutlineXMark />
          </CloseBtn>
        </DHead>

        {/* Identity */}
        <AvatarLg $role={user.role}>{getInitials(user.name)}</AvatarLg>
        <DName>{user.name}</DName>
        <DSub>{user.email}</DSub>
        <DBadges>
          <RolePill $role={user.role}>{user.role}</RolePill>
          <StatusBadge
            $status={user.status === "active" ? "delivered" : "cancelled"}
          >
            {user.status === "active" ? "Active" : "Inactive"}
          </StatusBadge>
        </DBadges>

        {/* Contact */}
        <Section>
          <SectionTitle>Contact</SectionTitle>
          <InfoRow>
            <HiOutlinePhone />
            <span className="lb">Phone</span>
            <span className="vl">{user.phone || "—"}</span>
          </InfoRow>
          {user.city && (
            <InfoRow>
              <HiOutlineMapPin />
              <span className="lb">City</span>
              <span className="vl">{user.city}</span>
            </InfoRow>
          )}
          <InfoRow>
            <HiOutlineCalendar />
            <span className="lb">Joined</span>
            <span className="vl">{formatDate(user.joinedDate)}</span>
          </InfoRow>
          <InfoRow>
            <HiOutlineClock />
            <span className="lb">Last Login</span>
            <span className="vl">{user.lastLogin}</span>
          </InfoRow>
        </Section>

        {/* Distributor extras */}
        {user.role === "distributor" && (
          <Section>
            <SectionTitle>Distributor Info</SectionTitle>
            {user.vehicle && (
              <InfoRow>
                <HiOutlineTruck />
                <span className="lb">Vehicle</span>
                <span className="vl" style={{ fontSize: "1.2rem" }}>
                  {user.vehicle}
                </span>
              </InfoRow>
            )}
            {user.zones && user.zones.length > 0 && (
              <>
                <div
                  style={{
                    fontSize: "1.2rem",
                    color: "var(--color-grey-500)",
                    marginTop: "0.8rem",
                    marginBottom: "0.2rem",
                  }}
                >
                  Delivery Zones
                </div>
                <ZoneTags>
                  {user.zones.map((z) => (
                    <ZoneTag key={z}>{z}</ZoneTag>
                  ))}
                </ZoneTags>
              </>
            )}
          </Section>
        )}

        {/* Client extras */}
        {user.role === "client" && (
          <Section>
            <SectionTitle>Store Info</SectionTitle>
            {user.storeName && (
              <InfoRow>
                <HiOutlineBuildingStorefront />
                <span className="lb">Store</span>
                <span className="vl">{user.storeName}</span>
              </InfoRow>
            )}
            {user.taxId && (
              <InfoRow>
                <HiOutlineIdentification />
                <span className="lb">Tax ID</span>
                <span className="vl">{user.taxId}</span>
              </InfoRow>
            )}
          </Section>
        )}

        {/* Notes */}
        {user.notes && (
          <Section>
            <SectionTitle>Notes</SectionTitle>
            <p
              style={{
                fontSize: "1.3rem",
                color: "var(--color-grey-600)",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {user.notes}
            </p>
          </Section>
        )}

        {/* Actions */}
        <Section>
          <SectionTitle>Actions</SectionTitle>
        </Section>
        <Actions>
          <ActionBtn onClick={onEdit}>
            <HiOutlinePencil /> Edit User Info
          </ActionBtn>
          <ActionBtn onClick={onResetPassword}>
            <HiOutlineKey /> Reset Password
          </ActionBtn>
          <ActionBtn $variant="warn" onClick={onToggleStatus}>
            {user.status === "active" ? (
              <HiOutlineNoSymbol />
            ) : (
              <HiOutlineCheckCircle />
            )}
            {user.status === "active" ? "Deactivate User" : "Reactivate User"}
          </ActionBtn>
          <ActionBtn
            $variant="danger"
            disabled={isAdmin}
            onClick={() => !isAdmin && setConfirmOpen(true)}
          >
            <HiOutlineTrash />
            {isAdmin ? "Delete User (protected)" : "Delete User"}
          </ActionBtn>
        </Actions>
      </DrawerWrap>

      {confirmOpen && (
        <ConfirmDeleteModal
          name={user.name}
          onConfirm={onDelete}
          onClose={() => setConfirmOpen(false)}
        />
      )}
    </>
  );
}
