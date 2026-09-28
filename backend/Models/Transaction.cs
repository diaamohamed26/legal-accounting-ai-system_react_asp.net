namespace LegalAccounting.API.Models;

public class Transaction
{
public int Id { get; set; }

public int ClientId { get; set; }

public string Description { get; set; } = string.Empty;

public decimal Amount { get; set; }

public string Type { get; set; } = string.Empty;

public DateTime Date { get; set; }

public Client? Client { get; set; }

}
