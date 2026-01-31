using CinemaProject.Server.DTOs.SessionSeat;
using CinemaProject.Server.Services;
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
                return BadRequest(response);
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
                return NotFound(response);
            }

            return Ok(response);
        }

        
        // Створює нове місце для сесії
        [HttpPost]
        public async Task<ActionResult<SessionSeatResponse>> Create([FromBody] CreateSessionSeatDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new SessionSeatResponse
                {
                    Success = false,
                    Message = "Невалідні дані"
                });
            }

            var response = await _sessionSeatService.CreateSessionSeatAsync(dto);

            if (!response.Success)
            {
                return BadRequest(response);
            }

            return CreatedAtAction(nameof(GetById), new { id = response.Data?.SessionSeatId }, response);
        }
    }
}