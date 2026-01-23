using Azure.Core;
using CinemaProject.Server.DTOs.MovieActor;

namespace CinemaProject.Server.Services
{
    public interface IMovieActorService
    {
        Task<MovieActorResponse> UpdateMovieActorsAsync(MovieActorDto request);
    }
}
