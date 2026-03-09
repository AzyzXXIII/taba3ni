import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import {
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineTruck,
  HiOutlineMapPin,
  HiOutlineStar,
  HiOutlineCheckCircle,
  HiOutlineChartBar,
  HiOutlineClock,
  HiOutlineCalendar,
  HiOutlineBuildingStorefront,
  HiOutlineShieldCheck,
  HiOutlinePencil,
  HiOutlineCamera,
  HiOutlineIdentification,
  HiOutlineCurrencyDollar,
  HiOutlineLockClosed,
  HiOutlineXMark,
  HiOutlineArrowLeft,
  HiOutlineCog6Tooth,
  HiOutlineBell,
  HiOutlineMoon,
  HiOutlineGlobeAlt,
} from "react-icons/hi2";
import Heading from "../UI/Heading";
import Button from "../UI/Button";
import StatusBadge from "../UI/StatusBadge";
import { useNotifications } from "../hooks/useNotifications";

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(1rem); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ─── Layout ───────────────────────────────────────────────────────────────────

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  animation: ${fadeUp} 0.3s ease-out;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: none;
  border: none;
  color: var(--color-brand-600);
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  width: fit-content;
  &:hover {
    color: var(--color-brand-700);
  }
  & svg {
    width: 2rem;
    height: 2rem;
  }
`;

const PageGrid = styled.div`
  display: grid;
  grid-template-columns: 34rem 1fr;
  gap: 2.4rem;
  align-items: start;
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  overflow: hidden;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.8rem 2.4rem;
  border-bottom: 1px solid var(--color-grey-100);
`;

const CardBody = styled.div`
  padding: 0.4rem 2.4rem 2rem;
`;

const RightCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
`;

// ─── Avatar ───────────────────────────────────────────────────────────────────

const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 2.4rem 2.4rem;
  gap: 1.2rem;
  background: linear-gradient(
    160deg,
    var(--color-brand-50),
    var(--color-grey-0)
  );
`;

const AvatarWrap = styled.div`
  position: relative;
  margin-bottom: 0.4rem;
`;

const Avatar = styled.div`
  width: 9.6rem;
  height: 9.6rem;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    var(--color-brand-600),
    var(--color-brand-700)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 800;
  font-size: 3.2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  border: 4px solid white;
`;

const AvatarEditBtn = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: var(--color-brand-600);
  border: 2.5px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: background 0.2s;
  & svg {
    width: 1.4rem;
    height: 1.4rem;
  }
  &:hover {
    background: var(--color-brand-700);
  }
`;

const AvatarName = styled.div`
  font-size: 1.9rem;
  font-weight: 800;
  color: var(--color-grey-900);
  text-align: center;
`;

const AvatarSub = styled.div`
  font-size: 1.3rem;
  color: var(--color-grey-500);
  text-align: center;
  margin-top: -0.4rem;
`;

const RoleBadge = styled.div<{ $role: string }>`
  padding: 0.5rem 1.4rem;
  border-radius: 100px;
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${(p) =>
    p.$role === "admin"
      ? "var(--color-red-50)"
      : p.$role === "distributor"
        ? "var(--color-brand-50)"
        : "var(--color-green-50)"};
  color: ${(p) =>
    p.$role === "admin"
      ? "var(--color-red-700)"
      : p.$role === "distributor"
        ? "var(--color-brand-700)"
        : "var(--color-green-700)"};
  border: 1px solid
    ${(p) =>
      p.$role === "admin"
        ? "var(--color-red-200)"
        : p.$role === "distributor"
          ? "var(--color-brand-200)"
          : "var(--color-green-200)"};
`;

