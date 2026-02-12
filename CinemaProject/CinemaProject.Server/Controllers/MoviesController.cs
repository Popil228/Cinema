using CinemaProject.Server.DTOs.Movie;
using CinemaProject.Server.Interfaces;
using Microsoft.AspNetCore.Authorization;
using CinemaProject.Server.Models.Enums;
using Microsoft.AspNetCore.Mvc;
using CinemaProject.Server.Interfaces;

namespace CinemaProject.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MoviesController : ControllerBase
    {
        private readonly IMovieService _movieService;

        public MoviesController(IMovieService movieService)
        {
            _movieService = movieService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllMovies([FromQuery] bool onlyShowingNow = false)
        {
            try
            {
                var movies = await _movieService.GetAllMoviesAsync(onlyShowingNow);
                return Ok(movies);
            }
            catch (Exception ex)
            {
                var error = new { error = new DTOs.ApiError {
                    Code = "BadRequest",
                    Message = ex.Message,
                    Target = null,
                    Details = null
                }};
                return BadRequest(error);
            }

        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetMovieById(int id)
        {
            try
            {
                var movie = await _movieService.GetMovieByIdAsync(id);
                return Ok(movie);
            }
            catch (Exception ex)
            {
                var error = new { error = new DTOs.ApiError {
                    Code = "BadRequest",
                    Message = ex.Message,
                    Target = null,
                    Details = null
                }};
                return BadRequest(error);
            }

        }

        [HttpPost]
        [Authorize(Policy = "ManageMovies")]
        public async Task<ActionResult<MovieResponse>> СreateMovie([FromBody] ShortMovieDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { error = new DTOs.ApiError {
                    Code = "BadRequest",
                    Message = "Невалідні дані",
                    Target = null,
                    Details = null
                }});
            }

            var result = await _movieService.CreateMovieAsync(request);

            if (!result.Success)
            {
                return BadRequest(new { error = new DTOs.ApiError {
                    Code = "BadRequest",
                    Message = result.Message,
                    Target = null,
                    Details = null
                }});
            }

            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        [Authorize(Policy = "ManageMovies")]
        public async Task<ActionResult<MovieResponse>> DeleteMovie(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { error = new DTOs.ApiError {
                    Code = "BadRequest",
                    Message = "Невалідні дані",
                    Target = null,
                    Details = null
                }});
            }

            var result = await _movieService.DeleteMovieAsync(id);

            if (!result.Success)
            {
                return BadRequest(new { error = new DTOs.ApiError {
                    Code = "BadRequest",
                    Message = result.Message,
                    Target = null,
                    Details = null
                }});
            }

            return Ok(result);
        }

        [HttpPut]
        [Authorize(Policy = "ManageMovies")]
        public async Task<ActionResult<MovieResponse>> UpdateMovie([FromBody] ShortMovieDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { error = new DTOs.ApiError {
                    Code = "BadRequest",
                    Message = "Невалідні дані",
                    Target = null,
                    Details = null
                }});
            }

            var result = await _movieService.UpdateMovieAsync(request);

            if (!result.Success)
            {
                return BadRequest(new { error = new DTOs.ApiError {
                    Code = "BadRequest",
                    Message = result.Message,
                    Target = null,
                    Details = null
                }});
            }

            return Ok(result);
        }

    }
}
