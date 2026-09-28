using BCrypt.Net;
using LegalAccounting.API.Data;
using LegalAccounting.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LegalAccounting.API.Controllers;

[ApiController]
[Route("api/admin/clients")]
[Authorize(Roles = "Admin")]
public class AdminClientsController : ControllerBase
{
    private readonly AppDbContext _context;

    public AdminClientsController(AppDbContext context)
    {
        _context = context;
    }

    // =========================================================
    // GET: /api/admin/clients
    // =========================================================
    [HttpGet]
    public async Task<IActionResult> GetClients()
    {
        var clients = await _context.Clients
            .AsNoTracking()
            .OrderByDescending(c => c.Id)
            .Select(c => new
            {
                id = c.Id,
                userId = c.UserId,
                name = c.Name,
                email = c.Email,

                invoiceCount = c.Invoices.Count(),
                expenseCount = c.Expenses.Count(),
                transactionCount = c.Transactions.Count(),
                documentCount = c.Documents.Count()
            })
            .ToListAsync();

        return Ok(clients);
    }

    // =========================================================
    // GET: /api/admin/clients/{id}
    // =========================================================
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetClient(int id)
    {
        var client = await _context.Clients
            .AsNoTracking()
            .Include(c => c.Invoices)
            .Include(c => c.Expenses)
            .Include(c => c.Transactions)
            .Include(c => c.Documents)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (client == null)
        {
            return NotFound(new
            {
                message = "Client not found."
            });
        }

        return Ok(new
        {
            id = client.Id,
            userId = client.UserId,
            name = client.Name,
            email = client.Email,

            invoices = client.Invoices
                .OrderByDescending(i => i.Date)
                .Select(i => new
                {
                    i.Id,
                    i.InvoiceNumber,
                    i.Amount,
                    i.Status,
                    i.Date,
                    i.DueDate
                }),

            expenses = client.Expenses
                .OrderByDescending(e => e.Date)
                .Select(e => new
                {
                    e.Id,
                    e.Description,
                    e.Amount,
                    e.Date
                }),

            transactions = client.Transactions
                .OrderByDescending(t => t.Date)
                .Select(t => new
                {
                    t.Id,
                    t.Description,
                    t.Amount,
                    t.Type,
                    t.Date
                }),

            documents = client.Documents
                .Select(d => new
                {
                    d.Id
                })
        });
    }

    // =========================================================
    // POST: /api/admin/clients
    //
    // Admin creates:
    // 1. User
    // 2. Client profile
    // 3. Links Client.UserId to the new User
    // =========================================================
    [HttpPost]
    public async Task<IActionResult> CreateClient(
        [FromBody] CreateClientRequest request)
    {
        if (request == null)
        {
            return BadRequest(new
            {
                message = "Request data is required."
            });
        }

        // =====================================================
        // Validate Name
        // =====================================================

        var name = request.Name?.Trim() ?? string.Empty;

        if (string.IsNullOrWhiteSpace(name))
        {
            return BadRequest(new
            {
                message = "Client name is required."
            });
        }

        if (name.Length > 200)
        {
            return BadRequest(new
            {
                message = "Client name cannot exceed 200 characters."
            });
        }

        // =====================================================
        // Validate Email
        // =====================================================

        var email = request.Email?.Trim().ToLowerInvariant()
                    ?? string.Empty;

        if (string.IsNullOrWhiteSpace(email))
        {
            return BadRequest(new
            {
                message = "Client email is required."
            });
        }

        if (email.Length > 150)
        {
            return BadRequest(new
            {
                message = "Client email cannot exceed 150 characters."
            });
        }

        if (!new System.ComponentModel.DataAnnotations
                .EmailAddressAttribute()
                .IsValid(email))
        {
            return BadRequest(new
            {
                message = "Please enter a valid email address."
            });
        }

        // =====================================================
        // Validate Password
        // =====================================================

        var password = request.Password?.Trim() ?? string.Empty;

        if (string.IsNullOrWhiteSpace(password))
        {
            return BadRequest(new
            {
                message = "Password is required."
            });
        }

        if (password.Length < 6)
        {
            return BadRequest(new
            {
                message = "Password must be at least 6 characters."
            });
        }

        if (password.Length > 100)
        {
            return BadRequest(new
            {
                message = "Password cannot exceed 100 characters."
            });
        }

        // =====================================================
        // Validate Confirm Password
        // =====================================================

        if (password != request.ConfirmPassword)
        {
            return BadRequest(new
            {
                message = "Password and Confirm Password do not match."
            });
        }

        // =====================================================
        // Check duplicate User email
        // =====================================================

        var userEmailExists = await _context.Users
            .AnyAsync(u => u.Email.ToLower() == email);

        if (userEmailExists)
        {
            return Conflict(new
            {
                message = "A user with this email already exists."
            });
        }

        // =====================================================
        // Check duplicate Client email
        // =====================================================

        var clientEmailExists = await _context.Clients
            .AnyAsync(c => c.Email.ToLower() == email);

        if (clientEmailExists)
        {
            return Conflict(new
            {
                message = "A client with this email already exists."
            });
        }

        // =====================================================
        // Database transaction
        // =====================================================

        await using var transaction =
            await _context.Database.BeginTransactionAsync();

        try
        {
            // =================================================
            // Create User
            // =================================================

            var user = new User
            {
                Name = name,
                Email = email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                Role = UserRole.Client,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);

            await _context.SaveChangesAsync();

            // =================================================
            // Create Client Profile
            // =================================================

            var client = new Client
            {
                UserId = user.Id,
                Name = name,
                Email = email
            };

            _context.Clients.Add(client);

            await _context.SaveChangesAsync();

            // =================================================
            // Commit
            // =================================================

            await transaction.CommitAsync();

            return CreatedAtAction(
                nameof(GetClient),
                new { id = client.Id },
                new
                {
                    id = client.Id,
                    userId = user.Id,
                    name = client.Name,
                    email = client.Email,
                    role = user.Role.ToString()
                }
            );
        }
        catch
        {
            await transaction.RollbackAsync();

            throw;
        }
    }

