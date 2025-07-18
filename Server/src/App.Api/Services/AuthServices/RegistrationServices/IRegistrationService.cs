using App.Api.Dtos;
using App.Api.Services.Helpers;

namespace App.Api.Services.AuthServices.RegistrationServices;

public record class CompleteRegistrationResult
{
    public required string AccessToken { get; set; }
    public required string RefreshToken { get; set; }
    public required DateTime AccessTokenExpiresAt { get; set; }
    public required DateTime RefreshTokenExpiresAt { get; set; }
};

public interface IRegistrationService
{
    Task<Result<string>> StartRegistrationAsync(StartRegistrationRequest request);
    Task<Result> VerifyOtpAsync(VerifyOtpRequest request);
    Task<Result<CompleteRegistrationResult>> CompleteRegistrationAsync(
        CompleteRegistrationRequest request
    );
    Task<Result<string>> ResendVerificationCodeAsync(ResendVerificationCodeRequest request);
}
