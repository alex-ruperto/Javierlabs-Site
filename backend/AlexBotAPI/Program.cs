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
builder.Services.AddSingleton<OpenAiService>();
builder.Services.AddControllers();

// Add logging configuration
LoggingConfig.AddLoggingConfiguration(builder.Services);

var app = builder.Build();

// Use Serilog for request logging
app.UseSerilogRequestLogging();

// Configure the HTTP request pipeline
app.MapControllers();
app.Run();