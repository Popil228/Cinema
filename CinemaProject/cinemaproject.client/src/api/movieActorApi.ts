import type { MovieActor } from "../types/movieActor";

const API_BASE_URL = '/api';

const createMovieActor = async (movieActorData: MovieActor[]) => {
    const response = await fetch(`${API_BASE_URL}/MovieActors`, {
        method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(movieActorData),
    })

  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.message ?? 'Помилка сервера');
  }

  return body.message;
}

const updateMovieActor = async (movieActorData: MovieActor[]) => {
  const response = await fetch(`${API_BASE_URL}/MovieActors`, {
    method: 'PUT',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(movieActorData),
  })

  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.message ?? 'Помилка сервера');
  }

  return body.message;
}

export { createMovieActor, updateMovieActor };

