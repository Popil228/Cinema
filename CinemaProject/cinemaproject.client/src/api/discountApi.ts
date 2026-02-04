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

const API_BASE_URL = "/api";

const createDiscount = async (discountData: DiscountCreateRequst) => {
  const token = tokenStorage.getToken();
  const headers: Record<string, string> = {
    "Content-type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const response = await fetch(`${API_BASE_URL}/Discounts`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(discountData),
  });

  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.message ?? "Помилка сервера");
  }

  return body.message;
};

const getDiscounts = async () => {
  const token = tokenStorage.getToken();
  const headers: Record<string, string> = {
    "Content-type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const response = await fetch(`${API_BASE_URL}/Discounts`, {
    method: "GET",
    headers: headers,
  });

  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.message ?? "Помилка сервера");
  }

  return body.discounts;
};

const deleteDiscount = async (id: number) => {
  const token = tokenStorage.getToken();
  const headers: Record<string, string> = {
    "Content-type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const response = await fetch(`${API_BASE_URL}/Discounts/${id}`, {
    method: "DELETE",
    headers: headers,
  });

  console.log(response);
  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.message ?? "Помилка сервера");
  }

  return body.success;
};

const updateDiscount = async (id: number, request: DiscountRequest) => {
  const token = tokenStorage.getToken();
  const headers: Record<string, string> = {
    "Content-type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const response = await fetch(`${API_BASE_URL}/Discounts/${id}`, {
    method: "PUT",
    headers: headers,
    body: JSON.stringify(request),
  });

  console.log(response);
  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.message ?? "Помилка сервера");
  }

  return body.success;
};

export {
  type DiscountDto,
  createDiscount,
  getDiscounts,
  deleteDiscount,
  updateDiscount,
};
