using CinemaProject.Server.Data;
using CinemaProject.Server.DTOs.Discount;
using CinemaProject.Server.Interfaces;
using CinemaProject.Server.Models.Entitys;
using Microsoft.EntityFrameworkCore;

namespace CinemaProject.Server.Services
{
    public class DiscountService : IDiscountService
    {
        private readonly CinemaDbContext _context;
        public DiscountService(CinemaDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Creates a new discount based on the specified request data.
        /// </summary>
        /// <param name="request">The details of the discount to create. Cannot be null.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a DiscountResponse indicating
        /// whether the discount was successfully created.</returns>
        public async Task<DiscountResponse> CreateDiscountAsync(DiscountCreateRequest request)
        {
            if (request == null)
                return new DiscountResponse
                {
                    Success = false,
                    Message = "Неправильні дані"
                };

            if (string.IsNullOrWhiteSpace(request.Code))
                return new DiscountResponse
                {
                    Success = false,
                    Message = "Код знижки обов'язковий"
                };

            if (await _context.Discounts.AnyAsync(d => d.Code == request.Code))
                return new DiscountResponse
                {
                    Success = false,
                    Message = "Такий код вже існує"
                };

            if (request.EndDate <= request.StartDate)
                return new DiscountResponse
                {
                    Success = false,
                    Message = "Некоректний період дії"
                };

            if (request.DiscountPercentage <= 0 || request.DiscountPercentage > 100)
                return new DiscountResponse
                {
                    Success = false,
                    Message = "Некоректний відсоток знижки"
                };

            var discount = new Discount
            {
                Code = request.Code,
                StartDate = DateTime.SpecifyKind(request.StartDate, DateTimeKind.Utc),
                EndDate = DateTime.SpecifyKind(request.EndDate, DateTimeKind.Utc),
                UsesLeft = request.UsesLeft,
                DiscountPercent = request.DiscountPercentage
            };

            _context.Discounts.Add(discount);
            await _context.SaveChangesAsync();
            return new DiscountResponse
            {
                Success = true,
                Message = "Код на знижку успішно створено"
            };
        }

        /// <summary>
        /// Asynchronously retrieves all available discount codes.
        /// </summary>
        /// <returns>A task that represents the asynchronous operation. The task result contains a <see cref="DiscountResponse"/>
        /// object with the list of discount codes. If no discounts are found, the response indicates failure and
        /// contains an appropriate message.</returns>
        public async Task<DiscountGetResponse> GetDiscountsAsync()
        {
            List<Discount> discounts = await _context.Discounts.ToListAsync();

            if (!discounts.Any())
            {
                return new DiscountGetResponse
                {
                    Success = false,
                    Message = "Кодів на знижки не знайдено",
                    Discounts = new List<DiscountDto>()
                };
            }

            return new DiscountGetResponse
            {
                Success = true,
                Message = "Коди на знижки успішно повернуті",
                Discounts = discounts.Select(d => new DiscountDto
                {
                    Id = d.DiscountId,
                    Code = d.Code,
                    StartDate = d.StartDate,
                    EndDate = d.EndDate,
                    UsesLeft = d.UsesLeft,
                    DiscountPercentage = d.DiscountPercent
                }).ToList()
            };
        }

        /// <summary>
        /// Deletes the discount with the specified identifier asynchronously.
        /// </summary>
        /// <param name="id">The unique identifier of the discount to delete.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a DiscountResponse indicating
        /// whether the discount was successfully deleted.</returns>
        public async Task<DiscountResponse> DeleteDiscountAsync(int id)
        {
            var discount = await _context.Discounts.FindAsync(id);
            if (discount == null)
            {
                return new DiscountResponse
                {
                    Success = false,
                    Message = "Код на знижку не знайдено"
                };
            }

            _context.Discounts.Remove(discount);
            await _context.SaveChangesAsync();

            return new DiscountResponse
            {
                Success = true,
                Message = "Код на знижку успішно видалено"
            };
        }


        /// <summary>
        /// Attempts to apply a discount code for the specified user asynchronously. 
        /// </summary>
        /// <remarks>The discount code must be valid, active, have remaining uses, and not have been
        /// previously used by the specified user. If any of these conditions are not met, the response will indicate
        /// failure and provide an appropriate message.</remarks>
        /// <param name="code">The discount code to be applied. Cannot be null or empty.</param>
        /// <param name="userId">The unique identifier of the user attempting to use the discount code.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a DiscountResponse indicating
        /// whether the discount was successfully applied and providing a relevant message.</returns>
        public async Task<DiscountUseResponse> CheckDiscountAsync(string code, int userId)
        {
            var discount = await _context.Discounts
                .FirstOrDefaultAsync(d => d.Code == code);

            if (discount == null)
            {
                return new DiscountUseResponse
                {
                    Success = false,
                    Message = "Код на знижку не знайдено"
                };
            }
            if (discount.UsesLeft <= 0 || discount.EndDate < DateTime.UtcNow || discount.StartDate > DateTime.UtcNow)
            {
                return new DiscountUseResponse
                {
                    Success = false,
                    Message = "Код на знижку не дійсний"
                };
            }

            var codeIsUsed = await _context.Bookings
                .AnyAsync(b => b.UserId == userId && b.DiscountId == discount.DiscountId);

            if (codeIsUsed)
            {
                return new DiscountUseResponse
                {
                    Success = false,
                    Message = "Код на знижку вже був використаний раніше"
                };
            }

            await _context.SaveChangesAsync();
            return new DiscountUseResponse
            {
                Success = true,
                Message = "Код на знижку успішно перевірений",
                Id = discount.DiscountId,
                DiscountPercentage = discount.DiscountPercent
            };

        }


        public async Task<DiscountResponse> UpdateDiscountAsync(int id, DiscountRequest request)
        {
            var discount = await _context.Discounts.FindAsync(id);

            if (discount == null)
            {
                return new DiscountResponse
                {
                    Success = false,
                    Message = "Код на знижку не знайдено"
                };
            }
            if (request.EndDate <= request.StartDate)
                return new DiscountResponse
                {
                    Success = false,
                    Message = "Некоректний період дії"
                };
            if (request.DiscountPercentage <= 0 || request.DiscountPercentage > 100)
                return new DiscountResponse
                {
                    Success = false,
                    Message = "Некоректний відсоток знижки"
                };
            if (request.UsesLeft < 0)
            {
                return new DiscountResponse
                {
                    Success = false,
                    Message = "Кількість використань не може бути від'ємною"
                };
            }

            discount.StartDate = DateTime.SpecifyKind(request.StartDate, DateTimeKind.Utc);
            discount.EndDate = DateTime.SpecifyKind(request.EndDate, DateTimeKind.Utc);
            discount.UsesLeft = request.UsesLeft;
            discount.DiscountPercent = request.DiscountPercentage;

            await _context.SaveChangesAsync();
            return new DiscountResponse
            {
                Success = true,
                Message = "Код на знижку успішно оновлено"
            };
        }
    }
}
