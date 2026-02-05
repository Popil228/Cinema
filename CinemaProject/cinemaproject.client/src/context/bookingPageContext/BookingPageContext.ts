import { createContext } from "react";
import { type BookingPageContextInterface } from "./BookingPageContextInterface";

const BookingPageContext = createContext<BookingPageContextInterface>({} as BookingPageContextInterface);

export default BookingPageContext;
