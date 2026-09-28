using LegalAccounting.API.Data;
using LegalAccounting.API.DTOs.Documents;
using LegalAccounting.API.Models;
using Microsoft.EntityFrameworkCore;

namespace LegalAccounting.API.Services;

public class DocumentService : IDocumentService
{
    private readonly AppDbContext _context;
    private readonly IWebHostEnvironment _environment;

    private const long MaxFileSize = 10 * 1024 * 1024;

    private static readonly string[] AllowedExtensions =
    {
        ".pdf",
        ".doc",
        ".docx",
        ".xls",
        ".xlsx",
        ".jpg",
        ".jpeg",
        ".png"
    };

    public DocumentService(
        AppDbContext context,
        IWebHostEnvironment environment)
    {
        _context = context;
        _environment = environment;
    }

    // =========================================================
    // GET ALL DOCUMENTS
    // =========================================================

    public async Task<List<DocumentDto>> GetAllAsync(
        int? clientId = null,
        string? search = null)
    {
        var query = _context.Documents
            .AsNoTracking()
            .Include(d => d.Client)
            .ThenInclude(c => c.User)
            .AsQueryable();

        // Filter by client
        if (clientId.HasValue)
        {
            query = query.Where(d =>
                d.ClientId == clientId.Value);
        }

        // Search
        if (!string.IsNullOrWhiteSpace(search))
        {
            search = search.Trim();

            query = query.Where(d =>
                d.Name.Contains(search) ||
                (d.Description != null &&
                 d.Description.Contains(search)) ||
                d.FileName.Contains(search) ||
                (d.DocumentType != null &&
                 d.DocumentType.Contains(search)));
        }

        return await query
            .OrderByDescending(d => d.CreatedAt)
            .Select(d => new DocumentDto
            {
                Id = d.Id,
                Name = d.Name,
                Description = d.Description,
                FileName = d.FileName,
                ContentType = d.ContentType,
                FileSize = d.FileSize,
                DocumentType = d.DocumentType,

                ClientId = d.ClientId,

                ClientName = d.Client != null &&
                             d.Client.User != null
                    ? d.Client.User.Name
                    : null,

                UploadedBy = d.UploadedBy,

                CreatedAt = d.CreatedAt,

                UpdatedAt = d.UpdatedAt
            })
            .ToListAsync();
    }

    // =========================================================
    // GET BY ID
    // =========================================================

    public async Task<DocumentDto?> GetByIdAsync(int id)
    {
        return await _context.Documents
            .AsNoTracking()
            .Include(d => d.Client)
            .ThenInclude(c => c.User)
            .Where(d => d.Id == id)
            .Select(d => new DocumentDto
            {
                Id = d.Id,
                Name = d.Name,
                Description = d.Description,
                FileName = d.FileName,
                ContentType = d.ContentType,
                FileSize = d.FileSize,
                DocumentType = d.DocumentType,

                ClientId = d.ClientId,

                ClientName = d.Client != null &&
                             d.Client.User != null
                    ? d.Client.User.Name
                    : null,

                UploadedBy = d.UploadedBy,

                CreatedAt = d.CreatedAt,

                UpdatedAt = d.UpdatedAt
            })
            .FirstOrDefaultAsync();
    }

    // =========================================================
    // GET ENTITY
    // =========================================================

    public async Task<Document?> GetEntityByIdAsync(int id)
    {
        return await _context.Documents
            .FirstOrDefaultAsync(d => d.Id == id);
    }

    // =========================================================
    // UPLOAD
    // =========================================================

