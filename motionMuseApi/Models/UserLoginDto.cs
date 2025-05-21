namespace motionMuseApi.Models
{
  public class UserLoggedDto
  {
    public required string RefreshToken { get; set; }
    public required string Token { get; set; }
  }
}