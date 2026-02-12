using CinemaProject.Server.Interfaces;
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
                var error = new { error = new DTOs.ApiError {
                    Code = "BadRequest",
                    Message = ex.Message,
                    Target = null,
                    Details = null
                }};
                return BadRequest(error);
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
                var error = new { error = new DTOs.ApiError {
                    Code = "BadRequest",
                    Message = ex.Message,
                    Target = null,
                    Details = null
                }};
                return BadRequest(error);
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
                var error = new { error = new CinemaProject.Server.DTOs.ApiError {
                    Code = "BadRequest",
                    Message = ex.Message,
                    Target = null,
                    Details = null
                }};
                return BadRequest(error);
            }
        }
    }
}
