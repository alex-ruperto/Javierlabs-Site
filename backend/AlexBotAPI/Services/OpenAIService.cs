using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using Serilog;

namespace AlexBotAPI.Services;

public class OpenAIService
{
    private readonly HttpClient _httpClient;
    private readonly string? _apiKey;
    private readonly string? _assistantId;
    private readonly string? _vectorStore;

    public OpenAIService(KeyVaultService keyVaultService)
    {
        // Retrieve secrets from the key vault
        _apiKey = keyVaultService.GetSecret("OpenAIPIKey").Result;
        _assistantId = keyVaultService.GetSecret("OpenAIPIAssistantId").Result;
        _vectorStore = keyVaultService.GetSecret("OpenAIPIVectorStore").Result;
    }
}