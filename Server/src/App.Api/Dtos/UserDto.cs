using System.ComponentModel.DataAnnotations;

namespace App.Api.Dtos;

public record class UserDto
{
    [Required]
    public required string Id { get; set; }

    [Required]
    public required string Username { get; set; }

    [Required]
    public required string Email { get; set; }

    [Required]
    public required string Firstname { get; set; }

    [Required]
    public required string Lastname { get; set; }
}
