using CinemaProject.Server.DTOs.Movie;


namespace CinemaProject.Server.Services
{
    public interface IMovieService
    {
        Task<List<MovieDto>> GetAllMoviesAsync();
        Task<List<MovieDto>> GetAllRollingMoviesAsync();
        Task<MovieDto> GetMovieByIdAsync(int id);
        Task<MovieResponse> AddMovieAsync(MovieDto request);
        Task<MovieResponse> DeleteMovieAsync(int Id);
        Task<MovieResponse> UpdateMovieAsync(MovieDto request);
        
    }
}
