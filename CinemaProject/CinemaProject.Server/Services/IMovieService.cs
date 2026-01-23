using CinemaProject.Server.DTOs.Movie;


namespace CinemaProject.Server.Services
{
    public interface IMovieService
    {
        Task<List<MovieDto>> SearchMoviesAsync(string query);
        Task<MovieDto?> GetMovieExtraInfoAsync(int id);
        Task<List<MovieDto>> GetAllMoviesAsync();
        Task<MovieResponse> AddMovieAsync(MovieDto request);
        Task<MovieResponse> DeleteMovieAsync(int movieId);
        Task<MovieResponse> UpdateMovieAsync(MovieDto request);
        
    }
}
