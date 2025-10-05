import styled from "styled-components";
import ButtonIcon from "./ButtonIcon";
import { HiArrowRightOnRectangle } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

const StyledHeaderMenu = styled.ul`
  display: flex;
  gap: 0.4rem;
`;

function HeaderMenu() {
  const navigate = useNavigate();

  const handleLogout = () => {
    window.logout();
    navigate("/login");
  };

  return (
    <StyledHeaderMenu>
      <li>
        <ButtonIcon onClick={handleLogout} title="Logout">
          <HiArrowRightOnRectangle />
        </ButtonIcon>
      </li>
    </StyledHeaderMenu>
  );
}

export default HeaderMenu;
