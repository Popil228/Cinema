import type { Dispatch, SetStateAction } from "react";
import type { StrictMovieInfo } from "../../types/movie";

interface MovieEditContextInterface {
    movieInfo: StrictMovieInfo;
    setMovieInfo: Dispatch<SetStateAction<StrictMovieInfo>>;
    isLoaded: boolean;
    setIsLoaded: Dispatch<SetStateAction<boolean>>;
}

export {type MovieEditContextInterface};