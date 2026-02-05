using Azure;
using CinemaProject.Server.DTOs.Ticket;
using CinemaProject.Server.Interfaces;
using CinemaProject.Server.Models.Entitys;
using CinemaProject.Server.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CinemaProject.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TicketsController : Controller
    {
        private readonly ITicketService _ticketService;

        public TicketsController(ITicketService ticketService)
        {
            _ticketService = ticketService;
        }

        [HttpGet("user")]
        [Authorize(Policy = "UserOrAdminTickets")]
        public async Task<ActionResult<TicketGetResponse>> GetTicketsByBookingId([FromQuery] int bookingId)
        {
            var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out int userId))
            {
                return Unauthorized();
            }

            var response = await _ticketService.GetTicketsByBookingIdAsync(bookingId, userId);

            if (!response.Success)
            {
                return BadRequest(new
                {
                    error = response.Message
                });
            }
            return Ok(response);
        }

        [HttpGet("admin")]
        [Authorize(Policy = "ManageTickets")]
        public async Task<ActionResult<TicketGetResponse>> AdminGetTicketsByBookingId([FromQuery] int bookingId)
        {
            var response = await _ticketService.GetTicketsByBookingIdAsync(bookingId);

            if (!response.Success)
            {
                return BadRequest(new
                {
                    error = response.Message
                });
            }
            return Ok(response);
        }

        [HttpDelete("{id:int}/user")]
        [Authorize(Policy = "UserOrAdminTickets")]
        public async Task<ActionResult<TicketResponse>> DeleteTicket(int id)
        {
            var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out int userId))
            {
                return Unauthorized();
            }

            var response = await _ticketService.DeleteTicketAsync(id, userId);

            if (!response.Success)
            {
                return BadRequest(new
                {
                    error = response.Message
                });
            }
            return Ok(response);
        }

        [HttpDelete("{id:int}/admin")]
        [Authorize(Policy = "ManageTickets")]
        public async Task<ActionResult<TicketResponse>> AdminDeleteTicket(int id)
        {
            var response = await _ticketService.DeleteTicketAsync(id);
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
