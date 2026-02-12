using CinemaProject.Server.DTOs.Discount;
using CinemaProject.Server.Interfaces;
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
                var error = new { error = new DTOs.ApiError {
                    Code = "BadRequest",
                    Message = "Невалідні дані",
                    Target = null,
                    Details = null
                }};
                return BadRequest(error);
            }

            var response = await _discount.CreateDiscountAsync(request);

            if (!response.Success)
            {
                var error = new { error = new DTOs.ApiError {
                    Code = "BadRequest",
                    Message = response.Message,
                    Target = null,
                    Details = null
                }};
                return BadRequest(error);
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
                var error = new { error = new DTOs.ApiError {
                    Code = "BadRequest",
                    Message = response.Message,
                    Target = null,
                    Details = null
                }};
                return BadRequest(error);
            }
            return Ok(response);
        }

        [HttpDelete("{id:int}")]
        [Authorize(Policy = "ManageDiscounts")]
        public async Task<ActionResult<DiscountResponse>> DeleteDiscount(int id)
        {
            if (!ModelState.IsValid)
            {
                var error = new { error = new DTOs.ApiError {
                    Code = "BadRequest",
                    Message = "Невалідні дані",
                    Target = null,
                    Details = null
                }};
                return BadRequest(error);
            }

            var response = await _discount.DeleteDiscountAsync(id);

            if (!response.Success)
            {
                var error = new { error = new DTOs.ApiError {
                    Code = "BadRequest",
                    Message = response.Message,
                    Target = null,
                    Details = null
                }};
                return BadRequest(error);
            }
            return Ok(response);
        }

        [HttpGet("check")]
        [Authorize(Policy = "UserOrAdminDiscounts")]
        public async Task<ActionResult<DiscountUseResponse>> CheckDiscount([FromQuery]string code)
        {
            if (!ModelState.IsValid)
            {
                var error = new { error = new DTOs.ApiError {
                    Code = "BadRequest",
                    Message = "Невалідні дані",
                    Target = null,
                    Details = null
                }};
                return BadRequest(error);
            }

            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!int.TryParse(userIdStr, out var userId))
            {
                var error = new { error = new DTOs.ApiError {
                    Code = "Unauthorized",
                    Message = "Користувач не автентифікований",
                    Target = null,
                    Details = null
                }};
                return Unauthorized(error);
            }

            var response = await _discount.CheckDiscountAsync(code, userId);

            if (!response.Success)
            {
                var error = new { error = new DTOs.ApiError {
                    Code = "BadRequest",
                    Message = response.Message,
                    Target = null,
                    Details = null
                }};
                return BadRequest(error);
            }
            return Ok(response);
        }

        [HttpPut("{id:int}")]
        [Authorize(Policy = "ManageDiscounts")]
        public async Task<ActionResult<DiscountResponse>> UpdateDiscount([FromRoute] int id, [FromBody] DiscountRequest request)
        {
            if (!ModelState.IsValid)
            {
                var error = new { error = new DTOs.ApiError {
                    Code = "BadRequest",
                    Message = "Невалідні дані",
                    Target = null,
                    Details = null
                }};
                return BadRequest(error);
            }
            var response = await _discount.UpdateDiscountAsync(id, request);
            if(!response.Success)
            {
                if(response.Message == "Код на знижку не знайдено")
                {
                    var error = new { error = new DTOs.ApiError {
                        Code = "NotFound",
                        Message = response.Message,
                        Target = null,
                        Details = null
                    }};
                    return NotFound(error);
                }
                else
                {
                    var error = new { error = new DTOs.ApiError {
                        Code = "BadRequest",
                        Message = response.Message,
                        Target = null,
                        Details = null
                    }};
                    return BadRequest(error);
                }
            }
            return Ok(response);
        }
    }
}
