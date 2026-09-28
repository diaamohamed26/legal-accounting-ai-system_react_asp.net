using System.Security.Claims;
using LegalAccounting.API.Data;
using LegalAccounting.API.DTOs.Invoices;
using LegalAccounting.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LegalAccounting.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class InvoicesController : ControllerBase
{
    private readonly InvoiceService _invoiceService;
    private readonly AppDbContext _context;

    public InvoicesController(
        InvoiceService invoiceService,
        AppDbContext context)
    {
        _invoiceService = invoiceService;
        _context = context;
    }

    // =====================================================
    // ADMIN - GET ALL INVOICES
    // GET /api/invoices
    // =====================================================

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll()
    {
        var invoices = await _invoiceService.GetAllAsync();

        return Ok(invoices);
    }

    // =====================================================
    // ADMIN - GET INVOICE BY ID
    // GET /api/invoices/1
    // =====================================================

    [HttpGet("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetById(int id)
    {
        var invoice = await _invoiceService.GetByIdAsync(id);

        if (invoice == null)
        {
            return NotFound(new
            {
                message = "Invoice not found."
            });
        }

        return Ok(invoice);
    }

    // =====================================================
    // ADMIN - CREATE INVOICE
    // POST /api/invoices
    // =====================================================

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create(
        [FromBody] CreateInvoiceDto dto)
    {
        if (dto == null)
        {
            return BadRequest(new
            {
                message = "Invoice data is required."
            });
        }

        try
        {
            var invoice = await _invoiceService.CreateAsync(dto);

            return CreatedAtAction(
                nameof(GetById),
                new { id = invoice.Id },
                invoice
            );
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }

    // =====================================================
    // ADMIN - UPDATE INVOICE
    // PUT /api/invoices/1
    // =====================================================

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] UpdateInvoiceDto dto)
    {
        if (dto == null)
        {
            return BadRequest(new
            {
                message = "Invoice data is required."
            });
        }

        try
        {
            var invoice =
                await _invoiceService.UpdateAsync(id, dto);

            if (invoice == null)
            {
                return NotFound(new
                {
                    message = "Invoice not found."
                });
            }

            return Ok(invoice);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }

    // =====================================================
    // ADMIN - UPDATE STATUS
    // PUT /api/invoices/1/status
    // =====================================================

    [HttpPut("{id:int}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateStatus(
        int id,
        [FromBody] string status)
    {
        if (string.IsNullOrWhiteSpace(status))
        {
            return BadRequest(new
            {
                message = "Status is required."
            });
        }

        try
        {
            var result =
                await _invoiceService.UpdateStatusAsync(
                    id,
                    status.Trim()
                );

            if (!result)
            {
                return NotFound(new
                {
                    message = "Invoice not found."
                });
            }

            return Ok(new
            {
                message = "Invoice status updated successfully.",
                status = status.Trim()
            });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }

    // =====================================================
    // ADMIN - DELETE INVOICE
    // DELETE /api/invoices/1
    // =====================================================

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var result =
                await _invoiceService.DeleteAsync(id);

            if (!result)
            {
                return NotFound(new
                {
                    message = "Invoice not found."
                });
            }

            return Ok(new
            {
                message = "Invoice deleted successfully."
            });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }

    // =====================================================
    // CLIENT - GET MY INVOICES
    // GET /api/invoices/my
    // =====================================================

    [HttpGet("my")]
    [Authorize(Roles = "Client")]
    public async Task<IActionResult> GetMyInvoices()
    {
        var userId = GetCurrentUserId();

        if (userId == null)
        {
            return Unauthorized(new
            {
                message = "User is not authenticated."
            });
        }

        var client = await _context.Clients
            .AsNoTracking()
            .FirstOrDefaultAsync(
                c => c.UserId == userId.Value
            );

        if (client == null)
        {
            return NotFound(new
            {
                message = "Client profile not found."
            });
        }

        var invoices =
            await _invoiceService.GetClientInvoicesAsync(
                client.Id
            );

        return Ok(invoices);
    }

    // =====================================================
    // CLIENT - GET MY INVOICE
    // GET /api/invoices/my/1
    // =====================================================

    [HttpGet("my/{id:int}")]
    [Authorize(Roles = "Client")]
    public async Task<IActionResult> GetMyInvoice(int id)
    {
        var userId = GetCurrentUserId();

        if (userId == null)
        {
            return Unauthorized(new
            {
                message = "User is not authenticated."
            });
        }

        var client = await _context.Clients
            .AsNoTracking()
            .FirstOrDefaultAsync(
                c => c.UserId == userId.Value
            );

        if (client == null)
        {
            return NotFound(new
            {
                message = "Client profile not found."
            });
        }

        var invoice =
            await _invoiceService.GetByIdAsync(id);

        if (invoice == null)
        {
            return NotFound(new
            {
                message = "Invoice not found."
            });
        }

        // Security check:
        // Client can only access their own invoice.
        if (invoice.ClientId != client.Id)
        {
            return NotFound(new
            {
                message = "Invoice not found."
            });
        }

        return Ok(invoice);
    }

    // =====================================================
    // CURRENT USER ID
    // =====================================================

    private int? GetCurrentUserId()
    {
        var claim =
            User.FindFirst(ClaimTypes.NameIdentifier);

        if (claim == null)
        {
            return null;
        }

        return int.TryParse(
            claim.Value,
            out var userId
        )
            ? userId
            : null;
    }
}