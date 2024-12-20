using AlexBotAPI.Helper;
using AlexBotAPI.Services;
using AlexBotAPI.Models;
using Microsoft.AspNetCore.RateLimiting;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Use Serilog for logging from the start
builder.Host.UseSerilog((context, config) =>
{
    config.MinimumLevel.Debug()
        .WriteTo.Console()
        .WriteTo.File("logs/alexbotapi_service.log", rollingInterval: RollingInterval.Day);
});

// Retrieve OpenAI API Key and Assistant ID
var keyVaultService = new KeyVaultService();
var apiKey = await keyVaultService.GetSecret("OpenAIAPIKey");
var assistantId = await keyVaultService.GetSecret("OpenAIAssistantId");
var openAiService = new OpenAiService(apiKey, assistantId);

// Add services to the DI container
builder.Services.AddSingleton(openAiService);
builder.Services.AddControllers();

// Add CORS Policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", policy =>
    {
        policy
            .WithOrigins(
                // allow requests from the following domains
                "https://javierlabs.com", 
                "https://yellow-ocean-0f2f9500f.4.azurestaticapps.net", 
                "http://localhost:5173", // local use only when running on the frontend
                "http://localhost:4173"
            )
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

// Add rate limiter options
builder.Services.Configure<BotApiRateLimitOptions>(
    builder.Configuration.GetSection(BotApiRateLimitOptions.BotApiRateLimit));

var botApiRateLimitOptions = new BotApiRateLimitOptions();
builder.Configuration.GetSection(BotApiRateLimitOptions.BotApiRateLimit).Bind(botApiRateLimitOptions);
var fixedPolicy = "fixed";

builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter(policyName: fixedPolicy, limiterOptions =>
    {
        limiterOptions.PermitLimit = botApiRateLimitOptions.Limit;
        limiterOptions.Window = TimeSpan.FromHours(botApiRateLimitOptions.Window);
        limiterOptions.QueueLimit = botApiRateLimitOptions.QueueLimit;
        limiterOptions.AutoReplenishment = botApiRateLimitOptions.AutoReplenishment;
    });

    // Define what happens if the request is rejected due to rate limiting
    options.OnRejected = (context, cancellationToken) =>
    {
        context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
        return new ValueTask(context.HttpContext.Response.WriteAsync(
            "Hourly request limit reached. Please try again later.",
            cancellationToken));
    };
});

// Add logging configuration
LoggingConfig.AddLoggingConfiguration(builder.Services);

var app = builder.Build();

// Use Serilog for request logging
app.UseSerilogRequestLogging();

// Enable Cross-Origin Resource Sharing
app.UseCors("AllowAllOrigins");

// Use the rate limiter
app.UseRateLimiter();

// Configure the HTTP request pipeline
app.MapControllers();
app.Run();