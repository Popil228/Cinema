import type { MovieInfo, StrictMovieInfo } from "../types/movie";

const API_BASE_URL = '/api';

const createMovie = async (movieData: MovieInfo) => {
    const response = await fetch(`${API_BASE_URL}/Movie`, {
        method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(movieData),
    })

  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.massage ?? 'Помилка сервера');
  }

  return body.massage;
}

const updateMovie = async (movieData: MovieInfo) => {
  const response = await fetch(`${API_BASE_URL}/Movie`, {
    method: 'PUT',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(movieData),
  })

  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.massage ?? 'Помилка сервера');
  }

  return body.massage;
}

const getAllMovies = async () => {
    const response = await fetch(`${API_BASE_URL}/Movie`, {
        method: 'GET',
      headers: { 'Content-type': 'application/json' },
    })

  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.massage ?? 'Помилка сервера');
  }

  return body as StrictMovieInfo[];
}


const deleteMovieById = async (movieId: number) => {
  const response = await fetch(`${API_BASE_URL}/Movie/${movieId}`, { method: "DELETE" })

  const body = await response.json();

    if (!response.ok) {
      throw new Error(body.massage ?? 'Помилка сервера');
    }

  return body;
}

export { deleteMovieById, getAllMovies, createMovie, updateMovie}