    // =========================================================
    // PUT: /api/admin/clients/{id}
    // =========================================================
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateClient(
        int id,
        [FromBody] UpdateClientRequest request)
    {
        if (request == null)
        {
            return BadRequest(new
            {
                message = "Request data is required."
            });
        }

        var client = await _context.Clients
            .Include(c => c.User)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (client == null)
        {
            return NotFound(new
            {
                message = "Client not found."
            });
        }

        var name = request.Name?.Trim() ?? string.Empty;
        var email = request.Email?.Trim().ToLowerInvariant()
                    ?? string.Empty;

        if (string.IsNullOrWhiteSpace(name))
        {
            return BadRequest(new
            {
                message = "Client name is required."
            });
        }

        if (string.IsNullOrWhiteSpace(email))
        {
            return BadRequest(new
            {
                message = "Client email is required."
            });
        }

        if (name.Length > 200)
        {
            return BadRequest(new
            {
                message = "Client name cannot exceed 200 characters."
            });
        }

        if (email.Length > 150)
        {
            return BadRequest(new
            {
                message = "Client email cannot exceed 150 characters."
            });
        }

        if (!new System.ComponentModel.DataAnnotations
                .EmailAddressAttribute()
                .IsValid(email))
        {
            return BadRequest(new
            {
                message = "Please enter a valid email address."
            });
        }

        // =====================================================
        // Check duplicate Client email
        // =====================================================

        var clientEmailExists = await _context.Clients
            .AnyAsync(c =>
                c.Id != id &&
                c.Email.ToLower() == email);

        if (clientEmailExists)
        {
            return Conflict(new
            {
                message = "A client with this email already exists."
            });
        }

        // =====================================================
        // Check duplicate User email
        // =====================================================

        if (client.User != null)
        {
            var userEmailExists = await _context.Users
                .AnyAsync(u =>
                    u.Id != client.UserId &&
                    u.Email.ToLower() == email);

            if (userEmailExists)
            {
                return Conflict(new
                {
                    message = "A user with this email already exists."
                });
            }

            client.User.Name = name;
            client.User.Email = email;
        }

        // =====================================================
        // Update Client
        // =====================================================

        client.Name = name;
        client.Email = email;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            id = client.Id,
            userId = client.UserId,
            name = client.Name,
            email = client.Email
        });
    }

    // =========================================================
    // DELETE: /api/admin/clients/{id}
    // =========================================================
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteClient(int id)
    {
        var client = await _context.Clients
            .FirstOrDefaultAsync(c => c.Id == id);

        if (client == null)
        {
            return NotFound(new
            {
                message = "Client not found."
            });
        }

        _context.Clients.Remove(client);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Client deleted successfully."
        });
    }
}

// =============================================================
// Request DTOs
// =============================================================

public class CreateClientRequest
{
    public string Name { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Password { get; set; } = string.Empty;

    public string ConfirmPassword { get; set; } = string.Empty;
}

public class UpdateClientRequest
{
    public string Name { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;
}