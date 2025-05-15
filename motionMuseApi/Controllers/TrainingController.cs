using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using motionMuseApi.Models;
using motionMuseApi.Repositories;

namespace motionMuseApi.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class TrainingController(ITrainingRepository repository) : ControllerBase
  {
    private readonly ITrainingRepository _repository = repository;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Training>>> Get()
    {
      var trainings = await _repository.Get();

      return Ok(trainings);
    }


    [HttpGet("{id}")]
    public async Task<ActionResult<Training?>> Get([FromRoute] Guid id)
    {
      var training = await _repository.Get(id);

      if (training is null)
      {
        return NotFound();
      }

      return Ok(training);
    }

    [HttpPost]
    public async Task<ActionResult<Training>> Create(Training newTraining)
    {
      var training = await _repository.Create(newTraining);

      return CreatedAtAction(nameof(Get), new { id = training.Id }, training);

    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update([FromRoute] Guid id, Training trainingToUpdate)
    {
      var updatedTraining = await _repository.Update(id, trainingToUpdate);

      if (updatedTraining is null)
      {
        return NotFound();
      }

      return Ok(updatedTraining);
    }


    [HttpDelete]
    public async Task<IActionResult> Delete(Guid id)
    {
      var deletedTraining = await _repository.Delete(id);

      if (deletedTraining == null)
      {
        return NotFound();
      }

      return Ok(deletedTraining);
    }
  }

}