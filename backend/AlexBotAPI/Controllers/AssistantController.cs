using AlexBotAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using OpenAI.Assistants;
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


    [HttpPost("init")]
    public async Task<IActionResult> InitializeAssistantThread([FromQuery] string sessionId)
    {
        if (string.IsNullOrEmpty(sessionId))
        {
            return BadRequest("Session ID is required.");
        }

        try
        {
            // Clear any previous mappings or threads for this session ID
            _openAiService.ClearSession(sessionId);

#pragma warning disable OPENAI001 
            var threadOptions = new ThreadCreationOptions
            {
                InitialMessages = { "Prepare for user interaction." }
            };
#pragma warning restore OPENAI001

            var assistantThread = await _openAiService.CreateAssistantThreadAsync(threadOptions);

            _openAiService.CacheThread(sessionId, assistantThread);
            return Ok("Assistant with thread initialized successfully.");
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Error while initializing assistant thread.");
            return StatusCode(500, "Failed to initialize assistant thread.");
        }
    }

    /// <summary>
    /// Handles Streaming of the Assistant's response.
    /// </summary>
    /// <param name="prompt">User's prompt to the Assistant.</param>
    [HttpGet("stream")]
    public async Task StreamAssistantResponses([FromQuery] string prompt, [FromQuery] string sessionId)
    {
        try
        {
            if (string.IsNullOrEmpty(prompt) || string.IsNullOrEmpty(sessionId))
            {
                Response.StatusCode = 400;
                await Response.WriteAsync($"Please provide a valid prompt and session ID.");
                return;
            }

            var assistantThread = _openAiService.GetCachedThread(sessionId);
            if (assistantThread == null)
            {
                Response.StatusCode = 404;
                await Response.WriteAsync("Assistant thread not initialized. Please initialize the thread first.");
                return;
            }

            // Check if the request headers don't contain "Accept" or if the "Accept" header doesn't contain "text/event-stream"
            if (!Request.Headers.TryGetValue("Accept", out var acceptHeader) ||
                !acceptHeader.ToString().Contains("text/event-stream", StringComparison.OrdinalIgnoreCase))
            {
                Response.StatusCode = 400; // Simply return a 200 response in to avoid starting a run.
                await Response.WriteAsync("Client must accept 'text/event-stream'.");
                return;
            }

            // If this logic is reached, set response headers for streaming to start a run.
            Response.ContentType = "text/event-stream";

            // Used cached thread to stream response
            await foreach (var response in _openAiService.GetAssistantResponseAsync(prompt, sessionId, assistantThread))
            {
                if (!string.IsNullOrEmpty(response))
                {
                    // Send each token as a server-side event (SSE)
                    await Response.WriteAsync($"data: {response}\n\n");
                    await Response.Body.FlushAsync();
                }
            }

            // Send final SSE event telling the client that it is done
            await Response.WriteAsync("data: [DONE]\n\n");
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
