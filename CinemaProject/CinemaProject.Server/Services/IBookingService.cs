using CinemaProject.Server.DTOs.Booking;

namespace CinemaProject.Server.Services
{
    public interface IBookingService
    {
        Task<BookingCreateResponse> CreateBookingAsync(BookingRequest request, int userId);
        Task<BookingResponse> DeleteBookingAsync(int id);
        Task<BookingGetResponse> GetUserBookingsAsync(int userId, int status);
        Task<BookingGetResponse> GetUserBookingsAsync(int userId);
        Task<BookingGetResponse> GetAllBookingsAsync(int status);
        Task<BookingGetResponse> GetAllBookingsAsync();
        Task<BookingResponse> UpdateBookingStatusAsync(int id, int status);

    }
}
