using CinemaProject.Server.DTOs;

namespace CinemaProject.Server.Services
{
    public interface IMovieService
    {
        Task<List<MovieSearchDto>> SearchMoviesAsync(string query);
    }
}
