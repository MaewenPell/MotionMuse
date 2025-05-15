using Microsoft.EntityFrameworkCore;

namespace motionMuseApi.Models
{
  public class MyDbContext(DbContextOptions<MyDbContext> options) : DbContext(options)
  {
    public DbSet<Training> Training { get; set; }
    public DbSet<User> User { get; set; }
  }
}