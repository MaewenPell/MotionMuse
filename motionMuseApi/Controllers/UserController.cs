using Microsoft.AspNetCore.Mvc;
using motionMuseApi.Mappings;
using motionMuseApi.Models;
using motionMuseApi.Repositories;

namespace motionMuseApi.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class UserController(IUserRepository userRepository) : ControllerBase
  {
    private readonly IUserRepository _userRepository = userRepository;

    [HttpPost("register")]
    public async Task<IActionResult> Register(UserDto user, string password)
    {
      var registeredUser = await _userRepository.RegisterUser(user, password);
      return CreatedAtAction(nameof(Register), new { username = registeredUser.Username }, registeredUser);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(string name, string password)
    {
      var user = await _userRepository.AuthenticateUser(name, password);

      if (user == null)
      {
        return Unauthorized();
      }

      return Ok(user);
    }
  }
}