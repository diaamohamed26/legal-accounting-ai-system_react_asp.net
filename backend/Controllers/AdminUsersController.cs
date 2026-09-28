using System.Security.Claims;
using BCrypt.Net;
using LegalAccounting.API.Data;
using LegalAccounting.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LegalAccounting.API.Controllers;

[ApiController]
[Route("api/admin/users")]
[Authorize(Roles = "Admin")]
public class AdminUsersController : ControllerBase
{
    private readonly AppDbContext _context;

    public AdminUsersController(AppDbContext context)
    {
        _context = context;
    }

    // =========================================================
    // GET: /api/admin/users
    // Get all users
    // =========================================================
    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _context.Users
            .AsNoTracking()
            .OrderByDescending(u => u.Id)
            .Select(u => new
            {
                u.Id,
                u.Email,
                u.Role,

                HasClient = _context.Clients
                    .Any(c => c.UserId == u.Id),

                Client = _context.Clients
                    .Where(c => c.UserId == u.Id)
                    .Select(c => new
                    {
                        c.Id,
                        c.Name,
                        c.Email
                    })
                    .FirstOrDefault()
            })
            .ToListAsync();

        return Ok(users);
    }

    // =========================================================
    // GET: /api/admin/users/{id}
    // Get one user
    // =========================================================
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetUser(int id)
    {
        var user = await _context.Users
            .AsNoTracking()
            .Where(u => u.Id == id)
            .Select(u => new
            {
                u.Id,
                u.Email,
                u.Role,

                Client = _context.Clients
                    .Where(c => c.UserId == u.Id)
                    .Select(c => new
                    {
                        c.Id,
                        c.Name,
                        c.Email
                    })
                    .FirstOrDefault()
            })
            .FirstOrDefaultAsync();

        if (user == null)
        {
            return NotFound(new
            {
                message = "User not found."
            });
        }

        return Ok(user);
    }

    // =========================================================
    // GET: /api/admin/users/available-for-client
    // Get Client users without a Client profile
    // =========================================================
    [HttpGet("available-for-client")]
    public async Task<IActionResult> GetAvailableUsersForClient()
    {
        var clientRole = UserRole.Client;

        var users = await _context.Users
            .AsNoTracking()
            .Where(u =>
                u.Role == clientRole &&
                !_context.Clients.Any(c => c.UserId == u.Id)
            )
            .OrderBy(u => u.Email)
            .Select(u => new
            {
                u.Id,
                u.Email,
                u.Role
            })
            .ToListAsync();

        return Ok(users);
    }

    // =========================================================
    // POST: /api/admin/users
    // Create user
    // =========================================================
    [HttpPost]
    public async Task<IActionResult> CreateUser(
        [FromBody] CreateUserRequest request)
    {
        if (request == null)
        {
            return BadRequest(new
            {
                message = "Request body is required."
            });
        }

        if (string.IsNullOrWhiteSpace(request.Email))
        {
            return BadRequest(new
            {
                message = "Email is required."
            });
        }

        if (string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new
            {
                message = "Password is required."
            });
        }

        if (request.Password.Length < 6)
        {
            return BadRequest(new
            {
                message = "Password must be at least 6 characters."
            });
        }

        var email = request.Email.Trim().ToLowerInvariant();

        var emailExists = await _context.Users
            .AnyAsync(u => u.Email.ToLower() == email);

        if (emailExists)
        {
            return Conflict(new
            {
                message = "A user with this email already exists."
            });
        }

        var role = string.IsNullOrWhiteSpace(request.Role)
            ? "Client"
            : request.Role.Trim();

        UserRole userRole;

        if (role.Equals(
                "Admin",
                StringComparison.OrdinalIgnoreCase))
        {
            userRole = UserRole.Admin;
        }
        else if (role.Equals(
                     "Client",
                     StringComparison.OrdinalIgnoreCase))
        {
            userRole = UserRole.Client;
        }
        else
        {
            return BadRequest(new
            {
                message = "Role must be either Admin or Client."
            });
        }

        var user = new User
        {
            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(
                request.Password
            ),
            Role = userRole
        };

        _context.Users.Add(user);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetUser),
            new { id = user.Id },
            new
            {
                user.Id,
                user.Email,
                user.Role,
                hasClient = false
            }
        );
    }

    // =========================================================
    // PUT: /api/admin/users/{id}
    // Update user
    // =========================================================
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateUser(
        int id,
        [FromBody] UpdateUserRequest request)
    {
        if (request == null)
        {
            return BadRequest(new
            {
                message = "Request body is required."
            });
        }

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
        {
            return NotFound(new
            {
                message = "User not found."
            });
        }

        if (string.IsNullOrWhiteSpace(request.Email))
        {
            return BadRequest(new
            {
                message = "Email is required."
            });
        }

        var email = request.Email.Trim().ToLowerInvariant();

        var emailExists = await _context.Users
            .AnyAsync(u =>
                u.Id != id &&
                u.Email.ToLower() == email);

        if (emailExists)
        {
            return Conflict(new
            {
                message = "A user with this email already exists."
            });
        }

        // -----------------------------------------
        // Update role
        // -----------------------------------------
        if (!string.IsNullOrWhiteSpace(request.Role))
        {
            if (request.Role.Equals(
                    "Admin",
                    StringComparison.OrdinalIgnoreCase))
            {
                user.Role = UserRole.Admin;
            }
            else if (request.Role.Equals(
                         "Client",
                         StringComparison.OrdinalIgnoreCase))
            {
                user.Role = UserRole.Client;
            }
            else
            {
                return BadRequest(new
                {
                    message = "Role must be either Admin or Client."
                });
            }
        }

        // -----------------------------------------
        // Update email
        // -----------------------------------------
        user.Email = email;

        // -----------------------------------------
        // Update password only when provided
        // -----------------------------------------
        if (!string.IsNullOrWhiteSpace(request.Password))
        {
            if (request.Password.Length < 6)
            {
                return BadRequest(new
                {
                    message = "Password must be at least 6 characters."
                });
            }

            user.PasswordHash =
                BCrypt.Net.BCrypt.HashPassword(
                    request.Password
                );
        }

        await _context.SaveChangesAsync();

        var hasClient = await _context.Clients
            .AnyAsync(c => c.UserId == user.Id);

        return Ok(new
        {
            user.Id,
            user.Email,
            user.Role,
            hasClient
        });
    }

    // =========================================================
    // DELETE: /api/admin/users/{id}
    // Delete user
    // =========================================================
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
        {
            return NotFound(new
            {
                message = "User not found."
            });
        }

        // -----------------------------------------
        // Prevent deleting current logged-in admin
        // -----------------------------------------
        var currentUserId = User
            .FindFirstValue(ClaimTypes.NameIdentifier);

        if (currentUserId == id.ToString())
        {
            return BadRequest(new
            {
                message =
                    "You cannot delete the currently logged-in user."
            });
        }

        // -----------------------------------------
        // Prevent deleting user with Client profile
        // -----------------------------------------
        var clientExists = await _context.Clients
            .AnyAsync(c => c.UserId == id);

        if (clientExists)
        {
            return Conflict(new
            {
                message =
                    "This user has a client profile. Delete the client profile first."
            });
        }

        _context.Users.Remove(user);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "User deleted successfully."
        });
    }
}

// =========================================================
// Request Models
// =========================================================

public class CreateUserRequest
{
    public string Email { get; set; } = string.Empty;

    public string Password { get; set; } = string.Empty;

    public string Role { get; set; } = "Client";
}

public class UpdateUserRequest
{
    public string Email { get; set; } = string.Empty;

    public string? Password { get; set; }

    public string? Role { get; set; }
}