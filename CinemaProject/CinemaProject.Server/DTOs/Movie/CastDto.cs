namespace CinemaProject.Server.DTOs.Movie
{
    public class CastDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Role { get; set; }
        public string? PhotoUri { get; set; }
    }
}
