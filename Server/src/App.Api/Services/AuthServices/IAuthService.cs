using System;
using App.Api.Dtos;

namespace App.Api.Services.AuthServices;

public interface IAuthService
{
    public Task<Results> VerifyUserCredentialsAsync(string username, string email);
}
