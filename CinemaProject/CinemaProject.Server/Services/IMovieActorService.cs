using Azure.Core;
using CinemaProject.Server.DTOs.MovieActor;

namespace CinemaProject.Server.Services
{
    public interface IMovieActorService
    {
        Task<MovieActorResponse> CreateMovieActorsAsync(List<MovieActorDto> request);
        Task<MovieActorResponse> UpdateMovieActorsAsync(List<MovieActorDto> request);
        Task<MovieActorResponse> DeleteMovieActorsAsync(MovieActorDto request);
    }
}
