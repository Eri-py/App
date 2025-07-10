using System.ComponentModel.DataAnnotations;

namespace App.Api.Dtos;

public record class CompleteRegistrationRequest
{
    [Required]
    public required string Username { get; set; }

    [Required]
    [EmailAddress]
    public required string Email { get; set; }

    [Required]
    public required string Password { get; set; }

    [Required]
    public required string Firstname { get; set; }

    [Required]
    public required string Lastname { get; set; }

    [Required]
    public required string DateOfBirth { get; set; }
}
