using App.Api.Dtos;
using App.Api.Services.Helpers;

namespace App.Api.Services.AuthServices.RegistrationServices;

public interface IRegistrationService
{
    Task<Result<string>> StartRegistrationAsync(StartRegistrationRequest request);
    Task<Result> VerifyOtpAsync(VerifyOtpRequest request);
    Task<Result<CompleteRegistrationResponse>> CompleteRegistrationAsync(
        CompleteRegistrationRequest request
    );
    Task<Result<string>> ResendVerificationCodeAsync(ResendVerificationCodeRequest request);
}
