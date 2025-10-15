import styled from "styled-components";
import { useState, useRef, useEffect } from "react";
import {
  HiOutlineBell,
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
  HiOutlineInformationCircle,
  HiOutlineXCircle,
  HiOutlineTrash,
} from "react-icons/hi2";
import { useNotifications } from "../hooks/useNotifications";
import type { NotificationType } from "../hooks/useNotifications";
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
`;

const Panel = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 1rem);
  right: 0;
  width: 36rem;
  max-height: 60vh;
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
`;

const PanelTitle = styled.h3`
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--color-grey-900);
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 0.8rem;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: var(--color-brand-600);
  cursor: pointer;
  font-size: 1.3rem;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    color: var(--color-brand-700);
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
}>`
  padding: 1.2rem 1.6rem;
  border-bottom: 1px solid var(--color-grey-100);
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  background-color: ${(props) =>
    props.$read ? "transparent" : "var(--color-grey-50)"};
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    background-color: var(--color-grey-50);
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
  width: 2.4rem;
  height: 2.4rem;
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
    width: 1.6rem;
    height: 1.6rem;
  }
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const Title = styled.h4`
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--color-grey-900);
  margin: 0;
`;

const Message = styled.p`
  font-size: 1.2rem;
  color: var(--color-grey-600);
  margin: 0;
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

  &:hover {
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
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;
  color: var(--color-grey-500);

  & p {
    font-size: 1.4rem;
    margin: 0;
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
  const containerRef = useRef<HTMLDivElement>(null);

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
          <PanelTitle>Notifications</PanelTitle>
          <HeaderActions>
            {notifications.length > 0 && (
              <>
                <ActionButton onClick={() => markAllAsRead()}>
                  Mark All Read
                </ActionButton>
                <ActionButton onClick={() => clearAll()}>Clear</ActionButton>
              </>
            )}
          </HeaderActions>
        </PanelHeader>

        <NotificationsList>
          {notifications.length === 0 ? (
            <EmptyState>
              <p>📭 No notifications yet</p>
            </EmptyState>
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                $read={notification.read}
                $type={notification.type}
                onClick={() => markAsRead(notification.id)}
              >
                <IconWrapper $type={notification.type}>
                  {getIcon(notification.type)}
                </IconWrapper>

                <Content>
                  <Title>{notification.title}</Title>
                  <Message>{notification.message}</Message>
                  <Time>{formatTime(notification.timestamp)}</Time>
                </Content>

                <DeleteButton
                  onClick={(e) => {
                    e.stopPropagation();
                    removeNotification(notification.id);
                  }}
                >
                  <HiOutlineTrash />
                </DeleteButton>
              </NotificationItem>
            ))
          )}
        </NotificationsList>
      </Panel>
    </Container>
  );
}
