using System.ComponentModel.DataAnnotations;

namespace App.Api.Dtos;

public record class ResendVerificationCodeRequest
{
    [Required]
    public required string Identifier { get; set; }
}
