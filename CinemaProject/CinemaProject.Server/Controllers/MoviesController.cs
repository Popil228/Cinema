using CinemaProject.Server.Services;
using Microsoft.AspNetCore.Mvc;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

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

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string query)
        {
            var movies = await _movieService.SearchMoviesAsync(query);
            if (!movies.Any()) return NotFound("Фільми не знайдено.");
            return Ok(movies);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Details(int id)
        {
            var result = await _movieService.GetMovieExtraInfoAsync(id);
            if (result == null) return NotFound("Фільм не знайдено.");
            return Ok(result);
        }
    }
}
