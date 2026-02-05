import type React from "react";
import styles from "./SessionSeat.module.scss";
import type { SessionSeatDto } from "../../api/sessionsApi";

interface SessionSeatComponent {
  sessionSeat: SessionSeatDto;
  isSelected: boolean;
  handleClick: (sessionSeat: SessionSeatDto) => void;
}

const SessionSeat: React.FC<SessionSeatComponent> = ({
  sessionSeat,
  isSelected,
  handleClick,
}) => {
  const className =
    `${styles.seat} ${!sessionSeat.isActive ? styles.occupied : ""}` +
    " " +
    `${isSelected ? styles.selected : ""}` +
    " " +
    (sessionSeat.seatType == "Standard"
      ? styles.seatColor1
      : sessionSeat.seatType == "VIP"
        ? styles.seatColor2
        : styles.seatColor3);

  return (
    <div
      key={sessionSeat.sessionSeatId}
      className={className}
      onClick={() => handleClick(sessionSeat)}
    >
      <span className={styles.tooltip}>{sessionSeat.seatNumber}</span>
    </div>
  );
};

export default SessionSeat;
