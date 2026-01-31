// export interface Session {
//   id: number;
//   time: string;
//   date: Date;
//   title: string;
//   genres?: string[];
//   imageUrl: string;
//   hall: 'A' | 'B';
// } //unused class, better use SessionsDto from api, maybe move dtos to type folder

export interface SeatType
{
  id: number,
  typeName: string,
  pricePercent: number //100 - defalt price
}

export interface Seat
{
  id: number,
  hallId: number,
  rowNumber: number,
  seatNumber: number,
  seatTypeId: number,
}

export interface SessionSeat {
  id: number,
  sessionId: number,
  seat: Seat
}

export interface SessionSeatDtoTest{
  id: number,
  rowNumber: number,
  seatNumber: number,

  seatTypeId: number,
  seatTypeName: string,
  seatTypePricePercent: number

  sessionId: number,
  isAvailable: boolean, //в беку визначається по наявності заброньованого квитка на це сидіння
}

//!!! інтерфейси SeatType, Seat, SessionSeat, SessionSeatDtoTest зроблені 
// для розробки логіки сторінки замовлень, як будете робити 
// апішки то це можна/треба буде поправити на дтошки !!!