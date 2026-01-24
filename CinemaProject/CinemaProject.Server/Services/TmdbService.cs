using CinemaProject.Server.DTOs.Actor;
using CinemaProject.Server.DTOs.Genre;
using CinemaProject.Server.DTOs.Movie;
using CinemaProject.Server.Models.Tmdb;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace CinemaProject.Server.Services
{
    public class TmdbService : ITmdbService
    {
        private const string TmdbBaseUrl = "https://api.themoviedb.org/3";
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly string _apiKey;

        public TmdbService(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _httpClientFactory = httpClientFactory;
            _apiKey = configuration["ApiKeyTmdb"];
        }

        /// <summary>
        /// Searches for movies that match the specified query string using The Movie Database (TMDb) API.
        /// </summary>
        /// <remarks>The search is performed using the TMDb API with the language set to Ukrainian
        /// (uk-UA). The returned movies include basic information such as ID, title, release date, and poster path.
        /// Network or API errors will result in an exception being thrown.</remarks>
        /// <param name="query">The search text to use for finding matching movies. Cannot be null or empty.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a list of movies that match the
        /// search query. The list is empty if no movies are found.</returns>
        public async Task<List<MovieDto>> SearchMoviesAsync(string query)
        {
            try
            {
                var client = _httpClientFactory.CreateClient("tmdb");

                var url = $"{TmdbBaseUrl}/search/movie?api_key={_apiKey}&query={Uri.EscapeDataString(query)}&language=uk-UA";
                var response = await client.GetAsync(url);

                if (!response.IsSuccessStatusCode)
                {
                    var errorBody = await response.Content.ReadAsStringAsync();
                    throw new Exception($"TMDb API error ({(int)response.StatusCode}): {errorBody}");
                }

                var json = await response.Content.ReadAsStringAsync();
                var result = JsonSerializer.Deserialize<TmdbMovieSearchResult>(
                    json,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
                );

                if (result?.Results == null || result.Results.Count == 0)
                {
                    throw new Exception("Фільмів за таким запитом не знайдено");
                }

                return result?.Results?.Select(m => new MovieDto
                {
                    MainInfo = new MovieMainInfoDto
                    {
                        Id = m.Id,
                        Title = m.Title,
                        ReleaseDate = ParseTmdbDate(m.Release_date) ?? DateTime.MinValue,
                        PosterPath = string.IsNullOrEmpty(m.Poster_path) ? null : m.Poster_path
                    },
                    ExtraInfo = null
                }).ToList() ?? new List<MovieDto>();
            }
            catch (HttpRequestException ex)
            {
                throw new Exception("Не вдалося підключитись до TMDb API", ex);
            }
            catch (JsonException ex)
            {
                throw new Exception("Помилка обробки відповіді TMDb API", ex);
            }
        }

        /// <summary>
        /// Retrieves additional information about a movie from The Movie Database (TMDb) asynchronously, including
        /// runtime, overview, genres, and a list of main actors.
        /// </summary>
        /// <remarks>The returned information includes the movie's runtime, overview, genres, and up to 15
        /// main actors. The data is retrieved from TMDb using the Ukrainian language setting.</remarks>
        /// <param name="tmdbId">The unique TMDb identifier of the movie for which to retrieve extra information.</param>
        /// <returns>A <see cref="MovieDto"/> containing the movie's extra information if found; otherwise, <see
        /// langword="null"/> if the movie does not exist or the request fails.</returns>
        public async Task<MovieDto?> GetMovieExtraInfoAsync(int tmdbId)
        {
            try
            {
                var client = _httpClientFactory.CreateClient("tmdb");

                var creditsTask = client.GetAsync($"{TmdbBaseUrl}/movie/{tmdbId}/credits?api_key={_apiKey}&language=uk-UA");
                var detailsTask = client.GetAsync($"{TmdbBaseUrl}/movie/{tmdbId}?api_key={_apiKey}&language=uk-UA");

                await Task.WhenAll(creditsTask, detailsTask);

                var creditsResponse = creditsTask.Result;
                var detailsResponse = detailsTask.Result;

                if (!detailsResponse.IsSuccessStatusCode)
                {
                    var errorBody = await detailsResponse.Content.ReadAsStringAsync();
                    throw new Exception($"TMDb API error ({(int)detailsResponse.StatusCode}): {errorBody}");
                }

                if (!creditsResponse.IsSuccessStatusCode)
                {
                    var errorBody = await creditsResponse.Content.ReadAsStringAsync();
                    throw new Exception($"TMDb API error ({(int)creditsResponse.StatusCode}): {errorBody}");
                }

                var creditsJson = await creditsResponse.Content.ReadAsStringAsync();
                var detailsJson = await detailsResponse.Content.ReadAsStringAsync();

                var credits = JsonSerializer.Deserialize<TmdbCreditsResponse>(creditsJson,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                var details = JsonSerializer.Deserialize<TmdbMovieDetails>(detailsJson,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                if (details == null)
                    throw new Exception("Не вдалося отримати деталі фільму");

                return new MovieDto
                {
                    MainInfo = null,
                    ExtraInfo = new MovieExtraInfoDto
                    {
                        Runtime = details.Runtime,
                        Overview = details.Overview,
                        Genres = details.Genres
                            .Select(g => new GenreDto { Id = g.Id, Name = g.Name })
                            .ToList(),
                        Actors = credits?.Cast?
                            .Take(15)
                            .Select(a => new CastDto
                            {
                                Id = a.Id,
                                Name = a.Name,
                                Role = a.Character,
                                PhotoUri = string.IsNullOrEmpty(a.Profile_Path) ? null : a.Profile_Path
                            })
                            .ToList() ?? new List<CastDto>()
                    }
                };
            }
            catch (HttpRequestException ex)
            {
                throw new Exception("Не вдалося підключитись до TMDb API", ex);
            }
            catch (JsonException ex)
            {
                throw new Exception("Помилка обробки відповіді TMDb API", ex);
            }
        }


        /// <summary>
        /// Parses a date string in TMDb format and returns the corresponding UTC date and time, if valid.
        /// </summary>
        /// <remarks>If the input string cannot be parsed as a valid date, the method returns <see
        /// langword="null"/>. The returned <see cref="DateTime"/> is converted to UTC.</remarks>
        /// <param name="value">The date string to parse. Can be null or empty.</param>
        /// <returns>A <see cref="DateTime"/> value representing the parsed date in UTC if the input is valid; otherwise, <see
        /// langword="null"/>.</returns>
        private static DateTime? ParseTmdbDate(string? value)
        {
            if (DateTime.TryParse(value, out var date))
                return DateTime.SpecifyKind(date, DateTimeKind.Utc);

            return null;
        }
    }
}
