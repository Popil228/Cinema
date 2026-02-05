export interface BookingRequest {
  discountId: number | null;
  sessionSeatIds: number[];
}

export interface BookingResponse {
  success: boolean;
  message?: string;
}

export interface BookingDto {
  id: number;
  bookingAt: string;
  totalPrice: number;
  status?: string;
  movieTitle: string;
  moviePosterPath: string;
}

export interface BookingGetResponse extends BookingResponse {
  bookings: BookingDto[];
}

export interface BookingCreateResponse extends BookingResponse {
  bookingId: number;
  totalPrice: number;
}
