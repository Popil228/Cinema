using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CinemaProject.Server.Models.Entitys
{
    public class SeatType
    {
        public int SeatTypeId { get; set; }

        [Column(TypeName = "varchar(50)")]
        public string TypeName { get; set; } = null!;
        public short PricePercent { get; set; }

    }
}
