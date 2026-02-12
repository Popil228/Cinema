
import type { MovieActor } from "../types/movieActor";
import { tokenStorage } from "./authApi";
import { HttpError } from '../errors/httpErrors';
import { handleHttpStatus } from '../utilities/apiUtils';

const API_BASE_URL = '/api';

const createMovieActor = async (movieActorData: MovieActor[]) => {
    const token = tokenStorage.getToken();
    const headers: Record<string, string> = { 'Content-type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(`${API_BASE_URL}/MovieActors`, {
        method: 'POST',
        headers,
        body: JSON.stringify(movieActorData),
    })

  // Handle common auth related statuses
  await handleHttpStatus(response);
  const body = await response.json();
  if (!response.ok) {
    const apiError = body?.error?.message || body?.error || body?.message || 'Помилка при створенні зв’язків акторів';
    throw new HttpError(response.status, apiError);
  }
  return body.message;
}

const updateMovieActor = async (movieActorData: MovieActor[]) => {
  const token = tokenStorage.getToken();
  const headers: Record<string, string> = { 'Content-type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const response = await fetch(`${API_BASE_URL}/MovieActors`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(movieActorData),
  })

  // Handle common auth related statuses
  await handleHttpStatus(response);
  const body = await response.json();
  if (!response.ok) {
    const apiError = body?.error?.message || body?.error || body?.message || 'Помилка при оновленні зв’язків акторів';
    throw new HttpError(response.status, apiError);
  }
  return body.message;
}

const deleteMovieActor = async (movieActorData: MovieActor) => {
  const token = tokenStorage.getToken();
  const headers: Record<string, string> = { 'Content-type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const response = await fetch(`${API_BASE_URL}/MovieActors`, {
    method: 'DELETE',
    headers,
    body: JSON.stringify(movieActorData),
  });

  // Handle common auth related statuses
  await handleHttpStatus(response);
  if (!response.ok) {
    const body = await response.json();
    const apiError = body?.error?.message || body?.error || body?.message || 'Помилка при видаленні зв’язку актора';
    throw new HttpError(response.status, apiError);
  }
  return true;
};

export { createMovieActor, updateMovieActor, deleteMovieActor };
