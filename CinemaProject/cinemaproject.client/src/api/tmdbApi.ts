import type { Cast, MovieInfo } from "../types/movie";
import { tokenStorage } from "./authApi";

const API_BASE_URL = '/api';

const searchMovies = async (searchStr:string) => {
    const token = tokenStorage.getToken();
    const response = await fetch(`${API_BASE_URL}/Tmdb/search?query=${searchStr}`, {
        method: 'GET',
        headers: { 'Content-type' : 'application/json', 
          'Authorization' : `Bearer ${token}` },})
    
    const body = await response.json();

    if (!response.ok) {
      throw new Error(body.error ?? 'Помилка сервера');
    }

    return body as MovieInfo[];
}

const getMovieInfoByIdTMDB = async (movieId:number) => {
    const token = tokenStorage.getToken();
    const response = await fetch(`${API_BASE_URL}/Tmdb/details/${movieId}`,
       {method:"GET",  headers: { 'Content-type' : 'application/json', 
          'Authorization' : `Bearer ${token}` },})

    const body = await response.json();

    if (!response.ok) {
      throw new Error(body.error ?? 'Помилка сервера');
    }

    return body as MovieInfo;
}

const getCastInfoByIdTMDB = async (movieId:number) => {
    const token = tokenStorage.getToken();
    const response = await fetch(`${API_BASE_URL}/Tmdb/actors/${movieId}`, 
      {method:"GET", 
         headers: { 'Content-type' : 'application/json', 
          'Authorization' : `Bearer ${token}` },
      })

    const body = await response.json();

    if (!response.ok) {
      throw new Error(body.error ?? 'Помилка сервера');
    }

    return body as Cast[];
}

export {searchMovies, getMovieInfoByIdTMDB, getCastInfoByIdTMDB};