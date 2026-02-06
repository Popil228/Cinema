import type { Cast, MovieInfo } from "../types/movie";
import { tokenStorage } from "./authApi";
import { HttpError, ParseError } from '../errors/httpErrors';
import { handleHttpStatus } from '../utilities/apiUtils';

const API_BASE_URL = '/api';

const searchMovies = async (searchStr:string) => {
    const token = tokenStorage.getToken();
    const headers: Record<string, string> = { 'Content-type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/Tmdb/search?query=${searchStr}`, {
        method: 'GET',
        headers,
    })

  // Handle common auth related statuses
  handleHttpStatus(response);

    let body = null;
    const contentType = response.headers.get('content-type');
    try {
        if (contentType && contentType.includes('application/json')) {
            body = await response.json();
        } else {
            const text = await response.text();
            if (text) {
                throw new ParseError('Некоректна відповідь сервера (не JSON)', text);
            } else {
                throw new ParseError('Порожня відповідь сервера');
            }
        }
    } catch (e) {
        if (e instanceof ParseError) {
            throw e;
        }
        throw new ParseError('Некоректна відповідь сервера (не JSON)', e instanceof Error ? e.message : '');
    }

    if (!response.ok) {
        throw new HttpError(response.status, body?.error ?? 'Помилка сервера');
    }

    return body as MovieInfo[];
}

const getMovieInfoByIdTMDB = async (movieId:number) => {
    const token = tokenStorage.getToken();
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/Tmdb/details/${movieId}`, {
        method:"GET",
        headers
    })

  // Handle common auth related statuses
  handleHttpStatus(response);

    let body = null;
    const contentType = response.headers.get('content-type');
    try {
        if (contentType && contentType.includes('application/json')) {
            body = await response.json();
        } else {
            const text = await response.text();
            if (text) {
                throw new ParseError('Некоректна відповідь сервера (не JSON)', text);
            } else {
                throw new ParseError('Порожня відповідь сервера');
            }
        }
    } catch (e) {
        if (e instanceof ParseError) {
            throw e;
        }
        throw new ParseError('Некоректна відповідь сервера (не JSON)', e instanceof Error ? e.message : '');
    }

    if (!response.ok) {
        throw new HttpError(response.status, body?.error ?? 'Помилка сервера');
    }

    return body as MovieInfo;
}

const getCastInfoByIdTMDB = async (movieId:number) => {
    const token = tokenStorage.getToken();
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/Tmdb/actors/${movieId}`, {
        method:"GET",
        headers
    })

  // Handle common auth related statuses
  handleHttpStatus(response);

    let body = null;
    const contentType = response.headers.get('content-type');
    try {
        if (contentType && contentType.includes('application/json')) {
            body = await response.json();
        } else {
            const text = await response.text();
            if (text) {
                throw new ParseError('Некоректна відповідь сервера (не JSON)', text);
            } else {
                throw new ParseError('Порожня відповідь сервера');
            }
        }
    } catch (e) {
        if (e instanceof ParseError) {
            throw e;
        }
        throw new ParseError('Некоректна відповідь сервера (не JSON)', e instanceof Error ? e.message : '');
    }

    if (!response.ok) {
        throw new HttpError(response.status, body?.error ?? 'Помилка сервера');
    }

    return body as Cast[];
}

export {searchMovies, getMovieInfoByIdTMDB, getCastInfoByIdTMDB};