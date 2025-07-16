using System;
using App.Api.Data.Entities;

namespace App.Api.Services.AuthServices.TokenServices;

public interface IJwtService
{
    public string CreateAuthToken(User user, IConfiguration configuration);
    public string CreateAccessToken();
}
