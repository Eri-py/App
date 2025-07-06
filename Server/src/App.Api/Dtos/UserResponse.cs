using App.Api.Data.Entities;

namespace App.Api.Dtos;

public record class UserResponse
{
    public string? Username { get; set; }
    public string? Email { get; set; }
    public string? Firstname { get; set; }
    public string? Lastname { get; set; }
    public string? Jwt { get; set; }
}
