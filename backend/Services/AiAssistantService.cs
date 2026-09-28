using LegalAccounting.API.Services.Interfaces;
using OpenAI.Chat;

namespace LegalAccounting.API.Services;

public class AiAssistantService : IAiAssistantService
{
    private readonly IConfiguration _configuration;

    public AiAssistantService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task<string> AskAsync(string message)
    {
        if (string.IsNullOrWhiteSpace(message))
        {
            throw new ArgumentException(
                "Message cannot be empty."
            );
        }

        var apiKey = _configuration["OpenAI:ApiKey"];

        if (string.IsNullOrWhiteSpace(apiKey))
        {
            throw new InvalidOperationException(
                "OpenAI API key is not configured."
            );
        }

        // Use a real OpenAI model available through the API.
        var client = new ChatClient(
            model: "gpt-5.1",
            apiKey: apiKey
        );

        var messages = new List<ChatMessage>
        {
            new SystemChatMessage(
                """
                You are the AI Assistant for a Legal Accounting System.

                You help users with:

                - Clients
                - Invoices
                - Expenses
                - Transactions
                - Accounts
                - Ledger
                - Financial reports
                - Documents
                - General accounting concepts

                Rules:

                1. Give clear and professional answers.
                2. Do not invent financial information.
                3. Do not claim that you accessed the database
                   unless database information was actually provided.
                4. If information is missing, clearly say that it
                   is not available.
                5. Keep answers understandable and practical.
                6. For accounting or legal matters, explain that
                   the response is informational and does not replace
                   professional accounting or legal advice.
                """
            ),

            new UserChatMessage(message)
        };

        var result = await client.CompleteChatAsync(messages);

        if (result.Value.Content.Count == 0)
        {
            return "I couldn't generate a response.";
        }

        return result.Value.Content[0].Text;
    }
}
