using System;
using App.Api.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace App.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users { get; set; }
}
