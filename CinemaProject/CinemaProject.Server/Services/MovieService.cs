using CinemaProject.Server.DTOs.Movie;
using CinemaProject.Server.DTOs.Actor;
using CinemaProject.Server.DTOs.Genre;
using CinemaProject.Server.Models.Tmdb;
using System.Net.Http;
using System.Reflection.Metadata.Ecma335;
using System.Text.Json;

namespace CinemaProject.Server.Services
{
    public class MovieService : IMovieService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly string _apiKey;
        private const string PosterBaseUri = "https://image.tmdb.org/t/p/w500";

        public MovieService(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _httpClientFactory = httpClientFactory;
            _apiKey = configuration["ApiKeyTmdb"];
        }

        // Search Movies
        public async Task<List<MovieSearchDto>> SearchMoviesAsync(string query)
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

            return result?.Results?.Select(m => new MovieSearchDto
            {
                Id = m.Id,
                Title = m.Title,
                ReleaseDate = m.Release_date,
                PosterPath = string.IsNullOrEmpty(m.Poster_path) ? null : $"{PosterBaseUri}{m.Poster_path}"
            }).ToList() ?? new List<MovieSearchDto>();
        }

        // Movie Extra Info (runtime, owerview, ganres, actors)
        public async Task<MovieExtraInfoDto?> GetMovieExtraInfoAsync(int tmdbId)
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

            return new MovieExtraInfoDto
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
                            : $"{PosterBaseUri}{a.Profile_Path}"
                    })
                    .ToList()
            };
        }
    }
}
