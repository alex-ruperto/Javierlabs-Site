using AlexBotAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Serilog;

namespace AlexBotAPI.Controllers;

/// <summary>
/// Controller to handle the Assistant's response over HTTP.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[EnableRateLimiting("fixed")]
public class AssistantController : ControllerBase
{
    private readonly OpenAiService _openAiService;

    public AssistantController(OpenAiService openAiService)
    {
        _openAiService = openAiService;
    }
    
    /// <summary>
    /// Handles Streaming of the Assistant's response.
    /// </summary>
    /// <param name="prompt">User's prompt to the Assistant.</param>
    [HttpGet("stream")]
    public async Task StreamAssistantResponses([FromQuery] string prompt)
    {
        try
        {
            if (string.IsNullOrEmpty(prompt))
            {
                Response.StatusCode = 400;
                await Response.WriteAsync($"Please provide a valid prompt.");
                return;
            }

            // Set response headers for streaming
            Response.ContentType = "text/event-stream";

            await foreach (var response in _openAiService.GetAssistantResponseAsync(prompt))
            {
                if (!string.IsNullOrEmpty(response))
                {
                    // Send each token as a server-side event (SSE)
                    await Response.WriteAsync($"data: {response}\n\n");
                    await Response.Body.FlushAsync();
                }
            }
            
            // Close the stream
            await Response.Body.FlushAsync(); 
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Error while streaming assistant response.");
            Response.StatusCode = 500;
            await Response.WriteAsync("An error occured while processing the request.");
        }
    }
}