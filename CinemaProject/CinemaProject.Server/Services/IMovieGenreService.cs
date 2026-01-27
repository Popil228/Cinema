using CinemaProject.Server.DTOs.MovieGenre;

namespace CinemaProject.Server.Services
{
    public interface IMovieGenreService
    {
        Task<MovieGenreResponse> CreateMovieGenresAsync(List<MovieGenreDto> request);
        Task<MovieGenreResponse> UpdateMovieGenresAsync(List<MovieGenreDto> request);
    }
}
