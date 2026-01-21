namespace CinemaProject.Server.Models.Tmdb
{
    public class TmdbMovieDetails
    {
        public int Runtime { get; set; }
        public string Overview { get; set; }
        public List<TmdbGenre> Genres { get; set; }
    }
}
