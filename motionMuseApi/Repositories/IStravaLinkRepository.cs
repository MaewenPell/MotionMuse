using motionMuseApi.Entities;

namespace motionMuseApi.Repositories;

public interface IStravaLinkRepository
{
  Task<StravaLinkEntity?> GetByAuth0UserIdAsync(string auth0UserId, CancellationToken ct = default);
  Task AddAsync(StravaLinkEntity entity, CancellationToken ct = default);
  Task UpdateAsync(StravaLinkEntity entity, CancellationToken ct = default);
  Task<StravaLinkEntity> GetOrCreateAsync(
    string auth0UserId,
    Func<Task<StravaLinkEntity>> factory,
    CancellationToken ct = default);
}
