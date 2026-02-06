
import type { Actor } from '../types/actor';
import { tokenStorage } from './authApi';
import { HttpError } from '../errors/httpErrors';
import { handleHttpStatus } from '../utilities/apiUtils';

const API_BASE_URL = '/api';

const createActor = async (movieActorData: Actor[]) => {
    const token = tokenStorage.getToken();
    const headers: Record<string, string> = { 'Content-type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(`${API_BASE_URL}/Actors`, {
        method: 'POST',
        headers,
        body: JSON.stringify(movieActorData),
    })

  // Handle common auth related statuses
  handleHttpStatus(response);

  const body = await response.json();

  if (!response.ok) {
    throw new HttpError(response.status, body.message ?? 'Помилка сервера');
  }

  return body.message;
}

const updateActor = async (actorData: Actor[]) => {
  const token = tokenStorage.getToken();
  const headers: Record<string, string> = { 'Content-type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const response = await fetch(`${API_BASE_URL}/Actors`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(actorData),
  })

  // Handle common auth related statuses
  handleHttpStatus(response);

  const body = await response.json();

  if (!response.ok) {
    throw new HttpError(response.status, body.message ?? 'Помилка сервера');
  }

  return body.message;
}

export { updateActor, createActor };