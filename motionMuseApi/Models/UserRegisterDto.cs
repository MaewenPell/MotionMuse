
namespace motionMuseApi.Models
{
  public class UserRegisterDto
  {
    public required string Username { get; set; }
    public required string Password { get; set; }

    public string Token { get; set; } = "";
    public string RefreshToken { get; set; } = "";
  }
}
