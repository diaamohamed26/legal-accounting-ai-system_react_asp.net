using LegalAccounting.API.Data;
using Microsoft.EntityFrameworkCore;

namespace LegalAccounting.API.Services;

public class PublicDashboardService : IPublicDashboardService
{
private readonly AppDbContext _context;

public PublicDashboardService(AppDbContext context)
{
    _context = context;
}

public async Task<PublicDashboardSummaryDto> GetSummaryAsync()
{
    var totalInvoices = await _context.Invoices
        .AsNoTracking()
        .CountAsync();

    var activeClients = await _context.Clients
        .AsNoTracking()
        .CountAsync();

    var totalExpenses = await _context.Expenses
        .AsNoTracking()
        .SumAsync(e => (decimal?)e.Amount) ?? 0;

    var totalDocuments = await _context.Documents
        .AsNoTracking()
        .CountAsync();

    var totalRevenue = await _context.Invoices
        .AsNoTracking()
        .Where(i => i.Status == "Paid")
        .SumAsync(i => (decimal?)i.Amount) ?? 0;

    return new PublicDashboardSummaryDto
    {
        TotalInvoices = totalInvoices,
        ActiveClients = activeClients,
        TotalExpenses = totalExpenses,
        TotalDocuments = totalDocuments,
        TotalRevenue = totalRevenue,

        // لا يوجد حالياً تاريخ كافٍ لحساب growth بشكل موثوق.
        RevenueGrowth = 0
    };
}

}
