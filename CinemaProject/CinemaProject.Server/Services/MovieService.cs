using CinemaProject.Server.Data;
using CinemaProject.Server.DTOs.Genre;
using CinemaProject.Server.DTOs.Movie;
using CinemaProject.Server.DTOs.MovieActor;
using CinemaProject.Server.Interfaces;
using CinemaProject.Server.Models.Entitys;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.Internal;
using System.Data;
using CinemaProject.Server.Interfaces;

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
        /// /// <param name="onlyShowingNow">If true - will return only movies with sessions set in future,
        /// otherwise all movies in db</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a list of <see cref="MovieDto"/>
        /// objects, each representing a movie with its associated genres and actors. The list is empty if no movies are
        /// found.</returns>
        public async Task<List<MovieDto>> GetAllMoviesAsync(bool onlyShowingNow)
        {
            List<int>? rollingMoviesId = null;
            if (onlyShowingNow)
            {
                rollingMoviesId = await _context.Sessions
                    .Where(s => s.StartTime.Date >= DateTime.UtcNow.Date)
                    .Select(s => s.MovieId)
                    .Distinct()
                    .ToListAsync();

                if (!rollingMoviesId.Any())
                {
                    throw new Exception("В БД немає майбутніх сеансів");
                }
            }

            var movies = await _context.Movies
                .Where(m => onlyShowingNow ? rollingMoviesId.Contains(m.MovieId) : true)
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
        /// Creates a new movie record asynchronously using the specified movie details.
        /// </summary>
        /// <remarks>If a movie with the same identifier already exists, the operation will not create a
        /// duplicate and will return a response indicating failure.</remarks>
        /// <param name="request">An object containing the details of the movie to create. Cannot be null.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a MovieResponse indicating
        /// whether the movie was created successfully and includes a message describing the outcome.</returns>
        public async Task<MovieResponse> CreateMovieAsync(ShortMovieDto request)
        {
            if (request == null)
            {
                return new MovieResponse
                {
                    Success = false,
                    Message = "Некоректні дані фільму"
                };
            }

            if (await _context.Movies.AnyAsync(m => m.MovieId == request.Id))
            {
                return new MovieResponse
                {
                    Success = false,
                    Message = "Такий фільм вже наявний в БД"
                };
            }

            var movie = new Models.Entitys.Movie
            {
                MovieId = request.Id,
                Title = request.Title,
                ReleaseDate = ToUtc(request.ReleaseDate),
                PosterUri = string.IsNullOrWhiteSpace(request.PosterPath)
                    ? null
                    : request.PosterPath,
                Description = request?.Overview,
                Duration = request?.Runtime > 0 
                    ? (short)request.Runtime 
                    : (short)0
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
        public async Task<MovieResponse> UpdateMovieAsync(ShortMovieDto request)
        {
            if (request == null)
            {
                return new MovieResponse
                {
                    Success = false,
                    Message = "Некоректні дані фільму"
                };
            }

            if (!await _context.Movies.AsNoTracking().AnyAsync(m => m.MovieId == request.Id))
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
                .FirstOrDefaultAsync(m => m.MovieId == request.Id);

            movie.Title = request.Title;
            movie.ReleaseDate = ToUtc(request.ReleaseDate);
            movie.PosterUri = string.IsNullOrWhiteSpace(request.PosterPath)
                    ? null
                    : request.PosterPath;
            movie.Description = request?.Overview;
            movie.Duration = request?.Runtime > 0 
                ? (short)request.Runtime 
                : (short)0;

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

    }
}
