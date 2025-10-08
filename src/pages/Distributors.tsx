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
} from "react-icons/hi2";
import Heading from "../UI/Heading";
import Row from "../UI/Row";
import Button from "../UI/Button";
import SearchBar from "../UI/SearchBar";
import Menus from "../UI/Menus";
import Modal from "../UI/Modal";
import ConfirmDelete from "../UI/ConfirmDelete";
import StatsCard from "../UI/StatsCard";

// Styled Components
const DistributorsLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
`;

const FiltersBar = styled.div`
  display: flex;
  gap: 1.6rem;
  align-items: center;
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 0.8rem;
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

const TableCard = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  overflow: hidden;
`;

const Table = styled.div`
  width: 100%;
  overflow-x: auto;
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

const DistributorAvatar = styled.div`
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
  color: var(--color-grey-0);
  font-weight: 700;
  font-size: 1.6rem;
`;

const DistributorDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
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

const ContactInfo = styled.div`
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

const StatusBadge = styled.span<{
  $status: "active" | "inactive" | "on-delivery";
}>`
  display: inline-flex;
  align-items: center;
  padding: 0.4rem 1rem;
  border-radius: 100px;
  font-size: 1.2rem;
  font-weight: 600;
  text-transform: uppercase;
  background-color: ${(props) => {
    if (props.$status === "active") return "var(--color-green-100)";
    if (props.$status === "on-delivery") return "var(--color-blue-100)";
    return "var(--color-grey-100)";
  }};
  color: ${(props) => {
    if (props.$status === "active") return "var(--color-green-700)";
    if (props.$status === "on-delivery") return "var(--color-blue-700)";
    return "var(--color-grey-700)";
  }};
`;

const EmptyState = styled.div`
  padding: 6rem 2rem;
  text-align: center;
  color: var(--color-grey-500);

  & p {
    font-size: 1.8rem;
    margin-bottom: 1.6rem;
  }

  & svg {
    width: 8rem;
    height: 8rem;
    margin: 0 auto 2rem;
    color: var(--color-grey-400);
  }
