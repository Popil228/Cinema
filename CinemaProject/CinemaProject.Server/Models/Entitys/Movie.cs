using System.ComponentModel.DataAnnotations.Schema;

namespace CinemaProject.Server.Models.Entitys
{
    public class Movie
    {
        public int MovieId { get; set; }

        [Column(TypeName = "varchar(255)")]
        public string? PosterUri { get; set; }

        [Column(TypeName = "varchar(255)")]
        public string Title { get; set; } = null!;

        public string? Description { get; set; }

        public short Duration { get; set; }

        public DateTime? ReleaseDate { get; set; }

        public ICollection<Session> Sessions { get; set; } = new List<Session>();
        public ICollection<MovieActor> MovieActors { get; set; } = new List<MovieActor>();
        public ICollection<MovieGenre> MovieGenres { get; set; } = new List<MovieGenre>();
    }
}
