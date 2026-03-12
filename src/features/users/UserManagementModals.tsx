import { useState } from "react";
import styled, { keyframes } from "styled-components";
import { HiOutlineXMark, HiOutlineExclamationTriangle } from "react-icons/hi2";
import Heading from "../../UI/Heading";
import Button from "../../UI/Button";
import { useNotifications } from "../../hooks/useNotifications";
import type { User, UserFormData, Role } from "./userManagementTypes";

// ─── Animations ───────────────────────────────────────────────────────────────

const overlayIn = keyframes`from { opacity: 0 } to { opacity: 1 }`;
const modalIn = keyframes`
  from { opacity: 0; transform: translateY(-1.5rem) scale(0.98) }
  to   { opacity: 1; transform: translateY(0) scale(1) }
`;

// ─── Modal shell ──────────────────────────────────────────────────────────────

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(3px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  animation: ${overlayIn} 0.2s ease-out;
`;

const ModalBox = styled.div`
  background: var(--color-grey-0);
  border-radius: var(--border-radius-md);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  max-height: 90vh;
  overflow-y: auto;
  animation: ${modalIn} 0.25s ease-out;
  width: 100%;
  max-width: 58rem;
`;

const MHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2.4rem;
  border-bottom: 1px solid var(--color-grey-100);
  position: sticky;
  top: 0;
  background: var(--color-grey-0);
  z-index: 1;
`;

const MBody = styled.div`
  padding: 2.4rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const MFoot = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1.2rem;
  padding: 1.8rem 2.4rem;
  border-top: 1px solid var(--color-grey-100);
  position: sticky;
  bottom: 0;
  background: var(--color-grey-0);
`;

const CloseBtn = styled.button`
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 50%;
  border: 1.5px solid var(--color-grey-200);
  background: transparent;
  color: var(--color-grey-500);
  cursor: pointer;
  transition: all 0.18s;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  & svg {
    width: 1.7rem;
    height: 1.7rem;
  }
  &:hover {
    border-color: var(--color-red-300);
    color: var(--color-red-600);
    background: var(--color-red-50);
  }
`;

// ─── Form primitives ──────────────────────────────────────────────────────────

const FGrid = styled.div<{ $cols?: number }>`
  display: grid;
  grid-template-columns: repeat(${(p) => p.$cols ?? 2}, 1fr);
  gap: 1.8rem;
  @media (max-width: 580px) {
    grid-template-columns: 1fr;
  }
`;

const FGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const FLabel = styled.label`
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--color-grey-700);
`;

const FInput = styled.input`
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

const FSelect = styled.select`
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

const ErrTxt = styled.span`
  font-size: 1.2rem;
  color: var(--color-red-600);
  font-weight: 500;
`;

const Hint = styled.span`
  font-size: 1.2rem;
  color: var(--color-grey-400);
  font-weight: 400;
`;

const ExtrasBox = styled.div`
  padding: 1.6rem;
  background: var(--color-grey-50);
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--color-grey-200);
`;

const ExtrasTitle = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: var(--color-grey-500);
  margin-bottom: 1.4rem;
`;

const ModeToggleBtn = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 1.1rem;
  cursor: pointer;
  font-family: inherit;
  border: 2px solid
    ${(p) => (p.$active ? "var(--color-brand-600)" : "var(--color-grey-200)")};
  border-radius: var(--border-radius-sm);
  background: ${(p) => (p.$active ? "var(--color-brand-50)" : "transparent")};
  color: ${(p) =>
    p.$active ? "var(--color-brand-700)" : "var(--color-grey-600)"};
  font-size: 1.4rem;
  font-weight: 600;
  transition: all 0.18s;
`;

const InfoBox = styled.div`
  padding: 1.6rem;
  background: var(--color-brand-50);
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--color-brand-200);
`;

// ─── UserFormModal ─────────────────────────────────────────────────────────────
// Used for both "Add New User" and "Edit User" — mode prop controls which

type UserFormModalProps = {
  mode: "add" | "edit";
  initial?: User;
  onSubmit: (data: UserFormData) => void;
  onClose: () => void;
};

export function UserFormModal({
  mode,
  initial,
  onSubmit,
  onClose,
}: UserFormModalProps) {
  const [form, setForm] = useState<UserFormData>({
    name: initial?.name ?? "",
    email: initial?.email ?? "",
    phone: initial?.phone ?? "",
    city: initial?.city ?? "",
    role: initial?.role ?? "client",
    password: "",
    notes: initial?.notes ?? "",
    vehicle: initial?.vehicle ?? "",
    zonesRaw: initial?.zones?.join(", ") ?? "",
    storeName: initial?.storeName ?? "",
    taxId: initial?.taxId ?? "",
  });

  const [errs, setErrs] = useState<Partial<Record<keyof UserFormData, string>>>(
    {},
  );

  const set = (k: keyof UserFormData, v: string) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrs((p) => ({ ...p, [k]: undefined }));
  };

  const validate = (): boolean => {
    const e: typeof errs = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email address";
    if (mode === "add" && form.password.length < 8)
      e.password = "Password must be at least 8 characters";
    setErrs(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(form);
      onClose();
    }
  };

  return (
    <Overlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <MHead>
          <Heading as="h2">
            {mode === "add" ? "Add New User" : `Edit — ${initial?.name}`}
          </Heading>
          <CloseBtn onClick={onClose}>
            <HiOutlineXMark />
          </CloseBtn>
        </MHead>

        <MBody>
          {/* Core fields */}
          <FGrid>
            <FGroup>
              <FLabel>Full Name *</FLabel>
              <FInput
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Ahmed Ben Ali"
                autoFocus
              />
              {errs.name && <ErrTxt>{errs.name}</ErrTxt>}
            </FGroup>

            <FGroup>
              <FLabel>Email *</FLabel>
              <FInput
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="ahmed@taba3ni.tn"
              />
              {errs.email && <ErrTxt>{errs.email}</ErrTxt>}
            </FGroup>

            <FGroup>
              <FLabel>Phone</FLabel>
              <FInput
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="+216 98 000 000"
              />
            </FGroup>

            <FGroup>
              <FLabel>City</FLabel>
              <FInput
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                placeholder="Tunis"
              />
            </FGroup>

            <FGroup>
              <FLabel>Role *</FLabel>
              <FSelect
                value={form.role}
                onChange={(e) => set("role", e.target.value as Role)}
              >
                <option value="admin">Admin</option>
                <option value="distributor">Distributor</option>
                <option value="client">Client</option>
              </FSelect>
            </FGroup>

            {mode === "add" && (
              <FGroup>
                <FLabel>Temporary Password *</FLabel>
                <FInput
                  type="password"
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  placeholder="Min. 8 characters"
                />
                {errs.password && <ErrTxt>{errs.password}</ErrTxt>}
              </FGroup>
            )}
          </FGrid>

          {/* Distributor-specific fields */}
          {form.role === "distributor" && (
            <ExtrasBox>
              <ExtrasTitle>Distributor Details</ExtrasTitle>
              <FGrid>
                <FGroup>
                  <FLabel>Vehicle</FLabel>
                  <FInput
                    value={form.vehicle}
                    onChange={(e) => set("vehicle", e.target.value)}
                    placeholder="Refrigerated Truck — 123 TU 1234"
                  />
                </FGroup>
                <FGroup>
                  <FLabel>
                    Zones <Hint>(comma-separated)</Hint>
                  </FLabel>
                  <FInput
                    value={form.zonesRaw}
                    onChange={(e) => set("zonesRaw", e.target.value)}
                    placeholder="Tunis, Lac 1, Ariana"
                  />
                </FGroup>
              </FGrid>
            </ExtrasBox>
          )}

          {/* Client-specific fields */}
          {form.role === "client" && (
            <ExtrasBox>
              <ExtrasTitle>Store Details</ExtrasTitle>
              <FGrid>
                <FGroup>
                  <FLabel>Store Name</FLabel>
                  <FInput
                    value={form.storeName}
                    onChange={(e) => set("storeName", e.target.value)}
                    placeholder="Carrefour Lac 2"
                  />
                </FGroup>
                <FGroup>
                  <FLabel>Tax ID / Matricule Fiscal</FLabel>
                  <FInput
                    value={form.taxId}
                    onChange={(e) => set("taxId", e.target.value)}
                    placeholder="TN-000000000"
                  />
                </FGroup>
              </FGrid>
            </ExtrasBox>
          )}

          {/* Notes */}
          <FGroup>
            <FLabel>
              Internal Notes <Hint>(admin only)</Hint>
            </FLabel>
            <FInput
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Any notes about this user..."
            />
          </FGroup>
        </MBody>

        <MFoot>
          <Button $variation="secondary" $size="medium" onClick={onClose}>
            Cancel
          </Button>
          <Button $variation="primary" $size="medium" onClick={handleSubmit}>
            {mode === "add" ? "Add User" : "Save Changes"}
          </Button>
        </MFoot>
      </ModalBox>
    </Overlay>
  );
}

