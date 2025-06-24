using System;

namespace App.Api.Services.AuthServices;

public interface IRegistrationService
{
    public Task<Results> StartRegistrationAsync(string username, string email);
    public Task<Results> VerifyOtpAsync(string username, string email, string otp);
    public Task<Results> CompleteRegistrationAsync();
}
