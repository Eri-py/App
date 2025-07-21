using System;
using App.Api.Dtos;
using App.Api.Results;

namespace App.Api.Services.AuthServices.LoginServices;

public interface ILoginService
{
    public Task<Result<string>> StartLoginAsync(LoginRequest request);
    public Task<Result<AuthResult>> CompleteLoginAsync(VerifyOtpRequest request);
}
