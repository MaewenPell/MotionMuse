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


    public async Task<User?> GetByName(string username)
    {
      var user = await _context.User.FirstOrDefaultAsync(u => u.Username == username);

      if (user == null)
      {
        return null;
      }

      return user;
    }

    public async Task<UserLoggedDto> RegisterUser(UserRegisterDto user)
    {
      var hashedPassword = _passwordManager.HashPassword(user.ToLoginDto());

      _context.User.Add(user.ToEntity(hashedPassword));
      await _context.SaveChangesAsync();

      return user.ToUserLoggedDto();
    }

    public async Task<UserLoggedDto?> AuthenticateUser(LoginDto login)
    {
      var user = await GetByName(login.Username);

      if (user == null)
      {
        return null;
      }

      bool isPasswordValid = _passwordManager.VerifyPassword(user.ToLoginDto(), user.PasswordHash, login.Password);

      if (isPasswordValid)
      {
        return user.ToUserLoggedDto();
      }

      return null;
    }
  }
}