﻿using AlexBotAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace AlexBotAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AssistantController : ControllerBase
{
    private readonly OpenAiService _openAiService;

    public AssistantController(OpenAiService openAiService)
    {
        _openAiService = openAiService;
    }
    
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
                    await Response.WriteAsync(response);
                    await Response.Body.FlushAsync();
                }
            }
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Error while streaming assistant response.");
            Response.StatusCode = 500;
            await Response.WriteAsync("An error occured while processing the request.");
        }
    }
}