using LegalAccounting.API.DTOs.AI;
using LegalAccounting.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LegalAccounting.API.Controllers;

[ApiController]
[Route("api/ai")]
[Authorize]
public class AiAssistantController : ControllerBase
{
    private readonly IAiAssistantService _aiAssistantService;
    private readonly ILogger<AiAssistantController> _logger;

    public AiAssistantController(
        IAiAssistantService aiAssistantService,
        ILogger<AiAssistantController> logger)
    {
        _aiAssistantService = aiAssistantService;
        _logger = logger;
    }

    [HttpPost("chat")]
    public async Task<IActionResult> Chat(
        [FromBody] AiChatRequest request)
    {
        if (request == null ||
            string.IsNullOrWhiteSpace(request.Message))
        {
            return BadRequest(new
            {
                message = "Message is required."
            });
        }

        try
        {
            var response =
                await _aiAssistantService.AskAsync(
                    request.Message
                );

            return Ok(new AiChatResponse
            {
                Message = response
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "AI Assistant request failed."
            );

            Console.WriteLine();
            Console.WriteLine("==========================================");
            Console.WriteLine("AI ASSISTANT ERROR");
            Console.WriteLine("==========================================");
            Console.WriteLine($"Message: {ex.Message}");
            Console.WriteLine($"Type: {ex.GetType().FullName}");

            if (ex.InnerException != null)
            {
                Console.WriteLine(
                    $"Inner Error: {ex.InnerException.Message}"
                );
            }

            Console.WriteLine("==========================================");
            Console.WriteLine();

            return StatusCode(500, new
            {
                message = "AI Assistant failed.",
                error = ex.Message,
                innerError = ex.InnerException?.Message
            });
        }
    }
}
