namespace LegalAccounting.API.DTOs.Expenses;

public class ExpenseResponseDto
{
    public int Id { get; set; }

    public int ClientId { get; set; }

    public string? ClientName { get; set; }

    public string Description { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public string? Category { get; set; }

    public DateTime Date { get; set; }

    public string? Notes { get; set; }
}