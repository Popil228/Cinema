using CinemaProject.Server.DTOs.SessionSeat;
using CinemaProject.Server.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CinemaProject.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SessionSeatController : ControllerBase
    {
        private readonly ISessionSeatService _sessionSeatService;

        public SessionSeatController(ISessionSeatService sessionSeatService)
        {
            _sessionSeatService = sessionSeatService;
        }

     
        // Отримує всі місця для сесії з можливістю фільтрації за isActive
        [HttpGet]
        public async Task<ActionResult<SessionSeatListResponse>> GetAll([FromQuery] int sessionId, [FromQuery] bool? isActive = null)
        {
            var response = await _sessionSeatService.GetAllBySessionIdAsync(sessionId, isActive);
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

    
        // Отримує місце сесії по ID
        [HttpGet("{id:int}")]
        public async Task<ActionResult<SessionSeatResponse>> GetById(int id)
        {
            var response = await _sessionSeatService.GetByIdAsync(id);

            if (!response.Success)
            {
                var error = new { error = new DTOs.ApiError {
                    Code = "NotFound",
                    Message = response.Message,
                    Target = null,
                    Details = null
                }};
                return NotFound(error);
            }

            return Ok(response);
        }
    }
}
