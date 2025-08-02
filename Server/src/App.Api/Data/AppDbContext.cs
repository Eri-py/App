using App.Api.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace App.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    // Add tables
    public DbSet<User> Users { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<Hobbies> Hobbies { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        // Ensure username and email on users table are unique.
        builder.Entity<User>().HasIndex(u => u.Email).IsUnique();
        builder.Entity<User>().HasIndex(u => u.Username).IsUnique();

        // Create hobbies table with Pokemon card collecting and flower spotting.
        builder
            .Entity<Hobbies>()
            .HasData(
                new Hobbies
                {
                    Id = new Guid("360fa3cd-b910-4849-92ac-87ec100124f8"),
                    CategoryName = "Pokemon card collecting",
                },
                new Hobbies
                {
                    Id = new Guid("ab1101f5-c1d7-424b-88b1-f39df2367eea"),
                    CategoryName = "Flower spotting",
                }
            );
    }
}
