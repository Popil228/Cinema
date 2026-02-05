export interface TicketDto {
  id: number;
  seatNumber: number;
  rowNumber: number;
  hallName: string;
  price: number;
  movieTitle: string;
  moviePosterPath: string;
  showTime: string;
}

export interface TicketResponse {
  success: boolean;
  message?: string;
}

export interface TicketGetResponse extends TicketResponse {
  tickets?: TicketDto[];
}