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
} from "react-icons/hi2";
import Heading from "../UI/Heading";
import Button from "../UI/Button";
import StatusBadge from "../UI/StatusBadge";

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

const PageGrid = styled.div`
  display: grid;
  grid-template-columns: 36rem 1fr;
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
  padding: 2rem 2.4rem;
  border-bottom: 1px solid var(--color-grey-100);
`;

const CardBody = styled.div`
  padding: 2.4rem;
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1.4rem;
  padding: 1.4rem 0;
  border-bottom: 1px solid var(--color-grey-50);
  &:last-child {
    border-bottom: none;
  }
`;

const InfoIcon = styled.div`
  width: 3.6rem;
  height: 3.6rem;
  border-radius: var(--border-radius-sm);
  background: var(--color-brand-50);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  & svg {
    width: 1.8rem;
    height: 1.8rem;
    color: var(--color-brand-600);
  }
`;

const InfoContent = styled.div`
  flex: 1;
  & .label {
    font-size: 1.2rem;
    color: var(--color-grey-500);
    font-weight: 500;
    margin-bottom: 0.2rem;
  }
  & .value {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-grey-900);
  }
`;

// ─── Avatar Section ───────────────────────────────────────────────────────────

const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3.2rem 2.4rem 2.4rem;
  gap: 1.6rem;
  background: linear-gradient(
    160deg,
    var(--color-brand-50),
    var(--color-grey-0)
  );
  position: relative;
`;

const AvatarWrap = styled.div`
  position: relative;
`;

const Avatar = styled.div`
  width: 10rem;
  height: 10rem;
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
  font-size: 3.6rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  border: 4px solid white;
`;

const AvatarEditBtn = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 3.2rem;
  height: 3.2rem;
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
    width: 1.5rem;
    height: 1.5rem;
  }
  &:hover {
    background: var(--color-brand-700);
  }
`;

const AvatarName = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-grey-900);
  text-align: center;
`;

const AvatarSub = styled.div`
  font-size: 1.3rem;
  color: var(--color-grey-500);
  text-align: center;
  margin-top: -0.8rem;
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

const OnlineIndicator = styled.div<{ $online: boolean }>`
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

// ─── Stats Grid ───────────────────────────────────────────────────────────────

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.6rem;
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatTile = styled.div`
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2rem;
  text-align: center;
  transition: all 0.2s;
  &:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }
`;

const StatValue = styled.div`
  font-size: 2.8rem;
  font-weight: 800;
  color: var(--color-brand-600);
  line-height: 1;
  margin-bottom: 0.6rem;
`;

const StatLabel = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-grey-500);
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

const StatIcon = styled.div`
  margin-bottom: 0.8rem;
  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-brand-300);
  }
`;

// ─── Zone Tags ────────────────────────────────────────────────────────────────

const ZoneTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-top: 0.4rem;
`;

const ZoneTag = styled.span`
  padding: 0.4rem 1.2rem;
  background: var(--color-brand-50);
  color: var(--color-brand-700);
  border: 1px solid var(--color-brand-200);
  border-radius: 100px;
  font-size: 1.2rem;
  font-weight: 600;
`;

// ─── Rating Display ───────────────────────────────────────────────────────────

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  & svg {
    width: 1.8rem;
    height: 1.8rem;
  }
`;

const RatingNum = styled.span`
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--color-grey-900);
  margin-left: 0.4rem;
`;

// ─── Right column stack ───────────────────────────────────────────────────────

const RightCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
`;

// ─── Notice banner ────────────────────────────────────────────────────────────

const ReadOnlyBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1.2rem 1.8rem;
  background: var(--color-grey-50);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-sm);
  font-size: 1.3rem;
  color: var(--color-grey-600);
  & svg {
    width: 1.8rem;
    height: 1.8rem;
    color: var(--color-grey-400);
    flex-shrink: 0;
  }
