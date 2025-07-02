using System.ComponentModel.DataAnnotations;

namespace App.Api.Dtos;

public class VerifyOtpRequest
{
    [Required]
    public string? Username { get; set; }

    [Required]
    [EmailAddress]
    public string? Email { get; set; }

    [Required]
    [Length(6, 6, ErrorMessage = "Must be 6 digits")]
    public string? Otp { get; set; }
}
