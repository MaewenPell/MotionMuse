namespace motionMuseApi.Models
{
  public class User
  {
    public Guid Id { get; set; } = Guid.NewGuid();
    public required string Username { get; set; }
    public required string PasswordHash { get; set; }
    public required string RefreshToken { get; set; }
    public required int ExpiresAt { get; set; }
    public required int ExpiresIn { get; set; }
    public required string Token { get; set; }
    public required bool IsAccountFinalized { get; set; }
  }
}