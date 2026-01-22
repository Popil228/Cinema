using CinemaProject.Server.DTOs.Movie;

namespace CinemaProject.Server.Services
{
    public interface IMovieService
    {
        Task<List<MovieSearchDto>> SearchMoviesAsync(string query);
        Task<MovieExtraInfoDto?> GetMovieExtraInfoAsync(int id);
    }
}
