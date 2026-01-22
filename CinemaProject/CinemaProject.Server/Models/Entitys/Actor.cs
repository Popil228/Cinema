using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CinemaProject.Server.Models.Entitys
{
    public class Actor
    {
        public int ActorId { get; set; }

        [Column(TypeName = "varchar(100)")]
        public string FullName { get; set; } = null!;

        [Column(TypeName = "varchar(255)")]
        public string? PhotoUri { get; set; } 
        public ICollection<MovieActor> MovieActors { get; set; } = new HashSet<MovieActor>();
    }
}
