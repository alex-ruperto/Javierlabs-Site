using System.ClientModel;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using OpenAI;
using OpenAI.Assistants;
using Serilog;

// Necessary to enable experimental assistant features. May have to update this file later if certain classes/functions deprecate.
#pragma warning disable OPENAI001 
namespace AlexBotAPI.Services;

public class OpenAIService
{
    private readonly AssistantClient _assistantClient;
    private readonly string? _assistantId;
    private Assistant _assistant;

    /// <summary>
    /// Constructor that initializes OpenAI Service with required secrets and OpenAI Client setup.
    /// </summary>
    /// <param name="keyVaultService">Provides the necessary keys to access the OpenAI API.</param>
    /// <exception cref="InvalidOperationException">Failure to retrieve secrets from the Azure Key Vault.</exception>
    public OpenAIService(KeyVaultService keyVaultService)
    {
        // Retrieve secrets from the key vault
        var apiKey = keyVaultService.GetSecret("OpenAIAPIKey").Result;
        _assistantId = keyVaultService.GetSecret("OpenAIAssistantId").Result;

        if (string.IsNullOrWhiteSpace(apiKey) || string.IsNullOrWhiteSpace(_assistantId))
        {
            throw new InvalidOperationException("Failed to retrieve the secrets from the Azure Key Vault.");
        }
        
        OpenAIClient openAIClient = new OpenAIClient(apiKey);
        _assistantClient = openAIClient.GetAssistantClient();
        _assistant = _assistantClient.GetAssistant(_assistantId);
    }

    /// <summary>
    /// Creates a thread for the assistant on OpenAI Platform and stream its response.
    /// </summary>
    /// <param name="userMessage"> Initial message for the assistant to respond to.</param>
    /// <returns>Streamed assistant response.</returns>
    public async IAsyncEnumerable<string> GetAssistantResponseAsync(string prompt)
    {

        // Thread Options
        ThreadCreationOptions threadOptions = new()
        {
            InitialMessages = { prompt }
        };

        // Create a new thread with the assistant client and thread options
        AssistantThread assistantThread = await _assistantClient.CreateThreadAsync(threadOptions);

        AsyncCollectionResult<StreamingUpdate> streamingUpdates = _assistantClient.CreateRunStreamingAsync(
            assistantThread.Id,
            _assistant.Id,
            new RunCreationOptions()
            {
                AdditionalInstructions = ""
            }
        );

        await foreach (StreamingUpdate streamingUpdate in streamingUpdates)
        {
            if (streamingUpdate.UpdateKind == StreamingUpdateReason.RunCreated)
            {
                var startTime = DateTime.UtcNow;
                Log.Information($"--- Run Started at {startTime} ---");
                yield return $"--- Run Started at {startTime} ---";
            }

            if (streamingUpdate is MessageContentUpdate contentUpdate)
            {
                Log.Information(contentUpdate.Text);
                yield return contentUpdate.Text;
            }
        }
    }
}


#pragma warning restore OPENAI001