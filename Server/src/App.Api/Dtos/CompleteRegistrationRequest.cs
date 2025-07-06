using System.ComponentModel.DataAnnotations;

namespace App.Api.Dtos;

public record class CompleteRegistrationRequest
{
    [Required]
    public required string Username { get; set; }

    [Required]
    [EmailAddress]
    public required string Email { get; set; }
    public required string Password { get; set; }
    public required string Firstname { get; set; }
    public required string Lastname { get; set; }
    public required string DateOfBirth { get; set; }
}
