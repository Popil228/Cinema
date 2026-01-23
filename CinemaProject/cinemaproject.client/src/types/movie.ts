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


export interface Session {
  id: number;
  time: string;
  date: Date;
  title: string;
  genres?: string[];
  imageUrl: string;
  hall: 'A' | 'B';
}