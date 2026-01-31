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

        public async Task<SessionSeatResponse> CreateSessionSeatAsync(CreateSessionSeatDto dto)
        {
            try
            {
                // Перевіряємо чи існує сесія
                var session = await _context.Sessions.FindAsync(dto.SessionId);
                if (session == null)
                {
                    return new SessionSeatResponse
                    {
                        Success = false,
                        Message = $"Сесія з ID {dto.SessionId} не знайдена"
                    };
                }

                // Перевіряємо чи існує місце
                var seat = await _context.Seats.FindAsync(dto.SeatId);
                if (seat == null)
                {
                    return new SessionSeatResponse
                    {
                        Success = false,
                        Message = $"Місце з ID {dto.SeatId} не знайдено"
                    };
                }

                // Перевіряємо чи вже існує таке місце для цієї сесії
                var existing = await _context.SessionSeats
                    .FirstOrDefaultAsync(ss => ss.SessionId == dto.SessionId && ss.SeatId == dto.SeatId);

                if (existing != null)
                {
                    return new SessionSeatResponse
                    {
                        Success = false,
                        Message = "Таке місце вже існує для цієї сесії"
                    };
                }

                var sessionSeat = new SessionSeat
                {
                    SessionId = dto.SessionId,
                    SeatId = dto.SeatId,
                    IsAvailable = true // Нове місце доступне за замовчуванням
                };

                _context.SessionSeats.Add(sessionSeat);
                await _context.SaveChangesAsync();

                // Отримуємо створений об'єкт з включеними навігаційними властивостями
                var created = await _context.SessionSeats
                    .Include(ss => ss.Seat)
                        .ThenInclude(s => s.SeatType)
                    .FirstAsync(ss => ss.SessionSeatId == sessionSeat.SessionSeatId);

                return new SessionSeatResponse
                {
                    Success = true,
                    Message = "Місце сесії успішно створено",
                    Data = MapToDto(created)
                };
            }
            catch (Exception ex)
            {
                return new SessionSeatResponse
                {
                    Success = false,
                    Message = $"Помилка при створенні місця сесії: {ex.Message}"
                };
            }
        }

        private static SessionSeatDto MapToDto(SessionSeat sessionSeat)
        {
            return new SessionSeatDto
            {
                SessionSeatId = sessionSeat.SessionSeatId,
                SessionId = sessionSeat.SessionId,
                SeatId = sessionSeat.SeatId,
                IsActive = sessionSeat.IsAvailable,
                SeatNumber = sessionSeat.Seat?.SeatNumber.ToString(),
                SeatType = sessionSeat.Seat?.SeatType?.Type
            };
        }
    }
}