// ─── ResetPasswordModal ───────────────────────────────────────────────────────

type ResetPasswordModalProps = {
  user: User;
  onClose: () => void;
};

export function ResetPasswordModal({ user, onClose }: ResetPasswordModalProps) {
  const { addNotification } = useNotifications();
  const [mode, setMode] = useState<"link" | "manual">("link");
  const [pass, setPass] = useState("");
  const [conf, setConf] = useState("");

  const isValid = mode === "link" || (pass.length >= 8 && pass === conf);

  const handleSubmit = () => {
    if (!isValid) return;
    addNotification(
      mode === "link" ? "🔑 Reset Link Sent" : "🔑 Password Updated",
      mode === "link"
        ? `Reset email sent to ${user.email}`
        : `Password for ${user.name} has been updated`,
      "success",
      { duration: 4000, persistent: true },
    );
    onClose();
  };

  return (
    <Overlay onClick={onClose}>
      <ModalBox
        style={{ maxWidth: "46rem" }}
        onClick={(e) => e.stopPropagation()}
      >
        <MHead>
          <Heading as="h2">Reset Password — {user.name}</Heading>
          <CloseBtn onClick={onClose}>
            <HiOutlineXMark />
          </CloseBtn>
        </MHead>

        <MBody>
          <div style={{ display: "flex", gap: "1rem" }}>
            <ModeToggleBtn
              $active={mode === "link"}
              onClick={() => setMode("link")}
            >
              📧 Send Reset Link
            </ModeToggleBtn>
            <ModeToggleBtn
              $active={mode === "manual"}
              onClick={() => setMode("manual")}
            >
              🔐 Set Manually
            </ModeToggleBtn>
          </div>

          {mode === "link" ? (
            <InfoBox>
              <div
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 600,
                  color: "var(--color-brand-600)",
                  marginBottom: "0.4rem",
                }}
              >
                Reset link will be sent to:
              </div>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "var(--color-grey-900)",
                }}
              >
                {user.email}
              </div>
              <div
                style={{
                  fontSize: "1.2rem",
                  color: "var(--color-grey-500)",
                  marginTop: "0.8rem",
                }}
              >
                The link expires in 24 hours.
              </div>
            </InfoBox>
          ) : (
            <FGrid $cols={1}>
              <FGroup>
                <FLabel>New Password</FLabel>
                <FInput
                  type="password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="Min. 8 characters"
                  autoFocus
                />
                {pass.length > 0 && pass.length < 8 && (
                  <ErrTxt>At least 8 characters required</ErrTxt>
                )}
              </FGroup>
              <FGroup>
                <FLabel>Confirm Password</FLabel>
                <FInput
                  type="password"
                  value={conf}
                  onChange={(e) => setConf(e.target.value)}
                  placeholder="Repeat new password"
                />
                {conf.length > 0 && pass !== conf && (
                  <ErrTxt>Passwords do not match</ErrTxt>
                )}
              </FGroup>
            </FGrid>
          )}
        </MBody>

        <MFoot>
          <Button $variation="secondary" $size="medium" onClick={onClose}>
            Cancel
          </Button>
          <Button
            $variation="primary"
            $size="medium"
            onClick={handleSubmit}
            disabled={!isValid}
          >
            {mode === "link" ? "Send Reset Link" : "Set New Password"}
          </Button>
        </MFoot>
      </ModalBox>
    </Overlay>
  );
}

