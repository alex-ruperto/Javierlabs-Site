using Serilog;

namespace AlexBotAPI.Helper;


/// <summary>
/// Sets up the global logging configuration for BaggageGPT
/// </summary>
public static class LoggingConfig
{
    /// <summary>
    /// Configures logging services for the application.
    /// </summary>
    /// <param name="services">Service collection to add logging configurations to.</param>
    public static void AddLoggingConfiguration(IServiceCollection services)
    {
        // Set up Serilog logging configuration
        Log.Logger = new LoggerConfiguration()
            .MinimumLevel.Information()  // Set the minimum log level
            .WriteTo.Console()  // Logs to the console
            .WriteTo.File("logs/alexbotapi_service.log", rollingInterval: RollingInterval.Day)
            .CreateLogger();                // Create the logger using the configured sinks

        // Add Serilog to the logging providers
        services.AddLogging(config =>
            {
                config.ClearProviders();  // Clear the default providers
                config.AddSerilog();  // Add Serilog as the logging provider. 
            }
        );
    }
}