import styled from "styled-components";
import { HiMagnifyingGlass } from "react-icons/hi2";
import type { InputHTMLAttributes } from "react";

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 40rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 1.2rem 1rem 4.2rem;
  border: 1px solid var(--color-grey-300);
  border-radius: var(--border-radius-md);
  font-size: 1.4rem;
  background-color: var(--color-grey-0);
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: var(--color-brand-600);
    box-shadow: 0 0 0 3px rgba(20, 93, 160, 0.1);
  }

  &::placeholder {
    color: var(--color-grey-400);
  }
`;

const SearchIcon = styled(HiMagnifyingGlass)`
  position: absolute;
  left: 1.2rem;
  top: 50%;
  transform: translateY(-50%);
  width: 2rem;
  height: 2rem;
  color: var(--color-grey-400);
  pointer-events: none;
`;

type SearchBarProps = InputHTMLAttributes<HTMLInputElement> & {
  placeholder?: string;
};

function SearchBar({ placeholder = "Search...", ...props }: SearchBarProps) {
  return (
    <SearchContainer>
      <SearchIcon />
      <SearchInput type="text" placeholder={placeholder} {...props} />
    </SearchContainer>
  );
}

export default SearchBar;
