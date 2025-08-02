using System;

namespace App.Api.Data.Entities;

public class Hobbies
{
    public Guid Id { get; set; }
    public required string CategoryName { get; set; }
}
