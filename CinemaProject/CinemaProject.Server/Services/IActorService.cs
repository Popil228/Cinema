using CinemaProject.Server.DTOs.Actor;


namespace CinemaProject.Server.Services
{
    public interface IActorService
    {
        Task<ActorResponse> UpdateActorAsync(ActorDto actorDto, int movieId);

    }
}
