using CinemaProject.Server.DTOs.MovieActor;
using CinemaProject.Server.DTOs.MovieGenre;
using CinemaProject.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace CinemaProject.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MovieGenresController : Controller
    {
        private readonly IMovieGenreService _movieGenreService;

        public MovieGenresController(IMovieGenreService movieGenreService)
        {
            _movieGenreService = movieGenreService;
        }

        [HttpPost]
        public async Task<ActionResult<MovieGenreResponse>> CreateMovieGenres([FromBody] List<MovieGenreDto> request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new MovieActorResponse
                {
                    Success = false,
                    Message = "Невалідні дані"
                });
            }

            var result = await _movieGenreService.CreateMovieGenresAsync(request);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpPut]
        public async Task<ActionResult<MovieGenreResponse>> UpdateMovieGenres([FromBody] List<MovieGenreDto> request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new MovieActorResponse
                {
                    Success = false,
                    Message = "Невалідні дані"
                });
            }

            var result = await _movieGenreService.UpdateMovieGenresAsync(request);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
    }
}
