using App.Api.Dtos;

namespace App.Api.Services.AuthServices.Registration;

public interface IRegistrationService
{
    Task<Result<string>> StartRegistrationAsync(StartRegistrationRequest request);
    Task<Result> VerifyOtpAsync(VerifyOtpRequest request);
    Task<Result<string>> CompleteRegistrationAsync(CompleteRegistrationRequest request);
    Task<Result<string>> ResendVerificationCodeAsync(ResendVerificationCodeRequest request);
}
