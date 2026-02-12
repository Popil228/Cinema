using CinemaProject.Server.DTOs.Actor;
using CinemaProject.Server.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CinemaProject.Server.Models.Enums;
using CinemaProject.Server.Interfaces;

namespace CinemaProject.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ActorsController : Controller
    {

        private readonly IActorService _actorService;

        public ActorsController(IActorService actorService)
        {
            _actorService = actorService;
        }

        [HttpPost]
        [Authorize(Policy = "ManageActors")]
        public async Task<ActionResult<ActorResponse>> CreateActors([FromBody] List<ActorDto> request)
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

            var result = await _actorService.CreateActorsAsync(request);

            if (!result.Success)
            {
                var error = new { error = new DTOs.ApiError {
                    Code = "BadRequest",
                    Message = result.Message,
                    Target = null,
                    Details = null
                }};
                return BadRequest(error);
            }
            return Ok(result);
        }

        [HttpPut]
        [Authorize(Policy = "ManageActors")]
        public async Task<ActionResult<ActorResponse>> UpdateActors([FromBody] List<ActorDto> request)
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

            var result = await _actorService.UpdateActorsAsync(request);

            if (!result.Success)
            {
                var error = new { error = new DTOs.ApiError {
                    Code = "BadRequest",
                    Message = result.Message,
                    Target = null,
                    Details = null
                }};
                return BadRequest(error);
            }

            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        [Authorize(Policy = "ManageActors")]
        public async Task<ActionResult<ActorResponse>> DeleteActor (int id)
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

            var result = await _actorService.DeleteActorAsync(id);

            if (!result.Success)
            {
                var error = new { error = new DTOs.ApiError {
                    Code = "BadRequest",
                    Message = result.Message,
                    Target = null,
                    Details = null
                }};
                return BadRequest(error);
            }

            return Ok(result);
        }

    }
}
