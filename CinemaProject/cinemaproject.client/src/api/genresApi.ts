import type { Genre } from '../types/movie';
import { HttpError } from '../errors/httpErrors';
import { handleHttpStatus } from '../utilities/apiUtils';

const API_BASE_URL = '/api';

const getAllGenres = async (): Promise<Genre[]> => {
  const response = await fetch(`${API_BASE_URL}/Genres`, {
    method: 'GET',
    headers: { 'Content-type': 'application/json' },
  });

  // Handle common auth related statuses
  await handleHttpStatus(response);
  if (!response.ok) {
    const body = await response.json();
    const apiError = body?.error?.message || body?.error || body?.message || 'Помилка сервера';
    throw new HttpError(response.status, apiError);
  }
  return await response.json();
}

export { getAllGenres };