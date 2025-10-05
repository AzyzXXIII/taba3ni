import styled from "styled-components";
import type { OrderStatus, PaymentStatus } from "../types/status";
import { statusColors } from "../utils/statusHelpers";

type StatusBadgeProps = {
  $status: OrderStatus | PaymentStatus;
};

const StatusBadge = styled.span<StatusBadgeProps>`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 1.2rem;
  border-radius: 100px;
  font-size: 1.2rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;

  background-color: ${(props) =>
    statusColors[props.$status]?.bg || "var(--color-grey-100)"};
  color: ${(props) =>
    statusColors[props.$status]?.text || "var(--color-grey-700)"};
`;

export default StatusBadge;
