export interface Movie {
  id: number;
  title: string;
  posterUrl: string;
  releaseDate?: string;
  rating?: number;
  year?: number;
  duration?: string;
  genres?: string[];
  actors?: string[];
  description?: string;
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