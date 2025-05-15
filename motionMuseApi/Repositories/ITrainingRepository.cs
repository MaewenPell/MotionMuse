using motionMuseApi.Models;

namespace motionMuseApi.Repositories
{
  public interface ITrainingRepository
  {
    Task<IEnumerable<Training?>> Get();
    Task<Training?> Get(Guid id);
    Task<Training> Create(Training newTraining);
    Task<Training?> Update(Guid id, Training trainingToUpdate);
    Task<Training?> Delete(Guid id);
  }
}