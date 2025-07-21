using System;
using App.Api.Data;
using App.Api.Data.Entities;
using App.Api.Dtos;
using App.Api.Results;
using App.Api.Services.AuthServices.TokenServices;
using App.Api.Services.EmailServices;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace App.Api.Services.AuthServices.LoginServices;

public class LoginService(AppDbContext context, IEmailService emailService, IJwtService jwtService)
    : ILoginService
{
    private const int c_OtpValidFor = 5; // Time in minutes Otp is valid for.
    private const int c_AccessTokenValidFor = 15; // Time in minutes Access Token is valid for.
    private const int c_RefreshTokenValidFor = 7; // Time in days Refresh Token is valid for.

    public async Task<Result<StartLoginResponse>> StartLoginAsync(StartLoginRequest request)
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

        // Check if user has completed registration
        if (!user.CreatedAt.HasValue)
        {
            return Result.BadRequest(
                "Account registration is not complete. Please complete your registration first."
            );
        }

        // Verify password
        var verificationResult = new PasswordHasher<User>().VerifyHashedPassword(
            user,
            user.PasswordHash!,
            password
        );

        if (verificationResult == PasswordVerificationResult.Failed)
        {
            return Result.NotFound("Your login credentials don't match an account in our system.");
        }

        var (otp, otpExpiresAt) = jwtService.CreateOtp(c_OtpValidFor);
        using var transaction = await context.Database.BeginTransactionAsync();
        try
        {
            // Update user with new OTP
            user.Otp = otp;
            user.OtpExpiresAt = otpExpiresAt;

            await context.SaveChangesAsync();

            // var emailResult = await emailService.SendEmailVerificationAsync(
            //     to: user.Email!,
            //     username: user.Username!,
            //     verificationToken: otp,
            //     codeValidFor: $"{c_OtpValidFor} minutes"
            // );

            // if (!emailResult.IsSuccess)
            // {
            //     await transaction.RollbackAsync();
            //     return emailResult;
            // }

            await transaction.CommitAsync();
            var response = new StartLoginResponse
            {
                OtpExpiresAt = otpExpiresAt.ToString("o"),
                Email = user.Email,
            };
            return Result<StartLoginResponse>.Success(response);
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<Result<AuthResult>> CompleteLoginAsync(VerifyOtpRequest request)
    {
        var email = request.Email.ToLower();
        var user = await context.Users.FirstOrDefaultAsync(u =>
            u.Email == email && u.Otp == request.Otp
        );

        if (user is null || user.OtpExpiresAt < DateTime.UtcNow)
        {
            return Result.BadRequest("Invalid or expired verification code");
        }

        // Check if user has completed registration
        if (!user.CreatedAt.HasValue)
        {
            return Result.BadRequest(
                "Account registration is not complete. Please complete your registration first."
            );
        }

        // Clear the OTP
        user.Otp = null;
        user.OtpExpiresAt = null;

        var (refreshToken, refreshTokenExpiresAt) = jwtService.CreateRefreshToken(
            c_RefreshTokenValidFor
        );
        // Add token to database
        var refreshTokenEntry = new RefreshToken
        {
            TokenHash = jwtService.HashToken(refreshToken),
            TokenExpiresAt = refreshTokenExpiresAt,
            UserId = user.Id,
        };
        user.RefreshTokens.Add(refreshTokenEntry);

        await context.SaveChangesAsync();

        var (accessToken, accessTokenExpiresAt) = jwtService.CreateAccessToken(
            user,
            c_AccessTokenValidFor
        );
        return Result<AuthResult>.Success(
            new AuthResult
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                AccessTokenExpiresAt = accessTokenExpiresAt,
                RefreshTokenExpiresAt = refreshTokenExpiresAt,
            }
        );
    }
}
