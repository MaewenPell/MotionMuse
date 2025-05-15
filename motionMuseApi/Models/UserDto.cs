
namespace motionMuseApi.Models
{
  public class UserDto
  {
    public required string Username { get; set; }
    public required string Password { get; set; }
    public required string InitialToken { get; set; }
    public required string RefreshToken { get; set; }
  }
}
