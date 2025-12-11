import styled from "styled-components";
import { useState, useRef, useEffect } from "react";
import {
  HiOutlineBell,
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
  HiOutlineInformationCircle,
  HiOutlineXCircle,
  HiOutlineTrash,
  HiOutlineFunnel,
} from "react-icons/hi2";
import { useNotifications } from "../hooks/useNotifications";
import type {
  NotificationType,
  NotificationPriority,
} from "../hooks/useNotifications";
import ButtonIcon from "./../UI/ButtonIcon";

// Styled Components
const Container = styled.div`
  position: relative;
`;

const NotificationBell = styled.div`
  position: relative;
  cursor: pointer;
`;

const Badge = styled.span`
  position: absolute;
  top: -6px;
  right: -6px;
  background: var(--color-red-700);
  color: var(--color-grey-0);
  border-radius: 50%;
  width: 1.8rem;
  height: 1.8rem;
  font-size: 1.1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }
`;

const Panel = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 1rem);
  right: 0;
  width: 40rem;
  max-height: 65vh;
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  pointer-events: ${(props) => (props.$isOpen ? "auto" : "none")};
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  transform: ${(props) =>
    props.$isOpen ? "translateY(0)" : "translateY(-1rem)"};
  transition: all 0.2s;

  @media (max-width: 640px) {
    width: calc(100vw - 2rem);
    right: -1rem;
  }
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.6rem;
  border-bottom: 1px solid var(--color-grey-100);
  background: linear-gradient(
    135deg,
    var(--color-brand-50),
    var(--color-grey-0)
  );
`;

const PanelTitle = styled.h3`
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--color-grey-900);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const UnreadBadge = styled.span`
  background: var(--color-brand-600);
  color: var(--color-grey-0);
  padding: 0.2rem 0.8rem;
  border-radius: 100px;
  font-size: 1.2rem;
  font-weight: 700;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 0.8rem;
  align-items: center;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: var(--color-brand-600);
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: 600;
  transition: all 0.2s;
  padding: 0.4rem 0.8rem;
  border-radius: var(--border-radius-sm);

  &:hover {
    background-color: var(--color-brand-50);
    color: var(--color-brand-700);
  }
`;

const FilterBar = styled.div`
  display: flex;
  gap: 0.4rem;
  padding: 1.2rem;
  border-bottom: 1px solid var(--color-grey-100);
  background-color: var(--color-grey-50);
  overflow-x: auto;

  &::-webkit-scrollbar {
    height: 0.4rem;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--color-grey-300);
    border-radius: var(--border-radius-sm);
  }
`;

const FilterChip = styled.button<{ $active: boolean }>`
  padding: 0.6rem 1.2rem;
  border: 1px solid
    ${(props) =>
      props.$active ? "var(--color-brand-600)" : "var(--color-grey-300)"};
  background: ${(props) =>
    props.$active ? "var(--color-brand-600)" : "var(--color-grey-0)"};
  color: ${(props) =>
    props.$active ? "var(--color-grey-0)" : "var(--color-grey-700)"};
  border-radius: 100px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.4rem;

  &:hover {
    border-color: var(--color-brand-600);
    transform: translateY(-1px);
  }

  & svg {
    width: 1.2rem;
    height: 1.2rem;
  }
`;

const NotificationsList = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  &::-webkit-scrollbar {
    width: 0.6rem;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--color-grey-300);
    border-radius: var(--border-radius-sm);
  }
