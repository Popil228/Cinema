using Azure.Core;
using CinemaProject.Server.Data;
using CinemaProject.Server.DTOs.Actor;
using CinemaProject.Server.DTOs.Auth;
using CinemaProject.Server.DTOs.Genre;
using CinemaProject.Server.DTOs.Movie;
using CinemaProject.Server.Models.Tmdb;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Net.Http;
using System.Reflection.Metadata.Ecma335;
using System.Text.Json;

namespace CinemaProject.Server.Services
{
    public class MovieService : IMovieService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly CinemaDbContext _context;
        private readonly string _apiKey;

        public MovieService(CinemaDbContext context, IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _context = context;
            _httpClientFactory = httpClientFactory;
            _apiKey = configuration["ApiKeyTmdb"];
        }

        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        // Search Movies (Main Info)
        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        public async Task<List<MovieDto>> SearchMoviesAsync(string query)
        {
            var client = _httpClientFactory.CreateClient();

            var url = $"https://api.themoviedb.org/3/search/movie?api_key={_apiKey}&query={Uri.EscapeDataString(query)}&language=uk-UA";
            var response = await client.GetAsync(url);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<TmdbMovieSearchResult>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            return result?.Results?.Select(m => new MovieDto
            {
                MainInfo = new MovieMainInfoDto
                {
                    Id = m.Id,
                    Title = m.Title,
                    ReleaseDate = DateTime.TryParse(m.Release_date, out var date)
                        ? DateTime.SpecifyKind(date, DateTimeKind.Utc)
                        : default,
                    PosterPath = string.IsNullOrEmpty(m.Poster_path)
                        ? null
                        : $"{m.Poster_path}"
                },
                ExtraInfo = null
            }).ToList() ?? new List<MovieDto>();
        }

        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        // Movie Details (Extra Info) 
        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        public async Task<MovieDto?> GetMovieExtraInfoAsync(int tmdbId)
        {
            var client = _httpClientFactory.CreateClient();

            var creditsTask = client.GetAsync(
                $"https://api.themoviedb.org/3/movie/{tmdbId}/credits?api_key={_apiKey}&language=uk-UA");

            var detailsTask = client.GetAsync(
                $"https://api.themoviedb.org/3/movie/{tmdbId}?api_key={_apiKey}&language=uk-UA");

            await Task.WhenAll(creditsTask, detailsTask);

            if (!creditsTask.Result.IsSuccessStatusCode ||
                !detailsTask.Result.IsSuccessStatusCode)
                return null;

            var creditsJson = await creditsTask.Result.Content.ReadAsStringAsync();
            var detailsJson = await detailsTask.Result.Content.ReadAsStringAsync();

            var credits = JsonSerializer.Deserialize<TmdbCreditsResponse>(creditsJson,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            var details = JsonSerializer.Deserialize<TmdbMovieDetails>(detailsJson,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            return new MovieDto
            {
                MainInfo = null,
                ExtraInfo = new MovieExtraInfoDto
                {
                    Runtime = details.Runtime,
                    Overview = details.Overview,

                    Genres = details.Genres
                    .Select(g => new GanreDto
                    {
                        Id = g.Id,
                        Name = g.Name
                    })
                    .ToList(),

                    Actors = credits.Cast
                    .Take(15)
                    .Select(a => new ActorDto
                    {
                        Id = a.Id,
                        Name = a.Name,
                        Role = a.Character,
                        PhotoUri = string.IsNullOrEmpty(a.Profile_Path)
                            ? null
                            : $"{a.Profile_Path}"
                    })
                    .ToList()
                }
            };
        }

        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        //Get all movies
        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        public async Task<List<MovieDto>> GetAllMoviesAsync()
        {
            var movies = await _context.Movies
                .Include(m => m.MovieGenres)
                    .ThenInclude(mg => mg.Genre)
                .Include(m => m.MovieActors)
                    .ThenInclude(ma => ma.Actor)
                .ToListAsync();

            return movies.Select(m => new MovieDto
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
                    Genres = m.MovieGenres.Select(mg => new GanreDto
                    {
                        Id = mg.Genre.GenreId,
                        Name = mg.Genre.GenreName
                    }).ToList(),
                    Actors = m.MovieActors.Select(ma => new ActorDto
                    {
                        Id = ma.Actor.ActorId,
                        Name = ma.Actor.FullName,
                        Role = ma.Character,
                        PhotoUri = ma.Actor.PhotoUri
                    }).ToList()
                }
            }).ToList();
        }

        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        // Add Movie
        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        public async Task<MovieResponse> AddMovieAsync(MovieDto request)
        {
            if (await _context.Movies.AnyAsync(m => m.MovieId == request.MainInfo.Id))
            {
                return new MovieResponse
                {
                    Success = false,
                    Message = "Такий фільм вже наявний в БД"
                };
            }

            // Genres
            var resultGenres = await CreateGenresToLink(request);
            if (!resultGenres.Success)
                return new MovieResponse { Success = false, Message = resultGenres.Message };

            // Actors
            var resultActors = await CreateActorsToLink(request);
            if (!resultActors.Success)
                return new MovieResponse { Success = false, Message = resultActors.Message };

            // Movie
            var movie = new Models.Entitys.Movie
            {
                MovieId = request.MainInfo.Id,
                Title = request.MainInfo.Title,
                ReleaseDate = DateTime.SpecifyKind(request.MainInfo.ReleaseDate, DateTimeKind.Utc),
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

        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        // Delete Movie
        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        public async Task<MovieResponse> DeleteMovieAsync(int movieId)
        {
            var movie = await _context.Movies
                .Include(m => m.MovieActors)
                .Include(m => m.MovieGenres)
                .FirstOrDefaultAsync(m => m.MovieId == movieId);
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

        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        // Update Movie
        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        public async Task<MovieResponse> UpdateMovieAsync(MovieDto request)
        {
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
            movie.ReleaseDate = DateTime.SpecifyKind(request.MainInfo.ReleaseDate, DateTimeKind.Utc);
            movie.PosterUri = request.MainInfo.PosterPath;
            movie.Description = request.ExtraInfo?.Overview;
            movie.Duration = request.ExtraInfo?.Runtime > 0 ? (short)request.ExtraInfo.Runtime : (short)0;

            // Genres
            var resultGenres = await CreateGenresToLink(request);
            if (!resultGenres.Success)
                return new MovieResponse { Success = false, Message = resultGenres.Message };

            // Actors
            var resultActors = await CreateActorsToLink(request);
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
                    var actorDto = request.ExtraInfo.Actors.First(ad => ad.Id == a.ActorId);
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

        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        // Helper Methods for Genres to create link
        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        public async Task<(bool Success, string Message, List<Models.Entitys.Genre> Genres)> CreateGenresToLink(MovieDto request)
        {
            var allGenres = await _context.Genres.ToListAsync();
            var genresToLink = new List<Models.Entitys.Genre>();

            foreach (GanreDto genreDto in request.ExtraInfo.Genres)
            {
                var existingGenre = allGenres.FirstOrDefault(g => g.GenreId == genreDto.Id);
                if (existingGenre != null)
                {
                    genresToLink.Add(existingGenre);
                }
                else
                {
                    return (false, $"Жанр з Id {genreDto.Id} не знайдено в базі даних", null);
                }
            }

            return (true, null, genresToLink);
        }

        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        // Helper Methods for Actors to create link
        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        public async Task<(bool Success, string Message, List<Models.Entitys.Actor> Actors)> CreateActorsToLink(MovieDto request)
        {
            var allActors = await _context.Actors.ToListAsync();

            var actorsToLink = new List<Models.Entitys.Actor>();
            foreach (ActorDto actorDto in request.ExtraInfo.Actors)
            {
                var existingActor = allActors.FirstOrDefault(a => a.ActorId == actorDto.Id || a.FullName == actorDto.Name);
                if (existingActor != null)
                {
                    actorsToLink.Add(existingActor);
                }
                else
                {
                    var newActor = new Models.Entitys.Actor
                    {
                        ActorId = actorDto.Id,
                        FullName = actorDto.Name,
                        PhotoUri = actorDto.PhotoUri
                    };
                    _context.Actors.Add(newActor);
                    actorsToLink.Add(newActor);
                }
            }

            return (true, null, actorsToLink);

        }
    }
}
