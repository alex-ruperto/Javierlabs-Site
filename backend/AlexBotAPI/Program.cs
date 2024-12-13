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

try
{
    var keyVaultService = new KeyVaultService(); // Create an instance of KeyVaultService
    string secretName = "Test-Secret"; // Replace with your secret name
    var secretValue = await keyVaultService.GetSecret(secretName); // Await the asynchronous call
    Log.Information("Retrieved Secret: {SecretValue}", secretValue); // Log the retrieved secret
}
catch (Exception ex)
{
    Log.Error("Error retrieving secret: {ErrorMessage}", ex.Message);
}

// Use Serilog for request logging
app.UseSerilogRequestLogging();

// Configure the HTTP request pipeline
app.MapControllers();
app.Run();