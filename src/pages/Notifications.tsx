import { useState, useEffect } from "react";
import styled from "styled-components";
import {
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
  HiOutlineInformationCircle,
  HiOutlineXCircle,
  HiOutlineTrash,
  HiOutlineArrowDownTray,
  HiOutlineCalendar,
} from "react-icons/hi2";
import Heading from "../UI/Heading";
import Row from "../UI/Row";
import Button from "../UI/Button";
import SearchBar from "../UI/SearchBar";
import { useNotifications } from "../hooks/useNotifications";
import type {
  NotificationType,
  NotificationPriority,
} from "../hooks/useNotifications";

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
  grid-template-columns: 0.5fr 0.8fr 1.5fr 3fr 2fr 1.5fr 0.5fr;
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
  grid-template-columns: 0.5fr 0.8fr 1.5fr 3fr 2fr 1.5fr 0.5fr;
  gap: 1.6rem;
  padding: 1.6rem 2.4rem;
  border-bottom: 1px solid var(--color-grey-100);
  align-items: center;
  transition: background-color 0.2s;
  background-color: ${(props) =>
    props.$read ? "transparent" : "var(--color-grey-50)"};

  &:hover {
    background-color: var(--color-grey-100);
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

const CategoryIcon = styled.div<{ $type: NotificationType }>`
  width: 4rem;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: ${(props) => {
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
    width: 2rem;
    height: 2rem;
  }
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

const PriorityBadge = styled.span<{ $priority: NotificationPriority }>`
  padding: 0.3rem 0.8rem;
  border-radius: 100px;
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  background: ${(props) => {
    if (props.$priority === "high") return "var(--color-red-100)";
    if (props.$priority === "medium") return "var(--color-yellow-100)";
    return "var(--color-grey-100)";
  }};
  color: ${(props) => {
    if (props.$priority === "high") return "var(--color-red-700)";
    if (props.$priority === "medium") return "var(--color-yellow-700)";
    return "var(--color-grey-600)";
  }};
`;

const BadgeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  align-items: flex-start;
`;

const Title = styled.span`
  font-weight: 600;
  color: var(--color-grey-900);
`;

const Message = styled.span`
  color: var(--color-grey-600);
  font-size: 1.3rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.4;

  &:hover {
    overflow: visible;
    -webkit-line-clamp: unset;
  }
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

const DateDivider = styled.div`
  padding: 1.2rem 2.4rem;
  background: linear-gradient(
    90deg,
    var(--color-grey-50),
    var(--color-grey-100)
  );
  border-top: 2px solid var(--color-grey-200);
  border-bottom: 2px solid var(--color-grey-200);
  font-weight: 700;
  font-size: 1.3rem;
  color: var(--color-grey-700);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 0.8rem;

  & svg {
    width: 1.6rem;
    height: 1.6rem;
  }
`;

const KeyboardHint = styled.p`
  font-size: 1.2rem;
  color: var(--color-grey-500);
  margin-top: 1rem;
  text-align: center;
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

function groupNotificationsByDate(notifications: any[]) {
  const groups: { [key: string]: any[] } = {};

  notifications.forEach((notif) => {
    const date = notif.timestamp.toDateString();
    if (!groups[date]) groups[date] = [];
    groups[date].push(notif);
  });

  return groups;
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
  const [groupByDate, setGroupByDate] = useState(false);

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

  const handleExport = () => {
    const csvData = [
      ["Type", "Priority", "Title", "Message", "Time", "Read"],
      ...filteredNotifications.map((n) => [
        n.type,
        n.priority || "medium",
        n.title,
        n.message.replace(/,/g, ";"), // Replace commas to avoid CSV issues
        n.timestamp.toISOString(),
        n.read ? "Yes" : "No",
      ]),
    ];

    const csvContent = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `notifications_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + A: Select all
      if ((e.metaKey || e.ctrlKey) && e.key === "a" && !e.shiftKey) {
        e.preventDefault();
        handleSelectAll(true);
      }
      // Ctrl/Cmd + Shift + R: Mark all read
      if (
        (e.metaKey || e.ctrlKey) &&
        e.shiftKey &&
        e.key.toLowerCase() === "r"
      ) {
        e.preventDefault();
        markAllAsRead();
      }
      // Delete/Backspace: Delete selected
      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        selectedIds.size > 0
      ) {
        e.preventDefault();
        handleDeleteSelected();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [selectedIds]);

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

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.8rem",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={groupByDate}
            onChange={(e) => setGroupByDate(e.target.checked)}
            style={{ width: "1.6rem", height: "1.6rem", cursor: "pointer" }}
          />
          <span style={{ fontSize: "1.4rem", fontWeight: 600 }}>
            Group by Date
          </span>
        </label>

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
            <Button
              $size="small"
              onClick={handleExport}
              style={{ backgroundColor: "var(--color-green-600)" }}
            >
              <HiOutlineArrowDownTray /> Export CSV
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
            <div>Icon</div>
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
          ) : groupByDate ? (
            Object.entries(groupNotificationsByDate(filteredNotifications)).map(
              ([date, notifs]) => (
                <div key={date}>
                  <DateDivider>
                    <HiOutlineCalendar />
                    {date}
                  </DateDivider>
                  {notifs.map((notif) => (
                    <TableRow key={notif.id} $read={notif.read}>
                      <Checkbox
                        type="checkbox"
                        checked={selectedIds.has(notif.id)}
                        onChange={(e) =>
                          handleSelectOne(notif.id, e.target.checked)
                        }
                      />
                      <CategoryIcon $type={notif.type}>
                        {getIcon(notif.type)}
                      </CategoryIcon>
                      <BadgeContainer>
                        <TypeBadge $type={notif.type}>
                          {getIcon(notif.type)}
                          {notif.type}
                        </TypeBadge>
                        {notif.priority && notif.priority !== "low" && (
                          <PriorityBadge $priority={notif.priority}>
                            {notif.priority}
                          </PriorityBadge>
                        )}
                      </BadgeContainer>
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
                  ))}
                </div>
              )
            )
          ) : (
            filteredNotifications.map((notif) => (
              <TableRow key={notif.id} $read={notif.read}>
                <Checkbox
                  type="checkbox"
                  checked={selectedIds.has(notif.id)}
                  onChange={(e) => handleSelectOne(notif.id, e.target.checked)}
                />
                <CategoryIcon $type={notif.type}>
                  {getIcon(notif.type)}
                </CategoryIcon>
                <BadgeContainer>
                  <TypeBadge $type={notif.type}>
                    {getIcon(notif.type)}
                    {notif.type}
                  </TypeBadge>
                  {notif.priority && notif.priority !== "low" && (
                    <PriorityBadge $priority={notif.priority}>
                      {notif.priority}
                    </PriorityBadge>
                  )}
                </BadgeContainer>
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

      <KeyboardHint>
        💡 Keyboard shortcuts: <strong>Ctrl+A</strong> (Select all) |{" "}
        <strong>Ctrl+Shift+R</strong> (Mark all read) | <strong>Delete</strong>{" "}
        (Delete selected)
      </KeyboardHint>
    </NotificationsLayout>
  );
}

export default Notifications;
