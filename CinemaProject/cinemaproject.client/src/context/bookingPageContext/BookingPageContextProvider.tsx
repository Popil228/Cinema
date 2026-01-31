import { useState, type ReactNode } from "react";
import BookingPageContext from "./BookingPageContext";
import { type BookingPageContextInterface } from "./BookingPageContextInterface";
import { type SessionDto } from "../../api/sessionsApi";
import { type SessionSeatDtoTest } from "../../types/session";

const BookingPageContextProvider: React.FC<{ children?: ReactNode }> = ({
  children,
}) => {
  const [selectedSession, setSelectedSession] = useState<SessionDto | null>(
    null,
  );
  const [sessionSeats, setSessionSeats] = useState<SessionSeatDtoTest[]>([]);

  const contextData: BookingPageContextInterface = {
    selectedSession: selectedSession,
    setSelectedSession: setSelectedSession,

    sessionSeats: sessionSeats,
    setSessionSeats: setSessionSeats,
  };

  return (
    <BookingPageContext.Provider value={contextData}>
      {children}
    </BookingPageContext.Provider>
  );
};

export default BookingPageContextProvider;
