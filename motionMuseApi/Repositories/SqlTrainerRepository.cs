using Microsoft.EntityFrameworkCore;
using motionMuseApi.Models;

namespace motionMuseApi.Repositories
{
  public class SqlTrainerRepository(MyDbContext dbcontext) : ITrainingRepository
  {

    private readonly MyDbContext _context = dbcontext;

    public async Task<Training> Create(Training newTraining)
    {
      _context.Training.Add(newTraining);
      await _context.SaveChangesAsync();

      return newTraining;
    }

    public async Task<Training?> Delete(Guid id)
    {
      var training = await _context.Training.FindAsync(id);

      if (training is null)
      {
        return null;
      }

      _context.Training.Remove(training);
      await _context.SaveChangesAsync();

      return training;
    }

    public async Task<IEnumerable<Training?>> Get()
    {
      return await _context.Training.ToListAsync();
    }

    public async Task<Training?> Get(Guid id)
    {
      var training = await _context.Training.FindAsync(id);

      if (training is null)
      {
        return null;
      }

      return training;
    }

    public async Task<Training?> Update(Guid id, Training trainingToUpdate)
    {
      if (id != trainingToUpdate.Id)
      {
        return null;
      }

      _context.Entry(trainingToUpdate).State = EntityState.Modified;

      try
      {
        await _context.SaveChangesAsync();
      }
      catch (DbUpdateConcurrencyException)
      {
        if (!TrainingExists(id))
        {
          return null;
        }
        else
        {
          return null;
        }
      }

      return trainingToUpdate;
    }

    private bool TrainingExists(Guid id)
    {
      return _context.Training.Any(x => x.Id == id);
    }
  }
}