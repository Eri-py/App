using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace App.Api.Services.EmailServices;

public class MailkitEmailService(IConfiguration configuration) : IEmailService
{
    public async Task<bool> SendEmailAsync(string to, string subject, string body)
    {
        try
        {
            var message = new MimeMessage();
            message.From.Add(
                new MailboxAddress(
                    configuration["Mailkit:FromName"],
                    configuration["Mailkit:FromAddress"]
                )
            );
            message.To.Add(MailboxAddress.Parse(to));
            message.Subject = subject;

            var bodyBuilder = new BodyBuilder { HtmlBody = body };
            message.Body = bodyBuilder.ToMessageBody();

            using var client = new SmtpClient();
            await client.ConnectAsync(
                configuration["Mailkit:Host"],
                int.Parse(configuration["Mailkit:Port"]!),
                SecureSocketOptions.StartTls
            );

            await client.AuthenticateAsync(
                configuration["Mailkit:Username"],
                configuration["Mailkit:Password"]
            );

            await client.SendAsync(message);
            await client.DisconnectAsync(true);

            return true;
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return false;
        }
    }

    public async Task<Results> SendEmailVerificationAsync(
        string to,
        string username,
        string verificationCode
    )
    {
        var templatePath = Path.Combine(
            Directory.GetCurrentDirectory(),
            "Templates",
            "EmailVerification.html"
        );
        var htmlTemplate = await File.ReadAllTextAsync(templatePath);

        var htmlBody = htmlTemplate
            .Replace("{{Username}}", username)
            .Replace("{{VerificationCode}}", verificationCode);

        var isSuccess = await SendEmailAsync(to, "Verify Your Email Address", htmlBody);
        if (!isSuccess)
            return Results.Failure("Error sending verification email");

        return Results.Success();
    }
}
