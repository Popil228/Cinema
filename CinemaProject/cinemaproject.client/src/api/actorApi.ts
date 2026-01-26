import type { Actor } from '../types/actor';

const API_BASE_URL = '/api';

const updateActor = async (actorData: Actor) => {
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

export { updateActor };