using Azure.Core;
using CinemaProject.Server.DTOs.Actor;
using CinemaProject.Server.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CinemaProject.Server.Models.Enums;

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
                return BadRequest(new ActorResponse
                {
                    Success = false,
                    Message = "Невалідні дані"
                });
            }

            var result = await _actorService.CreateActorsAsync(request);

            if (!result.Success)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpPut]
        [Authorize(Policy = "ManageActors")]
        public async Task<ActionResult<ActorResponse>> UpdateActors([FromBody] List<ActorDto> request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ActorResponse
                {
                    Success = false,
                    Message = "Невалідні дані"
                });
            }

            var result = await _actorService.UpdateActorsAsync(request);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        [Authorize(Policy = "ManageActors")]
        public async Task<ActionResult<ActorResponse>> DeleteActor (int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ActorResponse
                {
                    Success = false,
                    Message = "Невалідні дані"
                });
            }

            var result = await _actorService.DeleteActorAsync(id);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

    }
}
