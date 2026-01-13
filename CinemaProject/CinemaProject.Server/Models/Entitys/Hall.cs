namespace CinemaProject.Server.Models.Entitys
{
    public class Hall
    {
        public int HallId { get; set; }
        public string HallName { get; set; } = null!;
        public int HallCapacity { get; set; }

        public ICollection<Seat> Seats { get; set; } = new List<Seat>();
    }
}
