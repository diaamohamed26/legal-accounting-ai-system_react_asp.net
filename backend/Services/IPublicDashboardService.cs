namespace LegalAccounting.API.Services;

public interface IPublicDashboardService
{
Task<PublicDashboardSummaryDto> GetSummaryAsync();
}

public class PublicDashboardSummaryDto
{
public int TotalInvoices { get; set; }
public int ActiveClients { get; set; }
public decimal TotalExpenses { get; set; }
public int TotalDocuments { get; set; }
public decimal TotalRevenue { get; set; }
public decimal RevenueGrowth { get; set; }
}
