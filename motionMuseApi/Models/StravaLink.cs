namespace motionMuseApi.Models
{
  public class StravaLink
  {
    public Guid Id {get; set;}
    public string Auth0UserId {get; set;} = default!; // Valeur required mais remplie après.
    public long StravaAthleteId {get;set;}
    public string AccessToken {get;set;} = default!;
    public string RefreshToken {get;set;} = default!;
    public DateTime AccessTokenExpiressAtUtc {get;set;}
  }
}