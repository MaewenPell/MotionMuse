using motionMuseApi.Models;

namespace motionMuseApi.Mappings
{
  public static class UserMapping
  {
    public static UserDto ToDto(this User user, string plainPassword)
    {
      return new UserDto
      {
        Username = user.Username,
        InitialToken = user.InitialToken,
        RefreshToken = user.RefreshToken,
        Password = plainPassword
      };
    }

    public static User ToEntity(this UserDto userDto, string hashedPassword)
    {
      return new User
      {
        Username = userDto.Username,
        InitialToken = userDto.InitialToken,
        RefreshToken = userDto.RefreshToken,
        PasswordHash = hashedPassword,
      };
    }
  }
}