    public async Task<DocumentDto> UploadAsync(
        UploadDocumentDto dto,
        int? uploadedBy)
    {
        // =====================================================
        // Validate File
        // =====================================================

        if (dto.File == null)
        {
            throw new ArgumentException(
                "File is required.");
        }

        if (dto.File.Length == 0)
        {
            throw new ArgumentException(
                "The uploaded file is empty.");
        }

        if (dto.File.Length > MaxFileSize)
        {
            throw new ArgumentException(
                "Maximum file size is 10 MB.");
        }

        // =====================================================
        // Validate Name
        // =====================================================

        if (string.IsNullOrWhiteSpace(dto.Name))
        {
            throw new ArgumentException(
                "Document name is required.");
        }

        // =====================================================
        // Validate Extension
        // =====================================================

        var extension = Path
            .GetExtension(dto.File.FileName)
            .ToLowerInvariant();

        if (!AllowedExtensions.Contains(extension))
        {
            throw new ArgumentException(
                "File type is not allowed. " +
                "Allowed types: PDF, Word, Excel, JPG, JPEG, PNG.");
        }

        // =====================================================
        // Validate Client
        // =====================================================

        if (dto.ClientId.HasValue)
        {
            var clientExists = await _context.Clients
                .AnyAsync(c => c.Id == dto.ClientId.Value);

            if (!clientExists)
            {
                throw new ArgumentException(
                    "Client not found.");
            }
        }

        // =====================================================
        // Web Root
        // =====================================================

        var webRootPath = _environment.WebRootPath;

        if (string.IsNullOrWhiteSpace(webRootPath))
        {
            webRootPath = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot");
        }

        // =====================================================
        // Upload Folder
        // =====================================================

        var uploadFolder = Path.Combine(
            webRootPath,
            "uploads",
            "documents");

        Directory.CreateDirectory(uploadFolder);

        // =====================================================
        // Generate Safe File Name
        // =====================================================

        var storedFileName =
            $"{Guid.NewGuid():N}{extension}";

        var physicalFilePath = Path.Combine(
            uploadFolder,
            storedFileName);

        // =====================================================
        // Save Physical File
        // =====================================================

        try
        {
            await using var stream =
                new FileStream(
                    physicalFilePath,
                    FileMode.CreateNew,
                    FileAccess.Write,
                    FileShare.None);

            await dto.File.CopyToAsync(stream);
        }
        catch
        {
            if (File.Exists(physicalFilePath))
            {
                File.Delete(physicalFilePath);
            }

            throw;
        }

        // =====================================================
        // Create Database Entity
        // =====================================================

        var document = new Document
        {
            Name = dto.Name.Trim(),

            Description =
                string.IsNullOrWhiteSpace(dto.Description)
                    ? null
                    : dto.Description.Trim(),

            FileName = Path.GetFileName(
                dto.File.FileName),

            StoredFileName = storedFileName,

            FilePath = physicalFilePath,

            ContentType = dto.File.ContentType,

            FileSize = dto.File.Length,

            DocumentType =
                string.IsNullOrWhiteSpace(dto.DocumentType)
                    ? null
                    : dto.DocumentType.Trim(),

            ClientId = dto.ClientId,

            UploadedBy = uploadedBy,

            CreatedAt = DateTime.UtcNow
        };

        // =====================================================
        // Save Database
        // =====================================================

        try
        {
            _context.Documents.Add(document);

            await _context.SaveChangesAsync();
        }
        catch
        {
            // Database failed,
            // remove physical file.
            if (File.Exists(physicalFilePath))
            {
                File.Delete(physicalFilePath);
            }

            throw;
        }

        // =====================================================
        // Return DTO
        // =====================================================

        return new DocumentDto
        {
            Id = document.Id,
            Name = document.Name,
            Description = document.Description,
            FileName = document.FileName,
            ContentType = document.ContentType,
            FileSize = document.FileSize,
            DocumentType = document.DocumentType,
            ClientId = document.ClientId,
            UploadedBy = document.UploadedBy,
            CreatedAt = document.CreatedAt,
            UpdatedAt = document.UpdatedAt
        };
    }

    // =========================================================
    // DELETE
    // =========================================================

    public async Task<bool> DeleteAsync(int id)
    {
        var document = await _context.Documents
            .FirstOrDefaultAsync(d => d.Id == id);

        if (document == null)
        {
            return false;
        }

        // =====================================================
        // Delete Physical File
        // =====================================================

        if (!string.IsNullOrWhiteSpace(document.FilePath) &&
            File.Exists(document.FilePath))
        {
            File.Delete(document.FilePath);
        }

        // =====================================================
        // Delete Database Record
        // =====================================================

        _context.Documents.Remove(document);

        await _context.SaveChangesAsync();

        return true;
    }
}