using CinemaProject.Server.DTOs.Discount;

namespace CinemaProject.Server.Interfaces
{
    public interface IDiscountService
    {
        Task<DiscountResponse> CreateDiscountAsync(DiscountCreateRequest request);
        Task<DiscountGetResponse> GetDiscountsAsync();
        Task<DiscountGetPercentageResponse> GetDiscountPercentageAsync(int id);
        Task<DiscountResponse> DeleteDiscountAsync(int id);
        Task<DiscountUseResponse> CheckDiscountAsync(string code, int userId);
        Task<DiscountResponse> UpdateDiscountAsync(int id, DiscountRequest request);
    }
}
