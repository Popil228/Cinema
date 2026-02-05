using CinemaProject.Server.DTOs.Booking;
using CinemaProject.Server.Models.Enums;

namespace CinemaProject.Server.Interfaces
{
    public interface IBookingService
    {
        Task<BookingCreateResponse> CreateBookingAsync(BookingRequest request, int userId);
        Task<BookingResponse> DeleteBookingAsync(int id);
        Task<BookingGetResponse> GetUserBookingsAsync(int userId, int status);
        Task<BookingGetResponse> GetUserBookingsAsync(int userId);
        Task<BookingGetResponseAdmin> GetAllBookingsAsync(int status);
        Task<BookingGetResponseAdmin> GetAllBookingsAsync();
        Task<BookingResponse> UpdateBookingStatusAsync(int id, BookingStatus status);

    }
}
