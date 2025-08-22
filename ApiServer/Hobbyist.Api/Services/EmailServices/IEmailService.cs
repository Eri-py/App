using Hobbyist.Api.Results;

namespace Hobbyist.Api.Services.EmailServices;

public interface IEmailService
{
    public Task<Result> SendEmailAsync(string to, string subject, string body);
    public Task<Result> SendOtpEmailAsync(
        string to,
        string username,
        string otp,
        string otpValidFor
    );
}
