using CinemaProject.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CinemaProject.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TmdbController : Controller
    {
        private readonly ITmdbService _tmdbService;

        public TmdbController(ITmdbService tmdbService)
        {
            _tmdbService = tmdbService;
        }

        [HttpGet("search")]
        [Authorize(Policy = "ManageTMDBs")]
        public async Task<IActionResult> Search([FromQuery] string query)
        {
            try
            {
                var movies = await _tmdbService.SearchMoviesAsync(query);
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

        [HttpGet("details/{id:int}")]
        [Authorize(Policy = "ManageTMDBs")]
        public async Task<IActionResult> GetDetails(int id)
        {
            try
            {
                var result = await _tmdbService.GetMovieExtraInfoAsync(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    error = ex.Message
                });
            }
        }

        [HttpGet("actors/{id:int}")]
        [Authorize(Policy = "ManageTMDBs")]
        public async Task<IActionResult> GetCast(int id)
        {
            try
            {
                var result = await _tmdbService.GetCastAsync(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    error = ex.Message
                });
            }
        }
    }
}
