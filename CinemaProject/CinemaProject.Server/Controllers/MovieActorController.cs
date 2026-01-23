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

        [HttpPut]
        public async Task<ActionResult<MovieActorResponse>> UpdateMovieActors([FromBody] MovieActorDto request)
        {
            var result = await _movieActorService.UpdateMovieActorsAsync(request);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);


        }
    }
}
