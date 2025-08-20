using App.Api.Data;
using App.Api.Data.Entities;
using App.Api.Dtos;
using App.Api.Results;
using App.Api.Services.AuthServices.TokenServices;
using App.Api.Services.EmailServices;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace App.Api.Services.AuthServices.LoginServices;

public class LoginService(
    AppDbContext context,
    IEmailService emailService,
    ITokenService jwtService
) : ILoginService
{
    private readonly string _userNotFoundMessage =
        "Your login credentials don't match an account in our system.";
    private readonly string _incompleteRegistrationMessage =
        "Account registration is not complete. Please complete your registration first.";

    public async Task<Result<StartLoginResponse>> StartLoginAsync(StartLoginRequest request)
    {
        var identifier = request.Identifier.ToLower();
        var password = request.Password;
        var user = await context.Users.FirstOrDefaultAsync(u =>
            u.Username == identifier || u.Email == identifier
        );
        if (user is null)
            return Result.NotFound(_userNotFoundMessage);

        // Check if user has completed registration
        if (!user.CreatedAt.HasValue)
            return Result.BadRequest(_incompleteRegistrationMessage);

        // Verify password
        var verifyPasswordResult = new PasswordHasher<UserEntity>().VerifyHashedPassword(
            user,
            user.PasswordHash!,
            password
        );

        if (verifyPasswordResult == PasswordVerificationResult.Failed)
            return Result.NotFound(_userNotFoundMessage);

        var otpDetails = jwtService.CreateOtp(AuthConfig.OtpValidForMinutes);
        using var transaction = await context.Database.BeginTransactionAsync();
        try
        {
            // Update user with new OTP
            user.Otp = otpDetails.Value;
            user.OtpExpiresAt = otpDetails.ExpiresAt;

            await context.SaveChangesAsync();

            var emailResult = await emailService.SendOtpEmailAsync(
                to: user.Email!,
                username: user.Username!,
                otp: otpDetails.Value,
                otpValidFor: $"{AuthConfig.OtpValidForMinutes} minutes"
            );

            if (!emailResult.IsSuccess)
            {
                await transaction.RollbackAsync();
                return emailResult;
            }
            await transaction.CommitAsync();

            var response = new StartLoginResponse
            {
                OtpExpiresAt = otpDetails.ExpiresAt.ToString("o"),
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

    public async Task<Result<AuthResult>> CompleteLoginAsync(CompleteLoginRequest request)
    {
        var identifier = request.Identifier.ToLower();
        var user = await context.Users.FirstOrDefaultAsync(u =>
            (u.Email == identifier || u.Username == identifier) && u.Otp == request.Otp
        );

        if (user is null || user.OtpExpiresAt < DateTime.UtcNow)
            return Result.BadRequest("Invalid or expired verification code");

        // Check if user has completed registration
        if (!user.CreatedAt.HasValue)
            return Result.BadRequest(_incompleteRegistrationMessage);

        // Clear the OTP
        user.Otp = null;
        user.OtpExpiresAt = null;

        var refreshTokenDetails = jwtService.CreateRefreshToken(
            AuthConfig.RefreshTokenValidForDays
        );
        // Add refresh token to database
        var refreshTokenEntry = new RefreshTokenEntity
        {
            TokenHash = jwtService.HashToken(refreshTokenDetails.Value),
            TokenExpiresAt = refreshTokenDetails.ExpiresAt,
            UserId = user.Id,
        };
        user.RefreshTokens.Add(refreshTokenEntry);

        await context.SaveChangesAsync();

        var accessTokenDetails = jwtService.CreateAccessToken(
            user,
            AuthConfig.AccessTokenValidForMinutes
        );
        return Result<AuthResult>.Success(
            new AuthResult
            {
                AccessToken = accessTokenDetails.Value,
                RefreshToken = refreshTokenDetails.Value,
                AccessTokenExpiresAt = accessTokenDetails.ExpiresAt,
                RefreshTokenExpiresAt = refreshTokenDetails.ExpiresAt,
            }
        );
    }
}
