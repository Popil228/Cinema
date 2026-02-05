using CinemaProject.Server.DTOs.Ticket;

namespace CinemaProject.Server.Interfaces
{
    public interface ITicketService
    {
        Task<TicketGetResponse> GetTicketsByBookingIdAsync(int bookingId, int userId);
        Task<TicketGetResponse> GetTicketsByBookingIdAsync(int bookingId);
        Task<TicketResponse> DeleteTicketAsync(int ticketId, int userId);
        Task<TicketResponse> DeleteTicketAsync(int ticketId);
    }
}
