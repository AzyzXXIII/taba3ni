import styled from "styled-components";
import type { ReactNode } from "react";

const Card = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  transition: all 0.3s;

  &:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const IconContainer = styled.div<{ $color?: string }>`
  width: 5.2rem;
  height: 5.2rem;
  border-radius: var(--border-radius-md);
  background-color: ${(props) => props.$color || "var(--color-brand-100)"};
  display: flex;
  align-items: center;
  justify-content: center;

  & svg {
    width: 2.8rem;
    height: 2.8rem;
    color: var(--color-grey-0);
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const Title = styled.p`
  font-size: 1.4rem;
  font-weight: 500;
  color: var(--color-grey-600);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Value = styled.h3`
  font-size: 3.2rem;
  font-weight: 700;
  color: var(--color-grey-900);
`;

const Trend = styled.div<{ $isPositive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 1.3rem;
  font-weight: 600;
  color: ${(props) =>
    props.$isPositive ? "var(--color-green-700)" : "var(--color-red-700)"};
`;

type StatsCardProps = {
  title: string;
  value: string | number;
  icon: ReactNode;
  color?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
};

function StatsCard({ title, value, icon, color, trend }: StatsCardProps) {
  return (
    <Card>
      <Header>
        <Content>
          <Title>{title}</Title>
          <Value>{value}</Value>
        </Content>
        <IconContainer $color={color}>{icon}</IconContainer>
      </Header>

      {trend && (
        <Trend $isPositive={trend.isPositive}>
          {trend.isPositive ? "↗" : "↘"} {trend.value}
        </Trend>
      )}
    </Card>
  );
}

export default StatsCard;
