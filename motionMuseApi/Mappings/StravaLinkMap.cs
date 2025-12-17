using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using motionMuseApi.Entities;

namespace motionMuseApi.Mappings
{
  public class StravaLinkMap : IEntityTypeConfiguration<StravaLinkEntity>
  {
    public void Configure(EntityTypeBuilder<StravaLinkEntity> b)
    {
      b.ToTable("strava_links");
      b.HasKey(x => x.Id);

      b.HasIndex(x => x.Auth0UserId).IsUnique();

      b.Property(x => x.Auth0UserId)
       .HasMaxLength(128)
       .IsRequired();

      b.Property(x => x.AccessToken).IsRequired();
      b.Property(x => x.RefreshToken).IsRequired();

      b.Property(x => x.CreatedAtUtc).IsRequired();
      b.Property(x => x.UpdatedAtUtc).IsRequired();
    }
  }
}