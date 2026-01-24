import { createContext } from "react";
import {type MovieEditContextInterface } from "./MovieEditContextInterface";

const MoveEditContext = createContext<MovieEditContextInterface>({} as MovieEditContextInterface);

export default MoveEditContext;