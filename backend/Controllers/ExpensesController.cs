using LegalAccounting.API.Data;
using LegalAccounting.API.DTOs.Expenses;
using LegalAccounting.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LegalAccounting.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class ExpensesController : ControllerBase
{
    private readonly AppDbContext _context;

    public ExpensesController(AppDbContext context)
    {
        _context = context;
    }

    // =========================================================
    // GET: api/expenses
    // =========================================================

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ExpenseResponseDto>>> GetExpenses()
    {
        var expenses = await _context.Expenses
            .Include(e => e.Client)
            .OrderByDescending(e => e.Date)
            .ThenByDescending(e => e.Id)
            .Select(e => new ExpenseResponseDto
            {
                Id = e.Id,
                ClientId = e.ClientId,
                ClientName = e.Client != null
                    ? e.Client.Name
                    : null,
                Description = e.Description,
                Amount = e.Amount,
                Category = e.Category,
                Date = e.Date,
                Notes = e.Notes
            })
            .ToListAsync();

        return Ok(expenses);
    }

    // =========================================================
    // GET: api/expenses/{id}
    // =========================================================

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ExpenseResponseDto>> GetExpense(int id)
    {
        var expense = await _context.Expenses
            .Include(e => e.Client)
            .Where(e => e.Id == id)
            .Select(e => new ExpenseResponseDto
            {
                Id = e.Id,
                ClientId = e.ClientId,
                ClientName = e.Client != null
                    ? e.Client.Name
                    : null,
                Description = e.Description,
                Amount = e.Amount,
                Category = e.Category,
                Date = e.Date,
                Notes = e.Notes
            })
            .FirstOrDefaultAsync();

        if (expense == null)
        {
            return NotFound(new
            {
                message = "Expense not found."
            });
        }

        return Ok(expense);
    }

    // =========================================================
    // POST: api/expenses
    // =========================================================

    [HttpPost]
    public async Task<ActionResult<ExpenseResponseDto>> CreateExpense(
        [FromBody] CreateExpenseDto dto)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        // Make sure client exists
        var clientExists = await _context.Clients
            .AnyAsync(c => c.Id == dto.ClientId);

        if (!clientExists)
        {
            return BadRequest(new
            {
                message = "The selected client does not exist."
            });
        }

        var expense = new Expense
        {
            ClientId = dto.ClientId,
            Description = dto.Description.Trim(),
            Amount = dto.Amount,
            Category = dto.Category?.Trim(),
            Date = dto.Date,
            Notes = string.IsNullOrWhiteSpace(dto.Notes)
                ? null
                : dto.Notes.Trim()
        };

        _context.Expenses.Add(expense);

        await _context.SaveChangesAsync();

        var createdExpense = await _context.Expenses
            .Include(e => e.Client)
            .Where(e => e.Id == expense.Id)
            .Select(e => new ExpenseResponseDto
            {
                Id = e.Id,
                ClientId = e.ClientId,
                ClientName = e.Client != null
                    ? e.Client.Name
                    : null,
                Description = e.Description,
                Amount = e.Amount,
                Category = e.Category,
                Date = e.Date,
                Notes = e.Notes
            })
            .FirstAsync();

        return CreatedAtAction(
            nameof(GetExpense),
            new { id = expense.Id },
            createdExpense
        );
    }

    // =========================================================
    // PUT: api/expenses/{id}
    // =========================================================

    [HttpPut("{id:int}")]
    public async Task<ActionResult<ExpenseResponseDto>> UpdateExpense(
        int id,
        [FromBody] UpdateExpenseDto dto)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var expense = await _context.Expenses
            .FirstOrDefaultAsync(e => e.Id == id);

        if (expense == null)
        {
            return NotFound(new
            {
                message = "Expense not found."
            });
        }

        // Make sure client exists
        var clientExists = await _context.Clients
            .AnyAsync(c => c.Id == dto.ClientId);

        if (!clientExists)
        {
            return BadRequest(new
            {
                message = "The selected client does not exist."
            });
        }

        expense.ClientId = dto.ClientId;
        expense.Description = dto.Description.Trim();
        expense.Amount = dto.Amount;
        expense.Category = dto.Category?.Trim();
        expense.Date = dto.Date;
        expense.Notes = string.IsNullOrWhiteSpace(dto.Notes)
            ? null
            : dto.Notes.Trim();

        await _context.SaveChangesAsync();

        var updatedExpense = await _context.Expenses
            .Include(e => e.Client)
            .Where(e => e.Id == expense.Id)
            .Select(e => new ExpenseResponseDto
            {
                Id = e.Id,
                ClientId = e.ClientId,
                ClientName = e.Client != null
                    ? e.Client.Name
                    : null,
                Description = e.Description,
                Amount = e.Amount,
                Category = e.Category,
                Date = e.Date,
                Notes = e.Notes
            })
            .FirstAsync();

        return Ok(updatedExpense);
    }

    // =========================================================
    // DELETE: api/expenses/{id}
    // =========================================================

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteExpense(int id)
    {
        var expense = await _context.Expenses
            .FirstOrDefaultAsync(e => e.Id == id);

        if (expense == null)
        {
            return NotFound(new
            {
                message = "Expense not found."
            });
        }

        _context.Expenses.Remove(expense);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Expense deleted successfully."
        });
    }
}