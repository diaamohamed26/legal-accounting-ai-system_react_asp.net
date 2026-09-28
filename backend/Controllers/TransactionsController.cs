using LegalAccounting.API.Data;
using LegalAccounting.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LegalAccounting.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class TransactionsController : ControllerBase
{
    private readonly AppDbContext _context;

    public TransactionsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/transactions
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Transaction>>> GetTransactions()
    {
        var transactions = await _context.Transactions
            .Include(t => t.Client)
            .OrderByDescending(t => t.Date)
            .ToListAsync();

        return Ok(transactions);
    }

    // GET: api/transactions/5
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Transaction>> GetTransaction(int id)
    {
        var transaction = await _context.Transactions
            .Include(t => t.Client)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (transaction == null)
        {
            return NotFound(new
            {
                message = "Transaction not found."
            });
        }

        return Ok(transaction);
    }

    // GET: api/transactions/client/5
    [HttpGet("client/{clientId:int}")]
    public async Task<ActionResult<IEnumerable<Transaction>>> GetClientTransactions(
        int clientId)
    {
        var clientExists = await _context.Clients
            .AnyAsync(c => c.Id == clientId);

        if (!clientExists)
        {
            return NotFound(new
            {
                message = "Client not found."
            });
        }

        var transactions = await _context.Transactions
            .Include(t => t.Client)
            .Where(t => t.ClientId == clientId)
            .OrderByDescending(t => t.Date)
            .ToListAsync();

        return Ok(transactions);
    }

    // POST: api/transactions
    [HttpPost]
    public async Task<ActionResult<Transaction>> CreateTransaction(
        [FromBody] Transaction transaction)
    {
        if (transaction.ClientId <= 0)
        {
            return BadRequest(new
            {
                message = "ClientId is required."
            });
        }

        if (transaction.Amount <= 0)
        {
            return BadRequest(new
            {
                message = "Amount must be greater than zero."
            });
        }

        if (string.IsNullOrWhiteSpace(transaction.Description))
        {
            return BadRequest(new
            {
                message = "Description is required."
            });
        }

        if (string.IsNullOrWhiteSpace(transaction.Type))
        {
            return BadRequest(new
            {
                message = "Transaction type is required."
            });
        }

        var clientExists = await _context.Clients
            .AnyAsync(c => c.Id == transaction.ClientId);

        if (!clientExists)
        {
            return BadRequest(new
            {
                message = "The specified client does not exist."
            });
        }

        if (transaction.Date == default)
        {
            transaction.Date = DateTime.UtcNow;
        }

        transaction.Id = 0;

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();

        await _context.Entry(transaction)
            .Reference(t => t.Client)
            .LoadAsync();

        return CreatedAtAction(
            nameof(GetTransaction),
            new { id = transaction.Id },
            transaction
        );
    }

    // PUT: api/transactions/5
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateTransaction(
        int id,
        [FromBody] Transaction transaction)
    {
        if (id != transaction.Id)
        {
            return BadRequest(new
            {
                message = "Transaction ID mismatch."
            });
        }

        if (transaction.ClientId <= 0)
        {
            return BadRequest(new
            {
                message = "ClientId is required."
            });
        }

        if (transaction.Amount <= 0)
        {
            return BadRequest(new
            {
                message = "Amount must be greater than zero."
            });
        }

        if (string.IsNullOrWhiteSpace(transaction.Description))
        {
            return BadRequest(new
            {
                message = "Description is required."
            });
        }

        if (string.IsNullOrWhiteSpace(transaction.Type))
        {
            return BadRequest(new
            {
                message = "Transaction type is required."
            });
        }

        var existingTransaction = await _context.Transactions
            .FirstOrDefaultAsync(t => t.Id == id);

        if (existingTransaction == null)
        {
            return NotFound(new
            {
                message = "Transaction not found."
            });
        }

        var clientExists = await _context.Clients
            .AnyAsync(c => c.Id == transaction.ClientId);

        if (!clientExists)
        {
            return BadRequest(new
            {
                message = "The specified client does not exist."
            });
        }

        existingTransaction.ClientId = transaction.ClientId;
        existingTransaction.Description = transaction.Description;
        existingTransaction.Amount = transaction.Amount;
        existingTransaction.Type = transaction.Type;
        existingTransaction.Date = transaction.Date;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/transactions/5
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteTransaction(int id)
    {
        var transaction = await _context.Transactions
            .FirstOrDefaultAsync(t => t.Id == id);

        if (transaction == null)
        {
            return NotFound(new
            {
                message = "Transaction not found."
            });
        }

        _context.Transactions.Remove(transaction);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}