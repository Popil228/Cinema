using CinemaProject.Server.DTOs.Actor;
using CinemaProject.Server.DTOs.Genre;

namespace CinemaProject.Server.DTOs.Movie
{
    public class MovieExtraInfoDto
    {
        public int Runtime { get; set; }
        public string Overview { get; set; }
        public List<GanreDto> Genres { get; set; }
        public List<ActorDto> Actors { get; set; }
    }
}
