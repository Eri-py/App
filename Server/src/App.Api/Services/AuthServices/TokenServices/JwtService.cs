using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using App.Api.Data;
using App.Api.Data.Entities;
using App.Api.Results;
using App.Api.Services.EmailServices;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace App.Api.Services.AuthServices.TokenServices;

public class JwtService(
    IConfiguration configuration,
    AppDbContext context,
    IEmailService emailService
) : ITokenService
{
    public TokenDetails CreateOtp(int otpValidForMinutes)
    {
        var token = (CryptoRandom.NextInt() % 1000000).ToString("000000");
        var expiresAt = DateTime.UtcNow.AddMinutes(otpValidForMinutes);
        return new TokenDetails { Value = token, ExpiresAt = expiresAt };
    }

    public TokenDetails CreateAccessToken(User user, int tokenValidForMinutes)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, user.Username),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.GivenName, user.Firstname!),
            new(ClaimTypes.Surname, user.Lastname!),
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Secret"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expiresAt = DateTime.UtcNow.AddMinutes(tokenValidForMinutes);

        var tokenDescriptor = new JwtSecurityToken(
            issuer: configuration["Jwt:Issuer"],
            audience: configuration["Jwt:Audience"],
            claims: claims,
            expires: expiresAt,
            signingCredentials: creds
        );

        return new TokenDetails
        {
            Value = new JwtSecurityTokenHandler().WriteToken(tokenDescriptor),
            ExpiresAt = expiresAt,
        };
    }

    public TokenDetails CreateRefreshToken(int tokenValidForDays)
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var token = new StringBuilder(64);
        for (int i = 0; i < 64; i++)
        {
            token.Append(chars[CryptoRandom.NextInt() % chars.Length]);
        }

        return new TokenDetails
        {
            Value = token.ToString(),
            ExpiresAt = DateTime.UtcNow.AddDays(tokenValidForDays),
        };
    }

    public async Task<Result<string>> ResendOtpAsync(string identifier)
    {
        var user = await context.Users.FirstOrDefaultAsync(u =>
            u.Username == identifier || u.Email == identifier
        );

        if (user is null)
            return Result.NotFound("User not found");

        var otpDetails = CreateOtp(AuthConfig.OtpValidForMinutes);
        using var transaction = await context.Database.BeginTransactionAsync();
        try
        {
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
            return Result<string>.Success(otpDetails.ExpiresAt.ToString("o"));
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public string HashToken(string token) =>
        Convert.ToBase64String(SHA256.HashData(Encoding.UTF8.GetBytes(token)));

    public async Task<Result<AuthResult>> VerifyRefreshTokenAsync(string refreshToken)
    {
        var token = await context
            .RefreshTokens.Include(t => t.User)
            .FirstOrDefaultAsync(t => t.TokenHash == HashToken(refreshToken));

        if (token is null)
            return Result.NotFound("Invalid refresh token");

        var newRefreshToken = CreateRefreshToken(AuthConfig.RefreshTokenValidForDays);
        var accessToken = CreateAccessToken(token.User!, AuthConfig.AccessTokenValidForMinutes);

        // Update the refresh token.
        token.TokenHash = HashToken(newRefreshToken.Value);
        await context.SaveChangesAsync();

        return Result<AuthResult>.Success(
            new()
            {
                AccessToken = accessToken.Value,
                RefreshToken = newRefreshToken.Value,
                AccessTokenExpiresAt = accessToken.ExpiresAt,
                RefreshTokenExpiresAt = token.TokenExpiresAt,
            }
        );
    }

    private static class CryptoRandom
    {
        private static readonly ThreadLocal<RandomNumberGenerator> crng = new(
            RandomNumberGenerator.Create
        );
        private static readonly ThreadLocal<byte[]> bytes = new(() => new byte[sizeof(int)]);

        public static int NextInt()
        {
            crng.Value!.GetBytes(bytes.Value!);
            return BitConverter.ToInt32(bytes.Value!, 0) & int.MaxValue;
        }
    }
}
