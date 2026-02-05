using CinemaProject.Server.Data;
using CinemaProject.Server.DTOs.MovieGenre;
using CinemaProject.Server.Interfaces;
using Microsoft.EntityFrameworkCore;
using CinemaProject.Server.Interfaces;

namespace CinemaProject.Server.Services
{
    public class MovieGenreService : IMovieGenreService
    {
        private readonly CinemaDbContext _context;

        public MovieGenreService(CinemaDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Creates associations between a movie and one or more genres asynchronously.
        /// </summary>
        /// <remarks>If any of the specified genres are already linked to the movie, they will be ignored
        /// and the operation will succeed for the remaining genres. The method does not remove existing associations.
        /// The operation is performed as a single database transaction.</remarks>
        /// <param name="request">A list of genre data transfer objects specifying the genres to associate with a movie. The list must not be
        /// null or empty, and all items must reference the same movie.</param>
        /// <returns>A MovieGenreResponse indicating whether the operation succeeded and providing a descriptive message. If the
        /// movie or any specified genres do not exist, or if the genres are already associated, the response reflects
        /// the appropriate status.</returns>
        public async Task<MovieGenreResponse> CreateMovieGenresAsync(List<MovieGenreDto> request)
        {
            if (request == null || request.Count == 0)
            {
                return new MovieGenreResponse
                {
                    Success = false,
                    Message = "Список жанрів порожній"
                };
            }

            var movieId = request.First().movieId;

            var movieExists = await _context.Movies
                .AsNoTracking()
                .AnyAsync(m => m.MovieId == movieId);

            if (!movieExists)
            {
                return new MovieGenreResponse
                {
                    Success = false,
                    Message = "Фільм не знайдено"
                };
            }

            var genreIds = request.Select(r => r.genreId).Distinct().ToList();

            var existingGenreIds = await _context.Genres
                .AsNoTracking()
                .Where(g => genreIds.Contains(g.GenreId))
                .Select(g => g.GenreId)
                .ToListAsync();

            if (existingGenreIds.Count != genreIds.Count)
            {
                return new MovieGenreResponse
                {
                    Success = false,
                    Message = "Один або кілька жанрів не знайдено"
                };
            }

            var alreadyLinkedGenreIds = await _context.MovieGenres
                .AsNoTracking()
                .Where(mg => mg.MovieId == movieId)
                .Select(mg => mg.GenreId)
                .ToListAsync();

            var newMovieGenres = genreIds
                .Where(id => !alreadyLinkedGenreIds.Contains(id))
                .Select(id => new Models.Entitys.MovieGenre
                {
                    MovieId = movieId,
                    GenreId = id
                })
                .ToList();

            if (newMovieGenres.Count == 0)
            {
                return new MovieGenreResponse
                {
                    Success = true,
                    Message = "Жанри вже прив'язані до фільму"
                };
            }

            _context.MovieGenres.AddRange(newMovieGenres);
            await _context.SaveChangesAsync();

            return new MovieGenreResponse
            {
                Success = true,
                Message = "Жанри успішно додані до фільму"
            };
        }

        /// <summary>
        /// Updates the genres associated with a movie based on the provided list of genre assignments.
        /// </summary>
        /// <remarks>If the specified movie does not exist, or if any of the provided genre IDs are
        /// invalid, the operation fails and the response includes a descriptive error message. Existing genre
        /// associations for the movie are replaced with the new set provided.</remarks>
        /// <param name="request">A list of genre assignment data transfer objects specifying the movie and the genres to associate with it.
        /// The list must not be null or empty, and all items must refer to the same movie.</param>
        /// <returns>A MovieGenreResponse indicating whether the update was successful. If the operation fails, the response
        /// contains an appropriate error message.</returns>
        public async Task<MovieGenreResponse> UpdateMovieGenresAsync(List<MovieGenreDto> request)
        {
            if (request == null || request.Count == 0)
            {
                return new MovieGenreResponse
                {
                    Success = false,
                    Message = "Список жанрів порожній"
                };
            }

            var movieId = request.First().movieId;

            var movieExists = await _context.Movies
                .AsNoTracking()
                .AnyAsync(m => m.MovieId == movieId);

            if (!movieExists)
            {
                return new MovieGenreResponse
                {
                    Success = false,
                    Message = "Фільм не знайдено"
                };
            }

            var genreIds = request.Select(r => r.genreId).Distinct().ToList();
            var existingGenreIds = await _context.Genres
                .AsNoTracking()
                .Where(g => genreIds.Contains(g.GenreId))
                .Select(g => g.GenreId)
                .ToListAsync();

            var missingGenres = genreIds.Except(existingGenreIds).ToList();
            if (missingGenres.Any())
            {
                return new MovieGenreResponse
                {
                    Success = false,
                    Message = $"Жанри не знайдено: {string.Join(", ", missingGenres)}"
                };
            }

            var currentMovieGenres = await _context.MovieGenres
                .Where(mg => mg.MovieId == movieId)
                .ToListAsync();

            _context.MovieGenres.RemoveRange(currentMovieGenres);

            var newMovieGenres = genreIds
                .Select(id => new Models.Entitys.MovieGenre
                {
                    MovieId = movieId,
                    GenreId = id
                })
                .ToList();

            _context.MovieGenres.AddRange(newMovieGenres);
            await _context.SaveChangesAsync();

            return new MovieGenreResponse
            {
                Success = true,
                Message = "Жанри фільму успішно оновлені"
            };
        }

    }
}
