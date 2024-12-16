namespace AlexBotAPI.Models;

public class BotApiRateLimitOptions
{
    public const string BotApiRateLimit = "BotApiRateLimit";
    public int Limit { get; set; } = 50; // How many requests in total
    public int Window { get; set; } = 1; // Window (per hour)
    public int QueueLimit { get; set; } = 0; // If rate limit exceeded, add a queue? 0 = no queue.
    public bool AutoReplenishment { get; set; } = true; // Automatically reset counter one window is reached.

}