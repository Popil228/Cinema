using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CinemaProject.Server.Models.Entitys
{
    public class SeatType
    {
        [Key]
        public int SeatTypeId { get; set; }

        [Column(TypeName = "varchar(50)")]
        public string Type { get; set; } = null!;

        public short PricePercent { get; set; }

        public ICollection<Seat> Seats { get; set; } = new List<Seat>();
    }
}
