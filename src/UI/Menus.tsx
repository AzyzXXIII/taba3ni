import { createContext, useContext, useState } from "react";
import type { ReactNode, MouseEvent } from "react";
import { createPortal } from "react-dom";
import { HiEllipsisVertical } from "react-icons/hi2";
import styled from "styled-components";
import { useOutsideClick } from "../hooks/useOutsideClick";

const Menu = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledToggle = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-700);
  }
`;

interface Position {
  x: number;
  y: number;
}

interface StyledListProps {
  position: Position;
}

const StyledList = styled.ul<StyledListProps>`
  position: fixed;

  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-md);
  border-radius: var(--border-radius-md);

  right: ${(props) => props.position.x}px;
  top: ${(props) => props.position.y}px;
`;

const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1.2rem 2.4rem;
  font-size: 1.4rem;
  transition: all 0.2s;

  display: flex;
  align-items: center;
  gap: 1.6rem;

  &:hover {
    background-color: var(--color-grey-50);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }
`;

interface MenusContextType {
  openId: string;
  close: () => void;
  open: (id: string) => void;
  position: Position | null;
  setPosition: (position: Position) => void;
}

const MenusContext = createContext<MenusContextType | undefined>(undefined);

interface MenusProps {
  children: ReactNode;
}

function Menus({ children }: MenusProps) {
  const [openId, setOpenId] = useState("");
  const [position, setPosition] = useState<Position | null>(null);

  const close = () => setOpenId("");
  const open = setOpenId;

  return (
    <MenusContext.Provider
      value={{ openId, close, open, position, setPosition }}
    >
      {children}
    </MenusContext.Provider>
  );
}

interface ToggleProps {
  id: string;
}

function Toggle({ id }: ToggleProps) {
  const context = useContext(MenusContext);

  if (!context) {
    throw new Error("Toggle must be used within Menus");
  }

  const { openId, close, open, setPosition } = context;

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: window.innerWidth - rect.width - rect.x,
      y: rect.y + rect.height + 8,
    });

    if (openId === "" || openId !== id) {
      open(id);
    } else {
      close();
    }
  }

  return (
    <StyledToggle onClick={handleClick}>
      <HiEllipsisVertical />
    </StyledToggle>
  );
}

interface ListProps {
  id: string;
  children: ReactNode;
}

function List({ id, children }: ListProps) {
  const context = useContext(MenusContext);

  if (!context) {
    throw new Error("List must be used within Menus");
  }

  const { openId, position, close } = context;
  const ref = useOutsideClick<HTMLUListElement>(close);

  if (openId !== id) return null;

  return createPortal(
    <StyledList position={position!} ref={ref}>
      {children}
    </StyledList>,
    document.body
  );
}

interface ButtonProps {
  children: ReactNode;
  icon?: ReactNode;
  onClick?: () => void;
}

function Button({ children, icon, onClick }: ButtonProps) {
  const context = useContext(MenusContext);

  if (!context) {
    throw new Error("Button must be used within Menus");
  }

  const { close } = context;

  function handleClick() {
    onClick?.();
    close();
  }

  return (
    <li>
      <StyledButton onClick={handleClick}>
        {icon}
        <span>{children}</span>
      </StyledButton>
    </li>
  );
}

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

export default Menus;
