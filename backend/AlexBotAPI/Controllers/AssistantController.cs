using AlexBotAPI.Models;
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
#pragma warning disable OPENAI001 
            var threadOptions = new ThreadCreationOptions
            {
                InitialMessages = { }
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
    /// <param name="request">For getting the user's prompt and session ID to the Assistant.</param>
    [HttpPost("stream")]
    public async Task StreamAssistantResponses([FromBody] StreamRequest request)
    {
        string sessionId = request.SessionId;
        string prompt = request.Prompt;

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

            // Accumulate tokens into this string.
            string accumulatedText = "";

            // Track the length of text already flushed to the client.
            int lastFlushedLength = 0;

            // Helper function for detokenization
            bool IsWordComplete(string text)
            {
                if (string.IsNullOrEmpty(text))
                    return false;

                // Check last character
                char last = text[text.Length - 1];

                // If the last character is a whitespace or common punctuation, consider it complete.
                return char.IsWhiteSpace(last) || last == '.' || last == ',' || last == '!' || last == '?' || last == ':';
            }

            // Used cached thread to stream response
            await foreach (var token in _openAiService.GetAssistantResponseAsync(prompt, sessionId, assistantThread))
            {
                if (!string.IsNullOrEmpty(token))
                {
                    // Append token to the accumulated text
                    accumulatedText += token;
                    if (IsWordComplete(accumulatedText))
                    {
                        // Get only the new portion.
                        string newText = accumulatedText.Substring(lastFlushedLength);
                        await Response.WriteAsync($"{newText}\n\n");
                        await Response.Body.FlushAsync();
                        // Update lastFlushedLength
                        lastFlushedLength = accumulatedText.Length;

                    }
                }
            }

            // After streaming completes flush any remaining text.
            if (accumulatedText.Length > lastFlushedLength)
            {
                string newText = accumulatedText.Substring(lastFlushedLength);
                await Response.WriteAsync($"{newText}\n\n");
                await Response.Body.FlushAsync();
            }

            // Send final SSE event telling the client that it is done
            await Response.WriteAsync("[DONE]\n\n");
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
