using CinemaProject.Server.DTOs.MovieActor;
using CinemaProject.Server.DTOs.MovieGenre;
using CinemaProject.Server.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CinemaProject.Server.Models.Enums;
using CinemaProject.Server.Interfaces;


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
        [Authorize(Policy = "ManageMovieRelations")]
        public async Task<ActionResult<MovieGenreResponse>> CreateMovieGenres([FromBody] List<MovieGenreDto> request)
        {
            if (!ModelState.IsValid)
            {
                var error = new { error = new DTOs.ApiError {
                    Code = "BadRequest",
                    Message = "Невалідні дані",
                    Target = null,
                    Details = null
                }};
                return BadRequest(error);
            }

            var result = await _movieGenreService.CreateMovieGenresAsync(request);

            if (!result.Success)
            {
                var error = new { error = new DTOs.ApiError {
                    Code = "BadRequest",
                    Message = result.Message,
                    Target = null,
                    Details = null
                }};
                return BadRequest(error);
            }

            return Ok(result);
        }

        [HttpPut]
        [Authorize(Policy = "ManageMovieRelations")]
        public async Task<ActionResult<MovieGenreResponse>> UpdateMovieGenres([FromBody] List<MovieGenreDto> request)
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

            var result = await _movieGenreService.UpdateMovieGenresAsync(request);

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
