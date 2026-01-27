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
        /// Creates new actor records based on the provided list of actor data transfer objects.
        /// </summary>
        /// <remarks>If any actor in the list already exists, it will not be created again. The method
        /// returns a failure response if the input list is null, empty, or contains invalid actor data. Only actors
        /// that do not already exist in the database will be created.</remarks>
        /// <param name="request">A list of actor data transfer objects containing the information for each actor to be created. Each item
        /// must not be null and must have a non-empty name.</param>
        /// <returns>A response indicating the result of the creation operation. The response includes a success flag and a
        /// message describing the outcome.</returns>
        public async Task<ActorResponse> CreateActorsAsync(List<ActorDto> request)
        {
            if (request == null || request.Count == 0)
            {
                return new ActorResponse
                {
                    Success = false,
                    Message = "Список акторів порожній"
                };
            }

            var invalidActor = request.FirstOrDefault(a =>
                a == null ||
                string.IsNullOrWhiteSpace(a.Name)
            );

            if (invalidActor != null)
            {
                return new ActorResponse
                {
                    Success = false,
                    Message = "Один або більше акторів мають невалідні дані"
                };
            }

            var actorIds = request.Select(a => a.Id).ToList();

            var existingActorIds = await _context.Actors
                .Where(a => actorIds.Contains(a.ActorId))
                .Select(a => a.ActorId)
                .ToListAsync();

            var newActors = request
                .Where(a => !existingActorIds.Contains(a.Id))
                .Select(a => new Models.Entitys.Actor
                {
                    ActorId = a.Id,
                    FullName = a.Name,
                    PhotoUri = string.IsNullOrWhiteSpace(a.PhotoUri)
                        ? null
                        : a.PhotoUri
                })
                .ToList();

            if (newActors.Count == 0)
            {
                return new ActorResponse
                {
                    Success = true,
                    Message = "Усі актори вже існують"
                };
            }

            _context.Actors.AddRange(newActors);
            await _context.SaveChangesAsync();

            return new ActorResponse
            {
                Success = true,
                Message = $"Створено акторів: {newActors.Count}"
            };
        }

       /// <summary>
       /// Updates the details of one or more actors based on the provided list of actor data transfer objects.'
       /// </summary>
       /// <param name="request">A list of <see cref="ActorDto"/> objects containing the updated information for each actor. Each item must
       /// specify a valid actor identifier. The list cannot be null or empty.</param>
       /// <returns>An <see cref="ActorResponse"/> indicating whether the update operation was successful. If the operation
       /// fails, the response contains an appropriate error message.</returns>
        public async Task<ActorResponse> UpdateActorsAsync(List<ActorDto> request)
        {
            if (request == null || request.Count == 0)
                return new ActorResponse
                {
                    Success = false,
                    Message = "Список акторів порожній"
                };

            var actorIds = request.Select(a => a.Id).ToList();

            var actors = await _context.Actors
                .Where(a => actorIds.Contains(a.ActorId))
                .ToListAsync();

            foreach (var dto in request)
            {
                var actor = actors.FirstOrDefault(a => a.ActorId == dto.Id);
                if (actor == null) continue;

                if (!string.IsNullOrWhiteSpace(dto.Name))
                    actor.FullName = dto.Name;

                actor.PhotoUri = string.IsNullOrWhiteSpace(dto.PhotoUri)
                    ? null
                    : dto.PhotoUri;
            }

            await _context.SaveChangesAsync();

            return new ActorResponse
            {
                Success = true,
                Message = "Актори успішно оновлені"
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
