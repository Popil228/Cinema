import type { Genre } from '../types/movie';

const API_BASE_URL = '/api';

const getAllGenres = async (): Promise<Genre[]> => {
  const response = await fetch(`${API_BASE_URL}/Genres`, {
    method: 'GET',
    headers: { 'Content-type': 'application/json' },
  });

  if (!response.ok) {
    const body = await response.json();
    throw new Error(body.message ?? 'Помилка сервера');
  }

  return await response.json();
}

export { getAllGenres };