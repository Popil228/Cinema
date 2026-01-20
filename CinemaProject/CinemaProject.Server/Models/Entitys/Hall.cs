using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CinemaProject.Server.Models.Entitys
{
    public class Hall
    {
        public int HallId { get; set; }

        [Column(TypeName = "varchar(50)")]
        public string HallName { get; set; } = null!;

        public ICollection<Session> Sessions { get; set; } = new List<Session>();
        public ICollection<Seat> Seats { get; set; } = new List<Seat>();
    }
}
