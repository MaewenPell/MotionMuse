namespace motionMuseApi.Models
{
  public class Training
  {
    public Guid Id { get; set; }
    public required string Title { get; set; }

    public double LengthInKm { get; set; }

    public double ElevationGainInM { get; set; }

    public double NumberOfReps { get; set; }

    public double NumberOfIntervals { get; set; }

    public double IntervalDurationInSeconds { get; set; }

    public double IntervalRestDurationInSeconds { get; set; }
  }
}