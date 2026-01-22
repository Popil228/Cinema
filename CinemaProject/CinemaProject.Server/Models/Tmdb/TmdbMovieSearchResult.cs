namespace CinemaProject.Server.Models.Tmdb
{
    public class TmdbMovieSearchResult
    {
        public int Page { get; set; }
        public List<TmdbMovie> Results { get; set; }
        public int Total_results { get; set; }
        public int Total_pages { get; set; }
    }
}
