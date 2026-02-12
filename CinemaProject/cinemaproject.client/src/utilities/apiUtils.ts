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
  // Функція для отримання повідомлення з нового формату помилки

  const getApiErrorMessage = async (): Promise<string | undefined> => {
    try {
      const data = await response.clone().json();
      if (data && data.error && typeof data.error.message === 'string') return data.error.message;
    } catch {}
    return undefined;
  };

  const throwError = async () => {
    const apiMessage = await getApiErrorMessage();
    switch (response.status) {
      case 400:
        throw new BadRequestError(apiMessage || 'Невірний запит');
      case 401:
        throw new UnauthorizedError(apiMessage || 'Неавторизовано. Будь ласка, увійдіть у систему.');
      case 403:
        throw new ForbiddenError(apiMessage || 'Недостатньо прав для цієї операції.');
      case 404:
        throw new NotFoundError(apiMessage || 'Ресурс не знайдено');
      case 409:
        throw new ConflictError(apiMessage || 'Конфлікт даних');
      case 500:
        throw new InternalServerError(apiMessage || 'Внутрішня помилка сервера');
      default:
        if (!response.ok) {
          throw new HttpError(response.status, apiMessage || `HTTP ${response.status}: ${response.statusText}`, response.statusText);
        }
    }
  };

  // handleHttpStatus тепер повертає проміс, щоб дочекатися парсингу json
  // але для зворотної сумісності залишаємо синхронний API через .then().catch()
  // (у setupApiInterceptor треба буде додати await)
  // @ts-ignore
  return throwError();
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
