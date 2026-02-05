using CinemaProject.Server.DTOs.Movie;


namespace CinemaProject.Server.Interfaces
{
    public interface IMovieService
    {
        Task<List<MovieDto>> GetAllMoviesAsync(bool onlyShowingNow = false);
        Task<MovieDto> GetMovieByIdAsync(int id);
        Task<MovieResponse> CreateMovieAsync(ShortMovieDto request);
        Task<MovieResponse> DeleteMovieAsync(int Id);
        Task<MovieResponse> UpdateMovieAsync(ShortMovieDto request);
        
    }
}
