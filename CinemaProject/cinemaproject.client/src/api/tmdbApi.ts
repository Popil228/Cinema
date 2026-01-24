import type { MovieInfo } from "../types/movie";

const API_BASE_URL = '/api';

const searchMovies = async (searchStr:string) => {
    const response = await fetch(`${API_BASE_URL}/Tmdb/search?query=${searchStr}`, {
        method: 'GET',
        headers: { 'Content-type' : 'application/json' },})
    
    const body = await response.json();

    if (!response.ok) {
      throw new Error(body.error ?? 'Помилка сервера');
    }

    return body as MovieInfo[];
}

const getMovieInfoByIdTMDB = async (movieId:number) => {
    const response = await fetch(`${API_BASE_URL}/Tmdb/details/${movieId}`, {method:"GET"})

    const body = await response.json();

    if (!response.ok) {
      throw new Error(body.error ?? 'Помилка сервера');
    }

    return body as MovieInfo;
}

export {searchMovies, getMovieInfoByIdTMDB}
