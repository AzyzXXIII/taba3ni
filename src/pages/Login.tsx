import styled from "styled-components";
import Heading from "../UI/Heading";

const LoginLayout = styled.main`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 48rem;
  align-content: center;
  justify-content: center;
  gap: 3.2rem;
  background-color: var(--color-grey-50);
`;

function Login() {
  return (
    <LoginLayout>
      <Heading as="h1">Login to Taba3ni</Heading>
      <p>Login page coming soon...</p>
    </LoginLayout>
  );
}

export default Login;
