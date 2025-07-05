namespace App.Api.Services.AuthServices;

public interface IRegistrationService
{
    public Task<Result<string>> StartRegistrationAsync(string username, string email);
    public Task<Result> VerifyOtpAsync(string username, string email, string otp);
    public Task<Result> CompleteRegistrationAsync();
    public Task<Result<string>> ResendVerificationCodeAsync(string identifier);
}
