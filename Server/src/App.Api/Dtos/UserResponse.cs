using App.Api.Data.Entities;

namespace App.Api.Dtos;

public record class UserResponse
{
    public required string Username { get; set; }
    public required string Email { get; set; }
    public required string Firstname { get; set; }
    public required string Lastname { get; set; }
    public required string Jwt { get; set; }
}
