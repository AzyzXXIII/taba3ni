import styled from "styled-components";
import Logo from "./Logo";
import MainNav from "./MainNav";

const StyledSidebar = styled.aside`
  background-color: var(--color-grey-0);
  padding: 3.2rem 2.4rem;
  border-right: 1px solid var(--color-grey-100);
  grid-row: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
  overflow-y: auto;

  /* Scrollbar styling */
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

  &::-webkit-scrollbar-thumb:hover {
    background: var(--color-brand-600);
  }
`;

const CompanyInfo = styled.div`
  padding: 1.6rem 2.4rem;
  background: linear-gradient(
    135deg,
    var(--color-brand-600) 0%,
    var(--color-brand-700) 100%
  );
  border-radius: var(--border-radius-md);
  text-align: center;
`;

const CompanyName = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--color-grey-0);
  margin-bottom: 0.4rem;
`;

const CompanyTagline = styled.p`
  font-size: 1.2rem;
  color: var(--color-brand-50);
  opacity: 0.9;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid var(--color-grey-200);
  margin: 1.6rem 0;
`;

const Version = styled.div`
  margin-top: auto;
  padding: 1.2rem 2.4rem;
  text-align: center;
  font-size: 1.2rem;
  color: var(--color-grey-400);
`;

type SidebarProps = {
  role?: "admin" | "distributor" | "client";
  companyName?: string;
  showCompanyInfo?: boolean;
};

function Sidebar({
  role = "admin",
  companyName = "Taba3ni Dairy",
  showCompanyInfo = true,
}: SidebarProps) {
  return (
    <StyledSidebar>
      {/* Logo */}
      <Logo />

      {/* Company Info (optional) */}
      {showCompanyInfo && (
        <>
          <CompanyInfo>
            <CompanyName>{companyName}</CompanyName>
            <CompanyTagline>Distribution Management</CompanyTagline>
          </CompanyInfo>
          <Divider />
        </>
      )}

      {/* Navigation based on role */}
      <MainNav role={role} />

      {/* Version Info */}
      <Version>v1.0.0</Version>
    </StyledSidebar>
  );
}

export default Sidebar;
