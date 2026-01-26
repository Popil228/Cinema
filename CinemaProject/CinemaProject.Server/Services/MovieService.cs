using CinemaProject.Server.Data;
using CinemaProject.Server.DTOs.Genre;
using CinemaProject.Server.DTOs.Movie;
using CinemaProject.Server.Models.Entitys;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace CinemaProject.Server.Services
{
    public class MovieService : IMovieService
    {
        private readonly CinemaDbContext _context;
        
        public MovieService(CinemaDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Asynchronously retrieves all movies, including their genres and actors, as data transfer objects.
        /// </summary>
        /// <returns>A task that represents the asynchronous operation. The task result contains a list of <see cref="MovieDto"/>
        /// objects, each representing a movie with its associated genres and actors. The list is empty if no movies are
        /// found.</returns>
        public async Task<List<MovieDto>> GetAllMoviesAsync()
        {
            var movies = await _context.Movies
                .Include(m => m.MovieGenres)
                    .ThenInclude(mg => mg.Genre)
                .Include(m => m.MovieActors)
                    .ThenInclude(ma => ma.Actor)
                .ToListAsync();

            var result = movies.Select(m => new MovieDto
            {
                MainInfo = new MovieMainInfoDto
                {
                    Id = m.MovieId,
                    Title = m.Title,
                    ReleaseDate = m.ReleaseDate,
                    PosterPath = m.PosterUri
                },
                ExtraInfo = new MovieExtraInfoDto
                {
                    Overview = m.Description,
                    Runtime = m.Duration,
                    Genres = m.MovieGenres.Select(mg => new GenreDto
                    {
                        Id = mg.Genre.GenreId,
                        Name = mg.Genre.Name
                    }).ToList(),
                    Actors = m.MovieActors.Select(ma => new CastDto
                    {
                        Id = ma.Actor.ActorId,
                        Name = ma.Actor.FullName,
                        Role = ma.Character,
                        PhotoUri = ma.Actor.PhotoUri
                    }).ToList()
                }
            }).ToList();

            if (!result.Any())
            {
                throw new Exception("Фільмів в БД не знайдено");
            }

            return result;
        }

        /// <summary>
        /// Asynchronously retrieves all movies that have sessions assigned in the future, including their genres and actors, as data transfer objects.
        /// </summary>
        /// <returns>A task that represents the asynchronous operation. The task result contains a list of <see cref="MovieDto"/>
        /// objects, each representing a movie with its associated genres and actors. The list is empty if no movies are
        /// found.</returns>
        public async Task<List<MovieDto>> GetAllRollingMoviesAsync()
        {
            var rollingMoviesId = await _context.Sessions
                .Where(s => s.StartTime.Date >= DateTime.UtcNow.Date)
                .Select(s => s.MovieId)
                .Distinct()
                .ToListAsync();
            
            if(!rollingMoviesId.Any())
            {
                throw new Exception("В БД немає майбутніх сеансів");
            }

            var movies = await _context.Movies
                .Where(m=>rollingMoviesId.Contains(m.MovieId))
                .Include(m => m.MovieGenres)
                    .ThenInclude(mg => mg.Genre)
                .Include(m => m.MovieActors)
                    .ThenInclude(ma => ma.Actor)
                .ToListAsync();
            

            var result = movies.Select(m => new MovieDto
            {
                MainInfo = new MovieMainInfoDto
                {
                    Id = m.MovieId,
                    Title = m.Title,
                    ReleaseDate = m.ReleaseDate,
                    PosterPath = m.PosterUri
                },
                ExtraInfo = new MovieExtraInfoDto
                {
                    Overview = m.Description,
                    Runtime = m.Duration,
                    Genres = m.MovieGenres.Select(mg => new GenreDto
                    {
                        Id = mg.Genre.GenreId,
                        Name = mg.Genre.Name
                    }).ToList(),
                    Actors = m.MovieActors.Select(ma => new CastDto
                    {
                        Id = ma.Actor.ActorId,
                        Name = ma.Actor.FullName,
                        Role = ma.Character,
                        PhotoUri = ma.Actor.PhotoUri
                    }).ToList()
                }
            }).ToList();

            if (!result.Any())
            {
                throw new Exception("Фільмів в БД не знайдено");
            }

            return result;
        }

        /// <summary>
        /// Asynchronously retrieves requested movie data.
        /// </summary>
        /// <param name="id">Id of a movie in db. Cannot
        /// be null.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a <see cref="MovieDto"/> object 
        /// that contains information about movie.</returns>
        public async Task<MovieDto> GetMovieByIdAsync(int id)
        {
            Movie movie;
            try
            {
                movie = await _context.Movies
                    .Where(m => m.MovieId == id)
                    .Include(m => m.MovieGenres)
                        .ThenInclude(mg => mg.Genre)
                    .Include(m => m.MovieActors)
                        .ThenInclude(ma => ma.Actor)
                    .FirstAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"Фільм з id: {id} відсутній");
            }

            MovieDto result = new MovieDto
            {
                MainInfo = new MovieMainInfoDto
                {
                    Id = movie.MovieId,
                    Title = movie.Title,
                    ReleaseDate = movie.ReleaseDate,
                    PosterPath = movie.PosterUri
                },
                ExtraInfo = new MovieExtraInfoDto
                {
                    Overview = movie.Description,
                    Runtime = movie.Duration,
                    Genres = movie.MovieGenres.Select(mg => new GenreDto
                    {
                        Id = mg.Genre.GenreId,
                        Name = mg.Genre.Name
                    }).ToList(),
                    Actors = movie.MovieActors.Select(ma => new CastDto
                    {
                        Id = ma.Actor.ActorId,
                        Name = ma.Actor.FullName,
                        Role = ma.Character,
                        PhotoUri = ma.Actor.PhotoUri
                    }).ToList()
                }

            };

            return result;
        }

        /// <summary>
        /// Asynchronously adds a new movie to the database if it does not already exist.
        /// </summary>
        /// <param name="request">An object containing the details of the movie to add, including main information and extra metadata. Cannot
        /// be null.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a MovieResponse indicating
        /// whether the movie was successfully added and providing a relevant message.</returns>
        public async Task<MovieResponse> AddMovieAsync(MovieDto request)
        {
            if (request.MainInfo == null || request.ExtraInfo == null)
            {
                return new MovieResponse
                {
                    Success = false,
                    Message = "Некоректні дані фільму"
                };
            }

            if (await _context.Movies.AnyAsync(m => m.MovieId == request.MainInfo.Id))
            {
                return new MovieResponse
                {
                    Success = false,
                    Message = "Такий фільм вже наявний в БД"
                };
            }

            // Genres
            var resultGenres = await CreateGenresToLinkAsync(request);
            if (!resultGenres.Success)
                return new MovieResponse { Success = false, Message = resultGenres.Message };

            // Actors
            var resultActors = await CreateActorsToLinkAsync(request);
            if (!resultActors.Success)
                return new MovieResponse { Success = false, Message = resultActors.Message };

            // Movie
            var movie = new Models.Entitys.Movie
            {
                MovieId = request.MainInfo.Id,
                Title = request.MainInfo.Title,
                ReleaseDate = ToUtc(request.MainInfo.ReleaseDate),
                PosterUri = request.MainInfo.PosterPath,
                Description = request.ExtraInfo?.Overview,
                Duration = request.ExtraInfo?.Runtime > 0 ? (short)request.ExtraInfo.Runtime : (short)0,

                MovieGenres = resultGenres.Genres.Select(g => new Models.Entitys.MovieGenre { Genre = g }).ToList(),
                MovieActors = resultActors.Actors.Select(a =>
                {
                    var actorDto = request.ExtraInfo.Actors.First(ad => ad.Id == a.ActorId);
                    return new Models.Entitys.MovieActor
                    {
                        Actor = a,
                        Character = actorDto.Role
                    };
                }).ToList()
            };

            _context.Movies.Add(movie);
            await _context.SaveChangesAsync();

            return new MovieResponse
            {
                Success = true,
                Message = "Фільм додано успішно"
            };
        }

        /// <summary>
        /// Asynchronously deletes the movie with the specified identifier, including its associated actors and genres.
        /// </summary>
        /// <param name="movieId">The unique identifier of the movie to delete.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a MovieResponse indicating
        /// whether the deletion was successful and providing a related message.</returns>
        public async Task<MovieResponse> DeleteMovieAsync(int Id)
        {
            var movie = await _context.Movies
                .Include(m => m.MovieActors)
                .Include(m => m.MovieGenres)
                .FirstOrDefaultAsync(m => m.MovieId == Id);
            if (movie == null)
            {
                return new MovieResponse
                {
                    Success = false,
                    Message = "Фільм не знайдено"
                };
            }
            _context.MovieActors.RemoveRange(movie.MovieActors);
            _context.MovieGenres.RemoveRange(movie.MovieGenres);
            _context.Movies.Remove(movie);
            await _context.SaveChangesAsync();
            return new MovieResponse
            {
                Success = true,
                Message = "Фільм успішно видалено"
            };
        }

        /// <summary>
        /// Updates the details of an existing movie in the database using the specified movie data.
        /// </summary>
        /// <remarks>The method updates the movie's main information, genres, and actors. If the specified
        /// movie does not exist, the operation fails and returns a response indicating the error. All existing genre
        /// and actor associations for the movie are replaced with the new data provided in the request.</remarks>
        /// <param name="request">An object containing the updated information for the movie, including main details, genres, and actors. The
        /// movie to update is identified by the ID in <paramref name="request.MainInfo.Id"/>.</param>
        /// <returns>A <see cref="MovieResponse"/> indicating whether the update was successful. If the movie is not found or the
        /// update fails, the response contains an appropriate error message.</returns>
        public async Task<MovieResponse> UpdateMovieAsync(MovieDto request)
        {
            if (request.MainInfo == null || request.ExtraInfo == null)
            {
                return new MovieResponse
                {
                    Success = false,
                    Message = "Некоректні дані фільму"
                };
            }

            if (!await _context.Movies.AsNoTracking().AnyAsync(m => m.MovieId == request.MainInfo.Id))
            {
                return new MovieResponse
                {
                    Success = false,
                    Message = "Фільм не знайдено в базі даних"
                };
            }

            var movie = await _context.Movies
                .Include(m => m.MovieGenres)
                .Include(m => m.MovieActors)
                .FirstOrDefaultAsync(m => m.MovieId == request.MainInfo.Id);

            movie.Title = request.MainInfo.Title;
            movie.ReleaseDate = ToUtc(request.MainInfo.ReleaseDate);
            movie.PosterUri = request.MainInfo.PosterPath;
            movie.Description = request.ExtraInfo?.Overview;
            movie.Duration = request.ExtraInfo?.Runtime > 0 ? (short)request.ExtraInfo.Runtime : (short)0;

            // Genres
            var resultGenres = await CreateGenresToLinkAsync(request);
            if (!resultGenres.Success)
                return new MovieResponse { Success = false, Message = resultGenres.Message };

            // Actors
            var resultActors = await CreateActorsToLinkAsync(request);
            if (!resultActors.Success)
                return new MovieResponse { Success = false, Message = resultActors.Message };

            // Clear existing relations
            movie.MovieGenres.Clear();
            movie.MovieActors.Clear();

            // Add updated relations
            movie.MovieGenres = resultGenres.Genres
                .Select(g => new Models.Entitys.MovieGenre { Genre = g })
                .ToList();

            movie.MovieActors = resultActors.Actors
                .Select(a =>
                {
                    CastDto actorDto = request.ExtraInfo.Actors.First(ad => ad.Id == a.ActorId);
                    return new Models.Entitys.MovieActor
                    {
                        Actor = a,
                        Character = actorDto.Role
                    };
                })
                .ToList();

            await _context.SaveChangesAsync();
            return new MovieResponse
            {
                Success = true,
                Message = "Фільм успішно оновлено"
            };

        }

        /// <summary>
        /// Converts the specified <see cref="DateTime"/> value to a UTC <see cref="DateTimeKind"/> without changing the
        /// time value.
        /// </summary>
        /// <remarks>This method does not perform any time zone conversion; it only sets the <see
        /// cref="DateTime.Kind"/> property to <see cref="DateTimeKind.Utc"/>. Use this method when you know the input
        /// value represents a UTC time but is not marked as such.</remarks>
        /// <param name="date">The date and time value to convert. The <see cref="DateTimeKind"/> of this value is ignored.</param>
        /// <returns>A <see cref="DateTime"/> value with the same date and time as <paramref name="date"/>, but with the <see
        /// cref="DateTime.Kind"/> property set to <see cref="DateTimeKind.Utc"/>.</returns>
        private static DateTime ToUtc(DateTime date)
            => DateTime.SpecifyKind(date, DateTimeKind.Utc);

        /// <summary>
        /// Attempts to find and prepare the list of genres to associate with a movie based on the provided request
        /// data.
        /// </summary>
        /// <param name="request">The movie data transfer object containing genre information to be linked. Must not be null and must contain
        /// a valid list of genres in the ExtraInfo property.</param>
        /// <returns>A tuple containing a success flag, an optional error message, and a list of genres to link. If all genres
        /// are found, Success is set to true, Message is null, and Genres contains the matched genres. If any genre is
        /// not found, Success is false, Message contains an error description, and Genres is null.</returns>
        private async Task<(bool Success, string? Message, List<Models.Entitys.Genre> Genres)> CreateGenresToLinkAsync(MovieDto request)
        {
            var genreIds = request.ExtraInfo.Genres
                .Select(g => g.Id)
                .Distinct()
                .ToList();

            var genres = await _context.Genres
                .Where(g => genreIds.Contains(g.GenreId))
                .ToListAsync();

            if (genres.Count != genreIds.Count)
            {
                var missingIds = genreIds
                    .Except(genres.Select(g => g.GenreId));

                return (
                    false,
                    $"Жанр(и) з Id {string.Join(", ", missingIds)} не знайдено в базі даних",
                    null
                );
            }

            return (true, null, genres);
        }

        /// <summary>
        /// Creates or retrieves actor entities to be linked to the specified movie based on the provided actor
        /// information.
        /// </summary>
        /// <remarks>Existing actors are matched by ID or full name. New actors are created if no match is
        /// found. The returned list includes both existing and newly created actors.</remarks>
        /// <param name="request">A data transfer object containing details about the movie and the actors to be linked.</param>
        /// <returns>A tuple containing a value indicating whether the operation was successful, an optional message, and a list
        /// of actor entities to be linked to the movie.</returns>
        private async Task<(bool Success, string? Message, List<Models.Entitys.Actor> Actors)> CreateActorsToLinkAsync(MovieDto request)
        {
            if (request.ExtraInfo?.Actors == null || !request.ExtraInfo.Actors.Any())
            {
                return (true, null, new List<Models.Entitys.Actor>());
            }

            var actorDtos = request.ExtraInfo.Actors
                .GroupBy(a => a.Id)
                .Select(g => g.First())
                .ToList();

            var actorIds = actorDtos.Select(a => a.Id).ToList();

            var existingActors = await _context.Actors
                .Where(a => actorIds.Contains(a.ActorId))
                .ToListAsync();

            var actorsToLink = new List<Models.Entitys.Actor>();

            foreach (var actorDto in actorDtos)
            {
                var actor = existingActors
                    .FirstOrDefault(a => a.ActorId == actorDto.Id);

                if (actor != null)
                {
                    actorsToLink.Add(actor);
                    continue;
                }

                var newActor = new Models.Entitys.Actor
                {
                    ActorId = actorDto.Id,
                    FullName = actorDto.Name,
                    PhotoUri = actorDto.PhotoUri
                };

                _context.Actors.Add(newActor);
                actorsToLink.Add(newActor);
            }

            return (true, null, actorsToLink);

        }
    }
}
