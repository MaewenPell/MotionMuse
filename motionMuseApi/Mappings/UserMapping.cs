using motionMuseApi.Models;

namespace motionMuseApi.Mappings
{
  public static class UserMapping
  {
    public static User ToEntity(this UserRegisterDto userDto, string hashedPassword)
    {
      return new User
      {
        Username = userDto.Username,
        InitialToken = userDto.Token,
        Token = userDto.RefreshToken,
        PasswordHash = hashedPassword,
      };
    }

    public static LoginDto ToLoginDto(this User user)
    {
      return new LoginDto
      {
        Password = user.PasswordHash,
        Username = user.Username
      };
    }

    public static LoginDto ToLoginDto(this UserRegisterDto registerDto)
    {
      return new LoginDto
      {
        Password = registerDto.Password,
        Username = registerDto.Username
      };
    }

    public static UserLoggedDto ToUserLoggedDto(this User user)
    {
      return new UserLoggedDto
      {
        RefreshToken = user.Token,
        Token = user.Token
      };
    }

    public static UserLoggedDto ToUserLoggedDto(this UserRegisterDto registerDto)
    {
      return new UserLoggedDto
      {
        RefreshToken = registerDto.RefreshToken,
        Token = registerDto.Token,
      };
    }
  }
}