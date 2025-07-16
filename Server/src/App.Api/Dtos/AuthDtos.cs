using System;
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

public record class VerifyOtpRequest
{
    [Required]
    [EmailAddress]
    public required string Email { get; set; }

    [Required]
    [Length(6, 6, ErrorMessage = "Must be 6 digits")]
    public required string Otp { get; set; }
}

public record class ResendVerificationCodeRequest
{
    [Required]
    public required string Identifier { get; set; }
}

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

public record class CompleteRegistrationResponse
{
    public required string AccessToken { get; set; }
    public required string RefreshToken { get; set; }
}
