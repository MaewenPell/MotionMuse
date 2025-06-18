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
    public async Task<IActionResult> Register(UserRegisterDto user)
    {
      var registeredUser = await _userRepository.RegisterUser(user, user.Password);
      return CreatedAtAction(nameof(Register), registeredUser);
    }

    [HttpPost("finalize")]
    public async Task<IActionResult> Finalize(UserRegisterDto user)
    {
      var loggedUser = await _userRepository.Finalize(user);

      if (loggedUser == null)
      {
        return BadRequest();
      }

      return CreatedAtAction(nameof(Finalize), loggedUser);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(string username, string password)
    {
      var loginDto = new LoginDto
      {
        Password = password,
        Username = username
      };

      var user = await _userRepository.AuthenticateUser(loginDto);

      if (user == null)
      {
        return Unauthorized();
      }

      return Ok(user);
    }
  }
}