using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using App.Api.Data.Entities;
using Microsoft.IdentityModel.Tokens;

namespace App.Api.Services.AuthServices.TokenServices;

public class JwtService(IConfiguration configuration) : IJwtService
{
    public (string token, DateTime expiresAt) CreateOtp(int otpValidForMinutes)
    {
        var token = (CryptoRandom.NextInt() % 1000000).ToString("000000");
        var expiresAt = DateTime.UtcNow.AddMinutes(otpValidForMinutes);
        return (token, expiresAt);
    }

    public (string token, DateTime expiresAt) CreateAccessToken(User user, int tokenValidForMinutes)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, user.Username),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.GivenName, user.Firstname!),
            new(ClaimTypes.Surname, user.Lastname!),
        };
        var expiresAt = DateTime.UtcNow.AddMinutes(tokenValidForMinutes);

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Secret"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var tokenDescriptor = new JwtSecurityToken(
            issuer: configuration["Jwt:Issuer"],
            audience: configuration["Jwt:Audience"],
            claims: claims,
            expires: expiresAt,
            signingCredentials: creds
        );

        return (new JwtSecurityTokenHandler().WriteToken(tokenDescriptor), expiresAt);
    }

    public (string token, DateTime expiresAt) CreateRefreshToken(int tokenValidForDays)
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var token = new StringBuilder(64);
        for (int i = 0; i < 64; i++)
        {
            token.Append(chars[CryptoRandom.NextInt() % chars.Length]);
        }

        var expiresAt = DateTime.UtcNow.AddDays(tokenValidForDays);
        return (token.ToString(), expiresAt);
    }

    public string HashToken(string token)
    {
        return Convert.ToBase64String(SHA256.HashData(Encoding.UTF8.GetBytes(token)));
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
