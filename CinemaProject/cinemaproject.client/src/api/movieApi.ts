import type { MovieInfo } from "../types/movie";

const API_BASE_URL = '/api';

const searchMovies = async (searchStr:string) => {
    const responseText = await fetch(`${API_BASE_URL}/Movie/search?query=${searchStr}`, {
        method: 'GET',
        headers: { 'Content-type' : 'application/json' },})
    .then(response => response.text());
    
    let result:MovieInfo[] = [];
    try{
        result = JSON.parse(responseText) as MovieInfo[]    
    }
    catch
    {
        throw new Error(responseText);
    }


    console.log(result);
    return result;
}

const getMovieInfoByIdTMDB = async (movieId:number) => {
    const responseText = await fetch(`${API_BASE_URL}/Movie/details?id=${movieId}`)
    .then(response=>response.text());

    let result:MovieInfo;

    try{
        result = JSON.parse(responseText) as MovieInfo;
    }
    catch
    {
        throw new Error(responseText);
    }

    console.log(result);
    return result;
}

export {searchMovies, getMovieInfoByIdTMDB}