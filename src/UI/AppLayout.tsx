import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import styled from "styled-components";

const StyledAppLayout = styled.div`
  display: grid;
  grid-template-columns: 26rem 1fr;
  grid-template-rows: auto 1fr;
  height: 100vh;
  overflow: hidden;
`;

const Main = styled.main`
  background-color: var(--color-grey-50);
  padding: 4rem 4.8rem 6.4rem;
  overflow-y: auto;
  overflow-x: hidden;

  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 1rem;
  }

  &::-webkit-scrollbar-track {
    background: var(--color-grey-100);
  }

  &::-webkit-scrollbar-thumb {
    background: var(--color-grey-400);
    border-radius: var(--border-radius-md);
  }

  &::-webkit-scrollbar-thumb:hover {
    background: var(--color-brand-600);
  }

  /* Responsive */
  @media (max-width: 1024px) {
    padding: 3rem 2.4rem 4rem;
  }

  @media (max-width: 768px) {
    padding: 2rem 1.6rem 3rem;
  }
`;

const Container = styled.div`
  max-width: 120rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
`;

// Loading overlay when data is being fetched
const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const LoadingSpinner = styled.div`
  width: 6rem;
  height: 6rem;
  border: 6px solid rgba(255, 255, 255, 0.3);
  border-top-color: var(--color-brand-600);
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

type AppLayoutProps = {
  role?: "admin" | "distributor" | "client";
  userName?: string;
  unreadNotifications?: number;
  isLoading?: boolean;
  companyName?: string;
};

function AppLayout({
  role = "admin",
  userName = "John Doe",
  unreadNotifications = 0,
  isLoading = false,
  companyName = "Taba3ni Dairy",
}: AppLayoutProps) {
  return (
    <>
      {isLoading && (
        <LoadingOverlay>
          <LoadingSpinner />
        </LoadingOverlay>
      )}

      <StyledAppLayout>
        {/* Header spans both columns */}
        <Header
          userName={userName}
          userRole={role}
          unreadNotifications={unreadNotifications}
        />

        {/* Sidebar */}
        <Sidebar role={role} companyName={companyName} />

        {/* Main Content Area */}
        <Main>
          <Container>
            <Outlet />
          </Container>
        </Main>
      </StyledAppLayout>
    </>
  );
}

export default AppLayout;
