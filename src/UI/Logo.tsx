import styled from "styled-components";
import logo from "../assets/53aedebf65ca43329f765f3317a42bb3-free (1).png";
const StyledLogo = styled.div`
  text-align: center;
`;

const Img = styled.img`
  height: 9.6rem;
  width: auto;
`;

function Logo() {
  return (
    <StyledLogo>
      <Img src={logo} alt="Logo" />
    </StyledLogo>
  );
}

export default Logo;
