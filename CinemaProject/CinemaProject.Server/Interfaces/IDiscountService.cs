using CinemaProject.Server.DTOs.Discount;

namespace CinemaProject.Server.Interfaces
{
    public interface IDiscountService
    {
        Task<DiscountResponse> CreateDiscountAsync(DiscountDto request);
        Task<DiscountGetResponse> GetDiscountsAsync();
        Task<DiscountResponse> DeleteDiscountAsync(int id);
        Task<DiscountUseResponse> CheckDiscountAsync(string code, int userId);
        Task<DiscountResponse> UpdateDiscountAsync(int id, DiscountRequest request);
    }
}
