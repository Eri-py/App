using App.Api.Controllers.Helpers;
using App.Api.Dtos;
using App.Api.Services.AuthServices.RegistrationServices;
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
            var result = await registrationService.StartRegistrationAsync(request);
            return ResultMapper.Map(result);
        }

        [HttpPost("register/verify-otp")]
        public async Task<ActionResult> VerifyOtp([FromBody] VerifyOtpRequest request)
        {
            var result = await registrationService.VerifyOtpAsync(request);
            return ResultMapper.Map(result);
        }

        [HttpPost("resend-verification-code")]
        public async Task<ActionResult<string>> ResendVerificationCode(
            [FromBody] ResendVerificationCodeRequest request
        )
        {
            var result = await registrationService.ResendVerificationCodeAsync(request);
            return ResultMapper.Map(result);
        }

        [HttpPost("register/complete")]
        public async Task<ActionResult<string>> CompleteRegistration(
            [FromBody] CompleteRegistrationRequest request
        )
        {
            var result = await registrationService.CompleteRegistrationAsync(request);
            if (!result.IsSuccess)
            {
                return ResultMapper.Map<string>(result.ResultType, result.Message, null);
            }

            return NoContent();
        }
    }
}
