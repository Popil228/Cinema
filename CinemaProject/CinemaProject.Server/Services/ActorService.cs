using CinemaProject.Server.Data;
using CinemaProject.Server.DTOs.Actor;
using CinemaProject.Server.Models;
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
        /// Asynchronously creates a new actor using the specified actor data.
        /// </summary>
        /// <param name="request">An object containing the details of the actor to create. The actor's name and photo URI must not be null or
        /// empty.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains an ActorResponse indicating
        /// whether the actor was successfully created and includes a message describing the outcome.</returns>
        public async Task<ActorResponse> CreateActorAsync(ActorDto request)
        {
            if (request == null)
                return new ActorResponse { Success = false, Message = "Некоректні дані актора" };
            if (string.IsNullOrWhiteSpace(request.Name))
                return new ActorResponse { Success = false, Message = "Ім'я актора обов'язкове" };
            if (string.IsNullOrWhiteSpace(request.PhotoUri))
                return new ActorResponse { Success = false, Message = "Фото актора обов'язкове" };

            var newActor = new Models.Entitys.Actor
            {
                ActorId = request.Id,
                FullName = request.Name,
                PhotoUri = request.PhotoUri
            };

            _context.Actors.Add(newActor);
            await _context.SaveChangesAsync();
            return new ActorResponse
            {
                Success = true,
                Message = "Актор успішно створений"
            };
        }

        /// <summary>
        /// Asynchronously updates the details of an existing actor based on the provided data.
        /// </summary>
        /// <param name="request">An object containing the updated information for the actor. The actor's identifier, name, and photo URI must
        /// be specified. Cannot be null.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains an ActorResponse indicating
        /// whether the update was successful and providing a relevant message.</returns>
        public async Task<ActorResponse> UpdateActorAsync(ActorDto request)
        {
            if (request == null)
                return new ActorResponse { Success = false, Message = "Некоректні дані актора" };

            if (string.IsNullOrWhiteSpace(request.Name))
                return new ActorResponse { Success = false, Message = "Ім'я актора обов'язкове" };

            if (string.IsNullOrWhiteSpace(request.PhotoUri))
                return new ActorResponse { Success = false, Message = "Фото актора обов'язкове" };

            var actor = await _context.Actors
                .FirstOrDefaultAsync(a => a.ActorId == request.Id);

            if (actor == null)
            {
                return new ActorResponse
                {
                    Success = false,
                    Message = "Актор не знайдений"
                };
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

        /// <summary>
        /// Asynchronously deletes the actor with the specified identifier from the data store.
        /// </summary>
        /// <param name="actorId">The unique identifier of the actor to delete.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains an ActorResponse indicating
        /// whether the deletion was successful and providing a related message.</returns>
        public async Task<ActorResponse> DeleteActorAsync(int actorId)
        {
            var actor = await _context.Actors
                .FirstOrDefaultAsync(a => a.ActorId == actorId);

            if (actor == null)
            {
                return new ActorResponse
                {
                    Success = false,
                    Message = "Актор не знайдений"
                };
            }

            _context.Actors.Remove(actor);
            await _context.SaveChangesAsync();

            return new ActorResponse
            {
                Success = true,
                Message = "Актор успішно видалений"
            };


        }
    }
}
