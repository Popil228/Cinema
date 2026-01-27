import type { MovieInfo, StrictMovieInfo } from "../types/movie";

const API_BASE_URL = '/api';

const createMovie = async (movieData: MovieInfo) => {
    const response = await fetch(`${API_BASE_URL}/Movies`, {
        method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(movieData),
    })

  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.message ?? 'Помилка сервера');
  }

  return body.massage;
}

const updateMovie = async (movieData: MovieInfo) => {
  const response = await fetch(`${API_BASE_URL}/Movies`, {
    method: 'PUT',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(movieData),
  })

  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.message ?? 'Помилка сервера');
  }

  return body.massage;
}

const getAllMovies = async () => {
    const response = await fetch(`${API_BASE_URL}/Movies`, {
        method: 'GET',
      headers: { 'Content-type': 'application/json' },
    })

  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.message ?? 'Помилка сервера');
  }

  return body as StrictMovieInfo[];
}

const getAllRollingMovies = async () => {
    const response = await fetch(`${API_BASE_URL}/Movies/now-showing`, {
        method: 'GET',
      headers: { 'Content-type': 'application/json' },
    })

  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.message ?? 'Помилка сервера');
  }

  return body as StrictMovieInfo[];
}

const getMovieById = async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/Movies/${id}`, {
        method: 'GET',
      headers: { 'Content-type': 'application/json' },
    })

  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.message ?? 'Помилка сервера');
  }

  return body as StrictMovieInfo;
}

const deleteMovieById = async (movieId: number) => {
  const response = await fetch(`${API_BASE_URL}/Movies/${movieId}`, { method: "DELETE" })

  const body = await response.json();

    if (!response.ok) {
      throw new Error(body.message ?? 'Помилка сервера');
    }

  return body;
}

export { deleteMovieById, getAllMovies, createMovie, updateMovie, getAllRollingMovies, getMovieById}
