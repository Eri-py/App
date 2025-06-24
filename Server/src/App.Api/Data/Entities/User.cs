using System;

namespace App.Api.Data.Entities;

public class User
{
    public Guid Id { get; set; }
    public string? Username { get; set; }
    public string? Email { get; set; }
}
