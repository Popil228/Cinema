namespace CinemaProject.Server.Models.Entitys
{
    public class Seat
    {
        public int SeatId { get; set; }
        public int HallId { get; set; }
        public int SeatTypeId { get; set; }
        public short RowNumber { get; set; }
        public short SeatNumber { get; set; }

        public Hall Hall { get; set; } = null!;
        public SeatType SeatType { get; set; } = null!; 
    }
}
