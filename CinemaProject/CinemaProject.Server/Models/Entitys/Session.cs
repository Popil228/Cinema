using System;

namespace CinemaProject.Server.Models.Entitys
{
    public class Session
    {
        public int SessionId { get; set; }
        public int MovieId { get; set; }
        public int HallId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public decimal BasePrice { get; set; }

        public Movie Movie { get; set; } = null!;
        public Hall Hall { get; set; } = null!;
        public ICollection<SessionSeat> SessionSeats { get; set; } = new List<SessionSeat>();
    }
}
