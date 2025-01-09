using System.ClientModel;
using OpenAI;
using OpenAI.Assistants;
using Serilog;
using Microsoft.Extensions.Caching.Memory;
using System.Collections.Concurrent;
// Refer to the GitHub Repo https://github.com/openai/openai-dotnet?tab=readme-ov-file

// Necessary to enable experimental assistant features. May have to update this file later if certain classes/functions deprecate.
#pragma warning disable OPENAI001 
namespace AlexBotAPI.Services;

public class OpenAiService
{
    private readonly AssistantClient _assistantClient;
    private readonly string? _assistantId;
    private Assistant _assistant;
    private readonly IMemoryCache _memoryCache;
    private readonly ConcurrentDictionary<string, string> _activeSessionThreads = new();
    /// <summary>
    /// Constructor that initializes OpenAI Service with required secrets and OpenAI Client setup.
    /// </summary>
    /// <exception cref="InvalidOperationException">Failure to retrieve secrets from the Azure Key Vault.</exception>
    public OpenAiService(string apiKey, string assistantId, IMemoryCache memoryCache)
    {
        if (string.IsNullOrWhiteSpace(apiKey) || string.IsNullOrWhiteSpace(assistantId))
        {
            throw new InvalidOperationException("Failed to retrieve the secrets from the Azure Key Vault.");
        }

        OpenAIClient openAiClient = new OpenAIClient(apiKey);
        _assistantClient = openAiClient.GetAssistantClient();
        _assistantId = assistantId;
        _assistant = _assistantClient.GetAssistant(_assistantId);
        _memoryCache = memoryCache;
    }

    /// <summary>
    /// Asynchronously creates a new assistant thread with the provided options.
    /// </summary>
    /// <param name="threadCreationOptions"> Options for creating the thread.</param>
    /// <returns>A new AssistantThread</returns>
    public async Task<AssistantThread> CreateAssistantThreadAsync(ThreadCreationOptions threadCreationOptions)
    {
        return await _assistantClient.CreateThreadAsync(threadCreationOptions);
    }

    /// <summary>
    /// Caches an assistant thread by session ID.
    /// </summary>
    /// <param name="sessionId">Session ID or Unique Key</param>
    /// <param name="thread">Assistant thread to cache</param>
    public void CacheThread(string sessionId, AssistantThread thread)
    {
        // Configure cache expiration
        var cacheEntryOptions = new MemoryCacheEntryOptions()
            .SetSlidingExpiration(TimeSpan.FromMinutes(5)) // Resets expiration time upon access
            .SetAbsoluteExpiration(TimeSpan.FromMinutes(30)); // Maximum time for this cached thread to live
        _memoryCache.Set(sessionId, thread, cacheEntryOptions);
        Log.Information($"Cached thread with session ID: {sessionId}");
    }

    public void ClearSession(string sessionId)
    {
        // Remove the cached thread
        _memoryCache.Remove(sessionId);

        // Remove the active session thread mapping
        _activeSessionThreads.TryRemove(sessionId, out _);

        Log.Information($"Session {sessionId} cleared.");
    }
    /// <summary>
    /// Retrieves a cached assistant thread by session ID
    /// </summary>
    /// <param name="sessionId"></param>
    /// <returns>The cached assistant thread, or null if the assistant thread is not found.</returns>
    public AssistantThread? GetCachedThread(string sessionId)
    {
        if (_memoryCache.TryGetValue(sessionId, out AssistantThread thread))
        {
            Log.Information($"Retrieved thread with session ID: {sessionId}");
            return thread;
        }

        Log.Warning($"Thread not found in cache for the session ID: {sessionId}");
        return null;
    }


    /// <summary>
    /// Creates a thread for the assistant on OpenAI Platform and stream its response.
    /// </summary>
    /// <param name="prompt"> Initial message for the assistant to respond to.</param>
    /// <param name="thread">The asisstant thread to use for the responses.</param>
    /// <returns>Streamed assistant response from the assistant.</returns>
    public async IAsyncEnumerable<string> GetAssistantResponseAsync(string prompt, string sessionId, AssistantThread thread)
    {
        if (_activeSessionThreads.TryGetValue(sessionId, out var activeThreadId))
        {
            Log.Warning($"Session ID,{sessionId} already has an active thread. Closing previous thread: {activeThreadId}");
            _activeSessionThreads.TryRemove(sessionId, out _); // Remove the previous thread.
        }

        _activeSessionThreads.TryAdd(sessionId, thread.Id);

        try
        {
            AsyncCollectionResult<StreamingUpdate> streamingUpdates = _assistantClient.CreateRunStreamingAsync(
                thread.Id,
                _assistant.Id,
                new RunCreationOptions()
                {
                    AdditionalMessages = { prompt }
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
                    break; // Exit loop once the run is completed.
                }
            }
        }
        finally
        {
            _activeSessionThreads.TryRemove(sessionId, out _); // Remove the session thread mapping after completion.
        }
    }
}
#pragma warning restore OPENAI001
