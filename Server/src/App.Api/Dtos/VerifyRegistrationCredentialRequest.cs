using System.ComponentModel.DataAnnotations;

namespace App.Api.Dtos;

public record class VerifyRegistrationCredentialRequest
{
    [Required]
    public string? Username { get; set; }

    [Required]
    [EmailAddress]
    public string? Email { get; set; }
}
