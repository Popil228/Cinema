using CinemaProject.Server.Data;
using CinemaProject.Server.DTOs.Session;
using CinemaProject.Server.Interfaces;
using CinemaProject.Server.Models.Entitys;
using Microsoft.EntityFrameworkCore;

namespace CinemaProject.Server.Services
{
    public class SessionService : ISessionService
    {
        private readonly CinemaDbContext _context;

        public SessionService(CinemaDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<SessionDto>> GetAllSessionsAsync(bool onlyUpcoming, int? movieId)
        {
            var sessions = await _context.Sessions
                .Where(s => onlyUpcoming ? s.StartTime.Date >= DateTime.UtcNow.Date : true)
                .Where(s => movieId == null ? true : s.MovieId == movieId)
                .Include(s => s.Movie)
                    .ThenInclude(m => m.MovieGenres)
                        .ThenInclude(mg => mg.Genre)
                .Include(s => s.Hall)
                .OrderBy(s => s.StartTime)
                .ToListAsync();

            return sessions.Select(MapToDto);
        }

        public async Task<SessionDto?> GetSessionByIdAsync(int id)
        {
            var session = await _context.Sessions
                .Include(s => s.Movie)
                    .ThenInclude(m => m.MovieGenres)
                        .ThenInclude(mg => mg.Genre)
                .Include(s => s.Hall)
                .FirstOrDefaultAsync(s => s.SessionId == id);

            return session != null ? MapToDto(session) : null;
        }

        public async Task<SessionDto> CreateSessionAsync(CreateSessionDto dto)
        {
            var movie = await _context.Movies
                .Include(m => m.MovieGenres)
                    .ThenInclude(mg => mg.Genre)
                .FirstOrDefaultAsync(m => m.MovieId == dto.MovieId)
                ?? throw new ArgumentException($"Фільм з ID {dto.MovieId} не знайдено");

            var hall = await _context.Halls
                .Include(h => h.Seats)
                .FirstOrDefaultAsync(h => h.HallId == dto.HallId)
                ?? throw new ArgumentException($"Зал з ID {dto.HallId} не знайдено");

            // Конвертуємо в UTC
            var startTimeUtc = DateTime.SpecifyKind(dto.StartTime, DateTimeKind.Utc);
            var endTimeUtc = startTimeUtc.AddMinutes(movie.Duration);

            var hasConflict = await _context.Sessions
                .AnyAsync(s => s.HallId == dto.HallId &&
                    ((startTimeUtc >= s.StartTime && startTimeUtc < s.EndTime) ||
                     (endTimeUtc > s.StartTime && endTimeUtc <= s.EndTime) ||
                     (startTimeUtc <= s.StartTime && endTimeUtc >= s.EndTime)));

            if (hasConflict)
            {
                throw new InvalidOperationException("Зал зайнятий у вказаний час");
            }

            var session = new Session
            {
                MovieId = dto.MovieId,
                HallId = dto.HallId,
                StartTime = startTimeUtc,
                EndTime = endTimeUtc,
                BasePrice = dto.BasePrice,
                Movie = movie,
                Hall = hall
            };

            _context.Sessions.Add(session);
            await _context.SaveChangesAsync();

            // Автоматично створюємо SessionSeat для всіх місць у залі
            var sessionSeats = hall.Seats.Select(seat => new SessionSeat
            {
                SessionId = session.SessionId,
                SeatId = seat.SeatId,
                IsAvailable = true
            }).ToList();

            _context.SessionSeats.AddRange(sessionSeats);
            await _context.SaveChangesAsync();

            return MapToDto(session);
        }

        public async Task<SessionDto?> UpdateSessionAsync(int id, UpdateSessionDto dto)
        {
            var session = await _context.Sessions
                .Include(s => s.Movie)
                    .ThenInclude(m => m.MovieGenres)
                        .ThenInclude(mg => mg.Genre)
                .Include(s => s.Hall)
                .FirstOrDefaultAsync(s => s.SessionId == id);

            if (session == null) return null;

            if (dto.MovieId.HasValue)
            {
                var movie = await _context.Movies
                    .Include(m => m.MovieGenres)
                        .ThenInclude(mg => mg.Genre)
                    .FirstOrDefaultAsync(m => m.MovieId == dto.MovieId.Value)
                    ?? throw new ArgumentException($"Фільм з ID {dto.MovieId} не знайдено");
                session.MovieId = dto.MovieId.Value;
                session.Movie = movie;
            }

            if (dto.HallId.HasValue)
            {
                var hall = await _context.Halls.FindAsync(dto.HallId.Value)
                    ?? throw new ArgumentException($"Зал з ID {dto.HallId} не знайдено");
                session.HallId = dto.HallId.Value;
                session.Hall = hall;
            }

            if (dto.StartTime.HasValue)
            {
                var startTimeUtc = DateTime.SpecifyKind(dto.StartTime.Value, DateTimeKind.Utc);
                session.StartTime = startTimeUtc;
                session.EndTime = startTimeUtc.AddMinutes(session.Movie.Duration);
            }

            if (dto.BasePrice.HasValue)
            {
                session.BasePrice = dto.BasePrice.Value;
            }

            await _context.SaveChangesAsync();
            return MapToDto(session);
        }

        public async Task<bool> DeleteSessionAsync(int id)
        {
            var session = await _context.Sessions
                .Include(s => s.SessionSeats)
                .FirstOrDefaultAsync(s => s.SessionId == id);

            if (session == null) return false;

            if (session.SessionSeats.Any())
            {
                _context.SessionSeats.RemoveRange(session.SessionSeats);
            }

            _context.Sessions.Remove(session);
            await _context.SaveChangesAsync();
            return true;
        }

        private static SessionDto MapToDto(Session session)
        {
            return new SessionDto
            {
                Id = session.SessionId,
                MovieId = session.MovieId,
                MovieTitle = session.Movie.Title,
                MoviePosterPath = session.Movie.PosterUri,
                MovieGenres = session.Movie.MovieGenres?.Select(mg => mg.Genre.Name).ToArray(),
                HallId = session.HallId,
                HallName = session.Hall.Name,
                StartTime = session.StartTime,
                EndTime = session.EndTime,
                BasePrice = session.BasePrice
            };
        }
    }
}
