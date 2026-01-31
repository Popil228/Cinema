using CinemaProject.Server.DTOs.Booking;
using CinemaProject.Server.DTOs.Discount;
using CinemaProject.Server.Models.Enums;
using CinemaProject.Server.Services;
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

        [Authorize(Roles = "User")]
        [HttpPost]
        public async Task<ActionResult<BookingResponse>> CreateBooking(BookingRequest request)
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

            var response = await _bookingService.CreateBookingAsync(request, userId);

            if (!response.Success)
            {
                return BadRequest(new
                {
                    error = response.Message
                });
            }
            return Ok(response);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<ActionResult<BookingResponse>> DeleteBooking(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new DiscountUseResponse
                {
                    Success = false,
                    Message = "Невалідні дані"
                });
            }

            var response = await _bookingService.DeleteBookingAsync(id);

            if (!response.Success)
            {
                return BadRequest(new
                {
                    error = response.Message
                });
            }
            return Ok(response);
        }

        [Authorize(Roles = "User, Admin")]
        [HttpGet]
        public async Task<ActionResult<BookingGetResponse>> GetBooking([FromQuery] int? status)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!int.TryParse(userIdStr, out var userId))
            {
                return Unauthorized(new BookingGetResponse
                {
                    Success = false,
                    Message = "Користувач не автентифікований",
                    Bookings = new List<BookingDto>()
                });
            }

            var response = new BookingGetResponse();

            if (User.IsInRole("User"))
            {
                response = status.HasValue
                    ? await _bookingService.GetUserBookingsAsync(userId, status.Value)
                    : await _bookingService.GetUserBookingsAsync(userId);
            }
            else if (User.IsInRole("Admin"))
            {
                response = status.HasValue
                    ? await _bookingService.GetAllBookingsAsync(status.Value)
                    : await _bookingService.GetAllBookingsAsync();
            }

            if (!response.Success)
            {
                return BadRequest(new
                {
                    error = response.Message
                });
            }
            return Ok(response);
        }

        [Authorize(Roles = "User, Admin")]
        [HttpPatch("{id:int}")]
        public async Task<ActionResult<BookingResponse>> UpdateBookingStatus([FromRoute] int id, [FromQuery] int status)
        {
            if (!Enum.IsDefined(typeof(BookingStatus), status))
            {
                return BadRequest(new 
                {
                    error = "Некоректний статус бронювання"
                });
            }

            var response = await _bookingService.UpdateBookingStatusAsync(id, status);

            if (!response.Success)
            {
                return BadRequest(new
                {
                    error = response.Message
                });
            }
            return Ok(response);
        }
    }
}
