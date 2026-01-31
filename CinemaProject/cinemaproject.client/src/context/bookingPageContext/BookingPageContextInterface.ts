import type { Dispatch, SetStateAction } from "react";
import type { SessionDto } from "../../api/sessionsApi";
import type { SessionSeatDtoTest } from "../../types/session";

interface BookingPageContextInterface {
    selectedSession: SessionDto | null;
    setSelectedSession: Dispatch<SetStateAction<SessionDto | null>>;

    sessionSeats: SessionSeatDtoTest[];
    setSessionSeats: Dispatch<SetStateAction<SessionSeatDtoTest[]>>;
}

export {type BookingPageContextInterface};