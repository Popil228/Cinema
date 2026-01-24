namespace CinemaProject.Server.DTOs.Movie
{
    public class MovieMainInfoDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string ReleaseDate { get; set; } = string.Empty;
        public string? PosterPath { get; set; }
    }
}
