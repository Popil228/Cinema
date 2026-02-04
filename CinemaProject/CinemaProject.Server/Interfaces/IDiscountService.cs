using CinemaProject.Server.DTOs.Discount;

namespace CinemaProject.Server.Interfaces
{
    public interface IDiscountService
    {
        Task<DiscountResponse> CreateDiscountAsync(DiscountDto request);
        Task<DiscountGetResponse> GetDiscountsAsync();
        Task<DiscountResponse> DeleteDiscountAsync(int id);
        Task<DiscountUseResponse> UseDiscountAsync(string code, int userId);
    }
}
