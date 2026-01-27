using CinemaProject.Server.DTOs.Actor;


namespace CinemaProject.Server.Services
{
    public interface IActorService
    {
        Task<ActorResponse> CreateActorsAsync(List<ActorDto> actorDto);
        Task<ActorResponse> UpdateActorsAsync(List<ActorDto> actorDto);
        Task<ActorResponse> DeleteActorAsync(int actorId);

    }
}
