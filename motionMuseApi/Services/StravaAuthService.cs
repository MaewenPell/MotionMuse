using motionMuseApi.Models;
using motionMuseApi.Repositories;

namespace motionMuseApi.Services
{
  public class StravaAuthService(IStravaLinkRepository stravaLinkRepository) : IStravaAuthService
  {
    public async Task<string?> GetValidAccessTokenAsync(string auth0UserId, CancellationToken ct = default)
    {
      // Recherche en DB
      var entity = await stravaLinkRepository.GetByAuth0UserIdAsync(auth0UserId, ct);

      if (entity?.AccessToken is not null)
      {
        return entity.AccessToken;
      }

      // Bootstrap on veut récupérer un Management API Token
      return await GetAccessTokenFromM2M();
    }

    private static async Task<string?> GetAccessTokenFromM2M()
    {
      var httpClient = new HttpClient();

      var URI = "https://dev-motion-muse.eu.auth0.com/oauth/token";

      var body = new
      {
        client_id = Environment.GetEnvironmentVariable("AUTH0_CLIENT_ID"),
        client_secret = Environment.GetEnvironmentVariable("AUTH0_CLIENT_SECRET"),
        audience = "https://dev-motion-muse.eu.auth0.com/api/v2/",
        grant_type = "client_credentials"
      };

      using HttpResponseMessage responseMessage = await httpClient.PostAsJsonAsync(URI, body);

      if (responseMessage.IsSuccessStatusCode)
      {
        var res = await responseMessage.Content.ReadFromJsonAsync<TokenResponse>();

        if (res == null)
        {
          throw new Exception("Null value dans le res");
        }

        Console.Write(res.AccessToken);

        return res.AccessToken;

      }
      else
      {
        throw new Exception(responseMessage.RequestMessage.ToString());
      }

    }
  }
}
