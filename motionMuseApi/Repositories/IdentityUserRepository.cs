using Microsoft.EntityFrameworkCore;
using motionMuseApi.Mappings;
using motionMuseApi.Models;
using motionMuseApi.Services;

namespace motionMuseApi.Repositories
{
  public class IdentityUserRepository(MyDbContext context, PasswordManager passwordManager) : IUserRepository
  {
    private readonly MyDbContext _context = context;
    private readonly PasswordManager _passwordManager = passwordManager;

    public async Task<UserDto?> AuthenticateUser(string name, string plainPassword)
    {
      var user = await GetByName(name);

      if (user == null)
      {
        return null;
      }

      bool isPasswordValid = _passwordManager.VerifyPassword(user.ToDto(plainPassword), user.PasswordHash, plainPassword);

      return isPasswordValid ? user.ToDto(plainPassword) : null;
    }

    public async Task<UserDto> RegisterUser(UserDto user, string plainPassword)
    {
      var hashedPassword = _passwordManager.HashPassword(user, plainPassword);

      _context.User.Add(user.ToEntity(hashedPassword));
      await _context.SaveChangesAsync();

      return user;
    }

    public async Task<User?> GetByName(string username)
    {
      var user = await _context.User.FirstOrDefaultAsync(u => u.Username == username);

      if (user == null)
      {
        return null;
      }

      return user;
    }
  }
}