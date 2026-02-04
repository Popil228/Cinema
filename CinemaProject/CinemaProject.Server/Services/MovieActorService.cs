using CinemaProject.Server.Data;
using CinemaProject.Server.DTOs.MovieActor;
using Microsoft.EntityFrameworkCore;
using CinemaProject.Server.Interfaces;

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
        /// Creates associations between a movie and one or more actors asynchronously.
        /// </summary>
        /// <remarks>If any actor specified in the request does not exist, or if the movie does not exist,
        /// the operation will not create any associations and the response will indicate failure. Actors already
        /// associated with the movie will be ignored. Only new associations are created.</remarks>
        /// <param name="request">A list of movie-actor data transfer objects specifying the movie and actors to associate. The list must not
        /// be null or empty, and all actors must exist in the database.</param>
        /// <returns>A MovieActorResponse indicating the result of the operation. The response contains a success flag and a
        /// message describing the outcome.</returns>
        public async Task<MovieActorResponse> CreateMovieActorsAsync(List<MovieActorDto> request)
        {
            if (request == null || request.Count == 0)
            {
                return new MovieActorResponse
                {
                    Success = false,
                    Message = "Список акторів порожній"
                };
            }

            var movieId = request.First().movieId;

            var movieExists = await _context.Movies
                .AsNoTracking()
                .AnyAsync(m => m.MovieId == movieId);

            if (!movieExists)
            {
                return new MovieActorResponse
                {
                    Success = false,
                    Message = "Фільм не знайдено"
                };
            }

            var actorIds = request.Select(r => r.actorId).Distinct().ToList();

            var existingActorIds = await _context.Actors
                .AsNoTracking()
                .Where(a => actorIds.Contains(a.ActorId))
                .Select(a => a.ActorId)
                .ToListAsync();

            if (existingActorIds.Count != actorIds.Count)
            {
                return new MovieActorResponse
                {
                    Success = false,
                    Message = "Один або більше акторів не знайдені"
                };
            }

            var existingLinks = await _context.MovieActors
                .Where(ma => ma.MovieId == movieId && actorIds.Contains(ma.ActorId))
                .Select(ma => ma.ActorId)
                .ToListAsync();

            var newLinks = request
                .Where(r => !existingLinks.Contains(r.actorId))
                .Select(r => new Models.Entitys.MovieActor
                {
                    MovieId = r.movieId,
                    ActorId = r.actorId,
                    Character = r.Character
                })
                .ToList();

            if (newLinks.Count == 0)
            {
                return new MovieActorResponse
                {
                    Success = true,
                    Message = "Усі актори вже привʼязані до фільму"
                };
            }

            _context.MovieActors.AddRange(newLinks);
            await _context.SaveChangesAsync();

            return new MovieActorResponse
            {
                Success = true,
                Message = $"Додано акторів: {newLinks.Count}"
            };
        }

        /// <summary>
        /// Updates the character roles of actors in movies based on the provided list of movie-actor associations.
        /// </summary>
        /// <remarks>All specified movies and actors must exist, and each actor must already be associated
        /// with the corresponding movie. If any movie or actor is not found, or if an actor is not linked to a movie,
        /// the operation fails and returns an appropriate message.</remarks>
        /// <param name="request">A list of movie-actor data transfer objects specifying the movies, actors, and their updated character
        /// roles. Cannot be null or empty.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a MovieActorResponse indicating
        /// whether the update was successful and providing a descriptive message.</returns>
        public async Task<MovieActorResponse> UpdateMovieActorsAsync(List<MovieActorDto> request)
        {
            if (request == null || request.Count == 0)
            {
                return new MovieActorResponse
                {
                    Success = false,
                    Message = "Список ролей порожній"
                };
            }

            var movieId = request.First().movieId;

            var movieExists = await _context.Movies
                .AsNoTracking()
                .AnyAsync(m => m.MovieId == movieId);

            if (!movieExists)
            {
                return new MovieActorResponse
                {
                    Success = false,
                    Message = $"Фільм {movieId} не знайдено"
                };
            }

            var actorIds = request.Select(r => r.actorId).Distinct().ToList();

            var existingActors = await _context.Actors
                .Where(a => actorIds.Contains(a.ActorId))
                .Select(a => a.ActorId)
                .ToListAsync();

            var missingActors = actorIds.Except(existingActors).ToList();
            if (missingActors.Any())
            {
                return new MovieActorResponse
                {
                    Success = false,
                    Message = $"Актори не знайдені: {string.Join(", ", missingActors)}"
                };
            }

            var currentMovieActors = await _context.MovieActors
                .Where(ma => ma.MovieId == movieId)
                .ToListAsync();

            var toRemove = currentMovieActors
                .Where(ma => !actorIds.Contains(ma.ActorId)) 
                .ToList();
            _context.MovieActors.RemoveRange(toRemove);

            foreach (var dto in request)
            {
                var existing = currentMovieActors.FirstOrDefault(ma => ma.ActorId == dto.actorId);
                if (existing != null)
                {
                    existing.Character = dto.Character;
                }
                else
                {
                    _context.MovieActors.Add(new Models.Entitys.MovieActor
                    {
                        MovieId = movieId,
                        ActorId = dto.actorId,
                        Character = dto.Character
                    });
                }
            }

            await _context.SaveChangesAsync();

            return new MovieActorResponse
            {
                Success = true,
                Message = "Ролі акторів успішно оновлені у фільмі"
            };
        }

        /// <summary>
        /// Asynchronously removes the association between a specified actor and movie.
        /// </summary>
        /// <param name="request">An object containing the identifiers of the movie and actor whose association is to be deleted. Cannot be
        /// null.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a MovieActorResponse indicating
        /// whether the association was successfully removed, or providing an error message if the operation could not
        /// be completed.</returns>
        public async Task<MovieActorResponse> DeleteMovieActorsAsync(MovieActorDto request)
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
                    Message = "Актор не пов'язаний з фільмом."
                };
            }
            else
            {
                _context.MovieActors.Remove(movieActor);
            }

            await _context.SaveChangesAsync();

            return new MovieActorResponse
            {
                Success = true,
                Message = "Актор видалений з фільму успішно"
            };
        }
    }
}
