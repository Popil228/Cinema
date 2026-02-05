namespace CinemaProject.Server.DTOs.Discount
{
    public class DiscountResponse
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
        
    }

    public class DiscountGetResponse : DiscountResponse
    {
        public List<DiscountDto>? Discounts { get; set; }
    }

    public class DiscountUseResponse : DiscountResponse
    {
        public int Id { get; set; }
        public short DiscountPercentage { get; set; }
    }

    public class DiscountGetPercentageResponse : DiscountResponse
    {
        public short DiscountPercentage { get; set; }
    }
}
