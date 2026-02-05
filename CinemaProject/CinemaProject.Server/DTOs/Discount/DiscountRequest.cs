namespace CinemaProject.Server.DTOs.Discount
{
    public class DiscountRequest
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int UsesLeft { get; set; }
        public short DiscountPercentage { get; set; }
    }

    public class DiscountCreateRequest : DiscountRequest
    {
        public string Code { get; set; }
    }
}
