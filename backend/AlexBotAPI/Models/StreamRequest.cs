namespace AlexBotAPI.Models;

public class StreamRequest
{
    public required string Prompt { get; set; }
    public required string SessionId { get; set; }
}
