using CinemaProject.Server.DTOs.Movie;

namespace CinemaProject.Server.Services
{
    public interface ITmdbService
    {
        Task<List<MovieDto>> SearchMoviesAsync(string query);
        Task<MovieDto?> GetMovieExtraInfoAsync(int id);
        Task<IEnumerable<CastDto>> GetCastAsync(int id);
    }
}
