using App.Api.Data.Entities;

namespace App.Api.Services.AuthServices.TokenServices;

public interface IJwtService
{
    public string CreateAccessToken(User user, IConfiguration configuration, int tokenValidFor);
    public string CreateRefreshToken();
    public string HashToken(string token);
}
