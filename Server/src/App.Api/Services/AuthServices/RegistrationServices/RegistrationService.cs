using App.Api.Data;
using App.Api.Data.Entities;
using App.Api.Dtos;
using App.Api.Results;
using App.Api.Services.AuthServices.TokenServices;
using App.Api.Services.EmailServices;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace App.Api.Services.AuthServices.RegistrationServices;

public class RegistrationService(
    AppDbContext context,
    IEmailService emailService,
    ITokenService jwtService
) : IRegistrationService
{
    public async Task<Result<string>> StartRegistrationAsync(StartRegistrationRequest request)
    {
        var username = request.Username.ToLower();
        var email = request.Email.ToLower();

        var user = await context.Users.FirstOrDefaultAsync(u =>
            u.Username == username || u.Email == email
        );

        var otpDetails = jwtService.CreateOtp(AuthConfig.OtpValidForMinutes);
        using var transaction = await context.Database.BeginTransactionAsync();
        try
        {
            if (user is not null)
            {
                if (user.CreatedAt.HasValue)
                    return user.Username == username
                        ? Result.Conflict("Username taken")
                        : Result.Conflict("Email taken");

                // Update user details rather than create new user
                user.Username = username;
                user.Email = email;
                user.Otp = otpDetails.Value;
                user.OtpExpiresAt = otpDetails.ExpiresAt;
            }
            else
            {
                var newUser = new User
                {
                    Username = username,
                    Email = email,
                    Otp = otpDetails.Value,
                    OtpExpiresAt = otpDetails.ExpiresAt,
                };
                context.Users.Add(newUser);
            }
            await context.SaveChangesAsync();

            var emailResult = await emailService.SendOtpEmailAsync(
                to: email,
                username: username,
                otp: otpDetails.Value,
                otpValidFor: $"{AuthConfig.OtpValidForMinutes} minutes"
            );
            if (!emailResult.IsSuccess)
            {
                await transaction.RollbackAsync();
                return emailResult;
            }

            await transaction.CommitAsync();
            return Result<string>.Success(otpDetails.ExpiresAt.ToString("o"));
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<Result> VerifyOtpAsync(VerifyOtpRequest request)
    {
        var email = request.Email.ToLower();
        var user = await context.Users.FirstOrDefaultAsync(u =>
            u.Email == email && u.Otp == request.Otp
        );

        if (user is null || user.OtpExpiresAt < DateTime.UtcNow)
            return Result.BadRequest("Invalid or expired verification code");

        user.Otp = null;
        user.OtpExpiresAt = null;
        await context.SaveChangesAsync();

        return Result.NoContent();
    }

    public async Task<Result<AuthResult>> CompleteRegistrationAsync(
        CompleteRegistrationRequest request
    )
    {
        var email = request.Email.ToLower();
        var username = request.Username.ToLower();
        var user = await context.Users.FirstOrDefaultAsync(u =>
            u.Email == email && u.Username == username
        );
        if (user is null)
            return Result.NotFound("User not found");

        // Update user
        user.PasswordHash = new PasswordHasher<User>().HashPassword(user, request.Password);
        user.Firstname = request.Firstname;
        user.Lastname = request.Lastname;
        user.DateOfBirth = DateOnly.Parse(request.DateOfBirth);
        user.CreatedAt = DateTime.UtcNow;

        var refreshTokenDetails = jwtService.CreateRefreshToken(
            AuthConfig.RefreshTokenValidForDays
        );

        // Add token to database
        var refreshTokenEntry = new RefreshToken
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
