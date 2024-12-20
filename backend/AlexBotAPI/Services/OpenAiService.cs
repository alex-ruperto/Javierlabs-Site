using System.ClientModel;
using OpenAI;
using OpenAI.Assistants;
using Serilog;

// Refer to the GitHub Repo https://github.com/openai/openai-dotnet?tab=readme-ov-file

// Necessary to enable experimental assistant features. May have to update this file later if certain classes/functions deprecate.
#pragma warning disable OPENAI001 
namespace AlexBotAPI.Services;

public class OpenAiService
{
    private readonly AssistantClient _assistantClient;
    private readonly string? _assistantId;
    private Assistant _assistant;

    /// <summary>
    /// Constructor that initializes OpenAI Service with required secrets and OpenAI Client setup.
    /// </summary>
    /// <exception cref="InvalidOperationException">Failure to retrieve secrets from the Azure Key Vault.</exception>
    public OpenAiService(string apiKey, string assistantId)
    {
        if (string.IsNullOrWhiteSpace(apiKey) || string.IsNullOrWhiteSpace(assistantId))
        {
            throw new InvalidOperationException("Failed to retrieve the secrets from the Azure Key Vault.");
        }
        
        OpenAIClient openAiClient = new OpenAIClient(apiKey);
        _assistantClient = openAiClient.GetAssistantClient();
        _assistantId = assistantId;
        _assistant = _assistantClient.GetAssistant(_assistantId);
    }

    /// <summary>
    /// Creates a thread for the assistant on OpenAI Platform and stream its response.
    /// </summary>
    /// <param name="prompt"> Initial message for the assistant to respond to.</param>
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
                Log.Information($"---Run started at {DateTime.Now}");
            }

            if (streamingUpdate is MessageContentUpdate contentUpdate)
            {
                yield return contentUpdate.Text;
            }

            if (streamingUpdate.UpdateKind == StreamingUpdateReason.RunCompleted)
            {
                Log.Information($"---Done at {DateTime.Now}");
            }
        }
    }
}
#pragma warning restore OPENAI001