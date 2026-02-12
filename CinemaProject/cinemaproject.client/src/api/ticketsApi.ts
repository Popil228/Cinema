import { tokenStorage } from "./authApi";
import type { TicketResponse, TicketGetResponse } from "../types/ticket";
import { handleHttpStatus } from "../utilities/apiUtils";

const API_BASE_URL = '/api/Tickets';

const getHeaders = () => {
  const token = tokenStorage.getToken();
  const headers: Record<string, string> = { 'Content-type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const getTicketsByUser = async (bookingId: number) => {
  const response = await fetch(`${API_BASE_URL}/user?bookingId=${bookingId}`, {
    method: 'GET',
    headers: getHeaders(),
  });
  // Handle common auth related statuses
  await handleHttpStatus(response);

  const body = await response.json();
  if (!response.ok) {
    const apiError = body?.error?.message || 'Помилка отримання квитків';
    throw new Error(apiError);
  }
  return body as TicketGetResponse;
};

const getTicketsByAdmin = async (bookingId: number) => {
  const response = await fetch(`${API_BASE_URL}/admin?bookingId=${bookingId}`, {
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
  return body as TicketGetResponse;
};

const deleteTicketByUser = async (ticketId: number) => {
  const response = await fetch(`${API_BASE_URL}/${ticketId}/user`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  // Handle common auth related statuses
  await handleHttpStatus(response);

  const body = await response.json();
  if (!response.ok) {
    const apiError = body?.error?.message || 'Помилка видалення';
    throw new Error(apiError);
  }
  return body as TicketResponse;
};

const deleteTicketByAdmin = async (ticketId: number) => {
  const response = await fetch(`${API_BASE_URL}/${ticketId}/admin`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  // Handle common auth related statuses
  await handleHttpStatus(response);

  const body = await response.json();
  if (!response.ok) {
    const apiError = body?.error?.message || 'Помилка видалення';
    throw new Error(apiError);
  }
  return body as TicketResponse;
};

export { 
  getTicketsByUser, 
  getTicketsByAdmin, 
  deleteTicketByUser, 
  deleteTicketByAdmin 
};