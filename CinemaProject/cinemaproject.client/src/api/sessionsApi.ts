import { tokenStorage } from './authApi';
const API_BASE_URL = '/api';

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
  basePrice: number;
}

export interface UpdateSessionDto {
  movieId?: number;
  hallId?: number;
  startTime?: string;
  ticketPrice?: number;
}

export interface HallDto {
  hallId: number;
  name: string;
}

export interface SessionSeatDto{
  sessionSeatId: number;
  sessionId: number;
  seatId: number;
  isActive: boolean;
  rowNumber: number;
  seatNumber: number;
  seatType: string;
}

export const getAllSessions = async (onlyUpcoming:boolean = false, movieId:number|null = null): Promise<SessionDto[]> => {
  const fetchUri = "" + `${API_BASE_URL}/Sessions`
  + `?onlyUpcoming=${onlyUpcoming}`
  + ((movieId===null) ? "" : `&movieId=${movieId}`);

  const response = await fetch(fetchUri, {method:"GET"});
  if (!response.ok) {
    throw new Error('Помилка завантаження сесій');
  }

  return response.json();
};

export const getSessionById = async (id: number): Promise<SessionDto> => {
  const response = await fetch(`${API_BASE_URL}/Sessions/${id}`);
  if (!response.ok) {
    throw new Error(`Сесія з ID ${id} не знайдена`);
  }
  return response.json();
};

export const createSession = async (dto: CreateSessionDto): Promise<SessionDto> => {
  const token = tokenStorage.getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const response = await fetch(`${API_BASE_URL}/Sessions`, {
    method: 'POST',
    headers,
    body: JSON.stringify(dto),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Помилка створення сесії');
  }
  
  return response.json();
};

export const updateSession = async (id: number, dto: UpdateSessionDto): Promise<SessionDto> => {
  const response = await fetch(`${API_BASE_URL}/Sessions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Помилка оновлення сесії');
  }
  
  return response.json();
};

export const deleteSession = async (id: number): Promise<void> => {
  const token = tokenStorage.getToken();
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const response = await fetch(`${API_BASE_URL}/Sessions/${id}`, {
    method: 'DELETE',
    headers,
  });

  const contentType = response.headers.get('content-type');
  let body = null;
  if (contentType && contentType.includes('application/json')) {
    body = await response.json();
  } else {
    const text = await response.text();
    body = text ? text : null;
  }

  if (!response.ok) {
    if (body && typeof body === 'object' && 'message' in body) {
      throw new Error(body.message ?? 'Помилка видалення сесії');
    } else {
      throw new Error('Помилка видалення сесії');
    }
  }
};

export const getHalls = async (): Promise<HallDto[]> => {
  const response = await fetch(`${API_BASE_URL}/Halls`);
  if (!response.ok) {
    throw new Error('Помилка завантаження залів');
  }
  return response.json();
};

export const initHalls = async (): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/Halls/init`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Помилка ініціалізації залів');
  }
  return response.json();
};

interface SessionSeatApiResponse
{
  success : true;
  message : null;
  data : SessionSeatDto[];
}

export const getSessionSeats = async(sessionId:number) : Promise<SessionSeatDto[]> => {
  const response = await fetch(`${API_BASE_URL}/SessionSeat?sessionId=${sessionId}`, {
    method: 'GET',
  });

  if(!response.ok) {
    throw new Error('Помилка завантаження місць для сеансу');
  }
  return (await response.json() as SessionSeatApiResponse).data;
}
