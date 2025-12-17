using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using motionMuseApi.Models;

namespace motionMuseApi.Mappings
{
  public class TrainingMap : IEntityTypeConfiguration<Training>
  {
    public void Configure(EntityTypeBuilder<Training> b)
    {
      b.ToTable("trainings");
      b.HasKey(x => x.Id);

      b.Property(x => x.Title)
      .HasMaxLength(200)
      .IsRequired();
    }
  }
}