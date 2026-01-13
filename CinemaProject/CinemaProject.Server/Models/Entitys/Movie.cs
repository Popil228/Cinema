namespace CinemaProject.Server.Models.Entitys
{
    public class Movie
    {
        public int MovieId { get; set; }
        public string Title { get; set; } = null!;
        public int Duration { get; set; } 
        public string? Description { get; set; } = null!;
        public string PosterUrl { get; set; } = null!;
        public string? Actors { get; set; } = null!;

        public ICollection<MovieGenre> MovieGenres { get; set; } = new List<MovieGenre>();
        public ICollection<Session> Sessions { get; set; } = new List<Session>();
    }
}
