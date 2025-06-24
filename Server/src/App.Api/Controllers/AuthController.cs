using App.Api.Dtos;
using App.Api.Services.AuthServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace App.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(IAuthService authService) : ControllerBase
    {
        [HttpPost("register/verify-credentials")]
        public async Task<ActionResult<string>> VerifyRegistrationCredentials(
            [FromBody] VerifyRegistrationCredentialRequest request
        )
        {
            var username = request.Username!.ToLower();
            var email = request.Email!.ToLower();
            var result = await authService.VerifyUserCredentialsAsync(
                username: username,
                email: email
            );

            if (!result.IsSuccess)
                return BadRequest(result.ErrorMessage);

            return Ok();
        }
    }
}
