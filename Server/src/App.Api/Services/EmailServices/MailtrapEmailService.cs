using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace App.Api.Services.EmailServices;

public class MailtrapEmailService(IConfiguration configuration) : IEmailService
{
    public async Task<Result> SendEmailAsync(string to, string subject, string body)
    {
        try
        {
            var message = new MimeMessage();
            message.From.Add(
                new MailboxAddress(
                    configuration["Mailtrap:FromName"],
                    configuration["Mailtrap:FromAddress"]
                )
            );
            message.To.Add(MailboxAddress.Parse(to));
            message.Subject = subject;

            var bodyBuilder = new BodyBuilder { HtmlBody = body };
            message.Body = bodyBuilder.ToMessageBody();

            using var client = new SmtpClient();
            await client.ConnectAsync(
                configuration["Mailtrap:Host"],
                int.Parse(configuration["Mailtrap:Port"]!),
                SecureSocketOptions.StartTls
            );

            await client.AuthenticateAsync(
                configuration["Mailtrap:Username"],
                configuration["Mailtrap:Password"]
            );

            await client.SendAsync(message);
            await client.DisconnectAsync(true);

            return Result.NoContent();
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return Result.InternalServerError("Error sending email");
        }
    }

    public async Task<Result> SendEmailVerificationAsync(
        string to,
        string username,
        string verificationCode,
        string codeValidFor
    )
    {
        var templatePath = Path.Combine(
            Directory.GetCurrentDirectory(),
            "Templates",
            "VerificationEmailTemplate.html"
        );
        var htmlTemplate = await File.ReadAllTextAsync(templatePath);

        var htmlBody = htmlTemplate
            .Replace("{{Username}}", username)
            .Replace("{{VerificationCode}}", verificationCode)
            .Replace("{{CodeValidFor}}", codeValidFor);

        var emailResult = await SendEmailAsync(to, "Verify Your Email Address", htmlBody);
        return emailResult;
    }
}
