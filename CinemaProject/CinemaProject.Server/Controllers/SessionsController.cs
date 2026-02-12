using CinemaProject.Server.DTOs.Session;
using CinemaProject.Server.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CinemaProject.Server.Models.Enums;
using CinemaProject.Server.Interfaces;

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
        public async Task<ActionResult<IEnumerable<SessionDto>>> GetAll([FromQuery]bool onlyUpcoming = false, [FromQuery]int? movieId = null)
        {
            var sessions = await _sessionService.GetAllSessionsAsync(onlyUpcoming, movieId);
            return Ok(sessions);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SessionDto>> GetById(int id)
        {
            var session = await _sessionService.GetSessionByIdAsync(id);
            if (session == null)
            {
                var error = new { error = new DTOs.ApiError {
                    Code = "NotFound",
                    Message = $"Сесія з ID {id} не знайдена",
                    Target = "id",
                    Details = null
                }};
                return NotFound(error);
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
                var error = new { error = new DTOs.ApiError {
                    Code = "BadRequest",
                    Message = ex.Message,
                    Target = null,
                    Details = null
                }};
                return BadRequest(error);
            }
            catch (InvalidOperationException ex)
            {
                var error = new { error = new DTOs.ApiError {
                    Code = "Conflict",
                    Message = ex.Message,
                    Target = null,
                    Details = null
                }};
                return Conflict(error);
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
                    var error = new { error = new DTOs.ApiError {
                        Code = "NotFound",
                        Message = $"Сесія з ID {id} не знайдена",
                        Target = "id"
                    }};
                    return NotFound(error);
                }
                return Ok(session);
            }
            catch (ArgumentException ex)
            {
                var error = new { error = new DTOs.ApiError {
                    Code = "BadRequest",
                    Message = ex.Message,
                    Target = "id"
                }};
                return BadRequest(error);
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "ManageSessions")]
        public async Task<ActionResult> Delete(int id)
        {
            var result = await _sessionService.DeleteSessionAsync(id);
            if (!result)
            {
                var error = new { error = new DTOs.ApiError {
                    Code = "NotFound",
                    Message = $"Сесія з ID {id} не знайдена",
                    Target = "id"
                }};
                return NotFound(error);
            }
            return NoContent();
        }
    }
}
