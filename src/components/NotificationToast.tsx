import styled, { keyframes } from "styled-components";
import {
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
  HiOutlineInformationCircle,
  HiOutlineXCircle,
  HiOutlineXMark,
} from "react-icons/hi2";
import { useNotifications } from "../hooks/useNotifications";
import type { NotificationType } from "../hooks/useNotifications";

// Animations
const slideIn = keyframes`
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(400px);
    opacity: 0;
  }
`;

// Styled Components
const Container = styled.div`
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  pointer-events: none;

  @media (max-width: 640px) {
    left: 1rem;
    right: 1rem;
    top: 1rem;
  }
`;

const Toast = styled.div<{ $type: NotificationType; $exiting?: boolean }>`
  display: flex;
  gap: 1.2rem;
  align-items: flex-start;
  padding: 1.6rem;
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-lg);
  pointer-events: auto;
  max-width: 40rem;
  animation: ${(props) => (props.$exiting ? slideOut : slideIn)} 0.3s ease-out;

  border-left: 4px solid
    ${(props) => {
      if (props.$type === "success") return "var(--color-green-600)";
      if (props.$type === "error") return "var(--color-red-600)";
      if (props.$type === "warning") return "var(--color-yellow-600)";
      return "var(--color-blue-600)";
    }};

  @media (max-width: 640px) {
    max-width: 100%;
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
    width: 1.8rem;
    height: 1.8rem;
  }
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const Title = styled.h4`
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--color-grey-900);
  margin: 0;
`;

const Message = styled.p`
  font-size: 1.3rem;
  color: var(--color-grey-600);
  margin: 0;
`;

const ActionButton = styled.button`
  align-self: flex-start;
  margin-top: 0.8rem;
  padding: 0.4rem 1rem;
  background-color: var(--color-brand-600);
  color: var(--color-grey-0);
  border: none;
  border-radius: var(--border-radius-sm);
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-brand-700);
  }
`;

const CloseButton = styled.button`
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
    color: var(--color-grey-700);
  }

  & svg {
    width: 1.8rem;
    height: 1.8rem;
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

export function NotificationToast() {
  const { toastNotifications, removeNotification, markAsRead } =
    useNotifications();

  return (
    <Container>
      {toastNotifications.map((notification) => (
        <Toast key={notification.id} $type={notification.type}>
          <IconWrapper $type={notification.type}>
            {getIcon(notification.type)}
          </IconWrapper>

          <Content>
            <Title>{notification.title}</Title>
            <Message>{notification.message}</Message>
            {notification.action && (
              <ActionButton
                onClick={() => {
                  notification.action?.onClick();
                  removeNotification(notification.id);
                }}
              >
                {notification.action.label}
              </ActionButton>
            )}
          </Content>

          <CloseButton
            onClick={() => {
              markAsRead(notification.id);
              removeNotification(notification.id);
            }}
          >
            <HiOutlineXMark />
          </CloseButton>
        </Toast>
      ))}
    </Container>
  );
}
