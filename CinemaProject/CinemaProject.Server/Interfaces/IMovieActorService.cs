using Azure.Core;
using CinemaProject.Server.DTOs.MovieActor;

namespace CinemaProject.Server.Interfaces
{
    public interface IMovieActorService
    {
        Task<MovieActorResponse> CreateMovieActorsAsync(List<MovieActorDto> request);
        Task<MovieActorResponse> UpdateMovieActorsAsync(List<MovieActorDto> request);
        Task<MovieActorResponse> DeleteMovieActorsAsync(MovieActorDto request);
    }
}
