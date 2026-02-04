using CinemaProject.Server.DTOs.Actor;
using CinemaProject.Server.DTOs.MovieActor;
using CinemaProject.Server.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CinemaProject.Server.Models.Enums;


namespace CinemaProject.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MovieActorsController : Controller
    {
        private readonly IMovieActorService _movieActorService;

        public MovieActorsController(IMovieActorService movieActorService)
        {
            _movieActorService = movieActorService;
        }

        [HttpPost]
        [Authorize(Policy = "ManageMovieRelations")]
        public async Task<ActionResult<MovieActorResponse>> CreateMovieActors([FromBody] List<MovieActorDto> request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new MovieActorResponse
                {
                    Success = false,
                    Message = "Невалідні дані"
                });
            }

            var result = await _movieActorService.CreateMovieActorsAsync(request);
            
            if (!result.Success)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpPut]
        [Authorize(Policy = "ManageMovieRelations")]
        public async Task<ActionResult<MovieActorResponse>> UpdateMovieActors([FromBody] List<MovieActorDto> request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new MovieActorResponse
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

        [HttpDelete]
        [Authorize(Policy = "ManageMovieRelations")]
        public async Task<ActionResult<MovieActorResponse>> DeleteMovieActors([FromBody] MovieActorDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new MovieActorResponse
                {
                    Success = false,
                    Message = "Невалідні дані"
                });
            }

            var result = await _movieActorService.DeleteMovieActorsAsync(request);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
    }
}
