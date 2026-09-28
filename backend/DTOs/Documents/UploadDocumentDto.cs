using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace LegalAccounting.API.DTOs.Documents;

public class UploadDocumentDto
{
    [Required]
    public IFormFile File { get; set; } = null!;

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Description { get; set; }

    [MaxLength(100)]
    public string? DocumentType { get; set; }

    public int? ClientId { get; set; }
}