using CinemaProject.Server.DTOs.MovieGenre;

namespace CinemaProject.Server.Interfaces
{
    public interface IMovieGenreService
    {
        Task<MovieGenreResponse> CreateMovieGenresAsync(List<MovieGenreDto> request);
        Task<MovieGenreResponse> UpdateMovieGenresAsync(List<MovieGenreDto> request);
    }
}
