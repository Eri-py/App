namespace App.Api.Data.Entities;

public enum UserRoles
{
    Unverified = 0,
    User = 1,
}

public class User
{
    public Guid Id { get; set; }
    public string? Username { get; set; }
    public string? Email { get; set; }
    public string? Otp { get; set; }
    public DateTime? OtpExpiresAt { get; set; }
    public string? PasswordHash { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public UserRoles Role { get; set; } = UserRoles.Unverified;
    public DateTime? CreatedOn { get; set; }
}
