namespace motionMuseApi.Models
{
  public class Training
  {
    public Guid Id { get; set; } = Guid.NewGuid();
    public required string Title { get; set; }

    public required double LengthInKm { get; set; }

    public required double ElevationGainInM { get; set; }

    public double NumberOfReps { get; set; }

    public double NumberOfIntervals { get; set; }

    public double IntervalDurationInSeconds { get; set; }

    public double IntervalRestDurationInSeconds { get; set; }
  }
}