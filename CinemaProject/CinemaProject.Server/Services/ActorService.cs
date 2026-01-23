using CinemaProject.Server.Data;
using CinemaProject.Server.DTOs.Actor;
using Microsoft.EntityFrameworkCore;

namespace CinemaProject.Server.Services
{
    public class ActorService : IActorService
    {
        private readonly CinemaDbContext _context;

        public ActorService(CinemaDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Creates or updates an actor and associates the actor with a specified movie asynchronously.
        /// </summary>
        /// <remarks>If the actor does not exist, a new actor is created. If the specified movie exists,
        /// the actor is associated with the movie and the role is updated. The operation is performed asynchronously
        /// and changes are saved to the database.</remarks>
        /// <param name="request">An object containing the actor's details to be created or updated, including the actor's ID, name, photo
        /// URI, and role.</param>
        /// <param name="movieId">The unique identifier of the movie to associate with the actor. Must correspond to an existing movie.</param>
        /// <returns>A response indicating whether the actor was successfully created or updated, including a success flag and a
        /// message.</returns>
        public async Task<ActorResponse> UpdateActorAsync(ActorDto request)
        {
            if (request == null)
                return new ActorResponse { Success = false, Message = "Некоректні дані актора" };

            if (string.IsNullOrWhiteSpace(request.Name))
                return new ActorResponse { Success = false, Message = "Ім'я актора обов'язкове" };

            if (string.IsNullOrWhiteSpace(request.Role))
                return new ActorResponse { Success = false, Message = "Роль актора обов'язкова" };

            var actor = await _context.Actors
                .FirstOrDefaultAsync(a => a.ActorId == request.Id);

            if (actor == null)
            {
                actor = new Models.Entitys.Actor
                {
                    ActorId = request.Id,
                    FullName = request.Name,
                    PhotoUri = request.PhotoUri
                };
                _context.Actors.Add(actor);
            }
            else
            {
                actor.FullName = request.Name;
                actor.PhotoUri = request.PhotoUri;
            }

            await _context.SaveChangesAsync();

            return new ActorResponse
            {
                Success = true,
                Message = "Актор успішно оновлений"
            };
        }


    }
}
