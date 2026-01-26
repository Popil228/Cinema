using Azure.Core;
using CinemaProject.Server.DTOs.MovieActor;

namespace CinemaProject.Server.Services
{
    public interface IMovieActorService
    {
        Task<MovieActorResponse> CreateMovieActorAsync(MovieActorDto request);
        Task<MovieActorResponse> UpdateMovieActorsAsync(MovieActorDto request);
        Task<MovieActorResponse> DeleteMovieActorsAsync(MovieActorDto request);
    }
}
