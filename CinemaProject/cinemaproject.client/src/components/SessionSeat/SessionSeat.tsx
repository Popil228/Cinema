import type React from "react";
import type { SessionSeatDtoTest } from "../../types/session";
import styles from "./SessionSeat.module.scss";

interface SessionSeatComponent {
  sessionSeat: SessionSeatDtoTest;
  isSelected: boolean;
  handleClick: (sessionSeat: SessionSeatDtoTest) => void;
}

const SessionSeat: React.FC<SessionSeatComponent> = ({
  sessionSeat,
  isSelected,
  handleClick,
}) => {
  const className =
    `${styles.seat} ${!sessionSeat.isAvailable ? styles.occupied : ""}` +
    " " +
    `${isSelected ? styles.selected : ""}` +
    " " +
    (sessionSeat.seatTypeId == 1
      ? styles.seatColor1
      : sessionSeat.seatTypeId == 2
        ? styles.seatColor2
        : sessionSeat.seatTypeId == 3
          ? styles.seatColor3
          : styles.seatColor1);

  return (
    <div
      key={sessionSeat.id}
      className={className}
      onClick={() => handleClick(sessionSeat)}
    >
      <span className={styles.tooltip}>{sessionSeat.seatNumber}</span>
    </div>
  );
};

export default SessionSeat;
