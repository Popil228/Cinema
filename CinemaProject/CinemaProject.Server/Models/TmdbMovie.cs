namespace CinemaProject.Server.Models
{
    public class TmdbMovie
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Overview { get; set; }
        public string Release_date { get; set; }
        public string Poster_path { get; set; }
    }
}