// ─── ConfirmDeleteModal ───────────────────────────────────────────────────────

type ConfirmDeleteModalProps = {
  name: string;
  onConfirm: () => void;
  onClose: () => void;
};

export function ConfirmDeleteModal({
  name,
  onConfirm,
  onClose,
}: ConfirmDeleteModalProps) {
  return (
    <Overlay onClick={onClose}>
      <ModalBox
        style={{ maxWidth: "44rem" }}
        onClick={(e) => e.stopPropagation()}
      >
        <MHead>
          <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
            <div
              style={{
                width: "3.6rem",
                height: "3.6rem",
                borderRadius: "50%",
                background: "var(--color-red-50)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <HiOutlineExclamationTriangle
                style={{
                  width: "2rem",
                  height: "2rem",
                  color: "var(--color-red-600)",
                }}
              />
            </div>
            <Heading as="h2">Delete User</Heading>
          </div>
          <CloseBtn onClick={onClose}>
            <HiOutlineXMark />
          </CloseBtn>
        </MHead>

        <MBody>
          <p
            style={{
              fontSize: "1.5rem",
              color: "var(--color-grey-700)",
              lineHeight: 1.6,
            }}
          >
            Are you sure you want to permanently delete <strong>{name}</strong>?
            This action cannot be undone.
          </p>
        </MBody>

        <MFoot>
          <Button $variation="secondary" $size="medium" onClick={onClose}>
            Cancel
          </Button>
          <Button
            $variation="danger"
            $size="medium"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Yes, Delete User
          </Button>
        </MFoot>
      </ModalBox>
    </Overlay>
  );
}
