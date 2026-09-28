using LegalAccounting.API.Data;
using LegalAccounting.API.DTOs.Clients;
using Microsoft.EntityFrameworkCore;

namespace LegalAccounting.API.Services;

public class ClientDashboardService : IClientDashboardService
{
    private readonly AppDbContext _context;

    public ClientDashboardService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ClientDashboardDto?> GetDashboardAsync(int userId)
    {
        Console.WriteLine(
            $"[DASHBOARD SERVICE] Searching Client.UserId = {userId}"
        );

        var client = await _context.Clients
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (client == null)
        {
            Console.WriteLine(
                $"[DASHBOARD SERVICE] Client NOT FOUND for UserId = {userId}"
            );

            return null;
        }

        Console.WriteLine(
            $"[DASHBOARD SERVICE] Client FOUND: Id = {client.Id}, Name = {client.Name}, UserId = {client.UserId}"
        );

        var invoices = await _context.Invoices
            .AsNoTracking()
            .Where(i => i.ClientId == client.Id)
            .OrderByDescending(i => i.Date)
            .ToListAsync();

        var expenses = await _context.Expenses
            .AsNoTracking()
            .Where(e => e.ClientId == client.Id)
            .ToListAsync();

        var transactions = await _context.Transactions
            .AsNoTracking()
            .Where(t => t.ClientId == client.Id)
            .OrderByDescending(t => t.Date)
            .Take(5)
            .ToListAsync();

        var documents = await _context.Documents
            .AsNoTracking()
            .Where(d => d.ClientId == client.Id)
            .OrderByDescending(d => d.CreatedAt)
            .Take(5)
            .ToListAsync();

        var paidInvoices = invoices
            .Where(i => i.Status.Equals(
                "Paid",
                StringComparison.OrdinalIgnoreCase))
            .ToList();

        var pendingInvoices = invoices
            .Where(i => !i.Status.Equals(
                "Paid",
                StringComparison.OrdinalIgnoreCase))
            .ToList();

        var totalPaid = paidInvoices.Sum(i => i.Amount);
        var totalPending = pendingInvoices.Sum(i => i.Amount);
        var totalExpenses = expenses.Sum(e => e.Amount);

        var balance = totalPaid - totalExpenses;

        return new ClientDashboardDto
        {
            Client = new ClientDashboardClientDto
            {
                Id = client.Id,
                Name = client.Name,
                Email = client.Email
            },

            Stats = new ClientDashboardStatsDto
            {
                TotalInvoices = invoices.Count,
                PaidInvoices = paidInvoices.Count,
                PendingInvoices = pendingInvoices.Count,
                TotalExpenses = totalExpenses,
                TotalPaid = totalPaid,
                TotalPending = totalPending,
                Balance = balance
            },

            RecentInvoices = invoices
                .Take(5)
                .Select(i => new ClientInvoiceDto
                {
                    Id = i.Id,
                    InvoiceNumber = i.InvoiceNumber,
                    Amount = i.Amount,
                    Status = i.Status,
                    Date = i.Date,
                    DueDate = i.DueDate
                })
                .ToList(),

            RecentTransactions = transactions
                .Select(t => new ClientTransactionDto
                {
                    Id = t.Id,
                    Description = t.Description,
                    Amount = t.Amount,
                    Type = t.Type,
                    Date = t.Date
                })
                .ToList(),

            RecentDocuments = documents
                .Select(d => new ClientDocumentDto
                {
                    Id = d.Id,
                    Name = d.Name,
                    FileType = d.ContentType,
                    UploadedAt = d.CreatedAt
                })
                .ToList()
        };
    }
}