using System.ComponentModel.DataAnnotations;

namespace LegalAccounting.API.DTOs.Expenses;

public class UpdateExpenseDto
{
    [Required]
    public int ClientId { get; set; }

    [Required]
    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;

    [Range(0.01, double.MaxValue)]
    public decimal Amount { get; set; }

    [MaxLength(100)]
    public string? Category { get; set; }

    [Required]
    public DateTime Date { get; set; }

    [MaxLength(1000)]
    public string? Notes { get; set; }
}