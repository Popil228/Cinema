namespace CinemaProject.Server.DTOs.Booking
{
    public class BookingRequest
    {
        public int? DiscountId { get; set; }
        public decimal TotalPrice { get; set; }
    }
}
