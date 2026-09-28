namespace LegalAccounting.API.DTOs.Clients;

public class ClientDashboardDto
{
    public ClientDashboardClientDto Client { get; set; } = new();
    public ClientDashboardStatsDto Stats { get; set; } = new();
    public List<ClientInvoiceDto> RecentInvoices { get; set; } = new();
    public List<ClientTransactionDto> RecentTransactions { get; set; } = new();
    public List<ClientDocumentDto> RecentDocuments { get; set; } = new();
}

public class ClientDashboardClientDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}

public class ClientDashboardStatsDto
{
    public int TotalInvoices { get; set; }
    public int PaidInvoices { get; set; }
    public int PendingInvoices { get; set; }
    public decimal TotalExpenses { get; set; }
    public decimal TotalPaid { get; set; }
    public decimal TotalPending { get; set; }
    public decimal Balance { get; set; }
}

public class ClientInvoiceDto
{
    public int Id { get; set; }
    public string InvoiceNumber { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public DateTime? DueDate { get; set; }
}

public class ClientTransactionDto
{
    public int Id { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Type { get; set; } = string.Empty;
    public DateTime Date { get; set; }
}

public class ClientDocumentDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string FileType { get; set; } = string.Empty;
    public DateTime UploadedAt { get; set; }
}