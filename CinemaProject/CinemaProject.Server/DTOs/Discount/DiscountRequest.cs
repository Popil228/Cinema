namespace CinemaProject.Server.DTOs.Discount
{
    public class DiscountRequest
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int UsesLeft { get; set; }
        public short DiscountPercentage { get; set; }
    }
}
