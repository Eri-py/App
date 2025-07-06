using System.ComponentModel.DataAnnotations;

namespace App.Api.Dtos;

public class VerifyOtpRequest
{
    [Required]
    [EmailAddress]
    public required string Email { get; set; }

    [Required]
    [Length(6, 6, ErrorMessage = "Must be 6 digits")]
    public required string Otp { get; set; }
}
