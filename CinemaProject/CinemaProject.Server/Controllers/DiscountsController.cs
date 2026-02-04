using CinemaProject.Server.DTOs.Discount;
using CinemaProject.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CinemaProject.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DiscountsController : Controller
    {
        private readonly IDiscountService _discount;

        public DiscountsController(IDiscountService discount)
        {
            _discount = discount;
        }

        [HttpPost]
        [Authorize(Policy = "ManageDiscounts")]
        public async Task<ActionResult<DiscountResponse>> CreateDiscount([FromBody] DiscountCreateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new DiscountResponse
                {
                    Success = false,
                    Message = "Невалідні дані"
                });
            }

            var response = await _discount.CreateDiscountAsync(request);

            if (!response.Success)
            {
                return BadRequest(new
                {
                    error = response.Message
                });
            }
            return Ok(response);
        }

        [HttpGet]
        [Authorize(Policy = "ManageDiscounts")]
        public async Task<ActionResult<DiscountGetResponse>> GetDiscounts()
        {
            var response = await _discount.GetDiscountsAsync();
            if (!response.Success)
            {
                return BadRequest(new
                {
                    error = response.Message
                });
            }
            return Ok(response);
        }

        [HttpDelete("{id:int}")]
        [Authorize(Policy = "ManageDiscounts")]
        public async Task<ActionResult<DiscountResponse>> DeleteDiscount(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new DiscountResponse
                {
                    Success = false,
                    Message = "Невалідні дані"
                });
            }

            var response = await _discount.DeleteDiscountAsync(id);

            if (!response.Success)
            {
                return BadRequest(new
                {
                    error = response.Message
                });
            }
            return Ok(response);
        }

        [HttpPatch("use")]
        [Authorize(Policy = "UserOrAdminDiscounts")]
        public async Task<ActionResult<DiscountUseResponse>> UseDiscount([FromQuery]string code)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new DiscountUseResponse
                {
                    Success = false,
                    Message = "Невалідні дані"
                });
            }

            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!int.TryParse(userIdStr, out var userId))
            {
                return Unauthorized(new DiscountResponse
                {
                    Success = false,
                    Message = "Користувач не автентифікований"
                });
            }

            var response = await _discount.UseDiscountAsync(code, userId);

            if (!response.Success)
            {
                return BadRequest(new
                {
                    error = response.Message
                });
            }
            return Ok(response);
        }

        [HttpPut("{id:int}")]
        [Authorize(Policy = "ManageDiscounts")]
        public async Task<ActionResult<DiscountResponse>> UpdateDiscount([FromRoute] int id, [FromBody] DiscountRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new DiscountResponse
                {
                    Success = false,
                    Message = "Невалідні дані"
                });
            }
            var response = await _discount.UpdateDiscountAsync(id, request);
            if(!response.Success)
            {
                return response.Message == "Код на знижку не знайдено"
                    ? NotFound(response)
                    : BadRequest(response);
            }
            return Ok(response);
        }
    }
}
