using CinemaProject.Server.DTOs.Booking;
using CinemaProject.Server.Interfaces;
using CinemaProject.Server.Models.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CinemaProject.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingsController : Controller
    {
        private readonly IBookingService _bookingService;

        public BookingsController(IBookingService bookingService)
        {
            _bookingService = bookingService;
        }

        [HttpPost]
        [Authorize(Policy = "UserOrAdminBookings")]
        public async Task<ActionResult<BookingCreateResponse>> CreateBooking(BookingRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { error = new DTOs.ApiError {
                    Code = "BadRequest",
                    Message = "Невалідні дані",
                    Target = null,
                    Details = null
                }});
            }

            if(!request.SessionSeatIds.Any())
            {
                return BadRequest(new { error = new DTOs.ApiError {
                    Code = "BadRequest",
                    Message = "Бронювання неможливе, виберіть містя",
                    Target = null,
                    Details = null
                }});
            }

            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!int.TryParse(userIdStr, out var userId))
            {
                return Unauthorized(new { error = new DTOs.ApiError {
                    Code = "Unauthorized",
                    Message = "Користувач не автентифікований",
                    Target = null,
                    Details = null
                }});
            }

            var response = await _bookingService.CreateBookingAsync(request, userId);

            if (!response.Success)
            {
                return BadRequest(new { error = new DTOs.ApiError {
                    Code = "BadRequest",
                    Message = response.Message,
                    Target = null,
                    Details = null
                }});
            }
            return Ok(response);
        }

        [HttpDelete("{id:int}")]
        [Authorize(Policy = "ManageBookings")]
        public async Task<ActionResult<BookingResponse>> DeleteBooking(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { error = new DTOs.ApiError {
                    Code = "BadRequest",
                    Message = "Невалідні дані",
                    Target = null,
                    Details = null
                }});
            }

            var response = await _bookingService.DeleteBookingAsync(id);

            if (!response.Success)
            {
                return BadRequest(new { error = new DTOs.ApiError {
                    Code = "BadRequest",
                    Message = response.Message,
                    Target = null,
                    Details = null
                }});
            }
            return Ok(response);
        }

        [HttpGet("user")]
        [Authorize(Policy = "UserOrAdminBookings")]
        public async Task<ActionResult<BookingGetResponse>> GetBookings([FromQuery] int? status)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!int.TryParse(userIdStr, out var userId))
            {
                return Unauthorized(new { error = new DTOs.ApiError {
                    Code = "Unauthorized",
                    Message = "Користувач не автентифікований",
                    Target = null,
                    Details = null
                }});
            }

            var response = status.HasValue
                ? await _bookingService.GetUserBookingsAsync(userId, status.Value)
                : await _bookingService.GetUserBookingsAsync(userId);
            
            if (!response.Success)
            {
                return BadRequest(new { error = new DTOs.ApiError {
                    Code = "BadRequest",
                    Message = response.Message,
                    Target = null,
                    Details = null
                }});
            }
            return Ok(response);
        }

        [HttpGet("admin")]
        [Authorize(Policy = "ManageBookings")]
        public async Task<ActionResult<BookingGetResponseAdmin>> GetAllBookings([FromQuery] int? status)
        {
            var response = status.HasValue
                ? await _bookingService.GetAllBookingsAsync(status.Value)
                : await _bookingService.GetAllBookingsAsync();

            if (!response.Success)
            {
                return BadRequest(new { error = new DTOs.ApiError {
                    Code = "BadRequest",
                    Message = response.Message,
                    Target = null,
                    Details = null
                }});
            }
            return Ok(response);
        }

        [HttpPatch("{id:int}")]
        [Authorize(Policy = "UserOrAdminBookings")]
        public async Task<ActionResult<BookingResponse>> UpdateBookingStatus([FromRoute] int id, [FromQuery] BookingStatus status)
        {
            if (!Enum.IsDefined(typeof(BookingStatus), status))
            {
                return BadRequest(new { error = new DTOs.ApiError {
                    Code = "BadRequest",
                    Message = "Некоректний статус бронювання",
                    Target = null,
                    Details = null
                }});
            }

            var response = await _bookingService.UpdateBookingStatusAsync(id, status);

            if (!response.Success)
            {
                return BadRequest(new { error = new DTOs.ApiError {
                    Code = "BadRequest",
                    Message = response.Message,
                    Target = null,
                    Details = null
                }});
            }
            return Ok(response);
        }
    }
}
