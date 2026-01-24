using CinemaProject.Server.Data;
using CinemaProject.Server.DTOs.MovieActor;
using CinemaProject.Server.Models;
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
        /// Adds an actor to a movie asynchronously using the provided actor and movie information.
        /// </summary>
        /// <remarks>Returns a failure response if the specified movie or actor does not exist. The
        /// operation is performed asynchronously and updates the database upon success.</remarks>
        /// <param name="request">An object containing the details of the actor, the movie, and the character name to associate. Cannot be
        /// null.</param>
        /// <returns>A response indicating whether the actor was successfully added to the movie. The response includes a success
        /// flag and a message describing the result.</returns>
        public async Task<MovieActorResponse> CreateMovieActorAsync(MovieActorDto request)
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

            var movieActor = new Models.Entitys.MovieActor
            {
                MovieId = request.movieId,
                ActorId = request.actorId,
                Character = request.Character
            };

            _context.MovieActors.Add(movieActor);
            await _context.SaveChangesAsync();

            return new MovieActorResponse
            {
                Success = true,
                Message = "Актор успішно доданий до фільму"
            };
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
                return new MovieActorResponse
                {
                    Success = false,
                    Message = "Актор не пов'язаний з фільмом. Додайте актора до фільму перед оновленням ролі."
                };
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
