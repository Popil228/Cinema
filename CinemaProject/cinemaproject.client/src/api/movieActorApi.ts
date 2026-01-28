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
    throw new Error(body.message ?? 'Помилка при створенні зв’язків акторів');
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
    throw new Error(body.message ?? 'Помилка при оновленні зв’язків акторів');
  }

  return body.message;
}

const deleteMovieActor = async (movieActorData: MovieActor) => {
  const response = await fetch(`${API_BASE_URL}/MovieActors`, {
    method: 'DELETE',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(movieActorData),
  });

  if (!response.ok) {
    const body = await response.json();
    throw new Error(body.message ?? 'Помилка при видаленні зв’язку актора');
  }

  return true;
};

export { createMovieActor, updateMovieActor, deleteMovieActor };