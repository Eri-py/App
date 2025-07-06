using System.ComponentModel.DataAnnotations;

namespace App.Api.Dtos;

public record class CompleteRegistrationRequest
{
    [Required]
    public string Username { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Firstname { get; set; } = string.Empty;
    public string Lastname { get; set; } = string.Empty;
    public string DateOfBirth { get; set; } = string.Empty;
}
