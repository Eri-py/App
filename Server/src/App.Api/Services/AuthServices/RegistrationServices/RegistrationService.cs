using App.Api.Data;
using App.Api.Data.Entities;
using App.Api.Dtos;
using App.Api.Services.AuthServices.TokenServices;
using App.Api.Services.EmailServices;
using App.Api.Services.Helpers;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace App.Api.Services.AuthServices.RegistrationServices;

public class RegistrationService(
    AppDbContext context,
    IEmailService emailService,
    IJwtService jwtService
) : IRegistrationService
{
    private const int c_OtpValidFor = 5;
    private const int c_AccessTokenValidFor = 15;
    private const int c_RefreshTokenValidFor = 7;

    public async Task<Result<string>> StartRegistrationAsync(StartRegistrationRequest request)
    {
        var username = request.Username.ToLower();
        var email = request.Email.ToLower();

        var user = await context.Users.FirstOrDefaultAsync(u =>
            u.Username == username || u.Email == email
        );

        string otp = (CryptoRandom.NextInt() % 1000000).ToString("000000");
        var otpExpiresAt = DateTime.UtcNow.AddMinutes(c_OtpValidFor);

        using var transaction = await context.Database.BeginTransactionAsync();
        try
        {
            if (user is not null)
            {
                if (user.CreatedAt.HasValue)
                {
                    return user.Username == username
                        ? Result.Conflict("Username taken")
                        : Result.Conflict("Email taken");
                }

                user.Username = username;
                user.Email = email;
                user.Otp = otp;
                user.OtpExpiresAt = otpExpiresAt;
            }
            else
            {
                var newUser = new User
                {
                    Username = username,
                    Email = email,
                    Otp = otp,
                    OtpExpiresAt = otpExpiresAt,
                };
                context.Users.Add(newUser);
            }

            await context.SaveChangesAsync();

            var emailResult = await emailService.SendEmailVerificationAsync(
                to: email,
                username: username,
                verificationToken: otp,
                codeValidFor: $"{c_OtpValidFor} minutes"
            );

            if (!emailResult.IsSuccess)
            {
                await transaction.RollbackAsync();
                return emailResult;
            }

            await transaction.CommitAsync();
            return Result<string>.Success(otpExpiresAt.ToString("o"));
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

    public async Task<Result<CompleteRegistrationResult>> CompleteRegistrationAsync(
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

        // Calculate expiration dates
        var accessTokenExpiresAt = DateTime.UtcNow.AddMinutes(c_AccessTokenValidFor);
        var refreshTokenExpiresAt = DateTime.UtcNow.AddDays(c_RefreshTokenValidFor);

        // Add refresh token
        var refreshToken = jwtService.CreateRefreshToken();
        var refreshTokenEntry = new RefreshToken
        {
            TokenHash = jwtService.HashToken(refreshToken),
            TokenExpiresAt = refreshTokenExpiresAt,
            UserId = user.Id,
        };
        user.RefreshTokens.Add(refreshTokenEntry);

        await context.SaveChangesAsync();

        var accessToken = jwtService.CreateAccessToken(user, c_AccessTokenValidFor);

        return Result<CompleteRegistrationResult>.Success(
            new CompleteRegistrationResult
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                AccessTokenExpiresAt = accessTokenExpiresAt,
                RefreshTokenExpiresAt = refreshTokenExpiresAt,
            }
        );
    }

    public async Task<Result<string>> ResendVerificationCodeAsync(
        ResendVerificationCodeRequest request
    )
    {
        var identifier = request.Identifier.ToLower();

        var user = await context.Users.FirstOrDefaultAsync(u =>
            u.Username == identifier || u.Email == identifier
        );

        if (user is null)
            return Result.NotFound("User not found");

        string otp = (CryptoRandom.NextInt() % 1000000).ToString("000000");
        var otpExpiresAt = DateTime.UtcNow.AddMinutes(c_OtpValidFor);

        using var transaction = await context.Database.BeginTransactionAsync();
        try
        {
            user.Otp = otp;
            user.OtpExpiresAt = otpExpiresAt;

            await context.SaveChangesAsync();

            var emailResult = await emailService.SendEmailVerificationAsync(
                to: user.Email!,
                username: user.Username!,
                verificationToken: otp,
                codeValidFor: "5 minutes"
            );
            if (!emailResult.IsSuccess)
            {
                await transaction.RollbackAsync();
                return emailResult;
            }

            await transaction.CommitAsync();
            return Result<string>.Success(otpExpiresAt.ToString("o"));
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
}
