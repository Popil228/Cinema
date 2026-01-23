import type { MovieInfo } from "../types/movie";

const API_BASE_URL = '/api';

const searchMovies = async (searchStr:string) => {
    const response:MovieInfo[] = await fetch(`${API_BASE_URL}/Movies/search?query=${searchStr}`, {
        method: 'GET',
        headers: { 'Content-type' : 'application/json' },})
        .then(response => response.text())
        .then(text => JSON.parse(text) as MovieInfo[])
        .catch(err => {throw new Error(err)});

    console.log(response);
    return response;
}

export {searchMovies}