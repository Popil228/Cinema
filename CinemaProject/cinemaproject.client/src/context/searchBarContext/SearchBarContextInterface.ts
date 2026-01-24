import { type Dispatch, type SetStateAction } from "react";

interface SearchBarContextInterface{
    titleSearch:string;
    setTitleSearch:Dispatch<SetStateAction<string>>;

    genreSearch:string;
    setGenreSearch:Dispatch<SetStateAction<string>>;
    
    dateInput:string;
    setDateInput:Dispatch<SetStateAction<string>>;

    dateSearch:Date;
    setDateSearch:Dispatch<SetStateAction<Date>>;

    isSearchEnabled:boolean
    setSearchEnabled:Dispatch<SetStateAction<boolean>>;
}

export type {SearchBarContextInterface};