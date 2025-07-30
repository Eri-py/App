using System.Security.Claims;
using App.Api.Dtos;
using App.Api.Results;
using App.Api.Services.AuthServices;
using App.Api.Services.AuthServices.LoginServices;
using App.Api.Services.AuthServices.RegistrationServices;
using App.Api.Services.AuthServices.TokenServices;
using Microsoft.AspNetCore.Mvc;

namespace App.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(
        IRegistrationService registrationService,
        ILoginService loginService,
        ITokenService tokenService
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

        [HttpPost("resend-otp")]
        public async Task<ActionResult<string>> ResendOtp([FromBody] ResendOtpRequest request)
        {
            var result = await tokenService.ResendOtpAsync(request.Identifier);
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
        public async Task<ActionResult<string>> RefreshToken()
        {
            var refreshToken = Request.Cookies["__Secure-refreshToken"];
            if (refreshToken is null)
            {
                return BadRequest("Invalid token");
            }

            var result = await tokenService.VerifyRefreshTokenAsync(refreshToken);
            if (!result.IsSuccess)
            {
                return ResultMapper.Map<string>(result.ResultType, result.Message, null);
            }

            SetAuthCookies(result.Content!);
            return NoContent();
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
