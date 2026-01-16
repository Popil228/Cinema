namespace CinemaProject.Server.Models.Entitys
{
    public class Seat
    {
        public int SeatId { get; set; }
        public int HallId { get; set; }
        public int RowNumber { get; set; }
        public int SeatNumber { get; set; }

        public Hall Hall { get; set; } = null!;
    }
}
