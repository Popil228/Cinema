using Azure.Core;
using CinemaProject.Server.DTOs.Auth;
using CinemaProject.Server.DTOs.Movie;
using CinemaProject.Server.Services;
using Microsoft.AspNetCore.Mvc;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace CinemaProject.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MovieController : ControllerBase
    {
        private readonly IMovieService _movieService;

        public MovieController(IMovieService movieService)
        {
            _movieService = movieService;
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string query)
        {
            var movies = await _movieService.SearchMoviesAsync(query);
            if (!movies.Any()) return NotFound("Фільми не знайдено.");
            return Ok(movies);
        }

        [HttpGet("details")]
        public async Task<IActionResult> Details([FromQuery] int id)
        {
            var result = await _movieService.GetMovieExtraInfoAsync(id);
            if (result == null) return NotFound("Фільм не знайдено.");
            return Ok(result);
        }

        [HttpGet("get_all_movie")]
        public async Task<IActionResult> GetAllMovies()
        {
            var movies = await _movieService.GetAllMoviesAsync();
            if (!movies.Any()) return NotFound("Фільми не знайдено.");
            return Ok(movies);
        }


        [HttpPost("add_movie")]
        public async Task<ActionResult<MovieResponse>> AddMovie([FromBody] MovieDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new MovieResponse
                {
                    Success = false,
                    Message = "Невалідні дані"
                });
            }

            var result = await _movieService.AddMovieAsync(request);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpPost("delete_movie")]
        public async Task<ActionResult<MovieResponse>> DeleteMovie([FromBody] int movieId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new MovieResponse
                {
                    Success = false,
                    Message = "Невалідні дані"
                });
            }

            var result = await _movieService.DeleteMovieAsync(movieId);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpPost("update_movie")]
        public async Task<ActionResult<MovieResponse>> UpdateMovie([FromBody] MovieDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new MovieResponse
                {
                    Success = false,
                    Message = "Невалідні дані"
                });
            }

            var result = await _movieService.UpdateMovieAsync(request);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

    }
}
