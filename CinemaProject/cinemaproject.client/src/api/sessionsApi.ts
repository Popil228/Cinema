const API_BASE_URL = 'http://localhost:5005/api';

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

export const getAllSessions = async (): Promise<SessionDto[]> => {
  const response = await fetch(`${API_BASE_URL}/sessions`);
  if (!response.ok) {
    throw new Error('Помилка завантаження сесій');
  }
  return response.json();
};

export const getSessionById = async (id: number): Promise<SessionDto> => {
  const response = await fetch(`${API_BASE_URL}/sessions/${id}`);
  if (!response.ok) {
    throw new Error(`Сесія з ID ${id} не знайдена`);
  }
  return response.json();
};

export const createSession = async (dto: CreateSessionDto): Promise<SessionDto> => {
  const response = await fetch(`${API_BASE_URL}/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Помилка створення сесії');
  }
  
  return response.json();
};

export const updateSession = async (id: number, dto: UpdateSessionDto): Promise<SessionDto> => {
  const response = await fetch(`${API_BASE_URL}/sessions/${id}`, {
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
  const response = await fetch(`${API_BASE_URL}/sessions/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Помилка видалення сесії');
  }
};

export const getHalls = async (): Promise<HallDto[]> => {
  const response = await fetch(`${API_BASE_URL}/halls`);
  if (!response.ok) {
    throw new Error('Помилка завантаження залів');
  }
  return response.json();
};

export const initHalls = async (): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/halls/init`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Помилка ініціалізації залів');
  }
  return response.json();
};