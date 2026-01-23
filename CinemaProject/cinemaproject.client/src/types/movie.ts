export interface Actor {
  id: number;
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

export interface Genre{
  id: number;
  name: string;
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
  actors: Actor[];
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
