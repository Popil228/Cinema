using CinemaProject.Server.Data;
using CinemaProject.Server.Models.Entitys;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CinemaProject.Server.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace CinemaProject.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HallsController : ControllerBase
    {
        private readonly CinemaDbContext _context;

        public HallsController(CinemaDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Hall>>> GetAll()
        {
            var halls = await _context.Halls.ToListAsync();
            return Ok(halls);
        }

        [HttpPost]
        [Authorize(Policy = "ManageHalls")]
        public async Task<ActionResult<Hall>> Create([FromBody] string name)
        {
            var hall = new Hall { Name = name };
            _context.Halls.Add(hall);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAll), new { id = hall.HallId }, hall);
        }

        [HttpPost("init")]
        [Authorize(Policy = "ManageHalls")]
        public async Task<ActionResult> InitDefaultHalls()
        {
            var existingHalls = await _context.Halls.AnyAsync();
            if (existingHalls)
            {
                return Ok(new { message = "Зали вже існують", halls = await _context.Halls.ToListAsync() });
            }

            var hallA = new Hall { Name = "Зал A" };
            var hallB = new Hall { Name = "Зал B" };

            _context.Halls.AddRange(hallA, hallB);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Зали створено", halls = new[] { hallA, hallB } });
        }
    }
}
