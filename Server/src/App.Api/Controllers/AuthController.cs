using System.Security.Claims;
using App.Api.Dtos;
using App.Api.Results;
using App.Api.Services.AuthServices;
using App.Api.Services.AuthServices.LoginServices;
using App.Api.Services.AuthServices.RegistrationServices;
using Microsoft.AspNetCore.Mvc;

namespace App.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(
        IRegistrationService registrationService,
        ILoginService loginService
    ) : ControllerBase
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

        [HttpPost("register/resend-verification-code")]
        public async Task<ActionResult<string>> ResendVerificationCodeRegister(
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

            SetAuthCookies(result.Content!);
            return NoContent();
        }

        [HttpPost("login/start")]
        public async Task<ActionResult<StartLoginResponse>> Login(
            [FromBody] StartLoginRequest request
        )
        {
            var result = await loginService.StartLoginAsync(request);
            return ResultMapper.Map(result);
        }

        [HttpPost("login/resend-verification-code")]
        public async Task<ActionResult<string>> ResendVerificationCodeLogin(
            [FromBody] ResendVerificationCodeRequest request
        )
        {
            var result = await loginService.ResendVerificationCodeAsync(request);
            return ResultMapper.Map(result);
        }

        [HttpPost("login/complete")]
        public async Task<ActionResult<string>> CompleteLogin(
            [FromBody] CompleteLoginRequest request
        )
        {
            var result = await loginService.CompleteLoginAsync(request);
            if (!result.IsSuccess)
            {
                return ResultMapper.Map<string>(result.ResultType, result.Message, null);
            }

            SetAuthCookies(result.Content!);
            return NoContent();
        }

        [HttpGet("get-user-details")]
        public ActionResult<GetUserResponse> GetUserDetails()
        {
            if (!User.Identity!.IsAuthenticated)
                return Unauthorized();

            var userDto = new UserDto
            {
                Id = User.FindFirst(ClaimTypes.NameIdentifier)!.Value,
                Username = User.Identity.Name!,
                Email = User.FindFirst(ClaimTypes.Email)!.Value,
                Firstname = User.FindFirst(ClaimTypes.GivenName)!.Value,
                Lastname = User.FindFirst(ClaimTypes.Surname)!.Value,
            };

            return Ok(new GetUserResponse { IsAuthenticated = true, User = userDto });
        }

        [HttpGet("refresh-token")]
        public IActionResult RefreshToken()
        {
            foreach (var cookie in Request.Cookies)
            {
                Console.WriteLine(cookie.ToString());
            }
            Console.WriteLine("This is a test");
            return Ok("This is a test");
        }

        private void SetAuthCookies(AuthResult tokens)
        {
            // Clear any existing tokens first
            Response.Cookies.Delete("accessToken");
            Response.Cookies.Delete("__Secure-refreshToken");

            var accessTokenOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = Request.IsHttps,
                SameSite = SameSiteMode.Lax,
                Path = "/api",
                Expires = tokens.AccessTokenExpiresAt,
            };

            var refreshTokenOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = Request.IsHttps,
                SameSite = SameSiteMode.Strict,
                Path = "/api/auth/refresh-token",
                Expires = tokens.RefreshTokenExpiresAt,
            };

            Response.Cookies.Append("accessToken", tokens.AccessToken, accessTokenOptions);
            Response.Cookies.Append(
                "__Secure-refreshToken",
                tokens.RefreshToken,
                refreshTokenOptions
            );
        }
    }
}
