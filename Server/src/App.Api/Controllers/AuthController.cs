using App.Api.Dtos;
using App.Api.Services;
using App.Api.Services.AuthServices;
using Microsoft.AspNetCore.Mvc;

namespace App.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(IRegistrationService registrationService) : ControllerBase
    {
        [HttpPost("register/start")]
        public async Task<ActionResult> StartRegistration(
            [FromBody] StartRegistrationRequest request
        )
        {
            var result = await registrationService.StartRegistrationAsync(
                username: request.Username!.ToLower(),
                email: request.Email!.ToLower()
            );

            return ResultMapper(result);
        }

        [HttpPost("register/verify-otp")]
        public async Task<ActionResult> VerifyOtp([FromBody] VerifyOtpRequest request)
        {
            var result = await registrationService.VerifyOtpAsync(
                username: request.Username!.ToLower(),
                email: request.Email!.ToLower(),
                otp: request.Otp!
            );

            return ResultMapper(result);
        }

        private ActionResult ResultMapper(Result result)
        {
            return result.ResultType switch
            {
                ResultTypes.Success => Ok(result.Message),
                ResultTypes.NoContent => NoContent(),
                ResultTypes.Created => CreatedAtAction(null, null, result.Message),

                ResultTypes.BadRequest => BadRequest(result.Message),
                ResultTypes.Unauthorized => Unauthorized(result.Message),
                ResultTypes.Forbidden => Forbid(result.Message!),
                ResultTypes.NotFound => NotFound(result.Message),
                ResultTypes.Conflict => Conflict(result.Message),
                ResultTypes.TooManyRequests => StatusCode(429, result.Message),
                ResultTypes.InternalServerError => StatusCode(500, result.Message),

                _ => StatusCode(500, "An unexpected error occurred"),
            };
        }
    }
}
