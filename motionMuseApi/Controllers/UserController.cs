using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using motionMuseApi.Models;
using motionMuseApi.Repositories;

namespace motionMuseApi.Controllers
{
  [ApiController]
  [Authorize]
  [Route("api/[controller]")]
  public class UserController(IUserRepository userRepository) : ControllerBase
  {
    private readonly IUserRepository _userRepository = userRepository;

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserRegisterDto user)
    {
      var registeredUser = await _userRepository.RegisterUser(user);

      return CreatedAtAction(nameof(Register), registeredUser);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto login)
    {
      var loginDto = new LoginDto
      {
        Password = login.Password,
        Username = login.Username
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