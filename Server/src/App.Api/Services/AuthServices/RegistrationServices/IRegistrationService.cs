using App.Api.Dtos;
using App.Api.Results;

namespace App.Api.Services.AuthServices.RegistrationServices;

public interface IRegistrationService
{
    public Task<Result<string>> StartRegistrationAsync(StartRegistrationRequest request);
    public Task<Result> VerifyOtpAsync(VerifyOtpRequest request);
    public Task<Result<AuthResult>> CompleteRegistrationAsync(CompleteRegistrationRequest request);
}
