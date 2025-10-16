import { useState } from "react";
import styled from "styled-components";
import {
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
  HiOutlineInformationCircle,
  HiOutlineXCircle,
  HiOutlineTrash,
  HiOutlineCheckAll,
} from "react-icons/hi2";
import Heading from "../UI/Heading";
import Row from "../UI/Row";
import Button from "../UI/Button";
import SearchBar from "../UI/SearchBar";
import { useNotifications, NotificationType } from "../hooks/useNotifications";

// Styled Components
const NotificationsLayout = styled.div`
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

const ActionBar = styled.div`
  display: flex;
  gap: 1.2rem;
  align-items: center;
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
  grid-template-columns: 0.5fr 2fr 3fr 2fr 1.5fr 0.5fr;
  gap: 1.6rem;
  padding: 1.6rem 2.4rem;
  background-color: var(--color-grey-50);
  font-weight: 600;
  font-size: 1.3rem;
  text-transform: uppercase;
  color: var(--color-grey-600);
  border-bottom: 1px solid var(--color-grey-100);
`;

const TableRow = styled.div<{ $read: boolean }>`
  display: grid;
  grid-template-columns: 0.5fr 2fr 3fr 2fr 1.5fr 0.5fr;
  gap: 1.6rem;
  padding: 1.6rem 2.4rem;
  border-bottom: 1px solid var(--color-grey-100);
  align-items: center;
  transition: background-color 0.2s;
  background-color: ${(props) =>
    props.$read ? "transparent" : "var(--color-grey-50)"};

  &:hover {
    background-color: var(--color-grey-50);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const Checkbox = styled.input`
  width: 1.6rem;
  height: 1.6rem;
  cursor: pointer;
`;

const TypeBadge = styled.div<{ $type: NotificationType }>`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.4rem 1rem;
  border-radius: 100px;
  font-size: 1.2rem;
  font-weight: 600;
  text-transform: uppercase;
  background-color: ${(props) => {
    if (props.$type === "success") return "var(--color-green-100)";
    if (props.$type === "error") return "var(--color-red-100)";
    if (props.$type === "warning") return "var(--color-yellow-100)";
    return "var(--color-blue-100)";
  }};
  color: ${(props) => {
    if (props.$type === "success") return "var(--color-green-700)";
    if (props.$type === "error") return "var(--color-red-700)";
    if (props.$type === "warning") return "var(--color-yellow-700)";
    return "var(--color-blue-700)";
  }};

  & svg {
    width: 1.4rem;
    height: 1.4rem;
  }
`;

const Title = styled.span`
  font-weight: 600;
  color: var(--color-grey-900);
`;

const Message = styled.span`
  color: var(--color-grey-600);
  font-size: 1.3rem;
`;

const TimeStamp = styled.span`
  color: var(--color-grey-500);
  font-size: 1.2rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.8rem;
  justify-content: flex-end;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: var(--color-grey-400);
  cursor: pointer;
  padding: 0.4rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: var(--color-red-600);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
  }
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

function getIcon(type: NotificationType) {
  switch (type) {
    case "success":
      return <HiOutlineCheckCircle />;
    case "error":
      return <HiOutlineXCircle />;
    case "warning":
      return <HiOutlineExclamationTriangle />;
    default:
      return <HiOutlineInformationCircle />;
  }
}

function formatTime(date: Date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString();
}

function Notifications() {
  const {
    notifications,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
  } = useNotifications();

  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [readFilter, setReadFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Filter notifications
  const filteredNotifications = notifications.filter((notif) => {
    const matchesType = typeFilter === "all" || notif.type === typeFilter;
    const matchesRead =
      readFilter === "all" ||
      (readFilter === "unread" && !notif.read) ||
      (readFilter === "read" && notif.read);
    const matchesSearch =
      notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesRead && matchesSearch;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filteredNotifications.map((n) => n.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const handleMarkSelectedAsRead = () => {
    selectedIds.forEach((id) => markAsRead(id));
    setSelectedIds(new Set());
  };

  const handleDeleteSelected = () => {
    selectedIds.forEach((id) => removeNotification(id));
    setSelectedIds(new Set());
  };

  return (
    <NotificationsLayout>
      {/* Header */}
      <Row type="horizontal">
        <Heading as="h1">Notifications</Heading>
      </Row>

      {/* Filters & Search */}
      <FiltersBar>
        <SearchBar
          placeholder="Search notifications..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FilterGroup>
          <FilterButton
            $active={typeFilter === "all"}
            onClick={() => setTypeFilter("all")}
          >
            All Types
          </FilterButton>
          <FilterButton
            $active={typeFilter === "success"}
            onClick={() => setTypeFilter("success")}
          >
            Success
          </FilterButton>
          <FilterButton
            $active={typeFilter === "warning"}
            onClick={() => setTypeFilter("warning")}
          >
            Warning
          </FilterButton>
          <FilterButton
            $active={typeFilter === "error"}
            onClick={() => setTypeFilter("error")}
          >
            Error
          </FilterButton>
          <FilterButton
            $active={typeFilter === "info"}
            onClick={() => setTypeFilter("info")}
          >
            Info
          </FilterButton>
        </FilterGroup>
      </FiltersBar>

      {/* Read/Unread Filter & Actions */}
      <FiltersBar>
        <FilterGroup>
          <FilterButton
            $active={readFilter === "all"}
            onClick={() => setReadFilter("all")}
          >
            All
          </FilterButton>
          <FilterButton
            $active={readFilter === "unread"}
            onClick={() => setReadFilter("unread")}
          >
            Unread
          </FilterButton>
          <FilterButton
            $active={readFilter === "read"}
            onClick={() => setReadFilter("read")}
          >
            Read
          </FilterButton>
        </FilterGroup>

        {selectedIds.size > 0 && (
          <ActionBar>
            <span style={{ color: "var(--color-grey-600)", fontWeight: 600 }}>
              {selectedIds.size} selected
            </span>
            <Button
              $size="small"
              onClick={handleMarkSelectedAsRead}
              style={{ backgroundColor: "var(--color-blue-600)" }}
            >
              Mark Read
            </Button>
            <Button
              $size="small"
              onClick={handleDeleteSelected}
              style={{ backgroundColor: "var(--color-red-600)" }}
            >
              Delete
            </Button>
          </ActionBar>
        )}

        {notifications.length > 0 && selectedIds.size === 0 && (
          <ActionBar>
            <Button
              $size="small"
              onClick={() => markAllAsRead()}
              style={{ backgroundColor: "var(--color-blue-600)" }}
            >
              Mark All Read
            </Button>
            <Button
              $size="small"
              onClick={() => clearAll()}
              style={{ backgroundColor: "var(--color-red-600)" }}
            >
              Clear All
            </Button>
          </ActionBar>
        )}
      </FiltersBar>

      {/* Notifications Table */}
      <TableCard>
        <Table>
          <TableHeader>
            <Checkbox
              type="checkbox"
              checked={
                filteredNotifications.length > 0 &&
                selectedIds.size === filteredNotifications.length
              }
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
            <div>Type</div>
            <div>Message</div>
            <div>Title</div>
            <div>Time</div>
            <div></div>
          </TableHeader>

          {filteredNotifications.length === 0 ? (
            <EmptyState>
              <HiOutlineInformationCircle />
              <p>🔔 No notifications found</p>
              <p style={{ fontSize: "1.4rem" }}>
                Try adjusting your filters or search query
              </p>
            </EmptyState>
          ) : (
            filteredNotifications.map((notif) => (
              <TableRow key={notif.id} $read={notif.read}>
                <Checkbox
                  type="checkbox"
                  checked={selectedIds.has(notif.id)}
                  onChange={(e) => handleSelectOne(notif.id, e.target.checked)}
                />
                <TypeBadge $type={notif.type}>
                  {getIcon(notif.type)}
                  {notif.type}
                </TypeBadge>
                <Message>{notif.message}</Message>
                <Title>{notif.title}</Title>
                <TimeStamp>{formatTime(notif.timestamp)}</TimeStamp>
                <ActionButtons>
                  <IconButton
                    onClick={() => removeNotification(notif.id)}
                    title="Delete"
                  >
                    <HiOutlineTrash />
                  </IconButton>
                </ActionButtons>
              </TableRow>
            ))
          )}
        </Table>
      </TableCard>
    </NotificationsLayout>
  );
}

export default Notifications;
