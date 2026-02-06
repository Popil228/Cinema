import type { StrictMovieInfo, MovieSummary } from "../types/movie";
import { tokenStorage } from "./authApi";
import { handleHttpStatus } from "../utilities/apiUtils";

const API_BASE_URL = '/api';

const createMovie = async (movieData: MovieSummary) => {
  const token = tokenStorage.getToken();
  const headers: Record<string, string> = { 'Content-type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const response = await fetch(`${API_BASE_URL}/Movies`, {
    method: 'POST',
    headers,
    body: JSON.stringify(movieData),
  });
  // Handle common auth related statuses
  handleHttpStatus(response);

  let body = null;
  const contentType = response.headers.get('content-type');
  try {
    if (contentType && contentType.includes('application/json')) {
      body = await response.json();
    } else {
      // Try to get text for debugging
      const text = await response.text();
      if (text) {
        throw new Error('Некоректна відповідь сервера (не JSON): ' + text);
      } else {
        throw new Error('Порожня відповідь сервера');
      }
    }
  } catch (e) {
    throw new Error('Некоректна відповідь сервера (не JSON): ' + (e instanceof Error ? e.message : ''));
  }

  if (!response.ok) {
    throw new Error(body.message ?? 'Помилка сервера');
  }

  return body.message;
};

const updateMovie = async (movieData: MovieSummary) => {
  const token = tokenStorage.getToken();
  const headers: Record<string, string> = { 'Content-type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const response = await fetch(`${API_BASE_URL}/Movies`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(movieData),
  })
  // Handle common auth related statuses
  handleHttpStatus(response);

  let body = null;
  const contentType = response.headers.get('content-type');
  try {
    if (contentType && contentType.includes('application/json')) {
      body = await response.json();
    } else {
      // Try to get text for debugging
      const text = await response.text();
      if (text) {
        throw new Error('Некоректна відповідь сервера (не JSON): ' + text);
      } else {
        throw new Error('Порожня відповідь сервера');
      }
    }
  } catch (e) {
    throw new Error('Некоректна відповідь сервера (не JSON): ' + (e instanceof Error ? e.message : ''));
  }

  if (!response.ok) {
    throw new Error(body?.message ?? 'Помилка сервера');
  }

  return body?.message;
}

const getAllMovies = async () => {
    const response = await fetch(`${API_BASE_URL}/Movies`, {
        method: 'GET',
      headers: { 'Content-type': 'application/json' },
    })

  let body = null;
  const contentType = response.headers.get('content-type');
  try {
    if (contentType && contentType.includes('application/json')) {
      body = await response.json();
    } else {
      // Try to get text for debugging
      const text = await response.text();
      if (text) {
        throw new Error('Некоректна відповідь сервера (не JSON): ' + text);
      } else {
        throw new Error('Порожня відповідь сервера');
      }
    }
  } catch (e) {
    throw new Error('Некоректна відповідь сервера (не JSON): ' + (e instanceof Error ? e.message : ''));
  }

  if (!response.ok) {
    throw new Error(body?.message ?? 'Помилка сервера');
  }

  return body as StrictMovieInfo[];
}

const getAllNowShowingMovies = async () => {
    const response = await fetch(`${API_BASE_URL}/Movies?onlyShowingNow=true`, {
        method: 'GET',
      headers: { 'Content-type': 'application/json' },
    })

  let body = null;
  const contentType = response.headers.get('content-type');
  try {
    if (contentType && contentType.includes('application/json')) {
      body = await response.json();
    } else {
      // Try to get text for debugging
      const text = await response.text();
      if (text) {
        throw new Error('Некоректна відповідь сервера (не JSON): ' + text);
      } else {
        throw new Error('Порожня відповідь сервера');
      }
    }
  } catch (e) {
    throw new Error('Некоректна відповідь сервера (не JSON): ' + (e instanceof Error ? e.message : ''));
  }

  if (!response.ok) {
    throw new Error(body?.message ?? 'Помилка сервера');
  }

  return body as StrictMovieInfo[];
}

const getMovieById = async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/Movies/${id}`, {
        method: 'GET',
      headers: { 'Content-type': 'application/json' },
    })

  let body = null;
  const contentType = response.headers.get('content-type');
  try {
    if (contentType && contentType.includes('application/json')) {
      body = await response.json();
    } else {
      // Try to get text for debugging
      const text = await response.text();
      if (text) {
        throw new Error('Некоректна відповідь сервера (не JSON): ' + text);
      } else {
        throw new Error('Порожня відповідь сервера');
      }
    }
  } catch (e) {
    throw new Error('Некоректна відповідь сервера (не JSON): ' + (e instanceof Error ? e.message : ''));
  }

  if (!response.ok) {
    throw new Error(body?.message ?? 'Помилка сервера');
  }

  return body as StrictMovieInfo;
}

const deleteMovieById = async (movieId: number) => {
  const token = tokenStorage.getToken();
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const response = await fetch(`${API_BASE_URL}/Movies/${movieId}`, { method: "DELETE", headers });
  // Handle common auth related statuses
  handleHttpStatus(response);

  // Handle empty or non JSON responses
  const contentType = response.headers.get('content-type');
  let body = null;
  if (contentType && contentType.includes('application/json')) {
    body = await response.json();
  } else {
    const text = await response.text();
    body = text ? text : null;
  }

  if (!response.ok) {
    // Try to extract error message from body if its possible
    if (body && typeof body === 'object' && 'message' in body) {
      throw new Error(body.message ?? 'Помилка сервера');
    } else {
      throw new Error('Помилка сервера');
    }
  }

  return body;
}

export { deleteMovieById, getAllMovies, createMovie, updateMovie, getAllNowShowingMovies, getMovieById}
