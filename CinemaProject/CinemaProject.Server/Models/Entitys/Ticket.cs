namespace CinemaProject.Server.Models.Entitys
{
    public class Ticket
    {
        public int TicketId { get; set; }
        public int BookingId { get; set; }
        public int SessionSeatId { get; set; }
        public decimal Price { get; set; }

        public Booking Booking { get; set; } = null!;
        public SessionSeat SessionSeat { get; set; } = null!;
    }
}
