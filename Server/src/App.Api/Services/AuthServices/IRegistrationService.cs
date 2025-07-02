namespace App.Api.Services.AuthServices;

public interface IRegistrationService
{
    public Task<Result> StartRegistrationAsync(string username, string email);
    public Task<Result> VerifyOtpAsync(string username, string email, string otp);
    public Task<Result> CompleteRegistrationAsync();
}
