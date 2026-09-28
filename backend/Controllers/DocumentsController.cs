using System.Security.Claims;
using LegalAccounting.API.DTOs.Documents;
using LegalAccounting.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LegalAccounting.API.Controllers;

[ApiController]
[Route("api/documents")]
[Authorize]
public class DocumentsController : ControllerBase
{
    private readonly IDocumentService _documentService;

    public DocumentsController(
        IDocumentService documentService)
    {
        _documentService = documentService;
    }

    // =========================================================
    // GET: api/documents
    // GET: api/documents?clientId=1
    // GET: api/documents?search=contract
    // =========================================================

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int? clientId = null,
        [FromQuery] string? search = null)
    {
        var documents =
            await _documentService.GetAllAsync(
                clientId,
                search);

        return Ok(documents);
    }

    // =========================================================
    // GET: api/documents/1
    // =========================================================

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var document =
            await _documentService.GetByIdAsync(id);

        if (document == null)
        {
            return NotFound(new
            {
                message = "Document not found."
            });
        }

        return Ok(document);
    }

    // =========================================================
    // POST: api/documents/upload
    // =========================================================

    [HttpPost("upload")]
    [RequestSizeLimit(10 * 1024 * 1024)]
    public async Task<IActionResult> Upload(
        [FromForm] UploadDocumentDto dto)
    {
        try
        {
            // =================================================
            // Get User ID from JWT
            // =================================================

            int? userId = null;

            var userIdClaim =
                User.FindFirst(
                    ClaimTypes.NameIdentifier)?.Value;

            if (int.TryParse(
                userIdClaim,
                out var parsedUserId))
            {
                userId = parsedUserId;
            }

            // =================================================
            // Upload
            // =================================================

            var document =
                await _documentService.UploadAsync(
                    dto,
                    userId);

            return CreatedAtAction(
                nameof(GetById),
                new { id = document.Id },
                document);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
        catch (Exception)
        {
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new
                {
                    message =
                        "An error occurred while uploading the document."
                });
        }
    }

    // =========================================================
    // GET: api/documents/1/download
    // =========================================================

    [HttpGet("{id:int}/download")]
    public async Task<IActionResult> Download(int id)
    {
        var document =
            await _documentService.GetEntityByIdAsync(id);

        if (document == null)
        {
            return NotFound(new
            {
                message = "Document not found."
            });
        }

        if (string.IsNullOrWhiteSpace(
            document.FilePath))
        {
            return NotFound(new
            {
                message = "File path not found."
            });
        }

        if (!System.IO.File.Exists(
            document.FilePath))
        {
            return NotFound(new
            {
                message = "Physical file not found."
            });
        }

        var fileBytes =
            await System.IO.File.ReadAllBytesAsync(
                document.FilePath);

        return File(
            fileBytes,
            document.ContentType ??
                "application/octet-stream",
            document.FileName);
    }

    // =========================================================
    // DELETE: api/documents/1
    // =========================================================

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted =
            await _documentService.DeleteAsync(id);

        if (!deleted)
        {
            return NotFound(new
            {
                message = "Document not found."
            });
        }

        return Ok(new
        {
            message =
                "Document deleted successfully."
        });
    }
}