using LegalAccounting.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LegalAccounting.API.Controllers;

[ApiController]
[Route("api/admin/dashboard")]
[Authorize(Roles = "Admin")]
public class AdminDashboardController : ControllerBase
{
    private readonly AppDbContext _context;

    public AdminDashboardController(AppDbContext context)
    {
        _context = context;
    }

    // GET: /api/admin/dashboard
    [HttpGet]
    public async Task<IActionResult> GetDashboard()
    {
        var now = DateTime.UtcNow;

        var startOfMonth = new DateTime(
            now.Year,
            now.Month,
            1,
            0,
            0,
            0,
            DateTimeKind.Utc
        );

        var startOfNextMonth = startOfMonth.AddMonths(1);

        // =========================
        // Basic Statistics
        // =========================

        var totalClients = await _context.Clients
            .CountAsync();

        var totalInvoices = await _context.Invoices
            .CountAsync();

        var pendingInvoices = await _context.Invoices
            .CountAsync(i =>
                i.Status.ToLower() == "pending"
            );

        // =========================
        // Financial Statistics
        // =========================

        // Revenue = Paid invoices
        var totalRevenue = await _context.Invoices
            .Where(i =>
                i.Status.ToLower() == "paid"
            )
            .SumAsync(i => (decimal?)i.Amount) ?? 0;

        var totalExpenses = await _context.Expenses
            .SumAsync(e => (decimal?)e.Amount) ?? 0;

        // =========================
        // Current Month
        // =========================

        var incomeThisMonth = await _context.Invoices
            .Where(i =>
                i.Status.ToLower() == "paid" &&
                i.Date >= startOfMonth &&
                i.Date < startOfNextMonth
            )
            .SumAsync(i => (decimal?)i.Amount) ?? 0;

        var expensesThisMonth = await _context.Expenses
            .Where(e =>
                e.Date >= startOfMonth &&
                e.Date < startOfNextMonth
            )
            .SumAsync(e => (decimal?)e.Amount) ?? 0;

        // =========================
        // Recent Invoices
        // =========================

        var recentInvoices = await _context.Invoices
            .AsNoTracking()
            .Include(i => i.Client)
            .OrderByDescending(i => i.Date)
            .Take(5)
            .Select(i => new
            {
                i.Id,
                i.InvoiceNumber,
                i.ClientId,
                ClientName = i.Client != null
                    ? i.Client.Name
                    : "Unknown Client",
                i.Amount,
                i.Status,
                i.Date,
                i.DueDate
            })
            .ToListAsync();

        // =========================
        // Recent Expenses
        // =========================

        var recentExpenses = await _context.Expenses
            .AsNoTracking()
            .Include(e => e.Client)
            .OrderByDescending(e => e.Date)
            .Take(5)
            .Select(e => new
            {
                e.Id,
                e.ClientId,
                ClientName = e.Client != null
                    ? e.Client.Name
                    : "Unknown Client",
                e.Description,
                e.Amount,
                e.Date
            })
            .ToListAsync();

        // =========================
        // Recent Transactions
        // =========================

        var recentTransactions = await _context.Transactions
            .AsNoTracking()
            .Include(t => t.Client)
            .OrderByDescending(t => t.Date)
            .Take(5)
            .Select(t => new
            {
                t.Id,
                t.ClientId,
                ClientName = t.Client != null
                    ? t.Client.Name
                    : "Unknown Client",
                t.Description,
                t.Amount,
                t.Type,
                t.Date
            })
            .ToListAsync();

        // =========================
        // Financial Overview
        // =========================

        var financialOverview = await _context.Invoices
            .Where(i =>
                i.Status.ToLower() == "paid" &&
                i.Date >= startOfMonth &&
                i.Date < startOfNextMonth
            )
            .GroupBy(i => i.Date.Day)
            .Select(g => new
            {
                Day = g.Key,
                Income = g.Sum(i => i.Amount)
            })
            .OrderBy(x => x.Day)
            .ToListAsync();

        // =========================
        // Response
        // =========================

        return Ok(new
        {
            statistics = new
            {
                totalClients,
                totalInvoices,
                pendingInvoices,
                totalRevenue,
                totalExpenses,
                incomeThisMonth,
                expensesThisMonth
            },

            recentInvoices,

            recentExpenses,

            recentTransactions,

            financialOverview
        });
    }
}