using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CinemaProject.Server.Models.Entitys
{
    public class Genre
    {
        public int GenreId { get; set; }

        [Column(TypeName = "varchar(50)")]
        public string GenreName { get; set; } = null!;
        public ICollection<MovieGenre> MovieGenres { get; set; } = new List<MovieGenre>();
    }
}
