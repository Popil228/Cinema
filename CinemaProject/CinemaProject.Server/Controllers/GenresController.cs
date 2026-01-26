using CinemaProject.Server.Data;
using CinemaProject.Server.Models.Entitys;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CinemaProject.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GenresController : Controller
    {
        private readonly CinemaDbContext _context;

        public GenresController(CinemaDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Genre>>> GetAllGenre()
        {
            var genres = await _context.Genres.ToListAsync();
            return Ok(genres);
        }
    }
}
