using LegalAccounting.API.DTOs.Documents;
using LegalAccounting.API.Models;

namespace LegalAccounting.API.Services;

public interface IDocumentService
{
    Task<List<DocumentDto>> GetAllAsync(
        int? clientId = null,
        string? search = null);

    Task<DocumentDto?> GetByIdAsync(int id);

    Task<DocumentDto> UploadAsync(
        UploadDocumentDto dto,
        int? uploadedBy);

    Task<Document?> GetEntityByIdAsync(int id);

    Task<bool> DeleteAsync(int id);
}