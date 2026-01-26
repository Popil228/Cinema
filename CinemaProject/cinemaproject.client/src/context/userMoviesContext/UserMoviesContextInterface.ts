import type { Dispatch, SetStateAction } from "react";
import type { StrictMovieInfo } from "../../types/movie";

interface UserMoviesContextInterface{
    movies: StrictMovieInfo[],
    setMovies: Dispatch<SetStateAction<StrictMovieInfo[]>>,
    addMovie(movie: StrictMovieInfo): void,
    getMovieById(id: number): Promise<StrictMovieInfo>,
}

export {type UserMoviesContextInterface} 