namespace CinemaProject.Server.Models.Entitys
{
    public class SessionSeat
    {
        public int SessionSeatId { get; set; }
        public int SessionId { get; set; }
        public int SeatId { get; set; }
        public bool IsAvailable { get; set; }

        public Session Session { get; set; } = null!;
        public Seat Seat { get; set; } = null!;
        public Ticket? Ticket { get; set; }
    }
}
