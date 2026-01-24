import type { Movie, MovieApiResponse, MovieDto } from '../types/movie';

const API_BASE_URL = 'http://localhost:5005/api';

const mapMovieFromApi = (dto: MovieDto): Movie => {
  const mainInfo = dto.mainInfo;
  const extraInfo = dto.extraInfo;
  
  const formatDuration = (minutes?: number): string => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) return `${hours}г ${mins}хв`;
    if (hours > 0) return `${hours}г`;
    return `${mins}хв`;
  };

  return {
    id: mainInfo?.id ?? 0,
    title: mainInfo?.title ?? '',
    posterUrl: mainInfo?.posterPath ?? '',
    releaseDate: mainInfo?.releaseDate,
    year: mainInfo?.releaseDate ? new Date(mainInfo.releaseDate).getFullYear() : undefined,
    duration: formatDuration(extraInfo?.runtime),
    genres: extraInfo?.genres?.map(g => g.name) ?? [],
    actors: extraInfo?.actors?.map(a => ({
      name: a.name,
      portrait: a.photoUri ?? '',
      role: a.role ?? ''
    })) ?? [],
    description: extraInfo?.overview
  };
};

export const moviesApi = {
  async getAllMovies(): Promise<Movie[]> {
    const response = await fetch(`${API_BASE_URL}/movies/get_all_movie`);
    
    if (!response.ok) {
      if (response.status === 404) return [];
      throw new Error('Не вдалося отримати фільми');
    }
    
    const data: MovieDto[] = await response.json();
    return data.map(mapMovieFromApi);
  },

  async searchMovies(query: string): Promise<Movie[]> {
    const response = await fetch(`${API_BASE_URL}/movies/search?query=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      if (response.status === 404) return [];
      throw new Error('Помилка пошуку фільмів');
    }
    
    const data: MovieDto[] = await response.json();
    return data.map(mapMovieFromApi);
  },

  async getMovieDetails(tmdbId: number): Promise<MovieDto | null> {
    const response = await fetch(`${API_BASE_URL}/movies/deteils?id=${tmdbId}`);
    
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Фільм не знайдено');
    }
    
    return response.json();
  },

  async addMovie(movie: MovieDto): Promise<MovieApiResponse> {
    const response = await fetch(`${API_BASE_URL}/movies/add_movie`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movie),
    });
    return response.json();
  },

  async deleteMovie(movieId: number): Promise<MovieApiResponse> {
    const response = await fetch(`${API_BASE_URL}/movies/delete_movie`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movieId),
    });
    return response.json();
  },

  async updateMovie(movie: MovieDto): Promise<MovieApiResponse> {
    const response = await fetch(`${API_BASE_URL}/movies/update_movie`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movie),
    });
    return response.json();
  },
};

export const getAllMovies = moviesApi.getAllMovies;
export const searchMovies = moviesApi.searchMovies;
export const getMovieDetails = moviesApi.getMovieDetails;
export const addMovie = moviesApi.addMovie;
export const deleteMovie = moviesApi.deleteMovie;
export const updateMovie = moviesApi.updateMovie;

export type { MovieDto } from '../types/movie';
