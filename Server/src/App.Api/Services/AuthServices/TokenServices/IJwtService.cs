using App.Api.Data.Entities;

namespace App.Api.Services.AuthServices.TokenServices;

public interface IJwtService
{
    public (string token, DateTime expiresAt) CreateOtp(int otpValidForMinutes);
    public (string token, DateTime expiresAt) CreateAccessToken(User user, int tokenValidFor);
    public (string token, DateTime expiresAt) CreateRefreshToken(int tokenValidForDays);
    public string HashToken(string token);
}
