
import type { MovieGenre } from "../types/movieGenre";
import { tokenStorage } from "./authApi";
import { HttpError } from '../errors/httpErrors';
import { handleHttpStatus } from '../utilities/apiUtils';

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

  // Handle common auth related statuses
  await handleHttpStatus(response);
  const body = await response.json();
  if (!response.ok) {
    const apiError = body?.error?.message || body?.error || body?.message || 'Помилка сервера';
    throw new HttpError(response.status, apiError);
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

  // Handle common auth related statuses
  await handleHttpStatus(response);
  const body = await response.json();
  if (!response.ok) {
    const apiError = body?.error?.message || body?.error || body?.message || 'Помилка сервера';
    throw new HttpError(response.status, apiError);
  }
  return body.message;
}

export { createMovieGenre, updateMovieGenre };

