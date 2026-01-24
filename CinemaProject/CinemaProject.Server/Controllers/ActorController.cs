using Azure.Core;
using CinemaProject.Server.DTOs.Actor;
using CinemaProject.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace CinemaProject.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ActorController : Controller
    {

        private readonly IActorService _actorService;

        public ActorController(IActorService actorService)
        {
            _actorService = actorService;
        }

        [HttpPost]
        public async Task<ActionResult<ActorResponse>> CreateActor([FromBody] ActorDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ActorResponse
                {
                    Success = false,
                    Message = "Невалідні дані"
                });
            }

            var result = await _actorService.CreateActorAsync(request);

            if (!result.Success)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpPut]
        public async Task<ActionResult<ActorResponse>> UpdateActor([FromBody] ActorDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ActorResponse
                {
                    Success = false,
                    Message = "Невалідні дані"
                });
            }

            var result = await _actorService.UpdateActorAsync(request);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpDelete("{id:int}")]
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
