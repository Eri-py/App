using System;

namespace App.Api.Services.EmailServices;

public interface IEmailService
{
    public Task<Result> SendEmailAsync(string to, string subject, string body);
    public Task<Result> SendEmailVerificationAsync(
        string to,
        string username,
        string verificationToken,
        string codeLimit
    );
}
