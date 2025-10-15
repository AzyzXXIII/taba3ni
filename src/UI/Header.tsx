import styled from "styled-components";
import { HiOutlineBell, HiOutlineMoon, HiOutlineSun } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ButtonIcon from "./ButtonIcon";
import HeaderMenu from "./HeaderMenu";

import { NotificationsPanel } from "../components/NotificationsPanel";

const StyledHeader = styled.header`
  background-color: var(--color-grey-0);
  padding: 1.2rem 4.8rem;
  border-bottom: 1px solid var(--color-grey-100);
  display: flex;
  gap: 2.4rem;
  align-items: center;
  justify-content: space-between;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.6rem;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.2rem;
`;

const UserName = styled.span`
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--color-grey-900);
`;

const UserRole = styled.span`
  font-size: 1.2rem;
  color: var(--color-grey-500);
  text-transform: capitalize;
`;

const NotificationButton = styled.div`
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

const WelcomeText = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: var(--color-grey-900);

  @media (max-width: 768px) {
    display: none;
  }
`;

type HeaderProps = {
  userName?: string;
  userRole?: "admin" | "distributor" | "client";
  unreadNotifications?: number;
  welcomeMessage?: string;
};

function Header({
  userName = "John Doe",
  userRole = "admin",
  unreadNotifications = 10,
  welcomeMessage,
}: HeaderProps) {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark-mode");
  };

  const getWelcomeMessage = () => {
    if (welcomeMessage) return welcomeMessage;

    const hour = new Date().getHours();
    const greeting =
      hour < 12 ? "Sbah el khir" : hour < 18 ? "Asslema" : "Liltek zina";

    if (userRole === "admin") return `${greeting}, ${userName.split(" ")[0]}`;
    if (userRole === "distributor") return `${greeting}, Ready for deliveries?`;
    if (userRole === "client") return `${greeting}, ${userName.split(" ")[0]}`;

    return greeting;
  };

  return (
    <StyledHeader>
      <LeftSection>
        <WelcomeText>{getWelcomeMessage()}</WelcomeText>
      </LeftSection>

      <RightSection>
        {/* Dark Mode Toggle */}
        <ButtonIcon onClick={toggleDarkMode} title="Toggle Dark Mode">
          {isDarkMode ? <HiOutlineSun /> : <HiOutlineMoon />}
        </ButtonIcon>

        {/* Notifications */}
        <NotificationsPanel />

        {/* User Info */}
        <UserInfo>
          <UserName>{userName}</UserName>
          <UserRole>{userRole}</UserRole>
        </UserInfo>

        {/* User + Logout menu */}
        <HeaderMenu />
      </RightSection>
    </StyledHeader>
  );
}

export default Header;
