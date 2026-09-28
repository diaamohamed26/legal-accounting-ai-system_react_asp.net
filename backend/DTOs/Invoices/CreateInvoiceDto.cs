using System.ComponentModel.DataAnnotations;

namespace LegalAccounting.API.DTOs.Invoices;

public class CreateInvoiceDto
{
    [Required]
    public int ClientId { get; set; }

    [Required]
    [Range(0.01, double.MaxValue)]
    public decimal Amount { get; set; }

    public string Status { get; set; } = "Pending";

    [Required]
    public DateTime Date { get; set; }

    public DateTime? DueDate { get; set; }
}