using CinemaProject.Server.Data;
using CinemaProject.Server.DTOs.MovieActor;
using Microsoft.EntityFrameworkCore;

namespace CinemaProject.Server.Services
{
    public class MovieActorService : IMovieActorService
    {
        private readonly CinemaDbContext _context;

        public MovieActorService(CinemaDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Updates the character information for an actor in a specified movie, or adds the actor to the movie if not
        /// already associated.
        /// </summary>
        /// <remarks>If the specified movie or actor does not exist, the operation fails and the response
        /// contains an appropriate error message. If the actor is not already associated with the movie, a new
        /// association is created.</remarks>
        /// <param name="request">An object containing the movie and actor identifiers, along with the character name to be updated or added.
        /// Cannot be null.</param>
        /// <returns>A response indicating whether the update or addition was successful, including a success flag and a
        /// descriptive message.</returns>
        public async Task<MovieActorResponse> UpdateMovieActorsAsync(MovieActorDto request)
        {

            if (request == null)
            {
                return new MovieActorResponse
                {
                    Success = false,
                    Message = "Некоректні дані"
                };
            }

            var movieExists = await _context.Movies.AsNoTracking()
                .AnyAsync(m => m.MovieId == request.movieId);

            if (!movieExists)
            {
                return new MovieActorResponse
                {
                    Success = false,
                    Message = "Фільм не знайдено"
                };
            }

            var actorExists = await _context.Actors.AsNoTracking()
                .AnyAsync(a => a.ActorId == request.actorId);

            if (!actorExists)
            {
                return new MovieActorResponse
                {
                    Success = false,
                    Message = "Актор не знайдений"
                };
            }

            var movieActor = await _context.MovieActors
                .FirstOrDefaultAsync(ma =>
                    ma.MovieId == request.movieId &&
                    ma.ActorId == request.actorId);

            if (movieActor == null)
            {
                movieActor = new Models.Entitys.MovieActor
                {
                    MovieId = request.movieId,
                    ActorId = request.actorId,
                    Character = request.Character
                };
                _context.MovieActors.Add(movieActor);
            }
            else
            {
                movieActor.Character = request.Character;
            }

            await _context.SaveChangesAsync();

            return new MovieActorResponse
            {
                Success = true,
                Message = "Роль актор успішно оновлена у фільмі"
            };
        }
    }
}
