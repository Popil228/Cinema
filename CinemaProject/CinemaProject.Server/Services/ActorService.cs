using CinemaProject.Server.Data;
using CinemaProject.Server.DTOs.Actor;
using Microsoft.EntityFrameworkCore;

namespace CinemaProject.Server.Services
{
    public class ActorService : IActorService
    {
        private readonly CinemaDbContext _context;

        public ActorService(CinemaDbContext context)
        {
            _context = context;
        }

        public async Task<ActorResponse> UpdateActorAsync(ActorDto request, int movieId)
        {
            var actor = await _context.Actors
                .FirstOrDefaultAsync(a => a.ActorId == request.Id);

            if (actor == null)
            {
                actor = new Models.Entitys.Actor
                {
                    ActorId = request.Id,
                    FullName = request.Name,
                    PhotoUri = request.PhotoUri
                };
                _context.Actors.Add(actor);
            }
            else
            {
                actor.FullName = request.Name;
                actor.PhotoUri = request.PhotoUri;
            }

            if(await _context.Movies.AsNoTracking().AnyAsync(m => m.MovieId == movieId))
            {
                var movieActor = await _context.MovieActors
                .FirstOrDefaultAsync(ma =>
                    ma.MovieId == movieId &&
                    ma.ActorId == request.Id);

                if (movieActor == null)
                {
                    movieActor = new Models.Entitys.MovieActor
                    {
                        MovieId = movieId,
                        ActorId = request.Id,
                        Character = request.Role
                    };
                    _context.MovieActors.Add(movieActor);
                }
                else
                {
                    movieActor.Character = request.Role;
                }
            }

            await _context.SaveChangesAsync();

            return new ActorResponse
            {
                Success = true,
                Message = "Актор успішно оновлений"
            };
        }


    }
}
