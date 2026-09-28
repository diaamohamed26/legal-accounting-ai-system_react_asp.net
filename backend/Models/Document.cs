using System.ComponentModel.DataAnnotations;

namespace LegalAccounting.API.Models;

public class Document
{
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Description { get; set; }

    [Required]
    [MaxLength(255)]
    public string FileName { get; set; } = string.Empty;

    [Required]
    [MaxLength(255)]
    public string StoredFileName { get; set; } = string.Empty;

    [Required]
    public string FilePath { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? ContentType { get; set; }

    public long FileSize { get; set; }

    [MaxLength(100)]
    public string? DocumentType { get; set; }

    // =========================
    // Client Relationship
    // =========================

    public int? ClientId { get; set; }

    public Client? Client { get; set; }

    // =========================
    // Uploaded By
    // =========================

    public int? UploadedBy { get; set; }

    // =========================
    // Dates
    // =========================

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }
}