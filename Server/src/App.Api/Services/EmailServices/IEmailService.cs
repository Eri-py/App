using System;

namespace App.Api.Services.EmailServices;

public interface IEmailService
{
    public Task<bool> SendEmailAsync(string to, string subject, string body);
    public Task<Results> SendEmailVerificationAsync(
        string to,
        string username,
        string verificationToken
    );
}
