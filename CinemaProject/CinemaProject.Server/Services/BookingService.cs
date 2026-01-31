using CinemaProject.Server.Data;
using CinemaProject.Server.DTOs.Booking;
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
        /// Creates a new booking for the specified user based on the provided booking request.
        /// </summary>
        /// <remarks>If the booking request specifies a discount, the discount must exist; otherwise, the
        /// booking will not be created. The method returns a response with success status and a descriptive message for
        /// both successful and failed booking attempts.</remarks>
        /// <param name="request">The booking request containing details such as total price and optional discount to apply. Must have a
        /// positive total price.</param>
        /// <param name="userId">The identifier of the user for whom the booking is being created.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a BookingResponse indicating
        /// whether the booking was successfully created and includes a message describing the outcome.</returns>
        public async Task<BookingResponse> CreateBookingAsync(BookingRequest request, int userId)
        {
            if (request.TotalPrice <= 0)
            {
                return new BookingResponse
                {
                    Success = false,
                    Message = "Некоректна сума бронювання"
                };
            }

            if (request.DiscountId.HasValue)
            {
                var discount = await _context.Discounts
                    .FirstOrDefaultAsync(d => d.DiscountId == request.DiscountId);

                if (discount == null)
                {
                    return new BookingResponse
                    {
                        Success = false,
                        Message = "Знижку не знайдено"
                    };
                }
            }

                var booking = new Booking
            {
                UserId = userId,
                DiscountId = request.DiscountId,
                TotalPrice = request.TotalPrice,
                Status = BookingStatus.Pending
            };

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            return new BookingResponse
            {
                Success = true,
                Message = "Бронювання успішно створено"
            };
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
            var currentBooking = await _context.Bookings.FindAsync(id);

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
                 BookingAt = b.BookingAt.ToString("g"),
                 TotalPrice = b.TotalPrice,
                 Status = b.Status.ToString(),
                 Title = b.Tickets
                     .Select(t => t.SessionSeat.Session.Movie.Title)
                     .FirstOrDefault(),
                 PosterPath = b.Tickets
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
                 BookingAt = b.BookingAt.ToString("g"),
                 TotalPrice = b.TotalPrice,
                 Status = b.Status.ToString(),
                 Title = b.Tickets
                     .Select(t => t.SessionSeat.Session.Movie.Title)
                     .FirstOrDefault(),
                 PosterPath = b.Tickets
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
        public async Task<BookingGetResponse> GetAllBookingsAsync(int status)
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
             .Where(b => b.Status == statusEnum)
             .Select(b => new BookingDto
             {
                 BookingAt = b.BookingAt.ToString("g"),
                 TotalPrice = b.TotalPrice,
                 Status = b.Status.ToString(),
                 Title = b.Tickets
                     .Select(t => t.SessionSeat.Session.Movie.Title)
                     .FirstOrDefault(),
                 PosterPath = b.Tickets
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
        public async Task<BookingGetResponse> GetAllBookingsAsync()
        {
            var bookings = await _context.Bookings
             .AsNoTracking()
             .Select(b => new BookingDto
             {
                 BookingAt = b.BookingAt.ToString("g"),
                 TotalPrice = b.TotalPrice,
                 Status = b.Status.ToString(),
                 Title = b.Tickets
                     .Select(t => t.SessionSeat.Session.Movie.Title)
                     .FirstOrDefault(),
                 PosterPath = b.Tickets
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
        public async Task<BookingResponse> UpdateBookingStatusAsync(int id, int status)
        {
            var currentBooking = await _context.Bookings.FindAsync(id);

            if(currentBooking == null)
            {
                return new BookingResponse
                {
                    Success = false,
                    Message = "Бронювання не знайдено"
                };
            }

            currentBooking.Status = (BookingStatus)status;

            await _context.SaveChangesAsync();

            return new BookingResponse
            {
                Success = true,
                Message = "Статус бронювання оновлено успішно"
            };
        }
    }
}
