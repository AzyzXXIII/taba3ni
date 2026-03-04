import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineMapPin,
  HiOutlineTruck,
  HiOutlineStar,
  HiOutlineArrowDownTray,
  HiOutlinePlus,
  HiOutlineEnvelope,
} from "react-icons/hi2";
import Heading from "../UI/Heading";
import Row from "../UI/Row";
import Button from "../UI/Button";
import SearchBar from "../UI/SearchBar";
import Menus from "../UI/Menus";
import Modal from "../UI/Modal";
import ConfirmDelete from "../UI/ConfirmDelete";
import StatsCard from "../UI/StatsCard";
import DistributorForm from "../components/DistributorForm";

// ─── Types ────────────────────────────────────────────────────────────────────

type DistributorStatus = "active" | "inactive" | "on-delivery";

type Distributor = {
  id: string;
  name: string;
  phone: string;
  email: string;
  zone: string;
  vehicle: { type: string; plate: string; capacity?: string };
  status: DistributorStatus;
  totalDeliveries: number;
  activeDeliveries: number;
  rating: number;
  joinedDate: string;
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockDistributors: Distributor[] = [
  {
    id: "1",
    name: "Ahmed Mahmoudi",
    phone: "+216 98 123 456",
    email: "ahmed.mahmoudi@taba3ni.tn",
    zone: "Tunis, Lac 2, La Marsa",
    vehicle: {
      type: "Refrigerated Truck",
      plate: "123 TU 1234",
      capacity: "2 tons",
    },
    status: "on-delivery",
    totalDeliveries: 145,
    activeDeliveries: 2,
    rating: 4.8,
    joinedDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Karim Belaid",
    phone: "+216 98 234 567",
    email: "karim.belaid@taba3ni.tn",
    zone: "Ariana, Menzah, Ennasr",
    vehicle: { type: "Van", plate: "456 TU 5678", capacity: "1.5 tons" },
    status: "active",
    totalDeliveries: 98,
    activeDeliveries: 0,
    rating: 4.6,
    joinedDate: "2024-03-22",
  },
  {
    id: "3",
    name: "Mohamed Trabelsi",
    phone: "+216 98 345 678",
    email: "mohamed.trabelsi@taba3ni.tn",
    zone: "Ben Arous, Rades, Mégrine",
    vehicle: { type: "Pickup Truck", plate: "789 TU 9012", capacity: "1 ton" },
    status: "active",
    totalDeliveries: 67,
    activeDeliveries: 0,
    rating: 4.5,
    joinedDate: "2024-06-10",
  },
  {
    id: "4",
    name: "Slim Gharbi",
    phone: "+216 98 456 789",
    email: "slim.gharbi@taba3ni.tn",
    zone: "Bizerte, Menzel Bourguiba",
    vehicle: {
      type: "Refrigerated Van",
      plate: "321 TU 3456",
      capacity: "1.2 tons",
    },
    status: "inactive",
    totalDeliveries: 34,
    activeDeliveries: 0,
    rating: 4.2,
    joinedDate: "2024-09-05",
  },
];

// ─── Styled Components ────────────────────────────────────────────────────────

const PageLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
`;

const FiltersBar = styled.div`
  display: flex;
  gap: 1.6rem;
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
    ${(p) => (p.$active ? "var(--color-brand-600)" : "var(--color-grey-300)")};
  background-color: ${(p) =>
    p.$active ? "var(--color-brand-50)" : "var(--color-grey-0)"};
  color: ${(p) =>
    p.$active ? "var(--color-brand-600)" : "var(--color-grey-600)"};
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

const TableCard = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  overflow: hidden;
`;

// ── Desktop Table ─────────────────────────────────────────────────────────────

const DesktopTable = styled.div`
  @media (max-width: 1024px) {
    display: none;
  }
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.5fr 1fr 1fr 1fr 0.5fr;
  gap: 1.6rem;
  padding: 1.6rem 2.4rem;
  background-color: var(--color-grey-50);
  font-weight: 600;
  font-size: 1.3rem;
  text-transform: uppercase;
  color: var(--color-grey-600);
  border-bottom: 1px solid var(--color-grey-100);
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.5fr 1fr 1fr 1fr 0.5fr;
  gap: 1.6rem;
  padding: 1.6rem 2.4rem;
  border-bottom: 1px solid var(--color-grey-100);
  align-items: center;
  transition: background-color 0.2s;
  cursor: pointer;
  &:hover {
    background-color: var(--color-grey-50);
  }
  &:last-child {
    border-bottom: none;
  }
`;

const DistributorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
`;

const Avatar = styled.div`
  width: 4rem;
  height: 4rem;
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
  font-weight: 700;
  font-size: 1.6rem;
  flex-shrink: 0;
`;

const DistributorName = styled.span`
  font-weight: 600;
  font-size: 1.4rem;
  color: var(--color-grey-900);
`;

const VehicleInfo = styled.span`
  font-size: 1.2rem;
  color: var(--color-grey-500);
`;

const ContactCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 1.3rem;
  color: var(--color-grey-600);

  & > div {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }
  & svg {
    width: 1.4rem;
    height: 1.4rem;
    color: var(--color-brand-600);
  }
`;

const RatingBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 600;
  font-size: 1.3rem;
  color: var(--color-yellow-700);

  & svg {
    width: 1.4rem;
    height: 1.4rem;
    fill: currentColor;
  }
`;

// ── Status Badge ──────────────────────────────────────────────────────────────

const statusStyles: Record<
  DistributorStatus,
  { bg: string; color: string; label: string }
> = {
  active: {
    bg: "var(--color-green-100)",
    color: "var(--color-green-700)",
    label: "Available",
  },
  "on-delivery": {
    bg: "var(--color-blue-100)",
    color: "var(--color-blue-700)",
    label: "On Delivery",
  },
  inactive: {
    bg: "var(--color-grey-100)",
    color: "var(--color-grey-700)",
    label: "Inactive",
  },
};

const StatusBadge = styled.span<{ $status: DistributorStatus }>`
  display: inline-flex;
  align-items: center;
  padding: 0.4rem 1rem;
  border-radius: 100px;
  font-size: 1.2rem;
  font-weight: 600;
  text-transform: uppercase;
  background-color: ${(p) => statusStyles[p.$status].bg};
  color: ${(p) => statusStyles[p.$status].color};
`;

// ── Mobile Cards ──────────────────────────────────────────────────────────────

const MobileCards = styled.div`
  display: none;
  flex-direction: column;
  gap: 0;

  @media (max-width: 1024px) {
    display: flex;
  }
`;

const MobileCard = styled.div`
  padding: 2rem;
  border-bottom: 1px solid var(--color-grey-100);
  transition: background-color 0.2s;

  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background-color: var(--color-grey-50);
  }
`;

const MobileCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 1.4rem;
`;

const MobileCardBody = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem 2rem;
  margin-bottom: 1.4rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const MobileField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  & .field-label {
    font-size: 1.1rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--color-grey-400);
  }

  & .field-value {
    font-size: 1.4rem;
    color: var(--color-grey-700);
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    & svg {
      width: 1.4rem;
      height: 1.4rem;
      color: var(--color-brand-600);
    }
  }
`;

const MobileCardActions = styled.div`
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
`;

const MobileActionBtn = styled.button<{
  $variant?: "danger" | "primary" | "default";
}>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.2rem;
  border-radius: var(--border-radius-sm);
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid;

  ${(p) => {
    if (p.$variant === "danger")
      return `
      background: var(--color-grey-0); color: var(--color-red-700);
      border-color: var(--color-red-300);
      &:hover { background: var(--color-red-50); }
    `;
    if (p.$variant === "primary")
      return `
      background: var(--color-brand-600); color: white;
      border-color: var(--color-brand-600);
      &:hover { background: var(--color-brand-700); }
    `;
    return `
      background: var(--color-grey-0); color: var(--color-grey-700);
      border-color: var(--color-grey-300);
      &:hover { background: var(--color-grey-50); }
    `;
  }}

  & svg {
    width: 1.4rem;
    height: 1.4rem;
  }
`;

// ── Empty State ───────────────────────────────────────────────────────────────

const EmptyState = styled.div`
  padding: 6rem 2rem;
  text-align: center;
  color: var(--color-grey-500);

  & svg {
    width: 8rem;
    height: 8rem;
    margin: 0 auto 2rem;
    color: var(--color-grey-400);
    display: block;
  }
  & p {
    font-size: 1.8rem;
    margin-bottom: 0.8rem;
  }
  & span {
    font-size: 1.4rem;
    color: var(--color-grey-400);
  }
`;

const ResultCount = styled.p`
  font-size: 1.4rem;
  color: var(--color-grey-500);
  padding: 1.2rem 2.4rem;
  border-bottom: 1px solid var(--color-grey-100);
  background: var(--color-grey-50);
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getInitials = (name: string) =>
  name
    .trim()
    .split(" ")
    .map((n) => n[0]?.toUpperCase())
    .join("")
    .slice(0, 2);

function exportCSV(distributors: Distributor[]) {
  const date = new Date().toISOString().split("T")[0];
  const headers = [
    "ID",
    "Name",
    "Phone",
    "Email",
    "Zone",
    "Vehicle Type",
    "Plate",
    "Capacity",
    "Status",
    "Total Deliveries",
    "Active Deliveries",
    "Rating",
    "Joined Date",
  ];
  const rows = distributors.map((d) => [
    d.id,
    d.name,
    d.phone,
    d.email,
    d.zone,
    d.vehicle.type,
    d.vehicle.plate,
    d.vehicle.capacity || "",
    d.status,
    d.totalDeliveries,
    d.activeDeliveries,
    d.rating,
    d.joinedDate,
  ]);

  const csv = [headers, ...rows]
    .map((r) => r.map((v) => `"${v}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `distributors_${date}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

// ─── Component ────────────────────────────────────────────────────────────────

function Distributors() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [distributors, setDistributors] =
    useState<Distributor[]>(mockDistributors);

  const filtered = distributors.filter((d) => {
    const matchStatus = statusFilter === "all" || d.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      d.name.toLowerCase().includes(q) ||
      d.phone.includes(q) ||
      d.email.toLowerCase().includes(q) ||
      d.zone.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const stats = {
    total: distributors.length,
    active: distributors.filter((d) => d.status === "active").length,
    onDelivery: distributors.filter((d) => d.status === "on-delivery").length,
    totalDeliveries: distributors.reduce((s, d) => s + d.totalDeliveries, 0),
  };

  const handleDelete = (id: string) => {
    setDistributors((prev) => prev.filter((d) => d.id !== id));
  };

  const filters: { label: string; value: string }[] = [
    { label: "All", value: "all" },
    { label: "Available", value: "active" },
    { label: "On Delivery", value: "on-delivery" },
    { label: "Inactive", value: "inactive" },
  ];

  return (
    <PageLayout>
      {/* Header */}
      <Row type="horizontal">
        <Heading as="h1">Distributors</Heading>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Button
            $variation="secondary"
            $size="medium"
            onClick={() => exportCSV(filtered)}
          >
            <HiOutlineArrowDownTray
              style={{ width: "1.8rem", height: "1.8rem" }}
            />
            Export CSV
          </Button>
          <Modal>
            <Modal.Open opens="create-distributor">
              <Button $size="medium">
                <HiOutlinePlus style={{ width: "1.8rem", height: "1.8rem" }} />
                Add Distributor
              </Button>
            </Modal.Open>
            <Modal.Window name="create-distributor">
              <DistributorForm onCloseModal={() => {}} />
            </Modal.Window>
          </Modal>
        </div>
      </Row>

      {/* Stats */}
      <StatsRow>
        <StatsCard
          title="Total Distributors"
          value={stats.total}
          icon={<HiOutlineUser />}
          color="var(--color-blue-700)"
        />
        <StatsCard
          title="Available"
          value={stats.active}
          icon={<HiOutlineUser />}
          color="var(--color-green-700)"
        />
        <StatsCard
          title="On Delivery"
          value={stats.onDelivery}
          icon={<HiOutlineTruck />}
          color="var(--color-brand-600)"
        />
        <StatsCard
          title="Total Deliveries"
          value={stats.totalDeliveries}
          icon={<HiOutlineTruck />}
          color="var(--color-yellow-700)"
        />
      </StatsRow>

      {/* Filters */}
      <FiltersBar>
        <SearchBar
          placeholder="Search by name, phone, email or zone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FilterGroup>
          {filters.map((f) => (
            <FilterButton
              key={f.value}
              $active={statusFilter === f.value}
              onClick={() => setStatusFilter(f.value)}
            >
              {f.label}
            </FilterButton>
          ))}
        </FilterGroup>
      </FiltersBar>

      {/* Table + Cards */}
      <TableCard>
        <ResultCount>
          Showing <strong>{filtered.length}</strong> of{" "}
          <strong>{distributors.length}</strong> distributors
        </ResultCount>

        {filtered.length === 0 ? (
          <EmptyState>
            <HiOutlineUser />
            <p>No distributors found</p>
            <span>Try adjusting your search or filters</span>
          </EmptyState>
        ) : (
          <>
            {/* ── Desktop Table ── */}
            <DesktopTable>
              <TableHeader>
                <div>Distributor</div>
                <div>Contact</div>
                <div>Zone</div>
                <div>Deliveries</div>
                <div>Rating</div>
                <div>Status</div>
                <div />
              </TableHeader>
              <Menus>
                {filtered.map((d) => (
                  <TableRow
                    key={d.id}
                    onClick={() => navigate(`/distributors/${d.id}`)}
                  >
                    <DistributorInfo onClick={(e) => e.stopPropagation()}>
                      <Avatar>{getInitials(d.name)}</Avatar>
                      <div>
                        <DistributorName>{d.name}</DistributorName>
                        <br />
                        <VehicleInfo>
                          {d.vehicle.type} · {d.vehicle.plate}
                        </VehicleInfo>
                      </div>
                    </DistributorInfo>

                    <ContactCell onClick={(e) => e.stopPropagation()}>
                      <div>
                        <HiOutlinePhone />
                        {d.phone}
                      </div>
                      <div>
                        <HiOutlineEnvelope />
                        {d.email}
                      </div>
                    </ContactCell>

                    <ContactCell onClick={(e) => e.stopPropagation()}>
                      <div>
                        <HiOutlineMapPin />
                        {d.zone}
                      </div>
                    </ContactCell>

                    <div style={{ fontWeight: 600 }}>{d.totalDeliveries}</div>

                    <RatingBadge>
                      <HiOutlineStar />
                      {d.rating}
                    </RatingBadge>

                    <StatusBadge $status={d.status}>
                      {statusStyles[d.status].label}
                    </StatusBadge>

                    <div onClick={(e) => e.stopPropagation()}>
                      <Modal>
                        <Menus.Menu>
                          <Menus.Toggle id={d.id} />
                          <Menus.List id={d.id}>
                            <Menus.Button
                              icon={<HiOutlineEye />}
                              onClick={() => navigate(`/distributors/${d.id}`)}
                            >
                              View Details
                            </Menus.Button>
                            <Modal.Open opens={`edit-${d.id}`}>
                              <Menus.Button icon={<HiOutlinePencil />}>
                                Edit
                              </Menus.Button>
                            </Modal.Open>
                            <Modal.Open opens={`delete-${d.id}`}>
                              <Menus.Button icon={<HiOutlineTrash />}>
                                Delete
                              </Menus.Button>
                            </Modal.Open>
                          </Menus.List>
                        </Menus.Menu>

                        <Modal.Window name={`edit-${d.id}`}>
                          <DistributorForm
                            distributorToEdit={{
                              id: d.id,
                              name: d.name,
                              phone: d.phone,
                              email: d.email,
                              zone: d.zone,
                              vehicle: {
                                type: d.vehicle.type,
                                plate: d.vehicle.plate,
                                capacity: d.vehicle.capacity || "",
                              },
                              status: d.status,
                            }}
                            onCloseModal={() => {}}
                          />
                        </Modal.Window>

                        <Modal.Window name={`delete-${d.id}`}>
                          <ConfirmDelete
                            resourceName={`distributor ${d.name}`}
                            onConfirm={() => handleDelete(d.id)}
                            onCloseModal={() => {}}
                          />
                        </Modal.Window>
                      </Modal>
                    </div>
                  </TableRow>
                ))}
              </Menus>
            </DesktopTable>

            {/* ── Mobile Cards ── */}
            <MobileCards>
              {filtered.map((d) => (
                <MobileCard key={d.id}>
                  <MobileCardHeader>
                    <Avatar
                      style={{
                        width: "4.8rem",
                        height: "4.8rem",
                        fontSize: "1.8rem",
                      }}
                    >
                      {getInitials(d.name)}
                    </Avatar>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: "1.5rem",
                          color: "var(--color-grey-900)",
                          marginBottom: "0.4rem",
                        }}
                      >
                        {d.name}
                      </div>
                      <StatusBadge $status={d.status}>
                        {statusStyles[d.status].label}
                      </StatusBadge>
                    </div>
                    <RatingBadge>
                      <HiOutlineStar />
                      {d.rating}
                    </RatingBadge>
                  </MobileCardHeader>

                  <MobileCardBody>
                    <MobileField>
                      <span className="field-label">Phone</span>
                      <span className="field-value">
                        <HiOutlinePhone />
                        {d.phone}
                      </span>
                    </MobileField>
                    <MobileField>
                      <span className="field-label">Deliveries</span>
                      <span
                        className="field-value"
                        style={{
                          fontWeight: 700,
                          color: "var(--color-brand-600)",
                        }}
                      >
                        {d.totalDeliveries} total
                      </span>
                    </MobileField>
                    <MobileField>
                      <span className="field-label">Zone</span>
                      <span className="field-value">
                        <HiOutlineMapPin />
                        {d.zone}
                      </span>
                    </MobileField>
                    <MobileField>
                      <span className="field-label">Vehicle</span>
                      <span className="field-value">
                        <HiOutlineTruck />
                        {d.vehicle.type}
                      </span>
                    </MobileField>
                    <MobileField>
                      <span className="field-label">Email</span>
                      <span
                        className="field-value"
                        style={{ fontSize: "1.2rem" }}
                      >
                        <HiOutlineEnvelope />
                        {d.email}
                      </span>
                    </MobileField>
                    <MobileField>
                      <span className="field-label">Plate</span>
                      <span className="field-value">{d.vehicle.plate}</span>
                    </MobileField>
                  </MobileCardBody>

                  <MobileCardActions>
                    <MobileActionBtn
                      $variant="primary"
                      onClick={() => navigate(`/distributors/${d.id}`)}
                    >
                      <HiOutlineEye /> View
                    </MobileActionBtn>
                    <Modal>
                      <Modal.Open opens={`mob-edit-${d.id}`}>
                        <MobileActionBtn as="div">
                          <HiOutlinePencil /> Edit
                        </MobileActionBtn>
                      </Modal.Open>
                      <Modal.Window name={`mob-edit-${d.id}`}>
                        <DistributorForm
                          distributorToEdit={{
                            id: d.id,
                            name: d.name,
                            phone: d.phone,
                            email: d.email,
                            zone: d.zone,
                            vehicle: {
                              type: d.vehicle.type,
                              plate: d.vehicle.plate,
                              capacity: d.vehicle.capacity || "",
                            },
                            status: d.status,
                          }}
                          onCloseModal={() => {}}
                        />
                      </Modal.Window>

                      <Modal.Open opens={`mob-delete-${d.id}`}>
                        <MobileActionBtn as="div" $variant="danger">
                          <HiOutlineTrash /> Delete
                        </MobileActionBtn>
                      </Modal.Open>
                      <Modal.Window name={`mob-delete-${d.id}`}>
                        <ConfirmDelete
                          resourceName={`distributor ${d.name}`}
                          onConfirm={() => handleDelete(d.id)}
                          onCloseModal={() => {}}
                        />
                      </Modal.Window>
                    </Modal>
                  </MobileCardActions>
                </MobileCard>
              ))}
            </MobileCards>
          </>
        )}
      </TableCard>
    </PageLayout>
  );
}

export default Distributors;
