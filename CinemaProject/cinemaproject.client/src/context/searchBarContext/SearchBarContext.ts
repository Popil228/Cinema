import { createContext } from "react"
import { type SearchBarContextInterface } from "./SearchBarContextInterface";

const SearchBarContext = createContext<SearchBarContextInterface>({} as SearchBarContextInterface)

export default SearchBarContext;