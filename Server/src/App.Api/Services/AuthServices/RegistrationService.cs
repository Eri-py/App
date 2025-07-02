using App.Api.Data;
using App.Api.Data.Entities;
using App.Api.Services.EmailServices;
using Microsoft.EntityFrameworkCore;

namespace App.Api.Services.AuthServices;

public class RegistrationService(AppDbContext context, IEmailService emailService)
    : IRegistrationService
{
    public async Task<Result> StartRegistrationAsync(string username, string email)
    {
        var user = await context.Users.FirstOrDefaultAsync(u =>
            u.Username == username || u.Email == email
        );
        string otp = (Random.NextInt() % 1000000).ToString("000000");

        if (user is not null)
        {
            if (user.Role != UserRoles.Unverified)
            {
                return Result.Conflict("User with these credentials already exists");
            }
            user.Username = username;
            user.Email = email;
            user.Otp = otp;
            user.OtpExpiresAt = DateTime.UtcNow.AddMinutes(5);
        }
        else
        {
            var newUser = new User
            {
                Username = username,
                Email = email,
                Otp = otp,
                OtpExpiresAt = DateTime.UtcNow.AddMinutes(5),
                Role = UserRoles.Unverified,
            };
            context.Users.Add(newUser);
        }

        await context.SaveChangesAsync();

        var emailResult = await emailService.SendEmailVerificationAsync(
            to: email,
            username: username,
            verificationToken: otp
        );
        if (!emailResult.IsSuccess)
            return emailResult;

        return Result.NoContent();
    }

    public async Task<Result> VerifyOtpAsync(string username, string email, string otp)
    {
        var user = await context.Users.FirstOrDefaultAsync(u =>
            u.Username == username && u.Email == email && u.Otp == otp
        );
        if (user is null || user.OtpExpiresAt < DateTime.Now)
        {
            return Result.BadRequest("Invalid Verification code");
        }

        user.Otp = null;
        user.OtpExpiresAt = null;
        await context.SaveChangesAsync();

        return Result.NoContent();
    }

    public Task<Result> CompleteRegistrationAsync()
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
