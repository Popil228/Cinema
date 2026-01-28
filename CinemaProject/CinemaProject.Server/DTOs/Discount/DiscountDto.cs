using System.ComponentModel;

namespace CinemaProject.Server.DTOs.Discount
{
    public class DiscountDto
    {
        public string Code { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int UsesLeft { get; set; }
        public short DiscountPercentage { get; set; }
    }
}
