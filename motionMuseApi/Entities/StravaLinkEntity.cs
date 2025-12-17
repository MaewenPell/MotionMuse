using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using motionMuseApi.Interface;

namespace motionMuseApi.Entities
{
  public class StravaLinkEntity: IAuditableEntity
  {
    public Guid Id { get; set; }
    public string Auth0UserId { get; set; } = default!;
    public long StravaAthleteId {get; set;}
    public string AccessToken {get; set;} = default!;
    public string RefreshToken {get; set;} = default!;
    public DateTime CreatedAtUtc { get ; set; }
    public DateTime UpdatedAtUtc { get; set; }
  }
}