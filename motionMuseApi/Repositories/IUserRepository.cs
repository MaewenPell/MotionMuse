using motionMuseApi.Models;

namespace motionMuseApi.Repositories
{
  public interface IUserRepository
  {
    Task<User?> GetByName(string name);
    Task<UserLoggedDto> RegisterUser(UserRegisterDto user);
    Task<UserLoggedDto?> AuthenticateUser(LoginDto login);
  }
}