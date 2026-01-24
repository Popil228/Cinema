using CinemaProject.Server.Data;
using CinemaProject.Server.DTOs.Genre;
using CinemaProject.Server.DTOs.Movie;
using CinemaProject.Server.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CinemaProject.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MoviesController : ControllerBase
    {
        private readonly IMovieService _movieService;
        private readonly CinemaDbContext _context;

        public MoviesController(IMovieService movieService, CinemaDbContext context)
        {
            _movieService = movieService;
            _context = context;
        }

        [HttpGet("get_all_movie")]
        public async Task<IActionResult> GetAllMovies()
        {
            var movies = await _context.Movies
                .Include(m => m.MovieGenres)
                    .ThenInclude(mg => mg.Genre)
                .Include(m => m.MovieActors)
                    .ThenInclude(ma => ma.Actor)
                .Select(m => new MovieDto
                {
                    MainInfo = new MovieMainInfoDto
                    {
                        Id = m.MovieId,
                        Title = m.Title,
                        ReleaseDate = m.ReleaseDate.HasValue ? m.ReleaseDate.Value.ToString("yyyy-MM-dd") : "",
                        PosterPath = m.PosterUri
                    },
                    ExtraInfo = new MovieExtraInfoDto
                    {
                        Runtime = m.Duration,
                        Overview = m.Description ?? "",
                        Genres = m.MovieGenres.Select(mg => new GanreDto 
                        { 
                            Id = mg.Genre.GenreId, 
                            Name = mg.Genre.Name 
                        }).ToList(),
                        Actors = m.MovieActors.Select(ma => new DTOs.Actor.ActorDto
                        {
                            Id = ma.Actor.ActorId,
                            Name = ma.Actor.FullName,
                            Role = ma.Character ?? ""
                        }).ToList()
                    }
                })
                .ToListAsync();

            return Ok(movies);
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
