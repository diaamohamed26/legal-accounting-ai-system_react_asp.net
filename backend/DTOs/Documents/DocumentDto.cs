namespace LegalAccounting.API.DTOs.Documents;

public class DocumentDto
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string FileName { get; set; } = string.Empty;

    public string? ContentType { get; set; }

    public long FileSize { get; set; }

    public string? DocumentType { get; set; }

    public int? ClientId { get; set; }

    public string? ClientName { get; set; }

    public int? UploadedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}