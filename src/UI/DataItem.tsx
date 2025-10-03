import styled from "styled-components";
import type { ReactNode } from "react";

const StyledDataItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1.6rem;
  padding: 0.8rem 0;
`;

const Label = styled.span`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-weight: 500;

  & svg {
    width: 2rem;
    height: 2rem;
    color: var(--color-brand-600);
  }
`;

// ✅ Props type
type DataItemProps = {
  icon: ReactNode; // any valid React node (SVG, component, etc.)
  label: string;
  children?: ReactNode; // optional
};

function DataItem({ icon, label, children }: DataItemProps) {
  return (
    <StyledDataItem>
      <Label>
        {icon}
        <span>{label}</span>
      </Label>
      {children}
    </StyledDataItem>
  );
}

export default DataItem;
