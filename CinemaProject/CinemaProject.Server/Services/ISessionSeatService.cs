using CinemaProject.Server.DTOs.SessionSeat;

namespace CinemaProject.Server.Services
{
    public interface ISessionSeatService
    {
        Task<SessionSeatListResponse> GetAllBySessionIdAsync(int sessionId, bool? isActive = null);
        Task<SessionSeatResponse> GetByIdAsync(int id);
    }
}