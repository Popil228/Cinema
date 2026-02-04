import { tokenStorage } from "./authApi";

interface DiscountDto {
  code: string;
  startDate: string;
  endDate: string;
  usesLeft: number;
  discountPercentage: number;
}

const API_BASE_URL = "/api";

const createDiscount = async (discountData: DiscountDto) => {
  const token = tokenStorage.getToken();
  const headers: Record<string, string> = {
    "Content-type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const response = await fetch(`${API_BASE_URL}/Discounts`, {
    method: "POST",
    headers,
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
    headers,
  });

  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.message ?? "Помилка сервера");
  }

  return body.discounts;
};

export { type DiscountDto, createDiscount, getDiscounts };
