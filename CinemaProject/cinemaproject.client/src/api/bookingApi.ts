import { tokenStorage } from "./authApi";
import type { 
  BookingRequest, 
  BookingResponse, 
  BookingGetResponse, 
  BookingCreateResponse,
  BookingGetResponseAdmin
} from "../types/booking";
import { handleHttpStatus } from "../utilities/apiUtils";

const API_BASE_URL = '/api/Bookings';

const getHeaders = () => {
  const token = tokenStorage.getToken();
  const headers: Record<string, string> = { 'Content-type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const createBooking = async (request: BookingRequest) => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(request),
  });
  // Handle common auth related statuses
  await handleHttpStatus(response);
  let body;
  try {
    body = await response.json();
  } catch {
    body = {};
  }
  if (!response.ok) {
    const apiError = body?.error?.message || 'Помилка при бронюванні';
    throw new Error(apiError);
  }
  return body as BookingCreateResponse;
};

const deleteBooking = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  // Handle common auth related statuses
  await handleHttpStatus(response);
  const body = await response.json();
  if (!response.ok) {
    const apiError = body?.error?.message || 'Помилка при видаленні';
    throw new Error(apiError);
  }
  return body as BookingResponse;
};

const getUserBookings = async (status?: number) => {
  const url = status !== undefined 
    ? `${API_BASE_URL}/user?status=${status}` 
    : `${API_BASE_URL}/user`;

  const response = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
  });
  // Handle common auth related statuses
  await handleHttpStatus(response);
  const body = await response.json();
  if (!response.ok) {
    const apiError = body?.error?.message || 'Помилка отримання списку';
    throw new Error(apiError);
  }
  return body as BookingGetResponse;
};

const getAllBookings = async (status?: number): Promise<BookingGetResponseAdmin> => {
  const url = status !== undefined 
    ? `${API_BASE_URL}/admin?status=${status}` 
    : `${API_BASE_URL}/admin`;

  const response = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
  });
  // Handle common auth related statuses
  await handleHttpStatus(response);
  const body = await response.json();
  if (!response.ok) {
    const apiError = body?.error?.message || 'Помилка сервера';
    throw new Error(apiError);
  }
  return body as BookingGetResponseAdmin;
};

const updateBookingStatus = async (id: number, status: number) => {
  const response = await fetch(`${API_BASE_URL}/${id}?status=${status}`, {
    method: 'PATCH',
    headers: getHeaders(),
  });
  // Handle common auth related statuses
  await handleHttpStatus(response);
  const body = await response.json();
  if (!response.ok) {
    const apiError = body?.error?.message || 'Помилка оновлення статусу';
    throw new Error(apiError);
  }
  return body as BookingResponse;
};

export { 
  createBooking, 
  deleteBooking, 
  getUserBookings, 
  getAllBookings, 
  updateBookingStatus 
};