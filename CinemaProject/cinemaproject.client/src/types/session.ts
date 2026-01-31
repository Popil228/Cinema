export interface Session {
  id: number;
  time: string;
  date: Date;
  title: string;
  genres?: string[];
  imageUrl: string;
  hall: 'A' | 'B';
}
