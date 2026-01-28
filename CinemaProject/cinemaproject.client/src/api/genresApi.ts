import type { Genre } from '../types/movie';

const API_BASE_URL = '/api';

const getAllGenres = async () => {
    const response = await fetch(`${API_BASE_URL}/Genres`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json' },
    })

  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.message ?? 'Помилка сервера');
  }

  return body as Genre[];
}

export { getAllGenres };