using Microsoft.AspNetCore.Identity;
using motionMuseApi.Models;

namespace motionMuseApi.Services
{
  public class PasswordManager
  {
    private readonly PasswordHasher<LoginDto> _passwordHasher = new();

    public string HashPassword(LoginDto user)
    {
      return _passwordHasher.HashPassword(user, user.Password);
    }

    public bool VerifyPassword(LoginDto login, string hashedPassword, string providedPassword)
    {
      var result = _passwordHasher.VerifyHashedPassword(login, hashedPassword, providedPassword);
      return result == PasswordVerificationResult.Success;
    }
  }

}