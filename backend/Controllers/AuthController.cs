using System.Security.Claims;
using LegalAccounting.API.Data;
using LegalAccounting.API.DTOs.Auth;
using LegalAccounting.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LegalAccounting.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly AppDbContext _context;

    public AuthController(
        IAuthService authService,
        AppDbContext context)
    {
        _authService = authService;
        _context = context;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name) ||
            string.IsNullOrWhiteSpace(dto.Email) ||
            string.IsNullOrWhiteSpace(dto.Password))
        {
            return BadRequest(new
            {
                message = "Name, email and password are required."
            });
        }

        if (dto.Password.Length < 6)
        {
            return BadRequest(new
            {
                message = "Password must be at least 6 characters."
            });
        }

        var result = await _authService.RegisterAsync(dto);

        if (result == null)
        {
            return Conflict(new
            {
                message = "Email is already registered."
            });
        }

        /*
         * IMPORTANT:
         * Make sure RegisterAsync creates the User first.
         * Then create the Client profile for Client users.
         *
         * If your RegisterResult contains UserId/Id/Role,
         * use that ID here.
         */

        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var result = await _authService.LoginAsync(dto);

        if (result == null)
        {
            return Unauthorized(new
            {
                message = "Invalid email or password."
            });
        }

        return Ok(result);
    }

    // =========================
    // Current User
    // =========================

    [Authorize]
    [HttpGet("me")]
    public IActionResult Me()
    {
        var id = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        var name = User.FindFirstValue(
            ClaimTypes.Name
        );

        var email = User.FindFirstValue(
            ClaimTypes.Email
        );

        var role = User.FindFirstValue(
            ClaimTypes.Role
        );

        return Ok(new
        {
            id,
            name,
            email,
            role
        });
    }

    // =========================
    // Get Profile
    // =========================

    [Authorize]
    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var userIdClaim = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        if (!int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new
            {
                message = "Invalid user token."
            });
        }

        var user = await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            return NotFound(new
            {
                message = "User profile not found."
            });
        }

        return Ok(new
        {
            id = user.Id,
            name = user.Name,
            email = user.Email,
            role = user.Role.ToString()
        });
    }

    // =========================
    // Update Profile
    // =========================

    [Authorize]
    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile(
        [FromBody] UpdateProfileDto dto)
    {
        var userIdClaim = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        if (!int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new
            {
                message = "Invalid user token."
            });
        }

        if (string.IsNullOrWhiteSpace(dto.Name))
        {
            return BadRequest(new
            {
                message = "Name is required."
            });
        }

        if (string.IsNullOrWhiteSpace(dto.Email))
        {
            return BadRequest(new
            {
                message = "Email is required."
            });
        }

        var email = dto.Email.Trim().ToLowerInvariant();

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            return NotFound(new
            {
                message = "User profile not found."
            });
        }

        var emailExists = await _context.Users
            .AnyAsync(u =>
                u.Id != userId &&
                u.Email.ToLower() == email
            );

        if (emailExists)
        {
            return Conflict(new
            {
                message = "This email is already registered."
            });
        }

        user.Name = dto.Name.Trim();
        user.Email = email;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Profile updated successfully.",
            user = new
            {
                id = user.Id,
                name = user.Name,
                email = user.Email,
                role = user.Role.ToString()
            }
        });
    }

    // =========================
    // Admin Test
    // =========================

    [Authorize(Roles = "Admin")]
    [HttpGet("admin-test")]
    public IActionResult AdminTest()
    {
        return Ok(new
        {
            message = "Admin authentication is working."
        });
    }

    // =========================
    // Client Test
    // =========================

    [Authorize(Roles = "Client")]
    [HttpGet("client-test")]
    public IActionResult ClientTest()
    {
        return Ok(new
        {
            message = "Client authentication is working."
        });
    }
}

// =========================
// Update Profile DTO
// =========================

public class UpdateProfileDto
{
    public string Name { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;
}