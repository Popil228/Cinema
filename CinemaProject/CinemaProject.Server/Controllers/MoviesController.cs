using CinemaProject.Server.DTOs.Movie;
using CinemaProject.Server.Services;
using Microsoft.AspNetCore.Mvc;

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
        public async Task<IActionResult> GetAllMovies()
        {
            try
            {
                var movies = await _movieService.GetAllMoviesAsync();
                return Ok(movies);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    error = ex.Message
                });
            }

        }

        [HttpGet ("now-showing")]
        public async Task<IActionResult> GetNowShowingMovies()
        {
            try
            {
                var movies = await _movieService.GetNowShowingMoviesAsync();
                return Ok(movies);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    error = ex.Message
                });
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
                return BadRequest(new
                {
                    error = ex.Message
                });
            }

        }

        [HttpPost]
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

        [HttpDelete("{id:int}")]
        public async Task<ActionResult<MovieResponse>> DeleteMovie(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new MovieResponse
                {
                    Success = false,
                    Message = "Невалідні дані"
                });
            }

            var result = await _movieService.DeleteMovieAsync(id);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpPut]
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
