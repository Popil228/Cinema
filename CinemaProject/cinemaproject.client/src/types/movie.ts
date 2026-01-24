export interface Actor {
  name: string;
  portrait: string;
  role: string;
}

export interface Movie {
  id: number;
  title: string;
  posterUrl: string;
  releaseDate?: string;
  year?: number;
  duration?: string;
  genres?: string[];
  actors?: Actor[];
  description?: string;
}

// DTO типи для API 
export interface GenreDto {
  id: number;
  name: string;
}

export interface ActorDto {
  id: number;
  name: string;
  role?: string;
  photoUri?: string;
}

export interface MovieMainInfoDto {
  id: number;
  title: string;
  releaseDate: string;
  posterPath?: string;
}

export interface MovieExtraInfoDto {
  runtime?: number;
  overview?: string;
  genres?: GenreDto[];
  actors?: ActorDto[];
}

export interface MovieDto {
  mainInfo?: MovieMainInfoDto;
  extraInfo?: MovieExtraInfoDto;
}

export interface MovieApiResponse {
  success: boolean;
  message: string;
}

export interface Session {
  id: number;
  time: string;
  date: string;
  title: string;
  genres?: string[];
  imageUrl: string;
  hall: 'A' | 'B';
}

// Додаткові типи для API
export interface SessionDto {
  id: number;
  movieId: number;
  movieTitle: string;
  moviePosterPath?: string;
  movieGenres?: string[];
  hallId: number;
  hallName: string;
  startTime: string;
  endTime: string;
  basePrice: number;
}

export interface CreateSessionDto {
  movieId: number;
  hallId: number;
  startTime: string;
  ticketPrice: number;
}

export interface HallDto {
  hallId: number;
  name: string;
}