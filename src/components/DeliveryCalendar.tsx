import { useState } from "react";
import styled from "styled-components";
import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineTruck,
} from "react-icons/hi2";

const CalendarContainer = styled.div`
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-md);
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.6rem;
  border-bottom: 1px solid var(--color-grey-200);
`;

const MonthTitle = styled.h3`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-800);
  margin: 0;
`;

const NavButtons = styled.div`
  display: flex;
  gap: 0.4rem;
`;

const NavButton = styled.button`
  width: 3.2rem;
  height: 3.2rem;
  border: none;
  background-color: var(--color-grey-100);
  border-radius: var(--border-radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-brand-600);
    color: white;
  }

  & svg {
    width: 1.8rem;
    height: 1.8rem;
  }
`;

const WeekDays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.4rem;
  padding: 1.2rem;
  border-bottom: 1px solid var(--color-grey-200);
`;

const WeekDay = styled.div`
  text-align: center;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-grey-600);
  text-transform: uppercase;
  padding: 0.4rem;
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.4rem;
  padding: 1.2rem;
`;

const DayCell = styled.div<{
  $isToday?: boolean;
  $isOtherMonth?: boolean;
  $hasDeliveries?: boolean;
}>`
  aspect-ratio: 1;
  padding: 0.8rem;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${(props) =>
    props.$isToday
      ? "var(--color-brand-600)"
      : props.$hasDeliveries
      ? "var(--color-blue-50)"
      : "transparent"};
  color: ${(props) =>
    props.$isToday
      ? "white"
      : props.$isOtherMonth
      ? "var(--color-grey-400)"
      : "var(--color-grey-700)"};
  border: ${(props) =>
    props.$hasDeliveries && !props.$isToday
      ? "2px solid var(--color-blue-600)"
      : "2px solid transparent"};

  &:hover {
    background-color: ${(props) =>
      props.$isToday ? "var(--color-brand-700)" : "var(--color-grey-100)"};
  }
`;

const DayNumber = styled.span`
  font-size: 1.3rem;
  font-weight: 600;
`;

const DeliveryIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.2rem;
  margin-top: 0.2rem;
  font-size: 1rem;
  font-weight: 600;

  & svg {
    width: 1.2rem;
    height: 1.2rem;
  }
`;

const Legend = styled.div`
  display: flex;
  justify-content: center;
  gap: 2.4rem;
  padding: 1.2rem;
  border-top: 1px solid var(--color-grey-200);
  font-size: 1.2rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: var(--color-grey-600);
`;

const LegendDot = styled.div<{ $color: string }>`
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 50%;
  background-color: ${(props) => props.$color};
`;

type Delivery = {
  date: string;
  count: number;
};

type DeliveryCalendarProps = {
  deliveries?: Delivery[];
  onDateClick?: (date: Date) => void;
};

function DeliveryCalendar({
  deliveries = [],
  onDateClick,
}: DeliveryCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const getDeliveryCount = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    const delivery = deliveries.find((d) => d.date === dateStr);
    return delivery ? delivery.count : 0;
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Previous month's days
    const prevMonthDays = getDaysInMonth(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );

    for (let i = firstDay - 1; i >= 0; i--) {
      days.push(
        <DayCell key={`prev-${i}`} $isOtherMonth>
          <DayNumber>{prevMonthDays - i}</DayNumber>
        </DayCell>
      );
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const deliveryCount = getDeliveryCount(day);
      const hasDeliveries = deliveryCount > 0;

      days.push(
        <DayCell
          key={day}
          $isToday={isToday(day)}
          $hasDeliveries={hasDeliveries}
          onClick={() => {
            if (onDateClick) {
              onDateClick(
                new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
              );
            }
          }}
        >
          <DayNumber>{day}</DayNumber>
          {hasDeliveries && (
            <DeliveryIndicator>
              <HiOutlineTruck />
              {deliveryCount}
            </DeliveryIndicator>
          )}
        </DayCell>
      );
    }

    // Next month's days
    const remainingCells = 42 - days.length; // 6 rows * 7 days
    for (let day = 1; day <= remainingCells; day++) {
      days.push(
        <DayCell key={`next-${day}`} $isOtherMonth>
          <DayNumber>{day}</DayNumber>
        </DayCell>
      );
    }

    return days;
  };

  return (
    <CalendarContainer>
      <CalendarHeader>
        <MonthTitle>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </MonthTitle>
        <NavButtons>
          <NavButton onClick={previousMonth}>
            <HiOutlineChevronLeft />
          </NavButton>
          <NavButton onClick={nextMonth}>
            <HiOutlineChevronRight />
          </NavButton>
        </NavButtons>
      </CalendarHeader>

      <WeekDays>
        {weekDays.map((day) => (
          <WeekDay key={day}>{day}</WeekDay>
        ))}
      </WeekDays>

      <DaysGrid>{renderCalendar()}</DaysGrid>

      <Legend>
        <LegendItem>
          <LegendDot $color="var(--color-brand-600)" />
          Today
        </LegendItem>
        <LegendItem>
          <LegendDot $color="var(--color-blue-600)" />
          Has Deliveries
        </LegendItem>
      </Legend>
    </CalendarContainer>
  );
}

export default DeliveryCalendar;
