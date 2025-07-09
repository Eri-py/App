using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using App.Api.Data.Entities;
using Microsoft.IdentityModel.Tokens;

namespace App.Api.Services.AuthServices;

public abstract class Shared
{
    public static string CreateToken(User user, IConfiguration configuration)
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
        var tokenDescriptor = new JwtSecurityToken(
            issuer: configuration["Jwt:Issuer"],
            audience: configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(1),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
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
}
