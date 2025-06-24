using App.Api.Dtos;
using App.Api.Services.AuthServices;
using Microsoft.AspNetCore.Mvc;

namespace App.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(IRegistrationService registrationService) : ControllerBase
    {
        [HttpPost("register/start")]
        public async Task<ActionResult<string>> StartRegistration(
            [FromBody] StartRegistrationRequest request
        )
        {
            var username = request.Username!.ToLower();
            var email = request.Email!.ToLower();
            var result = await registrationService.StartRegistrationAsync(
                username: username,
                email: email
            );

            if (!result.IsSuccess)
                return BadRequest(result.ErrorMessage);

            return Ok();
        }

        [HttpPost("register/verify-otp")]
        public async Task<ActionResult<string>> VerifyOtp([FromBody] VerifyOtpRequest request)
        {
            var username = request.Username!.ToLower();
            var email = request.Email!.ToLower();

            var result = await registrationService.VerifyOtpAsync(
                username: username,
                email: email,
                otp: request.Otp!
            );

            if (!result.IsSuccess)
            {
                return BadRequest(result.ErrorMessage);
            }

            return Ok();
        }
    }
}
