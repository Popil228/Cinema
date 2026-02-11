using CinemaProject.Server.Data;
using CinemaProject.Server.DTOs.Booking;
using CinemaProject.Server.Interfaces;
using CinemaProject.Server.Models.Entitys;
using CinemaProject.Server.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace CinemaProject.Server.Services
{
    public class BookingService : IBookingService
    {
        private readonly CinemaDbContext _context;

        public BookingService(CinemaDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Asynchronously creates a new booking for a user, along with tickets for the specified session seats, 
        /// calculates the total price, applies a discount if provided, and ensures transactional integrity.
        /// </summary>
        /// <param name="request">An object containing the list of session seat IDs to book and an optional discount ID.</param>
        /// <param name="userId">The unique identifier of the user creating the booking.</param>
        /// <returns>
        /// A <see cref="BookingCreateResponse"/> containing the result of the booking operation:
        /// - <c>Success = true</c> if the booking and tickets were successfully created, including the <c>BookingId</c> and total price.
        /// - <c>Success = false</c> if some seats are already taken, a discount is invalid, or any server error occurs.
        /// </returns>
        /// <remarks>
        /// This method uses a database transaction to ensure that all changes (booking creation, ticket creation, seat availability updates, and total price calculation)
        /// are committed only if every step succeeds. If any step fails, all changes are rolled back.
        /// </remarks>
        public async Task<BookingCreateResponse> CreateBookingAsync(BookingRequest request, int userId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var booking = new Booking 
                { 
                    UserId = userId,
                    DiscountId = request.DiscountId,
                    Status = BookingStatus.Pending,
                    TotalPrice = 0
                };
                _context.Bookings.Add(booking);
                await _context.SaveChangesAsync();

                var seats = await _context.SessionSeats
                    .Where(ss => request.SessionSeatIds.Contains(ss.SessionSeatId))
                    .Include(ss => ss.Session)
                    .Include(ss => ss.Seat)
                        .ThenInclude(s => s.SeatType)
                    .ToListAsync();

                if (!seats.Any())
                {
                    return new BookingCreateResponse
                    {
                        Success = false,
                        Message = "Місце або місця відсутні"
                    };
                }

                if (seats.Any(ss => !ss.IsAvailable))
                {
                    return new BookingCreateResponse
                    {
                        Success = false,
                        Message = "Деякі місця вже зайняті"
                    };
                }

                decimal totalPrice = 0;
                foreach (var seat in seats)
                {
                    var price = seat.Session.BasePrice * (seat.Seat.SeatType.PricePercent / 100m);
                    totalPrice += price;

                    _context.Tickets.Add(new Ticket
                    {
                        BookingId = booking.BookingId,
                        SessionSeatId = seat.SessionSeatId,
                        Price = price
                    });

                    seat.IsAvailable = false;
                }

                if (request.DiscountId.HasValue)
                {
                    var discount = await _context.Discounts.FindAsync(request.DiscountId.Value);
                    if (discount != null)
                    {
                        totalPrice *= (1 - discount.DiscountPercent / 100m);
                        discount.UsesLeft--;
                    }
                }

                booking.TotalPrice = totalPrice;

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return new BookingCreateResponse 
                { 
                    Success = true,
                    Message = "Бронювання успішно створено", 
                    BookingId = booking.BookingId,
                    TotalPrice = totalPrice 
                };
            }
            catch
            {
                await transaction.RollbackAsync();
                return new BookingCreateResponse
                {
                    Success = false,
                    Message = "Помилка сервера"
                };
            }
        }

        /// <summary>
        /// Deletes a pending booking with the specified identifier asynchronously.
        /// </summary>
        /// <remarks>Only bookings with a status of Pending can be deleted. Attempting to delete a
        /// non-existent or non-pending booking will result in an unsuccessful response.</remarks>
        /// <param name="id">The unique identifier of the booking to delete. Must correspond to an existing booking in a pending state.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a BookingResponse indicating
        /// whether the deletion was successful and providing a relevant message.</returns>
        public async Task<BookingResponse> DeleteBookingAsync(int id)
        {
            var currentBooking = await _context.Bookings
                .Include(b => b.Tickets)
                .ThenInclude(t => t.SessionSeat)
                .FirstOrDefaultAsync(b => b.BookingId == id);

            if (currentBooking == null)
            {
                return new BookingResponse
                {
                    Success = false,
                    Message = "Бронювання не знайдено"
                };
            }

            if (currentBooking.Status != BookingStatus.Pending)
            {
                return new BookingResponse
                {
                    Success = false,
                    Message = "Неможливо видалити підтверджене бронювання"
                };
            }

            foreach (var ticket in currentBooking.Tickets)
            {
                ticket.SessionSeat.IsAvailable = true;
            }

            _context.Bookings.Remove(currentBooking);
            await _context.SaveChangesAsync();

            return new BookingResponse
            {
                Success = true,
                Message = "Бронювання видалено успішно"
            };
        }

        /// <summary>
        /// Asynchronously retrieves all bookings associated with the specified user.
        /// </summary>
        /// <param name="userId">The unique identifier of the user whose bookings are to be retrieved.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a BookingGetResponse object with
        /// the user's bookings if any exist; otherwise, indicates that no bookings were found.</returns>
        public async Task<BookingGetResponse> GetUserBookingsAsync(int userId)
        {
            var bookings = await _context.Bookings
             .AsNoTracking()
             .Where(b => b.UserId == userId)
             .Select(b => new BookingDto
             {
                 Id = b.BookingId,
                 BookingAt = b.BookingAt,
                 TotalPrice = b.TotalPrice,
                 Status = b.Status.ToString(),
                 MovieId = b.Tickets
                    .Select(t => t.SessionSeat.Session.Movie.MovieId)
                    .FirstOrDefault(),
                 MovieTitle = b.Tickets
                     .Select(t => t.SessionSeat.Session.Movie.Title)
                     .FirstOrDefault(),
                 MoviePosterPath = b.Tickets
                     .Select(t => t.SessionSeat.Session.Movie.PosterUri)
                     .FirstOrDefault()
             })
             .ToListAsync();

            if (!bookings.Any())
            {
                return new BookingGetResponse
                {
                    Success = true,
                    Message = "Бронювання відсутні",
                    Bookings = new List<BookingDto>()
                };
            }

            return new BookingGetResponse
            {
                Success = true,
                Message = "Бронювання успішно отримано",
                Bookings = bookings
            };

        }

        /// <summary>
        /// Asynchronously retrieves the list of bookings for a specified user and booking status.
        /// </summary>
        /// <remarks>If the specified status does not correspond to a defined BookingStatus value, the
        /// response will indicate failure and contain no bookings. If the user has no bookings with the specified
        /// status, the response will also indicate failure.</remarks>
        /// <param name="userId">The unique identifier of the user whose bookings are to be retrieved.</param>
        /// <param name="status">The integer value representing the booking status to filter by. Must correspond to a valid value of the
        /// BookingStatus enumeration.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a BookingGetResponse object with
        /// the user's bookings matching the specified status. If no bookings are found or the status is invalid, the
        /// response indicates failure and includes an appropriate message.</returns>
        public async Task<BookingGetResponse> GetUserBookingsAsync(int userId, int status)
        {
            if (!Enum.IsDefined(typeof(BookingStatus), status))
            {
                return new BookingGetResponse
                {
                    Success = false,
                    Message = "Не існує такого статусу замовлення",
                    Bookings = new List<BookingDto>()
                };
            }

            var statusEnum = (BookingStatus)status;

            var bookings = await _context.Bookings
             .AsNoTracking()
             .Where(b => b.UserId == userId && b.Status == statusEnum)
             .Select(b => new BookingDto
             {
                 Id = b.BookingId,
                 BookingAt = b.BookingAt,
                 TotalPrice = b.TotalPrice,
                 Status = b.Status.ToString(),
                 MovieId = b.Tickets
                    .Select(t => t.SessionSeat.Session.Movie.MovieId)
                    .FirstOrDefault(),
                 MovieTitle = b.Tickets
                     .Select(t => t.SessionSeat.Session.Movie.Title)
                     .FirstOrDefault(),
                 MoviePosterPath = b.Tickets
                     .Select(t => t.SessionSeat.Session.Movie.PosterUri)
                     .FirstOrDefault()
             })
             .ToListAsync();

            if (!bookings.Any())
            {
                return new BookingGetResponse
                {
                    Success = true,
                    Message = "Бронювання відсутні",
                    Bookings = new List<BookingDto>()
                };
            }

            return new BookingGetResponse
            {
                Success = true,
                Message = "Бронювання успішно отримано",
                Bookings = bookings
            };
        }

        /// <summary>
        /// Asynchronously retrieves all bookings that match the specified booking status.
        /// </summary>
        /// <param name="status">The integer value representing the booking status to filter by. Must correspond to a defined value in the
        /// BookingStatus enumeration.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a BookingGetResponse object with
        /// the list of bookings matching the specified status. If no bookings are found, the response contains an empty
        /// list. If the status is invalid, the response indicates failure.</returns>
        public async Task<BookingGetResponseAdmin> GetAllBookingsAsync(int status)
        {
            if (!Enum.IsDefined(typeof(BookingStatus), status))
            {
                return new BookingGetResponseAdmin
                {
                    Success = false,
                    Message = "Не існує такого статусу замовлення",
                    Bookings = new List<BookingDtoAdmin>()
                };
            }

            var statusEnum = (BookingStatus)status;

            var bookings = await _context.Bookings
             .AsNoTracking()
             .Where(b => b.Status == statusEnum)
             .Select(b => new BookingDtoAdmin
             {
                 Id = b.BookingId,
                 BookingAt = b.BookingAt,
                 TotalPrice = b.TotalPrice,
                 Status = b.Status.ToString(),
                 MovieId = b.Tickets
                    .Select(t => t.SessionSeat.Session.Movie.MovieId)
                    .FirstOrDefault(),
                 MovieTitle = b.Tickets
                     .Select(t => t.SessionSeat.Session.Movie.Title)
                     .FirstOrDefault(),
                 MoviePosterPath = b.Tickets
                     .Select(t => t.SessionSeat.Session.Movie.PosterUri)
                     .FirstOrDefault(),
                 Email = b.AppUser.Email,
                 PhoneNum = b.AppUser.PhoneNum
             })
             .ToListAsync();

            if (!bookings.Any())
            {
                return new BookingGetResponseAdmin
                {
                    Success = true,
                    Message = "Бронювання відсутні",
                    Bookings = new List<BookingDtoAdmin>()
                };
            }

            return new BookingGetResponseAdmin
            {
                Success = true,
                Message = "Бронювання успішно отримано",
                Bookings = bookings
            };
        }

        /// <summary>
        /// Asynchronously retrieves all bookings.
        /// </summary>
        /// <remarks>
        /// This method returns the complete list of bookings without applying any filters.
        /// If no bookings exist, the response will indicate success and return an empty list.
        /// </remarks>
        /// <returns>
        /// A task that represents the asynchronous operation.  
        /// The task result contains a <see cref="BookingGetResponse"/> object with:
        /// <list type="bullet">
        /// <item><description><c>Success = true</c> when the operation completes successfully.</description></item>
        /// <item><description>A list of all bookings if any exist, or an empty list if none are found.</description></item>
        /// </list>
        /// </returns>
        public async Task<BookingGetResponseAdmin> GetAllBookingsAsync()
        {
            var bookings = await _context.Bookings
             .AsNoTracking()
             .Select(b => new BookingDtoAdmin
             {
                 Id = b.BookingId,
                 BookingAt = b.BookingAt,
                 TotalPrice = b.TotalPrice,
                 Status = b.Status.ToString(),
                 MovieId = b.Tickets
                    .Select(t => t.SessionSeat.Session.Movie.MovieId)
                    .FirstOrDefault(),
                 MovieTitle = b.Tickets
                     .Select(t => t.SessionSeat.Session.Movie.Title)
                     .FirstOrDefault(),
                 MoviePosterPath = b.Tickets
                     .Select(t => t.SessionSeat.Session.Movie.PosterUri)
                     .FirstOrDefault(),
                 Email = b.AppUser.Email,
                 PhoneNum = b.AppUser.PhoneNum
             })
             .ToListAsync();

            if (!bookings.Any())
            {
                return new BookingGetResponseAdmin
                {
                    Success = true,
                    Message = "Бронювання відсутні",
                    Bookings = new List<BookingDtoAdmin>()
                };
            }

            return new BookingGetResponseAdmin
            {
                Success = true,
                Message = "Бронювання успішно отримано",
                Bookings = bookings
            };
        }

        /// <summary>
        /// Asynchronously updates the status of an existing booking.
        /// </summary>
        /// <param name="id">The unique identifier of the booking whose status is to be updated.</param>
        /// <param name="status">
        /// The integer value representing the new booking status.
        /// Must correspond to a valid value of the <see cref="BookingStatus"/> enumeration.
        /// </param>
        /// <returns>
        /// A task that represents the asynchronous operation. The task result contains a
        /// <see cref="BookingResponse"/> object indicating whether the booking status was
        /// successfully updated. If the booking is not found, the response indicates failure
        /// and contains an appropriate message.
        /// </returns>
        public async Task<BookingResponse> UpdateBookingStatusAsync(int id, BookingStatus status)
        {
            var currentBooking = await _context.Bookings
                .Include(b => b.Tickets)
                    .ThenInclude(t => t.SessionSeat)
                        .ThenInclude(ss => ss.Session)
                .Where(b => b.BookingId == id)
                .FirstOrDefaultAsync();

            if(currentBooking == null)
            {
                return new BookingResponse
                {
                    Success = false,
                    Message = "Бронювання не знайдено"
                };
            }

            if (currentBooking.Status == status)
            {
                return new BookingResponse
                {
                    Success = false,
                    Message = "Бронювання вже має цей статус"
                };
            }

            if (currentBooking.Status == BookingStatus.Completed || currentBooking.Status == BookingStatus.Cancelled)
            {
                return new BookingResponse
                {
                    Success = false,
                    Message = "Неможливо змінити статус завершеного або скасованого бронювання"
                };
            }

            if (currentBooking.Status == BookingStatus.Confirmed && status == BookingStatus.Pending)
            {
                return new BookingResponse
                {
                    Success = false,
                    Message = "Неможливо в підтверджений букінг поставити статус в очікуванні"
                };
            }

            if (status == BookingStatus.Completed)
            {
                var sessionStartTime = currentBooking.Tickets?
                    .Select(t => t.SessionSeat.Session.StartTime)
                    .FirstOrDefault();

                if (sessionStartTime.HasValue && DateTime.UtcNow < sessionStartTime.Value)
                {
                    return new BookingResponse
                    {
                        Success = false,
                        Message = "Неможливо завершити бронювання, якщо сеанс ще не почався"
                    };
                }
            }

            if (status == BookingStatus.Cancelled && currentBooking.Tickets != null)
            {
                foreach (var ticket in currentBooking.Tickets)
                {
                    ticket.SessionSeat.IsAvailable = true;
                }
            }

            currentBooking.Status = status;

            await _context.SaveChangesAsync();

            return new BookingResponse
            {
                Success = true,
                Message = "Статус бронювання оновлено успішно"
            };
        }
    }
}
