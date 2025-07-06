using App.Api.Data;
using App.Api.Data.Entities;
using App.Api.Dtos;
using App.Api.Services.EmailServices;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace App.Api.Services.AuthServices;

public class RegistrationService(AppDbContext context, IEmailService emailService)
    : IRegistrationService
{
    public async Task<Result<string>> StartRegistrationAsync(StartRegistrationRequest request)
    {
        var username = request.Username.ToLower();
        var email = request.Email.ToLower();
        var user = await context.Users.FirstOrDefaultAsync(u => u.Email == email);

        string otp = (Random.NextInt() % 1000000).ToString("000000");
        var otpExpiresAt = DateTime.UtcNow.AddMinutes(5);

        if (user is not null)
        {
            if (user.CreatedAt.HasValue)
            {
                return Result.Conflict("User with these credentials already exists");
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
                CreatedAt = null,
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
            return emailResult;

        return Result<string>.Success(otpExpiresAt.ToString("o"), "Verification code sent");
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

    public async Task<Result<UserResponse>> CompleteRegistrationAsync(
        CompleteRegistrationRequest request
    )
    {
        var email = request.Email.ToLower();
        var user = await context.Users.FirstOrDefaultAsync(u => u.Email == email);

        if (user is null)
            return Result.BadRequest("User not found");

        user.Username = request.Username.ToLower();
        user.Email = email;
        user.PasswordHash = new PasswordHasher<User>().HashPassword(user, request.Password);
        user.Firstname = request.Firstname;
        user.Lastname = request.Lastname;
        user.DateOfBirth = DateTime.Parse(request.DateOfBirth);
        user.CreatedAt = DateTime.UtcNow;
        await context.SaveChangesAsync();

        var response = new UserResponse
        {
            Username = user.Username,
            Email = user.Email,
            Firstname = user.Firstname,
            Lastname = user.Lastname,
            Jwt = "This is a token",
        };

        return Result<UserResponse>.Success(response, "Registration completed successfully");
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

        string otp = (Random.NextInt() % 1000000).ToString("000000");
        var otpExpiresAt = DateTime.UtcNow.AddMinutes(5);

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
            return emailResult;

        return Result<string>.Success(otpExpiresAt.ToString("o"), "Verification code resent");
    }
}

public static class Random
{
    private static readonly ThreadLocal<System.Security.Cryptography.RandomNumberGenerator> crng =
        new(System.Security.Cryptography.RandomNumberGenerator.Create);
    private static readonly ThreadLocal<byte[]> bytes = new(() => new byte[sizeof(int)]);

    public static int NextInt()
    {
        crng.Value!.GetBytes(bytes.Value!);
        return BitConverter.ToInt32(bytes.Value!, 0) & int.MaxValue;
    }
}