`;

// ─── Mock profile data ────────────────────────────────────────────────────────

const PROFILES: Record<string, any> = {
  // Distributor
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
    stats: {
      totalDeliveries: 312,
      completedThisMonth: 28,
      avgRating: 4.8,
      successRate: 96,
      totalKm: 4820,
      avgDeliveryTime: 24,
    },
    license: "Exp. 2027-06-30",
    emergencyContact: "+216 71 456 789",
  },

  // Admin
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

  // Client
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
    stats: {
      totalOrders: 47,
      totalSpent: 68400,
      avgOrderValue: 1455,
      activeSubscription: "Premium Client",
    },
    taxId: "TN-123456789",
    accountManager: "Sarah Bouaziz",
  },
};

const DEFAULT_DISTRIBUTOR = PROFILES["ahmed.mahmoudi@taba3ni.tn"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name
    .trim()
    .split(" ")
    .map((n) => n[0]?.toUpperCase())
    .join("")
    .slice(0, 2);
}

function formatJoinDate(str: string) {
  return new Date(str).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// ─── Profile Types ────────────────────────────────────────────────────────────

type ProfileProps = {
  userRole?: "admin" | "distributor" | "client";
  userId?: string;
  userName?: string;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StarDisplay({ rating }: { rating: number }) {
  return (
    <RatingRow>
      {[1, 2, 3, 4, 5].map((s) => (
        <HiOutlineStar
          key={s}
          style={{
            color:
              s <= Math.round(rating)
                ? "var(--color-yellow-500)"
                : "var(--color-grey-200)",
            fill: s <= Math.round(rating) ? "var(--color-yellow-500)" : "none",
          }}
        />
      ))}
      <RatingNum>{rating.toFixed(1)}</RatingNum>
    </RatingRow>
  );
}

// ─── Distributor Profile ──────────────────────────────────────────────────────

function DistributorProfile({
  profile,
}: {
  profile: typeof DEFAULT_DISTRIBUTOR;
}) {
  return (
    <Layout>
      <Heading as="h1">My Profile</Heading>
      <ReadOnlyBanner>
        <HiOutlineShieldCheck />
        Your profile information is managed by the Taba3ni admin team. Contact
        support to request changes.
      </ReadOnlyBanner>

      <PageGrid>
        {/* Left — Identity Card */}
        <Card>
          <AvatarSection>
            <AvatarWrap>
              <Avatar>{getInitials(profile.name)}</Avatar>
              <AvatarEditBtn title="Request photo change">
                <HiOutlineCamera />
              </AvatarEditBtn>
            </AvatarWrap>
            <AvatarName>{profile.name}</AvatarName>
            <AvatarSub>{profile.email}</AvatarSub>
            <RoleBadge $role={profile.role}>Distributor</RoleBadge>
            <OnlineIndicator $online={profile.isOnline}>
              {profile.isOnline ? "Active" : "Offline"}
            </OnlineIndicator>
          </AvatarSection>

          <CardBody>
            <InfoRow>
              <InfoIcon>
                <HiOutlinePhone />
              </InfoIcon>
              <InfoContent>
                <div className="label">Phone</div>
                <div className="value">{profile.phone}</div>
              </InfoContent>
            </InfoRow>
            <InfoRow>
              <InfoIcon>
                <HiOutlineCalendar />
              </InfoIcon>
              <InfoContent>
                <div className="label">Member Since</div>
                <div className="value">
                  {formatJoinDate(profile.joinedDate)}
                </div>
              </InfoContent>
            </InfoRow>
            <InfoRow>
              <InfoIcon>
                <HiOutlineIdentification />
              </InfoIcon>
              <InfoContent>
                <div className="label">Driver's License</div>
                <div className="value">{profile.license}</div>
              </InfoContent>
            </InfoRow>
            <InfoRow>
              <InfoIcon>
                <HiOutlinePhone />
              </InfoIcon>
              <InfoContent>
                <div className="label">Emergency Contact</div>
                <div className="value">{profile.emergencyContact}</div>
              </InfoContent>
            </InfoRow>
          </CardBody>
        </Card>

        {/* Right column */}
        <RightCol>
          {/* Performance stats */}
          <Card>
            <CardHeader>
              <Heading as="h2">Performance Stats</Heading>
              <StatusBadge $status="delivered">
                ★ {profile.stats.avgRating.toFixed(1)} Rating
              </StatusBadge>
            </CardHeader>
            <div style={{ padding: "2.4rem" }}>
              <StatsGrid>
                <StatTile>
                  <StatIcon>
                    <HiOutlineTruck />
                  </StatIcon>
                  <StatValue>{profile.stats.totalDeliveries}</StatValue>
                  <StatLabel>Total Deliveries</StatLabel>
                </StatTile>
                <StatTile>
                  <StatIcon>
                    <HiOutlineCheckCircle />
                  </StatIcon>
                  <StatValue>{profile.stats.completedThisMonth}</StatValue>
                  <StatLabel>This Month</StatLabel>
                </StatTile>
                <StatTile>
                  <StatIcon>
                    <HiOutlineChartBar />
                  </StatIcon>
                  <StatValue>{profile.stats.successRate}%</StatValue>
                  <StatLabel>Success Rate</StatLabel>
                </StatTile>
                <StatTile>
                  <StatIcon>
                    <HiOutlineMapPin />
                  </StatIcon>
                  <StatValue>
                    {profile.stats.totalKm.toLocaleString()}
                  </StatValue>
                  <StatLabel>Total km</StatLabel>
                </StatTile>
                <StatTile>
                  <StatIcon>
                    <HiOutlineClock />
                  </StatIcon>
                  <StatValue>{profile.stats.avgDeliveryTime}</StatValue>
                  <StatLabel>Avg Time (min)</StatLabel>
                </StatTile>
                <StatTile>
                  <StatIcon>
                    <HiOutlineStar />
                  </StatIcon>
                  <StatValue style={{ fontSize: "2rem" }}>
                    <StarDisplay rating={profile.stats.avgRating} />
                  </StatValue>
                  <StatLabel>Avg Rating</StatLabel>
                </StatTile>
              </StatsGrid>
            </div>
          </Card>

          {/* Vehicle info */}
          <Card>
            <CardHeader>
              <Heading as="h2">Vehicle Information</Heading>
            </CardHeader>
            <CardBody>
              <InfoRow>
                <InfoIcon>
                  <HiOutlineTruck />
                </InfoIcon>
                <InfoContent>
                  <div className="label">Vehicle Type</div>
                  <div className="value">{profile.vehicle.type}</div>
                </InfoContent>
              </InfoRow>
              <InfoRow>
                <InfoIcon>
                  <HiOutlineIdentification />
                </InfoIcon>
                <InfoContent>
                  <div className="label">Plate Number</div>
                  <div className="value">{profile.vehicle.plate}</div>
                </InfoContent>
              </InfoRow>
              <InfoRow>
                <InfoIcon>
                  <HiOutlineTruck />
                </InfoIcon>
                <InfoContent>
                  <div className="label">Capacity</div>
                  <div className="value">{profile.vehicle.capacity}</div>
                </InfoContent>
              </InfoRow>
              <InfoRow>
                <InfoIcon>
                  <HiOutlineCalendar />
                </InfoIcon>
                <InfoContent>
                  <div className="label">Last Service</div>
                  <div className="value">
                    {formatJoinDate(profile.vehicle.lastService)}
                  </div>
                </InfoContent>
              </InfoRow>
            </CardBody>
          </Card>

          {/* Zones */}
          <Card>
            <CardHeader>
              <Heading as="h2">Assigned Zones</Heading>
            </CardHeader>
            <div style={{ padding: "2rem 2.4rem" }}>
              <ZoneTags>
                {profile.zones.map((z: string) => (
                  <ZoneTag key={z}>
                    <HiOutlineMapPin
                      style={{
                        display: "inline",
                        width: "1.2rem",
                        height: "1.2rem",
                        marginRight: "0.4rem",
                      }}
                    />
                    {z}
                  </ZoneTag>
                ))}
              </ZoneTags>
            </div>
          </Card>
        </RightCol>
      </PageGrid>
    </Layout>
  );
}

// ─── Admin Profile ────────────────────────────────────────────────────────────

function AdminProfile({ profile }: { profile: any }) {
  return (
    <Layout>
      <Heading as="h1">My Profile</Heading>

      <PageGrid>
        <Card>
          <AvatarSection>
            <AvatarWrap>
              <Avatar>{getInitials(profile.name)}</Avatar>
            </AvatarWrap>
            <AvatarName>{profile.name}</AvatarName>
            <AvatarSub>{profile.department}</AvatarSub>
            <RoleBadge $role="admin">Administrator</RoleBadge>
            <OnlineIndicator $online={profile.isOnline}>Active</OnlineIndicator>
          </AvatarSection>

          <CardBody>
            <InfoRow>
              <InfoIcon>
                <HiOutlineEnvelope />
              </InfoIcon>
              <InfoContent>
                <div className="label">Email</div>
                <div className="value">{profile.email}</div>
              </InfoContent>
            </InfoRow>
            <InfoRow>
              <InfoIcon>
                <HiOutlinePhone />
              </InfoIcon>
              <InfoContent>
                <div className="label">Phone</div>
                <div className="value">{profile.phone}</div>
              </InfoContent>
            </InfoRow>
            <InfoRow>
              <InfoIcon>
                <HiOutlineCalendar />
              </InfoIcon>
              <InfoContent>
                <div className="label">Member Since</div>
                <div className="value">
                  {formatJoinDate(profile.joinedDate)}
                </div>
              </InfoContent>
            </InfoRow>
          </CardBody>
        </Card>

        <RightCol>
          <Card>
            <CardHeader>
              <Heading as="h2">Permissions & Access</Heading>
              <StatusBadge $status="delivered">Full Access</StatusBadge>
            </CardHeader>
            <div style={{ padding: "2rem 2.4rem" }}>
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
            </div>
          </Card>
        </RightCol>
      </PageGrid>
    </Layout>
  );
}

// ─── Client Profile ───────────────────────────────────────────────────────────

function ClientProfile({ profile }: { profile: any }) {
  const navigate = useNavigate();

  return (
    <Layout>
      <Heading as="h1">My Account</Heading>

      <PageGrid>
        {/* Left — Store identity */}
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
            <InfoRow>
              <InfoIcon>
                <HiOutlineUser />
              </InfoIcon>
              <InfoContent>
                <div className="label">Contact Person</div>
                <div className="value">{profile.store.contactPerson}</div>
              </InfoContent>
            </InfoRow>
            <InfoRow>
              <InfoIcon>
                <HiOutlineEnvelope />
              </InfoIcon>
              <InfoContent>
                <div className="label">Email</div>
                <div className="value">{profile.email}</div>
              </InfoContent>
            </InfoRow>
            <InfoRow>
              <InfoIcon>
                <HiOutlinePhone />
              </InfoIcon>
              <InfoContent>
                <div className="label">Phone</div>
                <div className="value">{profile.phone}</div>
              </InfoContent>
            </InfoRow>
            <InfoRow>
              <InfoIcon>
                <HiOutlineMapPin />
              </InfoIcon>
              <InfoContent>
                <div className="label">Address</div>
                <div className="value">{profile.store.address}</div>
              </InfoContent>
            </InfoRow>
            <InfoRow>
              <InfoIcon>
                <HiOutlineIdentification />
              </InfoIcon>
              <InfoContent>
                <div className="label">Tax ID</div>
                <div className="value">{profile.taxId}</div>
              </InfoContent>
            </InfoRow>
            <InfoRow>
              <InfoIcon>
                <HiOutlineCalendar />
              </InfoIcon>
              <InfoContent>
                <div className="label">Client Since</div>
                <div className="value">
                  {formatJoinDate(profile.joinedDate)}
                </div>
              </InfoContent>
            </InfoRow>
          </CardBody>
        </Card>

        {/* Right */}
        <RightCol>
          {/* Account stats */}
          <Card>
            <CardHeader>
              <Heading as="h2">Account Summary</Heading>
              <StatusBadge $status="delivered">
                {profile.stats.activeSubscription}
              </StatusBadge>
            </CardHeader>
            <div style={{ padding: "2.4rem" }}>
              <StatsGrid>
                <StatTile>
                  <StatIcon>
                    <HiOutlineTruck />
                  </StatIcon>
                  <StatValue>{profile.stats.totalOrders}</StatValue>
                  <StatLabel>Total Orders</StatLabel>
                </StatTile>
                <StatTile>
                  <StatIcon>
                    <HiOutlineCurrencyDollar />
                  </StatIcon>
                  <StatValue style={{ fontSize: "2rem" }}>
                    {profile.stats.totalSpent.toLocaleString()}
                  </StatValue>
                  <StatLabel>Total Spent (TND)</StatLabel>
                </StatTile>
                <StatTile>
                  <StatIcon>
                    <HiOutlineChartBar />
                  </StatIcon>
                  <StatValue style={{ fontSize: "2rem" }}>
                    {profile.stats.avgOrderValue.toLocaleString()}
                  </StatValue>
                  <StatLabel>Avg Order (TND)</StatLabel>
                </StatTile>
              </StatsGrid>
            </div>
          </Card>

          {/* Account manager */}
          <Card>
            <CardHeader>
              <Heading as="h2">Account Manager</Heading>
            </CardHeader>
            <CardBody>
              <InfoRow>
                <InfoIcon>
                  <HiOutlineUser />
                </InfoIcon>
                <InfoContent>
                  <div className="label">Your Manager</div>
                  <div className="value">{profile.accountManager}</div>
                </InfoContent>
              </InfoRow>
              <InfoRow>
                <InfoIcon>
                  <HiOutlineEnvelope />
                </InfoIcon>
                <InfoContent>
                  <div className="label">Support Email</div>
                  <div className="value">support@taba3ni.tn</div>
                </InfoContent>
              </InfoRow>
              <InfoRow>
                <InfoIcon>
                  <HiOutlinePhone />
                </InfoIcon>
                <InfoContent>
                  <div className="label">Support Phone</div>
                  <div className="value">+216 71 000 111</div>
                </InfoContent>
              </InfoRow>
            </CardBody>
          </Card>

          {/* Quick actions */}
          <Card>
            <CardHeader>
              <Heading as="h2">Quick Actions</Heading>
            </CardHeader>
            <div
              style={{
                padding: "2rem 2.4rem",
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
    </Layout>
  );
}

// ─── Root Component ───────────────────────────────────────────────────────────

function Profile({ userRole = "admin", userId, userName }: ProfileProps) {
  const profile =
    PROFILES[userId ?? ""] ??
    (userRole === "distributor"
      ? DEFAULT_DISTRIBUTOR
      : userRole === "client"
        ? PROFILES["client@taba3ni.tn"]
        : PROFILES["admin@taba3ni.tn"]);

  if (userRole === "distributor")
    return <DistributorProfile profile={profile} />;
  if (userRole === "client") return <ClientProfile profile={profile} />;
  return <AdminProfile profile={profile} />;
}

export default Profile;
