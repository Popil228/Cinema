import SearchBarContext from "./searchBarContext"
import { type SearchBarContextInterface } from "./SearchBarContextInterface";
import React, { useState, type ReactNode } from "react";

const SearchBarContextProvider:React.FC<{children?: ReactNode}> = ({children}) =>
{
    const [titleFilter, setTitleFilter] = useState<string>("");
    const [genreFilter, setGenreFilter] = useState<string>("");
    const [dateInput, setDateInput] = useState<string>("");
    const [dateFilter, setDateFilter] = useState<Date>(new Date);
    const [isSearchEnabled, setSearchEnabled] = useState<boolean>(false);

    const providerData: SearchBarContextInterface = {
        titleSearch: titleFilter,
        setTitleSearch: setTitleFilter,

        genreSearch: genreFilter,
        setGenreSearch: setGenreFilter,

        dateInput: dateInput,
        setDateInput: setDateInput,

        dateSearch: dateFilter,
        setDateSearch: setDateFilter,

        isSearchEnabled: isSearchEnabled,
        setSearchEnabled: setSearchEnabled,
    }

    return(
        <SearchBarContext.Provider value={providerData}>
            {children}
        </SearchBarContext.Provider>
    )
}

export default SearchBarContextProvider;