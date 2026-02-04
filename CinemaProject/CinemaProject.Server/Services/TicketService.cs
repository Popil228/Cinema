using Azure.Core;
using CinemaProject.Server.Data;
using CinemaProject.Server.DTOs.Ticket;
using CinemaProject.Server.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace CinemaProject.Server.Services
{
    public class TicketService : ITicketService
    {
        private readonly CinemaDbContext _context;

        public TicketService(CinemaDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Asynchronously retrieves all tickets associated with a specific booking that belongs to the specified user.
        /// </summary>
        /// <remarks>
        /// The method first verifies whether the booking exists. If the booking does not exist, a failure response is returned.
        /// If the booking exists but does not belong to the user or contains no tickets, a failure response is also returned.
        /// Only tickets linked to the given booking and user are returned.
        /// </remarks>
        /// <param name="bookingId">The unique identifier of the booking.</param>
        /// <param name="userId">The unique identifier of the user who owns the booking.</param>
        /// <returns>
        /// A task that represents the asynchronous operation. The task result contains a <see cref="TicketGetResponse"/> object:
        /// <list type="bullet">
        /// <item>
        /// <description><c>Success = true</c> with a list of tickets if tickets are found.</description>
        /// </item>
        /// <item>
        /// <description><c>Success = false</c> if the booking does not exist or no tickets are found.</description>
        /// </item>
        /// </list>
        /// </returns>
        public async Task<TicketGetResponse> GetTicketsByBookingIdAsync(int bookingId, int userId)
        {
            var bookingExists = await _context.Bookings
                .AsNoTracking()
                .AnyAsync(b => b.BookingId == bookingId);

            if (!bookingExists)
            {
                return new TicketGetResponse
                {
                    Success = false,
                    Message = "Бронювання не знайдено",
                    Tickets = new List<TicketDto>()
                };
            }

            var tickets = await _context.Bookings
                .AsNoTracking()
                .Where(b => b.BookingId == bookingId && b.UserId == userId)
                .SelectMany(b => b.Tickets!)
                .Select(t => new TicketDto
                {
                    Id = t.TicketId,
                    SeatNumber = t.SessionSeat.Seat.SeatNumber,
                    RowNumber = t.SessionSeat.Seat.RowNumber,
                    HallName = t.SessionSeat.Session.Hall.Name,
                    Price = t.Price,
                    MovieTitle = t.SessionSeat.Session.Movie.Title,
                    MoviePosterPath = t.SessionSeat.Session.Movie.PosterUri,
                    ShowTime = t.SessionSeat.Session.StartTime.ToString("g")
                })
                .ToListAsync();

            if (!tickets.Any())
            {
                return new TicketGetResponse
                {
                    Success = false,
                    Message = "Квитки не знайдено",
                    Tickets = new List<TicketDto>()
                };
            }

            return new TicketGetResponse
            {
                Success = true,
                Message = "Квитки успішно повернуто",
                Tickets = tickets
            };
        }

        /// <summary>
        /// Asynchronously retrieves all tickets associated with a specific booking.
        /// </summary>
        /// <param name="bookingId">The unique identifier of the booking whose tickets are being requested.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a <see cref="TicketGetResponse"/>
        /// which includes a list of tickets if they exist. If the booking does not exist or no tickets are found, the response
        /// indicates failure with an appropriate message.</returns>
        public async Task<TicketGetResponse> GetTicketsByBookingIdAsync(int bookingId)
        {
            var bookingExists = await _context.Bookings
                .AsNoTracking()
                .AnyAsync(b => b.BookingId == bookingId);

            if (!bookingExists)
            {
                return new TicketGetResponse
                {
                    Success = false,
                    Message = "Бронювання не знайдено",
                    Tickets = new List<TicketDto>()
                };
            }

            var tickets = await _context.Bookings
                .AsNoTracking()
                .Where(b => b.BookingId == bookingId)
                .SelectMany(b => b.Tickets!)
                .Select(t => new TicketDto
                {
                    Id = t.TicketId,
                    SeatNumber = t.SessionSeat.Seat.SeatNumber,
                    RowNumber = t.SessionSeat.Seat.RowNumber,
                    HallName = t.SessionSeat.Session.Hall.Name,
                    Price = t.Price,
                    MovieTitle = t.SessionSeat.Session.Movie.Title,
                    MoviePosterPath = t.SessionSeat.Session.Movie.PosterUri,
                    ShowTime = t.SessionSeat.Session.StartTime.ToString("g")
                })
                .ToListAsync();

            if (!tickets.Any())
            {
                return new TicketGetResponse
                {
                    Success = false,
                    Message = "Квитки не знайдено",
                    Tickets = new List<TicketDto>()
                };
            }

            return new TicketGetResponse
            {
                Success = true,
                Message = "Квитки успішно повернуто",
                Tickets = tickets
            };
        }

        /// <summary>
        /// Deletes a user's ticket, updates the booking total, and marks the corresponding session seat as available.
        /// </summary>
        /// <param name="ticketId">The ID of the ticket to be deleted.</param>
        /// <param name="userId">The ID of the user attempting to delete the ticket.</param>
        /// <returns>
        /// A <see cref="TicketResponse"/> object containing the result of the deletion operation
        /// and a message indicating success or failure.
        /// </returns>
        /// <remarks>
        /// The method performs the following steps:
        /// 1. Checks if the booking containing the specified ticket exists.
        /// 2. Verifies that the user has permission to delete the ticket.
        /// 3. Ensures the booking is in the <see cref="BookingStatus.Pending"/> status.
        /// 4. Updates the booking's total price after removing the ticket, applying any discount.
        /// 5. Marks the session seat associated with the ticket as available.
        /// 6. Removes the ticket from the database.
        /// 7. Removes the booking if it no longer contains any tickets after deletion.
        /// </remarks>
        public async Task<TicketResponse> DeleteTicketAsync(int ticketId, int userId)
        {
            var curentBooking = await _context.Bookings
                .Include(b => b.Tickets)
                    .ThenInclude(t => t.SessionSeat)
                .Include(b => b.Discount)
                .Where(b => b.Tickets!.Any(t => t.TicketId == ticketId))
                .FirstOrDefaultAsync();

            if (curentBooking == null)
            {
                return new TicketResponse
                {
                    Success = false,
                    Message = "Бронювання не знайдено"
                };
            }

            if (userId != curentBooking.UserId)
            {
                return new TicketResponse
                {
                    Success = false,
                    Message = "Ви не маєте дозволу видаляти цей квиток"
                };
            }

            if (curentBooking.Status != BookingStatus.Pending)
            {
                return new TicketResponse
                {
                    Success = false,
                    Message = "Квиток не може бути видалено, оскільки бронювання не перебуває в статусі Pending"
                };
            }

            var curentTicket = curentBooking.Tickets!
                .FirstOrDefault(t => t.TicketId == ticketId);
            if (curentTicket == null)
            {
                return new TicketResponse
                {
                    Success = false,
                    Message = "Квиток не знайдено"
                };
            }

            var totalPrice = curentBooking.Tickets!
                .Where(t => t.TicketId != ticketId)
                .Sum(t => t.Price);

            if (curentBooking.Discount != null)
            {
                totalPrice *= (1 - curentBooking.Discount.DiscountPercent / 100m);
            }

            curentBooking.TotalPrice = totalPrice;

            curentTicket.SessionSeat.IsAvailable = true;

            _context.Tickets.Remove(curentTicket);

            if (!curentBooking.Tickets!.Any(t => t.TicketId != ticketId))
            {
                _context.Bookings.Remove(curentBooking);
            }

            await _context.SaveChangesAsync();
            return new TicketResponse
            {
                Success = true,
                Message = "Квиток успішно видалено"
            };
        }

        /// <summary>
        /// Asynchronously deletes a ticket by its ID and marks the associated session seat as available.
        /// </summary>
        /// <param name="ticketId">The unique identifier of the ticket to be deleted.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a <see cref="TicketResponse"/>
        /// indicating whether the deletion was successful. The deletion is only allowed if the related booking exists
        /// and is in the <see cref="BookingStatus.Pending"/> state.</returns>

        public async Task<TicketResponse> DeleteTicketAsync(int ticketId)
        {
            var curentBooking = await _context.Bookings
                .Include(b => b.Tickets)
                    .ThenInclude(t => t.SessionSeat)
                .Include(b => b.Discount)
                .Where(b => b.Tickets!.Any(t => t.TicketId == ticketId))
                .FirstOrDefaultAsync();

            if (curentBooking == null)
            {
                return new TicketResponse
                {
                    Success = false,
                    Message = "Бронювання не знайдено"
                };
            }

            if (curentBooking.Status != BookingStatus.Pending)
            {
                return new TicketResponse
                {
                    Success = false,
                    Message = "Квиток не може бути видалено, оскільки бронювання не перебуває в статусі Pending"
                };
            }

            var curentTicket = curentBooking.Tickets!
                .FirstOrDefault(t => t.TicketId == ticketId);
            if (curentTicket == null)
            {
                return new TicketResponse
                {
                    Success = false,
                    Message = "Квиток не знайдено"
                };
            }

            var totalPrice = curentBooking.Tickets!
                .Where(t => t.TicketId != ticketId)
                .Sum(t => t.Price);

            if (curentBooking.Discount != null)
            {
                totalPrice *= (1 - curentBooking.Discount.DiscountPercent / 100m);
            }

            curentBooking.TotalPrice = totalPrice;

            curentTicket.SessionSeat.IsAvailable = true;

            _context.Tickets.Remove(curentTicket);

            if (!curentBooking.Tickets!.Any(t => t.TicketId != ticketId))
            {
                _context.Bookings.Remove(curentBooking);
            }

            await _context.SaveChangesAsync();
            return new TicketResponse
            {
                Success = true,
                Message = "Квиток успішно видалено"
            };

        }
    }
}
