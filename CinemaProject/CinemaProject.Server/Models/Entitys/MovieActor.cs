using System.ComponentModel.DataAnnotations.Schema;

namespace CinemaProject.Server.Models.Entitys
{
    public class MovieActor
    {
        public int ActorId { get; set; }
        public int MovieId { get; set; }

        [Column(TypeName = "varchar(255)")]
        public string? Character { get; set; }

        public Actor Actor { get; set; } = null!;
        public Movie Movie { get; set; } = null!;
    }
}
