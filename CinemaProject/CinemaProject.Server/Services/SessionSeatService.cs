using CinemaProject.Server.Data;
using CinemaProject.Server.DTOs.SessionSeat;
using CinemaProject.Server.Models.Entitys;
using Microsoft.EntityFrameworkCore;

namespace CinemaProject.Server.Services
{
    public class SessionSeatService : ISessionSeatService
    {
        private readonly CinemaDbContext _context;

        public SessionSeatService(CinemaDbContext context)
        {
            _context = context;
        }

        public async Task<SessionSeatListResponse> GetAllBySessionIdAsync(int sessionId, bool? isActive = null)
        {
            try
            {
                IQueryable<SessionSeat> query = _context.SessionSeats
                    .Include(ss => ss.Seat)
                        .ThenInclude(s => s.SeatType)
                    .Where(ss => ss.SessionId == sessionId);

                if (isActive.HasValue)
                {
                    query = query.Where(ss => ss.IsAvailable == isActive.Value);
                }

                var sessionSeats = await query.ToListAsync();

                var dtos = sessionSeats.Select(MapToDto).ToList();

                return new SessionSeatListResponse
                {
                    Success = true,
                    Data = dtos
                };
            }
            catch (Exception ex)
            {
                return new SessionSeatListResponse
                {
                    Success = false,
                    Message = $"Помилка при отриманні місць сесії: {ex.Message}"
                };
            }
        }

        public async Task<SessionSeatResponse> GetByIdAsync(int id)
        {
            try
            {
                var sessionSeat = await _context.SessionSeats
                    .Include(ss => ss.Seat)
                    .ThenInclude(s => s.SeatType)
                    .FirstOrDefaultAsync(ss => ss.SessionSeatId == id);

                if (sessionSeat == null)
                {
                    return new SessionSeatResponse
                    {
                        Success = false,
                        Message = $"Місце сесії з ID {id} не знайдено"
                    };
                }

                return new SessionSeatResponse
                {
                    Success = true,
                    Data = MapToDto(sessionSeat)
                };
            }
            catch (Exception ex)
            {
                return new SessionSeatResponse
                {
                    Success = false,
                    Message = $"Помилка при отриманні місця сесії: {ex.Message}"
                };
            }
        }

        private static SessionSeatDto MapToDto(SessionSeat sessionSeat)
        {
            short pricePercentage = (sessionSeat.Seat == null) ? (short)100 : sessionSeat.Seat.SeatType.PricePercent;
            return new SessionSeatDto
            {
                SessionSeatId = sessionSeat.SessionSeatId,
                SessionId = sessionSeat.SessionId,
                SeatId = sessionSeat.SeatId,
                IsActive = sessionSeat.IsAvailable,
                RowNumber = sessionSeat.Seat?.RowNumber ?? 0,
                SeatNumber = sessionSeat.Seat?.SeatNumber ?? 0,
                SeatType = sessionSeat.Seat?.SeatType?.Type,
                SeatTypePricePercentage = pricePercentage
            };
        }
    }
}