using CinemaProject.Server.Models.Enums;

namespace CinemaProject.Server.DTOs.Booking
{
    public class BookingResponse
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
    }

    public class BookingGetResponse : BookingResponse
    {
        public List<BookingDto> Bookings { get; set; }
    }

    public class BookingGetResponseAdmin : BookingResponse
    {
        public List<BookingDtoAdmin> Bookings { get; set; }
    }

    public class BookingCreateResponse : BookingResponse
    {
        public int BookingId { get; set; }
        public decimal TotalPrice { get; set; }
    }

    public class BookingDto
    {
        public int Id { get; set; }
        public DateTime BookingAt { get; set; } 
        public decimal TotalPrice { get; set; }
        public string? Status { get; set; }
        public int MovieId { get; set; }
        public string MovieTitle { get; set; }
        public string MoviePosterPath { get; set; }
    }

    public class BookingDtoAdmin : BookingDto
    {
        public string Email { get; set; } = null!;
        public string PhoneNum { get; set; } = null!;
    }
}
