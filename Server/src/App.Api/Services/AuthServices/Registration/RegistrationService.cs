using App.Api.Data;
using App.Api.Data.Entities;
using App.Api.Dtos;
using App.Api.Services.EmailServices;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace App.Api.Services.AuthServices.Registration;

public class RegistrationService(
    AppDbContext context,
    IEmailService emailService,
    IConfiguration configuration
) : IRegistrationService
{
    private readonly int OtpValidFor = 5;

    public async Task<Result<string>> StartRegistrationAsync(StartRegistrationRequest request)
    {
        var username = request.Username.ToLower();
        var email = request.Email.ToLower();

        var user = await context.Users.FirstOrDefaultAsync(u =>
            u.Username == username || u.Email == email
        );

        string otp = (Shared.Random.NextInt() % 1000000).ToString("000000");
        var otpExpiresAt = DateTime.UtcNow.AddMinutes(OtpValidFor);

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
                codeValidFor: "5 minutes"
            );

            if (!emailResult.IsSuccess)
            {
                await transaction.RollbackAsync();
                return emailResult;
            }

            await transaction.CommitAsync();
            return Result<string>.Success(otpExpiresAt.ToString("o"), "Verification code sent");
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

    public async Task<Result<string>> CompleteRegistrationAsync(CompleteRegistrationRequest request)
    {
        var email = request.Email.ToLower();
        var username = request.Username.ToLower();
        var user = await context.Users.FirstOrDefaultAsync(u =>
            u.Email == email && u.Username == username
        );

        if (user is null)
            return Result.BadRequest("User not found");

        user.PasswordHash = new PasswordHasher<User>().HashPassword(user, request.Password);
        user.Firstname = request.Firstname;
        user.Lastname = request.Lastname;
        user.DateOfBirth = DateTime.Parse(request.DateOfBirth);
        user.CreatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync();

        var token = Shared.CreateToken(user, configuration);
        return Result<string>.Success(token, "Registration completed successfully");
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
            return Result.BadRequest("User not found");

        string otp = (Shared.Random.NextInt() % 1000000).ToString("000000");
        var otpExpiresAt = DateTime.UtcNow.AddMinutes(OtpValidFor);

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
            return Result<string>.Success(otpExpiresAt.ToString("o"), "Verification code resent");
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
}
