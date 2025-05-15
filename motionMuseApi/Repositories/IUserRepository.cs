using motionMuseApi.Models;

namespace motionMuseApi.Repositories
{
  public interface IUserRepository
  {
    Task<User?> GetByName(string name);
    Task<UserDto> RegisterUser(UserDto user, string plainPassword);
    Task<UserDto?> AuthenticateUser(string name, string plainPassword);
  }
}