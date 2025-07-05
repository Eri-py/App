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
        public async Task<ActionResult<string>> StartRegistration(
            [FromBody] StartRegistrationRequest request
        )
        {
            var result = await registrationService.StartRegistrationAsync(
                username: request.Username!.ToLower(),
                email: request.Email!.ToLower()
            );

            return ResultMapper.Map(result);
        }

        [HttpPost("register/verify-otp")]
        public async Task<ActionResult> VerifyOtp([FromBody] VerifyOtpRequest request)
        {
            var result = await registrationService.VerifyOtpAsync(
                username: request.Username!.ToLower(),
                email: request.Email!.ToLower(),
                otp: request.Otp!
            );

            return ResultMapper.Map(result);
        }

        [HttpPost("resend-verification-code")]
        public async Task<ActionResult<string>> ResendVerificationCode(
            [FromBody] ResendVerificationCodeRequest request
        )
        {
            var result = await registrationService.ResendVerificationCodeAsync(
                identifier: request.Identifier!.ToLower()
            );

            return ResultMapper.Map(result);
        }
    }
}
