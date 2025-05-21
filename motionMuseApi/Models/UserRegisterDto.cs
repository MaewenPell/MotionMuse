
namespace motionMuseApi.Models
{
  public class UserRegisterDto
  {
    public required string Username { get; set; }
    public required string Password { get; set; }
    public required string Token { get; set; }
    public required string RefreshToken { get; set; }
  }
}
