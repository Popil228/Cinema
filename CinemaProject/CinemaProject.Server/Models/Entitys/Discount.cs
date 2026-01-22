using System.ComponentModel.DataAnnotations.Schema;

namespace CinemaProject.Server.Models.Entitys
{
    public class Discount
    {
        public int DiscountId { get; set; }

        [Column(TypeName = "varchar(50)")]
        public string Code { get; set; } = null!;

        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public int UsesLeft { get; set; }
        public short DiscountPercent { get; set; }

        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }
}
