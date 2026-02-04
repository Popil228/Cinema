using CinemaProject.Server.DTOs.Discount;

namespace CinemaProject.Server.Services
{
    public interface IDiscountService
    {
        Task<DiscountResponse> CreateDiscountAsync(DiscountCreateRequest request);
        Task<DiscountGetResponse> GetDiscountsAsync();
        Task<DiscountResponse> DeleteDiscountAsync(int id);
        Task<DiscountUseResponse> UseDiscountAsync(string code, int userId);
        Task<DiscountResponse> UpdateDiscountAsync(int id, DiscountRequest request);
    }
}