`;

const NotificationItem = styled.div<{
  $read: boolean;
  $type: NotificationType;
  $priority?: NotificationPriority;
}>`
  padding: 1.2rem 1.6rem;
  border-bottom: 1px solid var(--color-grey-100);
  border-left: 3px solid
    ${(props) => {
      if (props.$priority === "high") return "var(--color-red-600)";
      if (props.$priority === "medium") return "var(--color-yellow-600)";
      return "transparent";
    }};
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  background-color: ${(props) =>
    props.$read ? "transparent" : "var(--color-grey-50)"};
  transition: all 0.2s;
  cursor: pointer;
  position: relative;

  &:hover {
    background-color: var(--color-brand-50);
    transform: translateX(2px);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const IconWrapper = styled.div<{ $type: NotificationType }>`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 50%;
  background-color: ${(props) => {
    if (props.$type === "success") return "var(--color-green-100)";
    if (props.$type === "error") return "var(--color-red-100)";
    if (props.$type === "warning") return "var(--color-yellow-100)";
    return "var(--color-blue-100)";
  }};
  color: ${(props) => {
    if (props.$type === "success") return "var(--color-green-600)";
    if (props.$type === "error") return "var(--color-red-600)";
    if (props.$type === "warning") return "var(--color-yellow-600)";
    return "var(--color-blue-600)";
  }};

  & svg {
    width: 1.8rem;
    height: 1.8rem;
  }
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  min-width: 0;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
`;

const Title = styled.h4`
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--color-grey-900);
  margin: 0;
`;

const PriorityBadge = styled.span<{ $priority: NotificationPriority }>`
  padding: 0.2rem 0.6rem;
  border-radius: 100px;
  font-size: 1rem;
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

const Message = styled.p`
  font-size: 1.2rem;
  color: var(--color-grey-600);
  margin: 0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const Time = styled.span`
  font-size: 1.1rem;
  color: var(--color-grey-400);
  margin-top: 0.4rem;
`;

const DeleteButton = styled.button`
  flex-shrink: 0;
  background: none;
  border: none;
  color: var(--color-grey-400);
  cursor: pointer;
  padding: 0.4rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-sm);

  &:hover {
    background-color: var(--color-red-100);
    color: var(--color-red-600);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
  }
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  color: var(--color-grey-500);

  & svg {
    width: 6rem;
    height: 6rem;
    margin-bottom: 1.6rem;
    color: var(--color-grey-400);
  }

  & p {
    font-size: 1.4rem;
    margin: 0;
    font-weight: 600;
  }

  & span {
    font-size: 1.2rem;
    color: var(--color-grey-400);
    margin-top: 0.4rem;
  }
`;

const PanelFooter = styled.div`
  padding: 1.2rem 1.6rem;
  border-top: 1px solid var(--color-grey-100);
  background-color: var(--color-grey-50);
  text-align: center;
  font-size: 1.2rem;
  color: var(--color-grey-500);
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

export function NotificationsPanel() {
  const {
    notifications,
    unreadCount,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
  } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter notifications
  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "all") return true;
    if (filter === "unread") return !notif.read;
    if (filter === "high") return notif.priority === "high";
    return notif.type === filter;
  });

  // Close panel when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  return (
    <Container ref={containerRef}>
      <NotificationBell>
        <ButtonIcon onClick={() => setIsOpen(!isOpen)} title="Notifications">
          <HiOutlineBell />
        </ButtonIcon>
        {unreadCount > 0 && (
          <Badge>{unreadCount > 9 ? "9+" : unreadCount}</Badge>
        )}
      </NotificationBell>

      <Panel $isOpen={isOpen}>
        <PanelHeader>
          <PanelTitle>
            Notifications
            {unreadCount > 0 && <UnreadBadge>{unreadCount}</UnreadBadge>}
          </PanelTitle>
          <HeaderActions>
            {notifications.length > 0 && (
              <>
                <ActionButton onClick={() => markAllAsRead()}>
                  Mark Read
                </ActionButton>
                <ActionButton onClick={() => clearAll()}>Clear</ActionButton>
              </>
            )}
          </HeaderActions>
        </PanelHeader>

        <FilterBar>
          <FilterChip
            $active={filter === "all"}
            onClick={() => setFilter("all")}
          >
            All
          </FilterChip>
          <FilterChip
            $active={filter === "unread"}
            onClick={() => setFilter("unread")}
          >
            Unread {unreadCount > 0 && `(${unreadCount})`}
          </FilterChip>
          <FilterChip
            $active={filter === "high"}
            onClick={() => setFilter("high")}
          >
            🔥 Priority
          </FilterChip>
          <FilterChip
            $active={filter === "success"}
            onClick={() => setFilter("success")}
          >
            ✅ Success
          </FilterChip>
          <FilterChip
            $active={filter === "error"}
            onClick={() => setFilter("error")}
          >
            ❌ Errors
          </FilterChip>
          <FilterChip
            $active={filter === "warning"}
            onClick={() => setFilter("warning")}
          >
            ⚠️ Warnings
          </FilterChip>
        </FilterBar>

        <NotificationsList>
          {filteredNotifications.length === 0 ? (
            <EmptyState>
              <HiOutlineFunnel />
              <p>
                {filter === "all"
                  ? "📭 No notifications yet"
                  : `No ${filter} notifications`}
              </p>
              <span>{filter !== "all" && "Try changing the filter"}</span>
            </EmptyState>
          ) : (
            filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                $read={notification.read}
                $type={notification.type}
                $priority={notification.priority}
                onClick={() => markAsRead(notification.id)}
              >
                <IconWrapper $type={notification.type}>
                  {getIcon(notification.type)}
                </IconWrapper>

                <Content>
                  <TitleRow>
                    <Title>{notification.title}</Title>
                    {notification.priority &&
                      notification.priority !== "low" && (
                        <PriorityBadge $priority={notification.priority}>
                          {notification.priority}
                        </PriorityBadge>
                      )}
                  </TitleRow>
                  <Message>{notification.message}</Message>
                  <Time>{formatTime(notification.timestamp)}</Time>
                </Content>

                <DeleteButton
                  onClick={(e) => {
                    e.stopPropagation();
                    removeNotification(notification.id);
                  }}
                  title="Delete notification"
                >
                  <HiOutlineTrash />
                </DeleteButton>
              </NotificationItem>
            ))
          )}
        </NotificationsList>

        {notifications.length > 0 && (
          <PanelFooter>
            {filteredNotifications.length} of {notifications.length}{" "}
            notifications
          </PanelFooter>
        )}
      </Panel>
    </Container>
  );
}
