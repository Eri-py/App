using System.ComponentModel.DataAnnotations;

namespace App.Api.Dtos;

public record class StartRegistrationRequest
{
    [Required]
    public required string Username { get; set; }

    [Required]
    [EmailAddress]
    public required string Email { get; set; }
}