const OnlineDot = styled.div<{ $online: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1.3rem;
  font-weight: 600;
  color: ${(p) =>
    p.$online ? "var(--color-green-600)" : "var(--color-grey-400)"};
  &::before {
    content: "";
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 50%;
    background: ${(p) =>
      p.$online ? "var(--color-green-500)" : "var(--color-grey-300)"};
  }
`;

// ─── Info / Field rows ────────────────────────────────────────────────────────

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1.4rem;
  padding: 1.3rem 0;
  border-bottom: 1px solid var(--color-grey-50);
  &:last-child {
    border-bottom: none;
  }
`;

const InfoIcon = styled.div<{ $locked?: boolean }>`
  width: 3.4rem;
  height: 3.4rem;
  border-radius: var(--border-radius-sm);
  background: ${(p) =>
    p.$locked ? "var(--color-grey-50)" : "var(--color-brand-50)"};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  & svg {
    width: 1.7rem;
    height: 1.7rem;
    color: ${(p) =>
      p.$locked ? "var(--color-grey-400)" : "var(--color-brand-600)"};
  }
`;

const InfoContent = styled.div`
  flex: 1;
  min-width: 0;
  & .label {
    font-size: 1.2rem;
    color: var(--color-grey-500);
    font-weight: 500;
    margin-bottom: 0.3rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  & .value {
    font-size: 1.4rem;
    font-weight: 600;
    color: var(--color-grey-900);
  }
`;

const LockedBadge = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-grey-400);
  background: var(--color-grey-100);
  padding: 0.2rem 0.8rem;
  border-radius: 100px;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  & svg {
    width: 1.1rem;
    height: 1.1rem;
  }
`;

const EditRowWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const EditInput = styled.input`
  flex: 1;
  padding: 0.7rem 1rem;
  border: 2px solid var(--color-brand-400);
  border-radius: var(--border-radius-sm);
  font-size: 1.4rem;
  font-family: inherit;
  color: var(--color-grey-900);
  background: var(--color-grey-0);
  &:focus {
    outline: none;
    border-color: var(--color-brand-600);
  }
`;

const SmallIconBtn = styled.button<{ $danger?: boolean }>`
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-sm);
  border: 1.5px solid
    ${(p) => (p.$danger ? "var(--color-red-300)" : "var(--color-grey-200)")};
  background: ${(p) =>
    p.$danger ? "var(--color-red-50)" : "var(--color-grey-0)"};
  color: ${(p) =>
    p.$danger ? "var(--color-red-600)" : "var(--color-grey-500)"};
  cursor: pointer;
  transition: all 0.18s;
  flex-shrink: 0;
  & svg {
    width: 1.5rem;
    height: 1.5rem;
  }
  &:hover {
    background: ${(p) =>
      p.$danger ? "var(--color-red-100)" : "var(--color-brand-50)"};
    border-color: ${(p) =>
      p.$danger ? "var(--color-red-500)" : "var(--color-brand-400)"};
    color: ${(p) =>
      p.$danger ? "var(--color-red-700)" : "var(--color-brand-600)"};
  }
`;

const EditBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 1rem;
  border: 1.5px solid var(--color-grey-200);
  border-radius: var(--border-radius-sm);
  background: var(--color-grey-0);
  color: var(--color-grey-500);
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s;
  flex-shrink: 0;
  & svg {
    width: 1.3rem;
    height: 1.3rem;
  }
  &:hover {
    background: var(--color-brand-50);
    border-color: var(--color-brand-400);
    color: var(--color-brand-600);
  }
`;

// ─── Stats ────────────────────────────────────────────────────────────────────

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.6rem;
  padding: 2rem 2.4rem;
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatTile = styled.div`
  background: var(--color-grey-50);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 1.8rem;
  text-align: center;
  transition: all 0.2s;
  &:hover {
    box-shadow: var(--shadow-sm);
    transform: translateY(-2px);
  }
`;

const StatValue = styled.div`
  font-size: 2.6rem;
  font-weight: 800;
  color: var(--color-brand-600);
  line-height: 1;
  margin-bottom: 0.6rem;
`;

const StatLabel = styled.div`
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--color-grey-500);
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

const StatIconWrap = styled.div`
  margin-bottom: 0.8rem;
  & svg {
    width: 2.2rem;
    height: 2.2rem;
    color: var(--color-brand-300);
  }
`;

// ─── Zones ────────────────────────────────────────────────────────────────────

const ZoneTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  padding: 1.6rem 2.4rem 2rem;
`;

const ZoneTag = styled.span`
  padding: 0.5rem 1.2rem;
  background: var(--color-brand-50);
  color: var(--color-brand-700);
  border: 1px solid var(--color-brand-200);
  border-radius: 100px;
  font-size: 1.2rem;
  font-weight: 600;
`;

// ─── Tabs ─────────────────────────────────────────────────────────────────────

