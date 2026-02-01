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
        /// Asynchronously deletes a ticket by its ID for a specific user and marks the associated session seat as available.
        /// </summary>
        /// <param name="ticketId">The unique identifier of the ticket to be deleted.</param>
        /// <param name="userId">The unique identifier of the user attempting to delete the ticket. Users can only delete their own tickets.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a <see cref="TicketResponse"/>
        /// indicating whether the deletion was successful. The deletion is only allowed if the ticket exists, the related booking exists
        /// and is in the <see cref="BookingStatus.Pending"/> state, and the user has permission to delete the ticket.</returns>

        public async Task<TicketResponse> DeleteTicketAsync(int ticketId, int userId)
        {
            var userIdInBooking = await _context.Bookings
                    .Where(b => b.Tickets!.Any(t => t.TicketId == ticketId))
                    .Select(b => b.UserId)
                    .FirstOrDefaultAsync();

            if (userId != userIdInBooking)
            {
                return new TicketResponse
                {
                    Success = false,
                    Message = "Ви не маєте дозволу видаляти цей квиток"
                };
            }

            var bookingStatus = await _context.Tickets
                .AsNoTracking()
                .Where(t => t.TicketId == ticketId)
                .Select(t => t.Booking.Status)
                .FirstOrDefaultAsync();

            if (bookingStatus == default)
            {
                return new TicketResponse
                {
                    Success = false,
                    Message = "Бронювання не знайдено"
                };
            }

            if (bookingStatus != BookingStatus.Pending)
            {
                return new TicketResponse
                {
                    Success = false,
                    Message = "Квиток не може бути видалено, оскільки бронювання не перебуває в статусі Pending"
                };
            }

            var ticket = await _context.Tickets.FindAsync(ticketId);
            if (ticket == null)
            {
                return new TicketResponse
                {
                    Success = false,
                    Message = "Квиток не знайдено"
                };
            }

            await _context.SessionSeats
                .Where(ss => ss.SessionSeatId == ticket.SessionSeatId)
                .ExecuteUpdateAsync(s => s.SetProperty(
                    ss => ss.IsAvailable,
                    ss => true));

            _context.Tickets.Remove(ticket);
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
            var bookingStatus = await _context.Tickets
                .AsNoTracking()
                .Where(t => t.TicketId == ticketId)
                .Select(t => t.Booking.Status)
                .FirstOrDefaultAsync();
            if (bookingStatus == default)
            {
                return new TicketResponse
                {
                    Success = false,
                    Message = "Бронювання не знайдено"
                };
            }
            if (bookingStatus != BookingStatus.Pending)
            {
                return new TicketResponse
                {
                    Success = false,
                    Message = "Квиток не може бути видалено, оскільки бронювання не перебуває в статусі Pending"
                };
            }
            var ticket = await _context.Tickets.FindAsync(ticketId);
            if (ticket == null)
            {
                return new TicketResponse
                {
                    Success = false,
                    Message = "Квиток не знайдено"
                };
            }

            await _context.SessionSeats
                .Where(ss => ss.SessionSeatId == ticket.SessionSeatId)
                .ExecuteUpdateAsync(s => s.SetProperty(
                    ss => ss.IsAvailable,
                    ss => true));

            _context.Tickets.Remove(ticket);
            await _context.SaveChangesAsync();
            return new TicketResponse
            {
                Success = true,
                Message = "Квиток успішно видалено"
            };

        }
    }
}
