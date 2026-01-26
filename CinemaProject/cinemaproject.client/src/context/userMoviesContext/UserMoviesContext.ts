import { createContext } from "react";
import type { UserMoviesContextInterface } from "./UserMoviesContextInterface";

const UserMoviesContext = createContext<UserMoviesContextInterface>({} as UserMoviesContextInterface);

export default UserMoviesContext;