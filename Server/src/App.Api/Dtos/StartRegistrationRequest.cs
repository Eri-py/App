using System.ComponentModel.DataAnnotations;

namespace App.Api.Dtos;

public record class StartRegistrationRequest
{
    [Required]
    public string Username { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
}
