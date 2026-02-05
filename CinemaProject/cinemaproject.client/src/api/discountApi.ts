import { tokenStorage } from "./authApi";

interface DiscountDto {
  id: number;
  code: string;
  startDate: string;
  endDate: string;
  usesLeft: number;
  discountPercentage: number;
}

interface DiscountRequest {
  startDate: string;
  endDate: string;
  usesLeft: number;
  discountPercentage: number;
}

interface DiscountCreateRequst extends DiscountRequest {
  code: string;
}

interface DiscountCheckResponse {
  id: number;
  discountPercentage: number;
}

const API_BASE_URL = "/api";

const getHeaders = () => {
  const token = tokenStorage.getToken();
  const headers: Record<string, string> = {
    "Content-type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

const createDiscount = async (discountData: DiscountCreateRequst) => {
  const response = await fetch(`${API_BASE_URL}/Discounts`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(discountData),
  });

  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.message ?? "Помилка сервера");
  }

  return body.message;
};

const getDiscounts = async () => {
  const response = await fetch(`${API_BASE_URL}/Discounts`, {
    method: "GET",
    headers: getHeaders(),
  });

  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.message ?? "Помилка сервера");
  }

  return body.discounts;
};

const deleteDiscount = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/Discounts/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  console.log(response);
  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.message ?? "Помилка сервера");
  }

  return body.success;
};

const updateDiscount = async (id: number, request: DiscountRequest) => {
  const response = await fetch(`${API_BASE_URL}/Discounts/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(request),
  });

  console.log(response);
  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.message ?? "Помилка сервера");
  }

  return body.success;
};

const checkDiscount = async (code: string) => {
  const response = await fetch(`${API_BASE_URL}/Discounts/check?code=${code}`, {
    method: "GET",
    headers: getHeaders(),
  });

  console.log(response);
  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.error ?? "Помилка сервера");
  }

  return body as DiscountCheckResponse;
};

export {
  type DiscountDto,
  createDiscount,
  getDiscounts,
  deleteDiscount,
  updateDiscount,
  checkDiscount,
};