const TabBar = styled.div`
  display: flex;
  border-bottom: 2px solid var(--color-grey-100);
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 1.2rem 2.4rem;
  border: none;
  background: none;
  font-size: 1.5rem;
  font-weight: 600;
  cursor: pointer;
  color: ${(p) =>
    p.$active ? "var(--color-brand-600)" : "var(--color-grey-500)"};
  border-bottom: 2.5px solid
    ${(p) => (p.$active ? "var(--color-brand-600)" : "transparent")};
  margin-bottom: -2px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  & svg {
    width: 1.8rem;
    height: 1.8rem;
  }
  &:hover {
    color: var(--color-brand-600);
  }
`;

// ─── Settings styles ──────────────────────────────────────────────────────────

const SettingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.6rem 0;
  border-bottom: 1px solid var(--color-grey-50);
  gap: 2rem;
  &:last-child {
    border-bottom: none;
  }
`;

const SettingInfo = styled.div`
  & .title {
    font-size: 1.4rem;
    font-weight: 600;
    color: var(--color-grey-900);
    margin-bottom: 0.3rem;
  }
  & .desc {
    font-size: 1.3rem;
    color: var(--color-grey-500);
  }
`;

const Toggle = styled.button<{ $on: boolean }>`
  width: 4.8rem;
  height: 2.6rem;
  border-radius: 100px;
  border: none;
  background: ${(p) =>
    p.$on ? "var(--color-brand-600)" : "var(--color-grey-300)"};
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.25s;
  &::after {
    content: "";
    position: absolute;
    top: 3px;
    left: ${(p) => (p.$on ? "calc(100% - 23px)" : "3px")};
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    transition: left 0.25s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }
`;

const SelectInput = styled.select`
  padding: 0.7rem 1.2rem;
  border: 2px solid var(--color-grey-200);
  border-radius: var(--border-radius-sm);
  font-size: 1.3rem;
  font-family: inherit;
  background: var(--color-grey-0);
  color: var(--color-grey-900);
  cursor: pointer;
  &:focus {
    outline: none;
    border-color: var(--color-brand-600);
  }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name
    .trim()
    .split(" ")
    .map((n) => n[0]?.toUpperCase())
    .join("")
    .slice(0, 2);
}

function formatDate(str: string) {
  return new Date(str).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <HiOutlineStar
          key={s}
          style={{
            width: "1.7rem",
            height: "1.7rem",
            color:
              s <= Math.round(rating)
                ? "var(--color-yellow-500)"
                : "var(--color-grey-200)",
            fill: s <= Math.round(rating) ? "var(--color-yellow-500)" : "none",
          }}
        />
      ))}
      <span
        style={{ fontWeight: 800, fontSize: "1.6rem", marginLeft: "0.4rem" }}
      >
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

// ─── ProfileField — editable inline or locked ─────────────────────────────────

type FieldProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  locked?: boolean;
  editable?: boolean;
  onSave?: (val: string) => void;
};

function ProfileField({
  icon,
  label,
  value,
  locked = false,
  editable = false,
  onSave,
}: FieldProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const { addNotification } = useNotifications();

  const handleSave = () => {
    if (!draft.trim()) return;
    onSave?.(draft.trim());
    setEditing(false);
    addNotification(
      "✅ Profile Updated",
      `${label} has been updated`,
      "success",
      { duration: 3000 },
    );
  };

  const handleCancel = () => {
    setDraft(value);
    setEditing(false);
  };

  return (
    <InfoRow>
      <InfoIcon $locked={locked}>{icon}</InfoIcon>
      <InfoContent>
        <div className="label">
          {label}
          {locked && (
            <LockedBadge>
              <HiOutlineLockClosed />
              Admin only
            </LockedBadge>
          )}
        </div>

        {editing ? (
          <EditRowWrap>
            <EditInput
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") handleCancel();
              }}
              autoFocus
            />
            <SmallIconBtn onClick={handleSave} title="Save">
              <HiOutlineCheckCircle />
            </SmallIconBtn>
            <SmallIconBtn $danger onClick={handleCancel} title="Cancel">
              <HiOutlineXMark />
            </SmallIconBtn>
          </EditRowWrap>
        ) : (
          <EditRowWrap>
            <div className="value" style={{ flex: 1 }}>
              {value}
            </div>
            {editable && !locked && (
              <EditBtn
                onClick={() => {
                  setDraft(value);
                  setEditing(true);
                }}
              >
                <HiOutlinePencil />
                Edit
              </EditBtn>
            )}
          </EditRowWrap>
        )}
      </InfoContent>
    </InfoRow>
  );
}

