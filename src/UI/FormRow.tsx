import styled from "styled-components";
import type { ReactNode, CSSProperties } from "react";
import { Children, isValidElement } from "react";

const StyledFormRow = styled.div<Partial<FormRowProps>>`
  display: grid;
  align-items: center;
  grid-template-columns: 24rem 1fr 1.2fr;
  gap: 0.4rem;
  padding: 1.2rem 0;

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    padding-bottom: 0;
  }

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }

  &:has(button) {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  }
`;

const Label = styled.label`
  font-weight: 500;
`;

const Error = styled.span`
  font-size: 1.4rem;
  color: var(--color-red-700);
`;

interface FormRowProps {
  label?: string;
  error?: string;
  children: ReactNode;
  style?: CSSProperties;
}

function FormRow({ label, error, children, style }: FormRowProps) {
  // Find the first valid React element child and get its id for htmlFor
  const inputId = Children.toArray(children).find(
    (child) => isValidElement(child) && (child.props as { id?: string }).id
  ) as React.ReactElement<{ id?: string }> | undefined;

  return (
    <StyledFormRow style={style}>
      {label && <Label htmlFor={inputId?.props?.id}>{label}</Label>}
      {children}
      {error && <Error>{error}</Error>}
    </StyledFormRow>
  );
}

export default FormRow;