`;

// Types
type DistributorStatus = "active" | "inactive" | "on-delivery";

type Distributor = {
  id: string;
  name: string;
  phone: string;
  email: string;
  zone: string;
  vehicle: {
    type: string;
    plate: string;
  };
  status: DistributorStatus;
  totalDeliveries: number;
  activeDeliveries: number;
  rating: number;
};

// Mock Data
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
    },
    status: "on-delivery",
    totalDeliveries: 145,
    activeDeliveries: 2,
    rating: 4.8,
  },
  {
    id: "2",
    name: "Karim Belaid",
    phone: "+216 98 234 567",
    email: "karim.belaid@taba3ni.tn",
    zone: "Ariana, Menzah, Ennasr",
    vehicle: {
      type: "Van",
      plate: "456 TU 5678",
    },
    status: "active",
    totalDeliveries: 98,
    activeDeliveries: 0,
    rating: 4.6,
  },
  {
    id: "3",
    name: "Mohamed Trabelsi",
    phone: "+216 98 345 678",
    email: "mohamed.trabelsi@taba3ni.tn",
    zone: "Ben Arous, Rades, Mégrine",
    vehicle: {
      type: "Pickup Truck",
      plate: "789 TU 9012",
    },
    status: "active",
    totalDeliveries: 67,
    activeDeliveries: 0,
    rating: 4.5,
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
    },
    status: "inactive",
    totalDeliveries: 34,
    activeDeliveries: 0,
    rating: 4.2,
  },
];

function Distributors() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter distributors
  const filteredDistributors = mockDistributors.filter((distributor) => {
    const matchesStatus =
      statusFilter === "all" || distributor.status === statusFilter;
    const matchesSearch =
      distributor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      distributor.phone.includes(searchQuery) ||
      distributor.zone.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate stats
  const stats = {
    total: mockDistributors.length,
    active: mockDistributors.filter((d) => d.status === "active").length,
    onDelivery: mockDistributors.filter((d) => d.status === "on-delivery")
      .length,
    totalDeliveries: mockDistributors.reduce(
      (sum, d) => sum + d.totalDeliveries,
      0
    ),
  };

  const handleViewDistributor = (distributorId: string) => {
    navigate(`/distributors/${distributorId}`);
  };

  const handleDeleteDistributor = (distributorId: string) => {
    console.log("Delete distributor:", distributorId);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DistributorsLayout>
      {/* Header */}
      <Row type="horizontal">
        <Heading as="h1">Distributors Management</Heading>
        <Button $size="medium" onClick={() => navigate("/distributors/new")}>
          + Add Distributor
        </Button>
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

      {/* Filters & Search */}
      <FiltersBar>
        <SearchBar
          placeholder="Search by name, phone, or zone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
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
            Available
          </FilterButton>
          <FilterButton
            $active={statusFilter === "on-delivery"}
            onClick={() => setStatusFilter("on-delivery")}
          >
            On Delivery
          </FilterButton>
          <FilterButton
            $active={statusFilter === "inactive"}
            onClick={() => setStatusFilter("inactive")}
          >
            Inactive
          </FilterButton>
        </FilterGroup>
      </FiltersBar>

      {/* Distributors Table */}
      <TableCard>
        <Table>
          <TableHeader>
            <div>Distributor</div>
            <div>Contact</div>
            <div>Zone</div>
            <div>Deliveries</div>
            <div>Active</div>
            <div>Status</div>
            <div></div>
          </TableHeader>

          {filteredDistributors.length === 0 ? (
            <EmptyState>
              <HiOutlineUser />
              <p>🔍 No distributors found</p>
              <p style={{ fontSize: "1.4rem" }}>
                Try adjusting your filters or search query
              </p>
            </EmptyState>
          ) : (
            <Menus>
              {filteredDistributors.map((distributor) => (
                <TableRow key={distributor.id}>
                  <DistributorInfo>
                    <DistributorAvatar>
                      {getInitials(distributor.name)}
                    </DistributorAvatar>
                    <DistributorDetails>
                      <DistributorName>{distributor.name}</DistributorName>
                      <VehicleInfo>
                        {distributor.vehicle.type} - {distributor.vehicle.plate}
                      </VehicleInfo>
                    </DistributorDetails>
                  </DistributorInfo>

                  <ContactInfo>
                    <div>
                      <HiOutlinePhone />
                      {distributor.phone}
                    </div>
                  </ContactInfo>

                  <ContactInfo>
                    <div>
                      <HiOutlineMapPin />
                      {distributor.zone}
                    </div>
                  </ContactInfo>

                  <div style={{ fontWeight: 600 }}>
                    {distributor.totalDeliveries}
                  </div>

                  <div
                    style={{ fontWeight: 600, color: "var(--color-brand-600)" }}
                  >
                    {distributor.activeDeliveries}
                  </div>

                  <StatusBadge $status={distributor.status}>
                    {distributor.status === "on-delivery"
                      ? "On Delivery"
                      : distributor.status.charAt(0).toUpperCase() +
                        distributor.status.slice(1)}
                  </StatusBadge>

                  <div>
                    <Modal>
                      <Menus.Menu>
                        <Menus.Toggle id={distributor.id} />
                        <Menus.List id={distributor.id}>
                          <Menus.Button
                            icon={<HiOutlineEye />}
                            onClick={() =>
                              handleViewDistributor(distributor.id)
                            }
                          >
                            View Details
                          </Menus.Button>
                          <Menus.Button icon={<HiOutlinePencil />}>
                            Edit Distributor
                          </Menus.Button>
                          <Modal.Open opens={`delete-${distributor.id}`}>
                            <Menus.Button icon={<HiOutlineTrash />}>
                              Delete Distributor
                            </Menus.Button>
                          </Modal.Open>
                        </Menus.List>
                      </Menus.Menu>

                      <Modal.Window name={`delete-${distributor.id}`}>
                        <ConfirmDelete
                          resourceName={`distributor ${distributor.name}`}
                          onConfirm={() =>
                            handleDeleteDistributor(distributor.id)
                          }
                          onCloseModal={() => {}}
                        />
                      </Modal.Window>
                    </Modal>
                  </div>
                </TableRow>
              ))}
            </Menus>
          )}
        </Table>
      </TableCard>
    </DistributorsLayout>
  );
}

export default Distributors;
