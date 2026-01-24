namespace CinemaProject.Server.DTOs.Session
{
    public class SessionDto
    {
        public int Id { get; set; }
        public int MovieId { get; set; }
        public string MovieTitle { get; set; } = null!;
        public string? MoviePosterPath { get; set; }
        public string[]? MovieGenres { get; set; }
        public int HallId { get; set; }
        public string HallName { get; set; } = null!;
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public decimal BasePrice { get; set; }
    }

    public class CreateSessionDto
    {
        public int MovieId { get; set; }
        public int HallId { get; set; }
        public DateTime StartTime { get; set; }
        public decimal BasePrice { get; set; }
    }

    public class UpdateSessionDto
    {
        public int? MovieId { get; set; }
        public int? HallId { get; set; }
        public DateTime? StartTime { get; set; }
        public decimal? BasePrice { get; set; }
    }
}
