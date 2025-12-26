using System.Text.Json.Serialization;

namespace motionMuseApi.Models
{
  public class TokenResponse
  {
    [JsonPropertyName("access_token")]
    public string? AccessToken { get; set; } = default!;

    [JsonPropertyName("token_type")]
    public string? TokenType { get; set; } = default!;

  }
}