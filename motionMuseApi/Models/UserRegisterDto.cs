
namespace motionMuseApi.Models
{
  public class UserRegisterDto
  {
    public required string Username { get; set; }
    public required string Password { get; set; }
    public int? ExpiresIn { get; set; }
    public int? ExpiresAt { get; set; }
    public string Token { get; set; } = "";
    public string RefreshToken { get; set; } = "";
  }
}
