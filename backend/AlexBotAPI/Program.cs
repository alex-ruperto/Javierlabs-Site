using AlexBotAPI.Helper;
using AlexBotAPI.Services;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Use Serilog for logging from the start
builder.Host.UseSerilog((context, config) =>
{
    config.MinimumLevel.Debug()
        .WriteTo.Console()
        .WriteTo.File("logs/alexbotapi_service.log", rollingInterval: RollingInterval.Day);
});


// Add services to the DI container
builder.Services.AddSingleton<KeyVaultService>();
builder.Services.AddControllers();

// Add logging configuration
LoggingConfig.AddLoggingConfiguration(builder.Services);

var app = builder.Build();

// Test OpenAIService and KeyVaultService
try
{
    var keyVaultService = new KeyVaultService();
    
    // Pass in the KeyVault service to acquire secrets from the Key Vault
    var openAIService = new OpenAIService(keyVaultService);
    
    // Test prompt to send to the assistant
    string prompt = "Who is Alex Ruperto?";
    
    // Retrieve and log the assistant's responses.
    await foreach (var response in openAIService.GetAssistantResponseAsync(prompt))
    {
        Log.Information("Assistant Response: {Response}", response);
    }
}
catch (Exception ex)
{
    Log.Error(ex, "An error occurred while testing the OpenAI service.");
}   
finally
{
    Log.CloseAndFlush();
}
// Use Serilog for request logging
app.UseSerilogRequestLogging();

// Configure the HTTP request pipeline
app.MapControllers();
app.Run();