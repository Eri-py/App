using App.Api.Data;
using App.Api.Data.Entities;
using App.Api.Services.EmailServices;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace App.Api.Services.AuthServices;

public class RegistrationService(AppDbContext context, IEmailService emailService)
    : IRegistrationService
{
    public async Task<Results> StartRegistrationAsync(string username, string email)
    {
        var user = await context.Users.FirstOrDefaultAsync(u =>
            u.Username == username || u.Email == email
        );

        string otp = (Random.NextInt() % 1000000).ToString("000000");

        if (user is not null)
        {
            if (user.Role != UserRoles.Unverified)
            {
                return Results.Failure("User with these credentials already exists");
            }

            user.Otp = otp;
            user.OtpExpiresAt = DateTime.Now.AddMinutes(5);
        }
        else
        {
            // Create new user
            var newUser = new User
            {
                Username = username,
                Email = email,
                Otp = otp,
                OtpExpiresAt = DateTime.Now.AddMinutes(5),
                Role = UserRoles.Unverified,
            };
            context.Users.Add(newUser);
        }

        var emailResult = await emailService.SendEmailVerificationAsync(
            to: email,
            username: username,
            verificationToken: otp
        );
        // if (!emailResult.IsSuccess)
        //     return Results.Failure(emailResult.ErrorMessage!);

        await context.SaveChangesAsync();
        return Results.Success();
    }

    public async Task<Results> VerifyOtpAsync(string username, string email, string otp)
    {
        var user = await context.Users.FirstOrDefaultAsync(u =>
            u.Username == username && u.Email == email && u.Otp == otp
        );

        if (user is null || user.OtpExpiresAt < DateTime.Now)
        {
            return Results.Failure("Invalid Verification code");
        }

        user.Otp = null;
        user.OtpExpiresAt = null;
        await context.SaveChangesAsync();

        return Results.Success();
    }

    public Task<Results> CompleteRegistrationAsync()
    {
        throw new NotImplementedException();
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
