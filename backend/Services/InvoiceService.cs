using LegalAccounting.API.Data;
using LegalAccounting.API.DTOs.Invoices;
using LegalAccounting.API.Models;
using Microsoft.EntityFrameworkCore;

namespace LegalAccounting.API.Services;

public class InvoiceService
{
    private readonly AppDbContext _context;

    public InvoiceService(AppDbContext context)
    {
        _context = context;
    }

    // =====================================================
    // GET ALL INVOICES
    // =====================================================

    public async Task<List<InvoiceDto>> GetAllAsync()
    {
        return await _context.Invoices
            .AsNoTracking()
            .Include(i => i.Client)
            .OrderByDescending(i => i.Date)
            .Select(i => new InvoiceDto
            {
                Id = i.Id,
                ClientId = i.ClientId,
                InvoiceNumber = i.InvoiceNumber,
                Amount = i.Amount,
                Status = i.Status,
                Date = i.Date,
                DueDate = i.DueDate,

                ClientName = i.Client != null
                    ? i.Client.Name
                    : null,

                ClientEmail = i.Client != null
                    ? i.Client.Email
                    : null
            })
            .ToListAsync();
    }

    // =====================================================
    // GET BY ID
    // =====================================================

    public async Task<InvoiceDto?> GetByIdAsync(int id)
    {
        return await _context.Invoices
            .AsNoTracking()
            .Include(i => i.Client)
            .Where(i => i.Id == id)
            .Select(i => new InvoiceDto
            {
                Id = i.Id,
                ClientId = i.ClientId,
                InvoiceNumber = i.InvoiceNumber,
                Amount = i.Amount,
                Status = i.Status,
                Date = i.Date,
                DueDate = i.DueDate,

                ClientName = i.Client != null
                    ? i.Client.Name
                    : null,

                ClientEmail = i.Client != null
                    ? i.Client.Email
                    : null
            })
            .FirstOrDefaultAsync();
    }

    // =====================================================
    // GET CLIENT INVOICES
    // =====================================================

    public async Task<List<InvoiceDto>> GetClientInvoicesAsync(
        int clientId)
    {
        return await _context.Invoices
            .AsNoTracking()
            .Include(i => i.Client)
            .Where(i => i.ClientId == clientId)
            .OrderByDescending(i => i.Date)
            .Select(i => new InvoiceDto
            {
                Id = i.Id,
                ClientId = i.ClientId,
                InvoiceNumber = i.InvoiceNumber,
                Amount = i.Amount,
                Status = i.Status,
                Date = i.Date,
                DueDate = i.DueDate,

                ClientName = i.Client != null
                    ? i.Client.Name
                    : null,

                ClientEmail = i.Client != null
                    ? i.Client.Email
                    : null
            })
            .ToListAsync();
    }

    // =====================================================
    // CREATE
    // =====================================================

    public async Task<InvoiceDto> CreateAsync(
        CreateInvoiceDto dto)
    {
        var client = await _context.Clients
            .FirstOrDefaultAsync(c => c.Id == dto.ClientId);

        if (client == null)
        {
            throw new ArgumentException(
                "Client not found."
            );
        }

        if (dto.Amount <= 0)
        {
            throw new ArgumentException(
                "Invoice amount must be greater than zero."
            );
        }

        if (dto.DueDate.HasValue &&
            dto.DueDate.Value < dto.Date)
        {
            throw new ArgumentException(
                "Due date cannot be earlier than invoice date."
            );
        }

        var status = NormalizeStatus(dto.Status);

        var invoice = new Invoice
        {
            ClientId = dto.ClientId,

            InvoiceNumber =
                await GenerateInvoiceNumberAsync(),

            Amount = dto.Amount,

            Status = status,

            Date = dto.Date,

            DueDate = dto.DueDate
        };

        _context.Invoices.Add(invoice);

        await _context.SaveChangesAsync();

        return MapToDto(invoice, client);
    }

    // =====================================================
    // UPDATE
    // =====================================================

    public async Task<InvoiceDto?> UpdateAsync(
        int id,
        UpdateInvoiceDto dto)
    {
        var invoice = await _context.Invoices
            .Include(i => i.Client)
            .FirstOrDefaultAsync(i => i.Id == id);

        if (invoice == null)
        {
            return null;
        }

        var client = await _context.Clients
            .FirstOrDefaultAsync(c => c.Id == dto.ClientId);

        if (client == null)
        {
            throw new ArgumentException(
                "Client not found."
            );
        }

        if (dto.Amount <= 0)
        {
            throw new ArgumentException(
                "Invoice amount must be greater than zero."
            );
        }

        if (dto.DueDate.HasValue &&
            dto.DueDate.Value < dto.Date)
        {
            throw new ArgumentException(
                "Due date cannot be earlier than invoice date."
            );
        }

        invoice.ClientId = dto.ClientId;

        invoice.Amount = dto.Amount;

        invoice.Status =
            NormalizeStatus(dto.Status);

        invoice.Date = dto.Date;

        invoice.DueDate = dto.DueDate;

        await _context.SaveChangesAsync();

        return MapToDto(invoice, client);
    }

    // =====================================================
    // UPDATE STATUS
    // =====================================================

    public async Task<bool> UpdateStatusAsync(
        int id,
        string status)
    {
        var invoice = await _context.Invoices
            .FirstOrDefaultAsync(i => i.Id == id);

        if (invoice == null)
        {
            return false;
        }

        invoice.Status = NormalizeStatus(status);

        await _context.SaveChangesAsync();

        return true;
    }

    // =====================================================
    // DELETE
    // =====================================================

    public async Task<bool> DeleteAsync(int id)
    {
        var invoice = await _context.Invoices
            .FirstOrDefaultAsync(i => i.Id == id);

        if (invoice == null)
        {
            return false;
        }

        _context.Invoices.Remove(invoice);

        await _context.SaveChangesAsync();

        return true;
    }

    // =====================================================
    // GENERATE INVOICE NUMBER
    // =====================================================

    private async Task<string> GenerateInvoiceNumberAsync()
    {
        var lastInvoice = await _context.Invoices
            .OrderByDescending(i => i.Id)
            .FirstOrDefaultAsync();

        var nextId = (lastInvoice?.Id ?? 0) + 1;

        return $"INV-{nextId:D5}";
    }

    // =====================================================
    // NORMALIZE STATUS
    // =====================================================

    private static string NormalizeStatus(string? status)
    {
        if (string.IsNullOrWhiteSpace(status))
        {
            return "Pending";
        }

        var normalized = status.Trim().ToLowerInvariant();

        return normalized switch
        {
            "pending" => "Pending",
            "paid" => "Paid",
            "overdue" => "Overdue",
            "cancelled" => "Cancelled",
            "canceled" => "Cancelled",
            "draft" => "Draft",
            "partiallypaid" => "PartiallyPaid",
            "partially paid" => "PartiallyPaid",

            _ => throw new ArgumentException(
                "Invalid invoice status."
            )
        };
    }

    // =====================================================
    // MAP
    // =====================================================

    private static InvoiceDto MapToDto(
        Invoice invoice,
        Client client)
    {
        return new InvoiceDto
        {
            Id = invoice.Id,

            ClientId = invoice.ClientId,

            InvoiceNumber = invoice.InvoiceNumber,

            Amount = invoice.Amount,

            Status = invoice.Status,

            Date = invoice.Date,

            DueDate = invoice.DueDate,

            ClientName = client.Name,

            ClientEmail = client.Email
        };
    }
}