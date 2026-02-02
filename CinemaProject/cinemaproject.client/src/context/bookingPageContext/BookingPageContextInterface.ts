import type { Dispatch, SetStateAction } from "react";
import type { SessionDto, SessionSeatDto } from "../../api/sessionsApi";

interface BookingPageContextInterface {
    selectedSession: SessionDto | null;
    setSelectedSession: Dispatch<SetStateAction<SessionDto | null>>;

    sessionSeats: SessionSeatDto[];
    setSessionSeats: Dispatch<SetStateAction<SessionSeatDto[]>>;
}

export {type BookingPageContextInterface};