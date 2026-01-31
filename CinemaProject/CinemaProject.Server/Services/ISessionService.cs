using CinemaProject.Server.DTOs.Session;

namespace CinemaProject.Server.Services
{
    public interface ISessionService
    {
        Task<IEnumerable<SessionDto>> GetAllSessionsAsync(bool onlyUpcoming = false, int? movieId = null);
        Task<SessionDto?> GetSessionByIdAsync(int id);
        Task<SessionDto> CreateSessionAsync(CreateSessionDto dto);
        Task<SessionDto?> UpdateSessionAsync(int id, UpdateSessionDto dto);
        Task<bool> DeleteSessionAsync(int id);
    }
}
