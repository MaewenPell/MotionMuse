using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using motionMuseApi.Services;

namespace motionMuseApi.Controllers
{
  [ApiController]
  [Route("api/strava")]
  [Authorize]
  public class StravaController(IStravaAuthService service) : ControllerBase
  {
    [HttpGet]
    [Route("_debug/m2m")]
    public async Task<string> Ping()
    {
      var auth0UserId = User.FindFirst("sub")?.Value ?? "";

      // TODO : A partir du User recupéré via le front et le userAccess  token
      // Chopper le bon claim (name identifier) et le mettre en bd.

      if (string.IsNullOrEmpty(auth0UserId))
      {
        return "";
      }

      return await service.GetValidAccessTokenAsync(auth0UserId);
    }
  }
}