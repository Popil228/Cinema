
import type { MovieGenre } from "../types/movieGenre";
import { tokenStorage } from "./authApi";

const API_BASE_URL = '/api';

const createMovieGenre = async (movieGenreData: MovieGenre[]) => {
    const token = tokenStorage.getToken();
    const headers: Record<string, string> = { 'Content-type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(`${API_BASE_URL}/MovieGenres`, {
        method: 'POST',
        headers,
        body: JSON.stringify(movieGenreData),
    })

  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.message ?? 'Помилка сервера');
  }

  return body.message;
}

const updateMovieGenre = async (movieGenreData: MovieGenre[]) => {
  const token = tokenStorage.getToken();
  const headers: Record<string, string> = { 'Content-type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const response = await fetch(`${API_BASE_URL}/MovieGenres`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(movieGenreData),
  })

  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.message ?? 'Помилка сервера');
  }

  return body.message;
}

export { createMovieGenre, updateMovieGenre };

