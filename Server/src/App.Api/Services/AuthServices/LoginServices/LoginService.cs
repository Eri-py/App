using System;
using App.Api.Data;
using App.Api.Dtos;
using App.Api.Results;
using App.Api.Services.AuthServices.TokenServices;
using App.Api.Services.EmailServices;
using Microsoft.EntityFrameworkCore;

namespace App.Api.Services.AuthServices.LoginServices;

public class LoginService(AppDbContext context, IEmailService emailService, IJwtService jwtService)
    : ILoginService
{
    private const int c_OtpValidFor = 5; // Time in minutes Otp is valid for.
    private const int c_AccessTokenValidFor = 15; // Time in minutes Access Token is valid for.
    private const int c_RefreshTokenValidFor = 7; // Time in days Refresh Token is valid for.

    public async Task<Result<string>> StartLoginAsync(LoginRequest request)
    {
        var identifier = request.Identifier.ToLower();
        var password = request.Password;
        var user = await context.Users.FirstOrDefaultAsync(u =>
            u.Username == identifier || u.Email == identifier
        );

        if (user is null)
        {
            return Result.NotFound($"Your login credentials don't match an account in our system.");
        }

        return Result<string>.Success("Yayyyyy");
    }

    public Task<Result<AuthResult>> CompleteLoginAsync(VerifyOtpRequest request)
    {
        throw new NotImplementedException();
    }
}
