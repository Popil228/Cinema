import {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
  ParseError,
  HttpError
} from '../errors/httpErrors';

/**
 * Handles common HTTP status codes and throws appropriate typed errors.
 * This utility centralizes error handling logic to avoid repetition across API calls.
 */
export const handleHttpStatus = (response: Response): void => {
  switch (response.status) {
    case 400:
      throw new BadRequestError('Невірний запит');
    case 401:
      throw new UnauthorizedError('Неавторизовано. Будь ласка, увійдіть у систему.');
    case 403:
      throw new ForbiddenError('Недостатньо прав для цієї операції.');
    case 404:
      throw new NotFoundError('Ресурс не знайдено');
    case 409:
      throw new ConflictError('Конфлікт даних');
    case 500:
      throw new InternalServerError('Внутрішня помилка сервера');
    default:
      if (!response.ok) {
        throw new HttpError(response.status, `HTTP ${response.status}: ${response.statusText}`, response.statusText);
      }
  }
};

/**
 * Safely parses JSON response, throwing ParseError on failure.
 */
export const parseJsonResponse = async <T>(response: Response): Promise<T> => {
  try {
    return await response.json();
  } catch (error) {
    throw new ParseError('Не вдалося розпарсити відповідь сервера');
  }
};