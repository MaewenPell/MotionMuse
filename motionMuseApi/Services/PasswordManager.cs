using Microsoft.AspNetCore.Identity;
using motionMuseApi.Models;

namespace motionMuseApi.Services
{
  public class PasswordManager
  {
    private readonly PasswordHasher<UserDto> _passwordHasher = new();

    public string HashPassword(UserDto user, string password)
    {
      return _passwordHasher.HashPassword(user, password);
    }

    public bool VerifyPassword(UserDto user, string hashedPassword, string providedPassword)
    {
      var result = _passwordHasher.VerifyHashedPassword(user, hashedPassword, providedPassword);
      return result == PasswordVerificationResult.Success;
    }
  }

}