// ─── Settings Tab (shared across roles) ──────────────────────────────────────

type SettingsState = {
  emailNotifications: boolean;
  smsNotifications: boolean;
  darkMode: boolean;
  language: string;
  timezone: string;
};

function SettingsTab() {
  const { addNotification } = useNotifications();
  const [s, setS] = useState<SettingsState>({
    emailNotifications: true,
    smsNotifications: false,
    darkMode: false,
    language: "en",
    timezone: "Africa/Tunis",
  });

  const toggle = (key: keyof SettingsState) => {
    setS((prev) => ({ ...prev, [key]: !prev[key] }));
    addNotification(
      "Settings Saved",
      "Your preference has been updated",
      "success",
      { duration: 2500 },
    );
  };

  const handleSelect = (key: keyof SettingsState, val: string) => {
    setS((prev) => ({ ...prev, [key]: val }));
    addNotification(
      "Settings Saved",
      "Your preference has been updated",
      "success",
      { duration: 2500 },
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.4rem" }}>
      {/* Notifications */}
      <Card>
        <CardHeader>
          <Heading as="h2">
            <span
              style={{ display: "flex", alignItems: "center", gap: "1rem" }}
            >
              <HiOutlineBell style={{ width: "2rem", height: "2rem" }} />
              Notifications
            </span>
          </Heading>
        </CardHeader>
        <CardBody>
          <SettingRow>
            <SettingInfo>
              <div className="title">Email Notifications</div>
              <div className="desc">
                Receive order and delivery updates by email
              </div>
            </SettingInfo>
            <Toggle
              $on={s.emailNotifications}
              onClick={() => toggle("emailNotifications")}
            />
          </SettingRow>
          <SettingRow>
            <SettingInfo>
              <div className="title">SMS Notifications</div>
              <div className="desc">Receive delivery alerts via SMS</div>
            </SettingInfo>
            <Toggle
              $on={s.smsNotifications}
              onClick={() => toggle("smsNotifications")}
            />
          </SettingRow>
        </CardBody>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <Heading as="h2">
            <span
              style={{ display: "flex", alignItems: "center", gap: "1rem" }}
            >
              <HiOutlineMoon style={{ width: "2rem", height: "2rem" }} />
              Appearance
            </span>
          </Heading>
        </CardHeader>
        <CardBody>
          <SettingRow>
            <SettingInfo>
              <div className="title">Dark Mode</div>
              <div className="desc">Switch to a darker color scheme</div>
            </SettingInfo>
            <Toggle $on={s.darkMode} onClick={() => toggle("darkMode")} />
          </SettingRow>
        </CardBody>
      </Card>

      {/* Language & Region */}
      <Card>
        <CardHeader>
          <Heading as="h2">
            <span
              style={{ display: "flex", alignItems: "center", gap: "1rem" }}
            >
              <HiOutlineGlobeAlt style={{ width: "2rem", height: "2rem" }} />
              Language & Region
            </span>
          </Heading>
        </CardHeader>
        <CardBody>
          <SettingRow>
            <SettingInfo>
              <div className="title">Language</div>
              <div className="desc">Choose your preferred language</div>
            </SettingInfo>
            <SelectInput
              value={s.language}
              onChange={(e) => handleSelect("language", e.target.value)}
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="ar">العربية</option>
            </SelectInput>
          </SettingRow>
          <SettingRow>
            <SettingInfo>
              <div className="title">Timezone</div>
              <div className="desc">Set your local timezone</div>
            </SettingInfo>
            <SelectInput
              value={s.timezone}
              onChange={(e) => handleSelect("timezone", e.target.value)}
            >
              <option value="Africa/Tunis">Africa/Tunis (UTC+1)</option>
              <option value="Europe/Paris">Europe/Paris (UTC+1/+2)</option>
              <option value="UTC">UTC</option>
            </SelectInput>
          </SettingRow>
        </CardBody>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <Heading as="h2">
            <span
              style={{ display: "flex", alignItems: "center", gap: "1rem" }}
            >
              <HiOutlineShieldCheck style={{ width: "2rem", height: "2rem" }} />
              Security
            </span>
          </Heading>
        </CardHeader>
        <CardBody>
          <SettingRow>
            <SettingInfo>
              <div className="title">Password</div>
              <div className="desc">Last changed 3 months ago</div>
            </SettingInfo>
            <Button $variation="secondary" $size="small">
              Change Password
            </Button>
          </SettingRow>
          <SettingRow>
            <SettingInfo>
              <div className="title">Two-Factor Authentication</div>
              <div className="desc">Add an extra layer of security</div>
            </SettingInfo>
            <Button $variation="secondary" $size="small">
              Enable 2FA
            </Button>
          </SettingRow>
        </CardBody>
      </Card>
    </div>
  );
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const PROFILES: Record<string, any> = {
  "ahmed.mahmoudi@taba3ni.tn": {
    name: "Ahmed Mahmoudi",
    email: "ahmed.mahmoudi@taba3ni.tn",
    phone: "+216 98 123 456",
    role: "distributor",
    joinedDate: "2023-03-15",
    isOnline: true,
    vehicle: {
      type: "Refrigerated Truck",
      plate: "123 TU 1234",
      capacity: "2 tonnes",
      lastService: "2025-10-01",
    },
    zones: ["Tunis", "Lac 1", "Lac 2", "Les Berges du Lac"],
    emergencyContact: "+216 71 456 789",
    license: "Exp. 2027-06-30",
    stats: {
      totalDeliveries: 312,
      completedThisMonth: 28,
      avgRating: 4.8,
      successRate: 96,
      totalKm: 4820,
      avgDeliveryTime: 24,
    },
  },
  "admin@taba3ni.tn": {
    name: "Admin User",
    email: "admin@taba3ni.tn",
    phone: "+216 71 000 000",
    role: "admin",
    joinedDate: "2022-01-10",
    isOnline: true,
    department: "Operations",
    permissions: ["Full Access", "User Management", "Reports", "Settings"],
  },
  "client@taba3ni.tn": {
    name: "Carrefour Lac 2",
    email: "client@taba3ni.tn",
    phone: "+216 71 123 456",
    role: "client",
    joinedDate: "2023-06-20",
    isOnline: false,
    store: {
      name: "Carrefour Lac 2",
      address: "Avenue de la Bourse, Lac 2, Tunis 1053",
      city: "Tunis",
      type: "Supermarket",
      contactPerson: "Ahmed Ben Ali",
    },
    taxId: "TN-123456789",
    accountManager: "Sarah Bouaziz",
    stats: {
      totalOrders: 47,
      totalSpent: 68400,
      avgOrderValue: 1455,
      activeSubscription: "Premium Client",
    },
  },
};

// ─── Role views ───────────────────────────────────────────────────────────────

function DistributorProfile({
  profile,
  onSave,
}: {
  profile: any;
  onSave: (f: string, v: string) => void;
}) {
  const [tab, setTab] = useState<"profile" | "settings">("profile");
  return (
    <Layout>
      <Heading as="h1">My Profile</Heading>
      <TabBar>
        <Tab $active={tab === "profile"} onClick={() => setTab("profile")}>
          {" "}
          <HiOutlineUser /> Profile{" "}
        </Tab>
        <Tab $active={tab === "settings"} onClick={() => setTab("settings")}>
          {" "}
          <HiOutlineCog6Tooth /> Settings{" "}
        </Tab>
      </TabBar>

      {tab === "settings" ? (
        <SettingsTab />
      ) : (
        <PageGrid>
          {/* Left */}
          <Card>
            <AvatarSection>
              <AvatarWrap>
                <Avatar>{getInitials(profile.name)}</Avatar>
                <AvatarEditBtn>
                  <HiOutlineCamera />
                </AvatarEditBtn>
              </AvatarWrap>
              <AvatarName>{profile.name}</AvatarName>
              <AvatarSub>{profile.email}</AvatarSub>
              <RoleBadge $role="distributor">Distributor</RoleBadge>
              <OnlineDot $online={profile.isOnline}>
                {profile.isOnline ? "Active" : "Offline"}
              </OnlineDot>
            </AvatarSection>
            <CardBody>
              <ProfileField
                icon={<HiOutlineEnvelope />}
                label="Email"
                value={profile.email}
                locked
              />
              <ProfileField
                icon={<HiOutlinePhone />}
                label="Phone"
                value={profile.phone}
                editable
                onSave={(v) => onSave("phone", v)}
              />
              <ProfileField
                icon={<HiOutlinePhone />}
                label="Emergency Contact"
                value={profile.emergencyContact}
                editable
                onSave={(v) => onSave("emergencyContact", v)}
              />
              <ProfileField
                icon={<HiOutlineCalendar />}
                label="Member Since"
                value={formatDate(profile.joinedDate)}
                locked
              />
              <ProfileField
                icon={<HiOutlineIdentification />}
                label="Driver's License"
                value={profile.license}
                locked
              />
            </CardBody>
          </Card>

          {/* Right */}
          <RightCol>
            <Card>
              <CardHeader>
                <Heading as="h2">Performance Stats</Heading>
                <StatusBadge $status="delivered">
                  ★ {profile.stats.avgRating.toFixed(1)}
                </StatusBadge>
              </CardHeader>
              <StatsGrid>
                <StatTile>
                  <StatIconWrap>
                    <HiOutlineTruck />
                  </StatIconWrap>
                  <StatValue>{profile.stats.totalDeliveries}</StatValue>
                  <StatLabel>Total Deliveries</StatLabel>
                </StatTile>
                <StatTile>
                  <StatIconWrap>
                    <HiOutlineCheckCircle />
                  </StatIconWrap>
                  <StatValue>{profile.stats.completedThisMonth}</StatValue>
                  <StatLabel>This Month</StatLabel>
                </StatTile>
                <StatTile>
                  <StatIconWrap>
                    <HiOutlineChartBar />
                  </StatIconWrap>
                  <StatValue>{profile.stats.successRate}%</StatValue>
                  <StatLabel>Success Rate</StatLabel>
                </StatTile>
                <StatTile>
                  <StatIconWrap>
                    <HiOutlineMapPin />
                  </StatIconWrap>
                  <StatValue>
                    {profile.stats.totalKm.toLocaleString()}
                  </StatValue>
                  <StatLabel>Total km</StatLabel>
                </StatTile>
                <StatTile>
                  <StatIconWrap>
                    <HiOutlineClock />
                  </StatIconWrap>
                  <StatValue>{profile.stats.avgDeliveryTime}</StatValue>
                  <StatLabel>Avg Time (min)</StatLabel>
                </StatTile>
                <StatTile>
                  <StatIconWrap>
                    <HiOutlineStar />
                  </StatIconWrap>
                  <div style={{ marginTop: "0.4rem" }}>
                    <StarDisplay rating={profile.stats.avgRating} />
                  </div>
                  <StatLabel style={{ marginTop: "0.4rem" }}>
                    Avg Rating
                  </StatLabel>
                </StatTile>
              </StatsGrid>
            </Card>

            <Card>
              <CardHeader>
                <Heading as="h2">Vehicle Information</Heading>
                <LockedBadge>
                  <HiOutlineLockClosed />
                  Admin managed
                </LockedBadge>
              </CardHeader>
              <CardBody>
                <ProfileField
                  icon={<HiOutlineTruck />}
                  label="Vehicle Type"
                  value={profile.vehicle.type}
                  locked
                />
                <ProfileField
                  icon={<HiOutlineIdentification />}
                  label="Plate Number"
                  value={profile.vehicle.plate}
                  locked
                />
                <ProfileField
                  icon={<HiOutlineTruck />}
                  label="Capacity"
                  value={profile.vehicle.capacity}
                  locked
                />
                <ProfileField
                  icon={<HiOutlineCalendar />}
                  label="Last Service"
                  value={formatDate(profile.vehicle.lastService)}
                  locked
                />
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <Heading as="h2">Assigned Zones</Heading>
                <LockedBadge>
                  <HiOutlineLockClosed />
                  Admin managed
                </LockedBadge>
              </CardHeader>
              <ZoneTags>
                {profile.zones.map((z: string) => (
                  <ZoneTag key={z}>{z}</ZoneTag>
                ))}
              </ZoneTags>
            </Card>
          </RightCol>
        </PageGrid>
      )}
    </Layout>
  );
}

function AdminProfile({
  profile,
  onSave,
}: {
  profile: any;
  onSave: (f: string, v: string) => void;
}) {
  const [tab, setTab] = useState<"profile" | "settings">("profile");
  return (
    <Layout>
      <Heading as="h1">My Profile</Heading>
      <TabBar>
        <Tab $active={tab === "profile"} onClick={() => setTab("profile")}>
          {" "}
          <HiOutlineUser /> Profile{" "}
        </Tab>
        <Tab $active={tab === "settings"} onClick={() => setTab("settings")}>
          {" "}
          <HiOutlineCog6Tooth /> Settings{" "}
        </Tab>
      </TabBar>

      {tab === "settings" ? (
        <SettingsTab />
      ) : (
        <PageGrid>
          <Card>
            <AvatarSection>
              <AvatarWrap>
                <Avatar>{getInitials(profile.name)}</Avatar>
                <AvatarEditBtn>
                  <HiOutlineCamera />
                </AvatarEditBtn>
              </AvatarWrap>
              <AvatarName>{profile.name}</AvatarName>
              <AvatarSub>{profile.department}</AvatarSub>
              <RoleBadge $role="admin">Administrator</RoleBadge>
              <OnlineDot $online>Active</OnlineDot>
            </AvatarSection>
            <CardBody>
              <ProfileField
                icon={<HiOutlineEnvelope />}
                label="Email"
                value={profile.email}
                locked
              />
              <ProfileField
                icon={<HiOutlineUser />}
                label="Department"
                value={profile.department}
                locked
              />
              <ProfileField
                icon={<HiOutlinePhone />}
                label="Phone"
                value={profile.phone}
                editable
                onSave={(v) => onSave("phone", v)}
              />
              <ProfileField
                icon={<HiOutlineCalendar />}
                label="Member Since"
                value={formatDate(profile.joinedDate)}
                locked
              />
            </CardBody>
          </Card>
          <RightCol>
            <Card>
              <CardHeader>
                <Heading as="h2">Permissions & Access</Heading>
                <StatusBadge $status="delivered">Full Access</StatusBadge>
              </CardHeader>
              <ZoneTags>
                {profile.permissions.map((p: string) => (
                  <ZoneTag
                    key={p}
                    style={{
                      background: "var(--color-red-50)",
                      color: "var(--color-red-700)",
                      borderColor: "var(--color-red-200)",
                    }}
                  >
                    <HiOutlineShieldCheck
                      style={{
                        display: "inline",
                        width: "1.2rem",
                        height: "1.2rem",
                        marginRight: "0.4rem",
                      }}
                    />
                    {p}
                  </ZoneTag>
                ))}
              </ZoneTags>
            </Card>
          </RightCol>
        </PageGrid>
      )}
    </Layout>
  );
}

function ClientProfile({
  profile,
  onSave,
}: {
  profile: any;
  onSave: (f: string, v: string) => void;
}) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"profile" | "settings">("profile");

  return (
    <Layout>
      <Heading as="h1">My Account</Heading>
      <TabBar>
        <Tab $active={tab === "profile"} onClick={() => setTab("profile")}>
          {" "}
          <HiOutlineUser /> Profile{" "}
        </Tab>
        <Tab $active={tab === "settings"} onClick={() => setTab("settings")}>
          {" "}
          <HiOutlineCog6Tooth /> Settings{" "}
        </Tab>
      </TabBar>

      {tab === "settings" ? (
        <SettingsTab />
      ) : (
        <PageGrid>
          <Card>
            <AvatarSection>
              <AvatarWrap>
                <Avatar style={{ fontSize: "2.8rem" }}>
                  <HiOutlineBuildingStorefront
                    style={{ width: "4rem", height: "4rem" }}
                  />
                </Avatar>
              </AvatarWrap>
              <AvatarName>{profile.store.name}</AvatarName>
              <AvatarSub>{profile.store.type}</AvatarSub>
              <RoleBadge $role="client">Client</RoleBadge>
            </AvatarSection>
            <CardBody>
              <ProfileField
                icon={<HiOutlineBuildingStorefront />}
                label="Store Name"
                value={profile.store.name}
                locked
              />
              <ProfileField
                icon={<HiOutlineEnvelope />}
                label="Email"
                value={profile.email}
                locked
              />
              <ProfileField
                icon={<HiOutlineUser />}
                label="Contact Person"
                value={profile.store.contactPerson}
                editable
                onSave={(v) => onSave("contactPerson", v)}
              />
              <ProfileField
                icon={<HiOutlinePhone />}
                label="Phone"
                value={profile.phone}
                editable
                onSave={(v) => onSave("phone", v)}
              />
              <ProfileField
                icon={<HiOutlineMapPin />}
                label="Address"
                value={profile.store.address}
                locked
              />
              <ProfileField
                icon={<HiOutlineIdentification />}
                label="Tax ID"
                value={profile.taxId}
                locked
              />
              <ProfileField
                icon={<HiOutlineCalendar />}
                label="Client Since"
                value={formatDate(profile.joinedDate)}
                locked
              />
            </CardBody>
          </Card>

          <RightCol>
            <Card>
              <CardHeader>
                <Heading as="h2">Account Summary</Heading>
                <StatusBadge $status="delivered">
                  {profile.stats.activeSubscription}
                </StatusBadge>
              </CardHeader>
              <StatsGrid>
                <StatTile>
                  <StatIconWrap>
                    <HiOutlineTruck />
                  </StatIconWrap>
                  <StatValue>{profile.stats.totalOrders}</StatValue>
                  <StatLabel>Total Orders</StatLabel>
                </StatTile>
                <StatTile>
                  <StatIconWrap>
                    <HiOutlineCurrencyDollar />
                  </StatIconWrap>
                  <StatValue style={{ fontSize: "1.8rem" }}>
                    {profile.stats.totalSpent.toLocaleString()}
                  </StatValue>
                  <StatLabel>Total Spent (TND)</StatLabel>
                </StatTile>
                <StatTile>
                  <StatIconWrap>
                    <HiOutlineChartBar />
                  </StatIconWrap>
                  <StatValue style={{ fontSize: "1.8rem" }}>
                    {profile.stats.avgOrderValue.toLocaleString()}
                  </StatValue>
                  <StatLabel>Avg Order (TND)</StatLabel>
                </StatTile>
              </StatsGrid>
            </Card>

            <Card>
              <CardHeader>
                <Heading as="h2">Account Manager</Heading>
                <LockedBadge>
                  <HiOutlineLockClosed />
                  Admin managed
                </LockedBadge>
              </CardHeader>
              <CardBody>
                <ProfileField
                  icon={<HiOutlineUser />}
                  label="Your Manager"
                  value={profile.accountManager}
                  locked
                />
                <ProfileField
                  icon={<HiOutlineEnvelope />}
                  label="Support Email"
                  value="support@taba3ni.tn"
                  locked
                />
                <ProfileField
                  icon={<HiOutlinePhone />}
                  label="Support Phone"
                  value="+216 71 000 111"
                  locked
                />
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <Heading as="h2">Quick Actions</Heading>
              </CardHeader>
              <div
                style={{
                  padding: "1.6rem 2.4rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.2rem",
                }}
              >
                <Button
                  $variation="primary"
                  $size="medium"
                  onClick={() => navigate("/new-order")}
                >
                  Place New Order
                </Button>
                <Button
                  $variation="secondary"
                  $size="medium"
                  onClick={() => navigate("/invoices")}
                >
                  View Invoices
                </Button>
                <Button
                  $variation="secondary"
                  $size="medium"
                  onClick={() => navigate("/history")}
                >
                  Order History
                </Button>
              </div>
            </Card>
          </RightCol>
        </PageGrid>
      )}
    </Layout>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

type ProfileProps = {
  userRole?: "admin" | "distributor" | "client";
  userId?: string;
  userName?: string;
};

function Profile({ userRole = "admin", userId }: ProfileProps) {
  const navigate = useNavigate();

  const fallback =
    userRole === "distributor"
      ? PROFILES["ahmed.mahmoudi@taba3ni.tn"]
      : userRole === "client"
        ? PROFILES["client@taba3ni.tn"]
        : PROFILES["admin@taba3ni.tn"];

  const [profile, setProfile] = useState<any>(
    PROFILES[userId ?? ""] ?? fallback,
  );

  const handleSave = (field: string, value: string) => {
    setProfile((prev: any) =>
      field === "contactPerson"
        ? { ...prev, store: { ...prev.store, contactPerson: value } }
        : { ...prev, [field]: value },
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <BackButton onClick={() => navigate(-1)}>
        <HiOutlineArrowLeft />
        Back
      </BackButton>

      {userRole === "distributor" && (
        <DistributorProfile profile={profile} onSave={handleSave} />
      )}
      {userRole === "client" && (
        <ClientProfile profile={profile} onSave={handleSave} />
      )}
      {userRole === "admin" && (
        <AdminProfile profile={profile} onSave={handleSave} />
      )}
    </div>
  );
}

export default Profile;
