using App.Api.Dtos;
using App.Api.Results;

namespace App.Api.Services.AuthServices.LoginServices;

public interface ILoginService
{
    public Task<Result<StartLoginResponse>> StartLoginAsync(StartLoginRequest request);
    public Task<Result<AuthResult>> CompleteLoginAsync(CompleteLoginRequest request);
}
