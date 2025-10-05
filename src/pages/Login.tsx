import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
//import Heading from "../UI/Heading";
import Button from "../UI/Button";
import Input from "../UI/Input";
import FormRowVertical from "../UI/FormRowVertical";
import SpinnerMini from "../UI/SpinnerMini";

const LoginLayout = styled.main`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 48rem;
  align-content: center;
  justify-content: center;
  gap: 3.2rem;
  background: linear-gradient(
    135deg,
    var(--color-brand-600) 0%,
    var(--color-brand-700) 100%
  );
`;

const LoginCard = styled.div`
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  padding: 4.8rem;
  box-shadow: var(--shadow-lg);
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 3.2rem;

  & h1 {
    font-size: 3.6rem;
    font-weight: 800;
    background: linear-gradient(
      135deg,
      var(--color-brand-600) 0%,
      var(--color-brand-700) 100%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 0.8rem;
  }

  & p {
    color: var(--color-grey-600);
    font-size: 1.4rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
`;

const ForgotPassword = styled.button`
  background: none;
  border: none;
  color: var(--color-brand-600);
  font-size: 1.3rem;
  cursor: pointer;
  text-align: right;
  margin-top: -1.2rem;

  &:hover {
    color: var(--color-brand-700);
    text-decoration: underline;
  }
`;

const RoleSelector = styled.div`
  display: flex;
  gap: 1.2rem;
  margin-top: 1.6rem;
`;

const RoleButton = styled.button<{ $active?: boolean }>`
  flex: 1;
  padding: 1.2rem;
  border: 2px solid
    ${(props) =>
      props.$active ? "var(--color-brand-600)" : "var(--color-grey-300)"};
  background-color: ${(props) =>
    props.$active ? "var(--color-brand-50)" : "var(--color-grey-0)"};
  color: ${(props) =>
    props.$active ? "var(--color-brand-600)" : "var(--color-grey-600)"};
  border-radius: var(--border-radius-sm);
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: var(--color-brand-600);
    color: var(--color-brand-600);
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 1.6rem;
  margin: 2.4rem 0;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background-color: var(--color-grey-200);
  }

  & span {
    color: var(--color-grey-500);
    font-size: 1.3rem;
  }
`;

const DemoCredentials = styled.div`
  background-color: var(--color-blue-100);
  padding: 1.6rem;
  border-radius: var(--border-radius-sm);
  margin-top: 1.6rem;

  & h4 {
    font-size: 1.4rem;
    margin-bottom: 0.8rem;
    color: var(--color-blue-700);
  }

  & p {
    font-size: 1.2rem;
    color: var(--color-blue-700);
    margin: 0.4rem 0;
  }
`;

type Role = "admin" | "distributor" | "client";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role>("admin");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);

      // Create user object based on role
      const userData = {
        name:
          selectedRole === "admin"
            ? "Sarrour Hcini"
            : selectedRole === "distributor"
            ? "Ahmed Mahmoudi"
            : "Carrefour Lac 2",
        email: email,
        role: selectedRole,
        notifications: Math.floor(Math.random() * 10), // Random notifications for demo
      };

      // Call global login function
      window.login(userData);

      // Navigate to dashboard
      navigate("/dashboard");
    }, 1000);
  };

  const fillDemoCredentials = (role: Role) => {
    setSelectedRole(role);

    if (role === "admin") {
      setEmail("admin@taba3ni.tn");
      setPassword("admin123");
    } else if (role === "distributor") {
      setEmail("distributor@taba3ni.tn");
      setPassword("dist123");
    } else {
      setEmail("client@taba3ni.tn");
      setPassword("client123");
    }
  };

  return (
    <LoginLayout>
      <LoginCard>
        <Logo>
          <h1>🥛 Taba3ni</h1>
          <p>Dairy Distribution Management</p>
        </Logo>

        <Form onSubmit={handleSubmit}>
          <FormRowVertical label="Select Your Role">
            <RoleSelector>
              <RoleButton
                type="button"
                $active={selectedRole === "admin"}
                onClick={() => setSelectedRole("admin")}
              >
                👨‍💼 Admin
              </RoleButton>
              <RoleButton
                type="button"
                $active={selectedRole === "distributor"}
                onClick={() => setSelectedRole("distributor")}
              >
                🚛 Distributor
              </RoleButton>
              <RoleButton
                type="button"
                $active={selectedRole === "client"}
                onClick={() => setSelectedRole("client")}
              >
                🏪 Client
              </RoleButton>
            </RoleSelector>
          </FormRowVertical>

          <FormRowVertical label="Email Address">
            <Input
              type="email"
              id="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </FormRowVertical>

          <FormRowVertical label="Password">
            <Input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </FormRowVertical>

          <ForgotPassword
            type="button"
            onClick={() => alert("Forgot password feature coming soon!")}
          >
            Forgot password?
          </ForgotPassword>

          <Button type="submit" $size="large" disabled={isLoading}>
            {isLoading ? <SpinnerMini /> : "Login"}
          </Button>
        </Form>

        <Divider>
          <span>Demo Credentials</span>
        </Divider>

        <DemoCredentials>
          <h4>Quick Login (Development)</h4>
          <p>
            <strong>Admin:</strong>{" "}
            <button
              style={{
                background: "none",
                border: "none",
                color: "var(--color-brand-600)",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={() => fillDemoCredentials("admin")}
            >
              Fill Admin Credentials
            </button>
          </p>
          <p>
            <strong>Distributor:</strong>{" "}
            <button
              style={{
                background: "none",
                border: "none",
                color: "var(--color-brand-600)",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={() => fillDemoCredentials("distributor")}
            >
              Fill Distributor Credentials
            </button>
          </p>
          <p>
            <strong>Client:</strong>{" "}
            <button
              style={{
                background: "none",
                border: "none",
                color: "var(--color-brand-600)",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={() => fillDemoCredentials("client")}
            >
              Fill Client Credentials
            </button>
          </p>
        </DemoCredentials>
      </LoginCard>
    </LoginLayout>
  );
}

export default Login;
