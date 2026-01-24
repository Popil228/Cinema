using CinemaProject.Server.DTOs.Actor;


namespace CinemaProject.Server.Services
{
    public interface IActorService
    {
        Task<ActorResponse> CreateActorAsync(ActorDto actorDto);
        Task<ActorResponse> UpdateActorAsync(ActorDto actorDto);
        Task<ActorResponse> DeleteActorAsync(int actorId);

    }
}
