import type { MovieGenre } from "../types/movieGenre";

const API_BASE_URL = '/api';

const createMovieGenre = async (movieGenreData: MovieGenre[]) => {
    const response = await fetch(`${API_BASE_URL}/MovieGenres`, {
        method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(movieGenreData),
    })

  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.message ?? 'Помилка сервера');
  }

  return body.message;
}

const updateMovieGenre = async (movieGenreData: MovieGenre[]) => {
  const response = await fetch(`${API_BASE_URL}/MovieGenres`, {
    method: 'PUT',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(movieGenreData),
  })

  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.message ?? 'Помилка сервера');
  }

  return body.message;
}

export { createMovieGenre, updateMovieGenre };

