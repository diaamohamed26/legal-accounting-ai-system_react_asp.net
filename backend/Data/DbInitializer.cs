using BCrypt.Net;
using LegalAccounting.API.Models;
using Microsoft.EntityFrameworkCore;

namespace LegalAccounting.API.Data;

public static class DbInitializer
{
public static async Task SeedAsync(AppDbContext context)
{
await context.Database.MigrateAsync();

    var adminExists = await context.Users
        .AnyAsync(u => u.Role == UserRole.Admin);

    if (adminExists)
        return;

    var admin = new User
    {
        Name = "System Administrator",
        Email = "admin@legalaccounting.com",
        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123456"),
        Role = UserRole.Admin,
        IsActive = true,
        CreatedAt = DateTime.UtcNow
    };

    context.Users.Add(admin);

    await context.SaveChangesAsync();
}

}
