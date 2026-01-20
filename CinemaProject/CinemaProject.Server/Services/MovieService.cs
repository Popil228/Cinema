using CinemaProject.Server.DTOs;
using CinemaProject.Server.Models;
using System.Net.Http;
using System.Text.Json;

namespace CinemaProject.Server.Services
{
    public class MovieService : IMovieService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly string _apiKey;
        private const string PosterBaseUrl = "https://image.tmdb.org/t/p/w500";

        public MovieService(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _httpClientFactory = httpClientFactory;
            _apiKey = configuration["ApiKeyTmdb"];
        }

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
                PosterPath = string.IsNullOrEmpty(m.Poster_path) ? null : $"{PosterBaseUrl}{m.Poster_path}"
            }).ToList() ?? new List<MovieSearchDto>();
        }
    }
}
