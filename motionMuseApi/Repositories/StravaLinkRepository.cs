
using Microsoft.EntityFrameworkCore;
using motionMuseApi.Entities;
using motionMuseApi.Models;

namespace motionMuseApi.Repositories
{
  public class StravaLinkRepository(MyDbContext db) : IStravaLinkRepository
  {
    public async Task AddAsync(StravaLinkEntity entity, CancellationToken ct = default)
    {
      await db.StravaLinks.AddAsync(entity, ct);
      await db.SaveChangesAsync(ct);
    }

    public Task<StravaLinkEntity?> GetByAuth0UserIdAsync(string auth0UserId, CancellationToken ct = default)
    {
      return db.StravaLinks
        .AsNoTracking()
        .FirstOrDefaultAsync(x => x.Auth0UserId == auth0UserId, ct);
    }

    public async Task<StravaLinkEntity> GetOrCreateAsync(string auth0UserId, Func<Task<StravaLinkEntity>> factory, CancellationToken ct = default)
    {
      var existingLink = await db.StravaLinks.FirstAsync(x => x.Auth0UserId == auth0UserId, ct);

      if (existingLink is not null)
      {
        return existingLink;
      }

      var created = await factory();

      created.Auth0UserId = auth0UserId;
      if (created.Id == Guid.Empty)
      {
        created.Id = Guid.NewGuid();
      }

      db.StravaLinks.Add(created);

      try
      {
        await db.SaveChangesAsync(ct);
        return created;
      }
      catch (DbUpdateException)
      {
        var first = await db.StravaLinks.FirstAsync(x => x.Auth0UserId == auth0UserId, ct);
        return first;
      }
    }

    public async Task UpdateAsync(StravaLinkEntity entity, CancellationToken ct = default)
    {
      db.StravaLinks.Update(entity);
      await db.SaveChangesAsync(ct);
    }
  }
}
