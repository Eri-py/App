using App.Api.Data;
using App.Api.Data.Entities;
using App.Api.Services.EmailServices;
using Microsoft.EntityFrameworkCore;

namespace App.Api.Services.AuthServices;

public class JwtAuthService(AppDbContext context, IEmailService emailService) : IAuthService
{
    public async Task<Results> VerifyUserCredentialsAsync(string username, string email)
    {
        var existingUser = await context.Users.FirstOrDefaultAsync(u =>
            u.Username == username || u.Email == email
        );

        if (existingUser is not null)
        {
            if (existingUser.Role != UserRoles.Unverified)
            {
                return Results.Failure("User with Credentials Exists");
            }
            context.Users.Remove(existingUser);
            await context.SaveChangesAsync();
        }

        string otp = (Random.NextInt() % 1000000).ToString("000000");
        var emailResult = await emailService.SendEmailVerificationAsync(
            to: email,
            username: username,
            verificationToken: otp
        );
        if (!emailResult.IsSuccess)
            return Results.Failure(emailResult.ErrorMessage!);

        var newUser = new User
        {
            Username = username,
            Email = email,
            Otp = otp,
            OtpExpiresAt = DateTime.Now.AddMinutes(1.5),
            Role = UserRoles.Unverified,
        };

        // Update database
        context.Users.Add(newUser);
        await context.SaveChangesAsync();

        return Results.Success();
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
