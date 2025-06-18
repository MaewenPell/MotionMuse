using motionMuseApi.Models;

namespace motionMuseApi.Repositories
{
  public interface IUserRepository
  {
    Task<User?> GetByName(string name);
    Task<UserRegisteredDto> RegisterUser(UserRegisterDto user, string plainPassword);
    Task<UserLoggedDto?> Finalize(UserRegisterDto user);
    Task<UserLoggedDto?> AuthenticateUser(LoginDto login);
  }
}