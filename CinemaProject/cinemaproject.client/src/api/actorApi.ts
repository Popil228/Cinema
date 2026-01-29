import type { Actor } from '../types/actor';

const API_BASE_URL = '/api';

const createActor = async (movieActorData: Actor[]) => {
    const response = await fetch(`${API_BASE_URL}/Actors`, {
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

const updateActor = async (actorData: Actor[]) => {
  const response = await fetch(`${API_BASE_URL}/Actors`, {
    method: 'PUT',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(actorData),
  })

  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.message ?? 'Помилка сервера');
  }

  return body.message;
}

export { updateActor, createActor };