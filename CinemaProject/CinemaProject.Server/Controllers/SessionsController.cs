using CinemaProject.Server.DTOs.Session;
using CinemaProject.Server.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CinemaProject.Server.Models.Enums;

namespace CinemaProject.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SessionsController : ControllerBase
    {
        private readonly ISessionService _sessionService;

        public SessionsController(ISessionService sessionService)
        {
            _sessionService = sessionService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SessionDto>>> GetAll()
        {
            var sessions = await _sessionService.GetAllSessionsAsync();
            return Ok(sessions);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SessionDto>> GetById(int id)
        {
            var session = await _sessionService.GetSessionByIdAsync(id);
            if (session == null)
            {
                return NotFound(new { message = $"Сесія з ID {id} не знайдена" });
            }
            return Ok(session);
        }

        [HttpPost]
        [Authorize(Policy = "ManageSessions")]
        public async Task<ActionResult<SessionDto>> Create([FromBody] CreateSessionDto dto)
        {
            try
            {
                var session = await _sessionService.CreateSessionAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = session.Id }, session);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "ManageSessions")]
        public async Task<ActionResult<SessionDto>> Update(int id, [FromBody] UpdateSessionDto dto)
        {
            try
            {
                var session = await _sessionService.UpdateSessionAsync(id, dto);
                if (session == null)
                {
                    return NotFound(new { message = $"Сесія з ID {id} не знайдена" });
                }
                return Ok(session);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "ManageSessions")]
        public async Task<ActionResult> Delete(int id)
        {
            var result = await _sessionService.DeleteSessionAsync(id);
            if (!result)
            {
                return NotFound(new { message = $"Сесія з ID {id} не знайдена" });
            }
            return NoContent();
        }
    }
}
