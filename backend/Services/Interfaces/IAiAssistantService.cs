namespace LegalAccounting.API.Services.Interfaces;

public interface IAiAssistantService
{
    Task<string> AskAsync(string message);
}