namespace LegalAccounting.API.Models;

public class Invoice
{
    public int Id { get; set; }

    public int ClientId { get; set; }

    public string InvoiceNumber { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public string Status { get; set; } = "Pending";

    public DateTime Date { get; set; }

    public DateTime? DueDate { get; set; }

    public Client? Client { get; set; }
}