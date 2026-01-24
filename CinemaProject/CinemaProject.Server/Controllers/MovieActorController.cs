using CinemaProject.Server.DTOs.Actor;
using CinemaProject.Server.DTOs.MovieActor;
using CinemaProject.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace CinemaProject.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MovieActorController : Controller
    {
        private readonly IMovieActorService _movieActorService;

        public MovieActorController(IMovieActorService movieActorService)
        {
            _movieActorService = movieActorService;
        }

        [HttpPost]
        public async Task<ActionResult<MovieActorResponse>> CreateMovieActor([FromBody] MovieActorDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ActorResponse
                {
                    Success = false,
                    Message = "Невалідні дані"
                });
            }

            var result = await _movieActorService.CreateMovieActorAsync(request);
            
            if (!result.Success)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpPut]
        public async Task<ActionResult<MovieActorResponse>> UpdateMovieActors([FromBody] MovieActorDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ActorResponse
                {
                    Success = false,
                    Message = "Невалідні дані"
                });
            }

            var result = await _movieActorService.UpdateMovieActorsAsync(request);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);


        }
    }
}
