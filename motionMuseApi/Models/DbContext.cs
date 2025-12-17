using Microsoft.EntityFrameworkCore;
using motionMuseApi.Entities;

namespace motionMuseApi.Models
{
  public class MyDbContext(DbContextOptions<MyDbContext> options) : DbContext(options)
  {
    public DbSet<Training> Training => Set<Training>();
    public DbSet<StravaLinkEntity> StravaLinks => Set<StravaLinkEntity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      base.OnModelCreating(modelBuilder);

      modelBuilder.ApplyConfigurationsFromAssembly(typeof(MyDbContext).Assembly);
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {

      var now = DateTime.UtcNow;

      foreach (var e in ChangeTracker.Entries<StravaLinkEntity>())
      {
        if (e.State == EntityState.Added)
        {
          e.Entity.CreatedAtUtc = now;
          e.Entity.UpdatedAtUtc = now;
        }
        else if (e.State == EntityState.Modified)
        {
          e.Entity.UpdatedAtUtc = now;
        }
      }

      return base.SaveChangesAsync(cancellationToken);
    }
  }
}