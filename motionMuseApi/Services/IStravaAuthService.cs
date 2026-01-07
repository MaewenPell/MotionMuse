namespace motionMuseApi.Services
{
  public interface IStravaAuthService
  {
    Task<string?> GetValidAccessTokenAsync(string auth0UserId, CancellationToken ct = default);
  }
}