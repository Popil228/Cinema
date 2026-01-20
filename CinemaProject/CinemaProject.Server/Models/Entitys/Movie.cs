using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CinemaProject.Server.Models.Entitys
{
    public class Movie
    {
        public int MovieId { get; set; }

        [Column(TypeName = "varchar(50)")]
        public string Title { get; set; } = null!;
        public int Duration { get; set; }
        public string? Description { get; set; } = null!;

        [Column(TypeName = "varchar(255)")]
        public string PosterUri { get; set; } = null!;

        public ICollection<MovieGenre> MovieGenres { get; set; } = new List<MovieGenre>();
        public ICollection<Session> Sessions { get; set; } = new List<Session>();
    }
}
