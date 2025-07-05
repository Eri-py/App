using System.ComponentModel.DataAnnotations;

namespace App.Api.Dtos;

public record class ResendVerificationCodeRequest
{
    [Required]
    public string? Identifier { get; set; }
}
