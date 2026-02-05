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

export interface BookingDtoAdmin extends BookingDto {
  email: string;
  phoneNum: string;
}

export interface BookingGetResponse extends BookingResponse {
  bookings: BookingDto[];
}

export interface BookingGetResponseAdmin extends BookingResponse {
  bookings: BookingDtoAdmin[];
}

export interface BookingCreateResponse extends BookingResponse {
  bookingId: number;
  totalPrice: number;
}