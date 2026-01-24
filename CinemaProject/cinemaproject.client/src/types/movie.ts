export interface Cast {
  id: number;
  name: string;
  photoUri: string;
  character: string;
}

export interface Movie {
  id: number;
  title: string;
  posterUrl: string;
  releaseDate?: string;
  year?: number;
  duration?: string;
  genres?: string[];
  actors?: Cast[];
  description?: string;
}

export interface Genre{
  id: number;
  name: string;
}

export interface StrictMovieInfo{
  mainInfo: MovieMainInfo;
  extraInfo: MovieExtaInfo;
}

export interface MovieInfo{
  mainInfo: MovieMainInfo | null;
  extraInfo: MovieExtaInfo | null;
}

export interface MovieMainInfo{
  id: number;
  title: string;
  releaseDate: string;
  posterPath:string;
}

export interface MovieExtaInfo{
  runtime: number; //in minutes
  overview: string;
  genres: Genre[];
  actors: Cast[];
}



export interface Session {
  id: number;
  time: string;
  date: Date;
  title: string;
  genres?: string[];
  imageUrl: string;
  hall: 'A' | 'B';
}
