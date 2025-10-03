import styled from "styled-components";
import type { ChangeEvent, SelectHTMLAttributes } from "react";

// ✅ Styled select with typed props
type StyledSelectProps = {
  type?: "white" | "default";
};

const StyledSelect = styled.select<StyledSelectProps>`
  font-size: 1.4rem;
  padding: 0.8rem 1.2rem;
  border: 1px solid
    ${(props) =>
      props.type === "white"
        ? "var(--color-grey-100)"
        : "var(--color-grey-300)"};
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-0);
  font-weight: 500;
  box-shadow: var(--shadow-sm);
`;

// ✅ Option type
type Option = {
  value: string | number;
  label: string;
};

// ✅ Props type including custom 'type'
type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  options: Option[];
  type?: "white" | "default"; // <- add this
};

// ✅ Component
function Select({
  options,
  value,
  onChange,
  type = "default",
  ...props
}: SelectProps) {
  return (
    <StyledSelect
      value={value}
      onChange={onChange as (e: ChangeEvent<HTMLSelectElement>) => void}
      type={type}
      {...props}
    >
      {options.map((option) => (
        <option value={option.value} key={option.value}>
          {option.label}
        </option>
      ))}
    </StyledSelect>
  );
}

export default Select;
