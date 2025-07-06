namespace App.Api.Data.Entities;

public class User
{
    public Guid Id { get; set; }
    public required string Username { get; set; }
    public required string Email { get; set; }
    public string? Otp { get; set; }
    public DateTime? OtpExpiresAt { get; set; }
    public string? PasswordHash { get; set; }
    public string? Firstname { get; set; }
    public string? Lastname { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public DateTime? CreatedAt { get; set; }
}
