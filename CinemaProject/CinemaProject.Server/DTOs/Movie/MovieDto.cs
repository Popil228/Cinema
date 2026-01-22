using CinemaProject.Server.DTOs.Actor;
using CinemaProject.Server.DTOs.Genre;

namespace CinemaProject.Server.DTOs.Movie
{
    public class MovieDto
    {
        public MovieMainInfoDto? MainInfo { get; set; }
        public MovieExtraInfoDto? ExtraInfo { get; set; }
    }

    public class MovieMainInfoDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public DateTime ReleaseDate { get; set; }
        public string PosterPath { get; set; }
    }

    public class MovieExtraInfoDto
    {
        public int Runtime { get; set; }
        public string Overview { get; set; }
        public List<GanreDto> Genres { get; set; }
        public List<ActorDto> Actors { get; set; }
    }
}
