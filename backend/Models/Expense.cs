namespace LegalAccounting.API.Models;

public class Expense
{
    public int Id { get; set; }

    public int ClientId { get; set; }

    public Client Client { get; set; } = null!;

    public string Description { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public string? Category { get; set; }

    public DateTime Date { get; set; }

    public string? Notes { get; set; }
}