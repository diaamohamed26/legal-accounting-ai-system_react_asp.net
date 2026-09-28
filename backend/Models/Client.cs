using System.ComponentModel.DataAnnotations;

namespace LegalAccounting.API.Models;

public class Client
{
    public int Id { get; set; }

    public int UserId { get; set; }

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    // =========================
    // User
    // =========================

    public User? User { get; set; }

    // =========================
    // Invoices
    // =========================

    public ICollection<Invoice> Invoices { get; set; }
        = new List<Invoice>();

    // =========================
    // Expenses
    // =========================

    public ICollection<Expense> Expenses { get; set; }
        = new List<Expense>();

    // =========================
    // Transactions
    // =========================

    public ICollection<Transaction> Transactions { get; set; }
        = new List<Transaction>();

    // =========================
    // Documents
    // =========================

    public ICollection<Document> Documents { get; set; }
        = new List<Document>();
}
