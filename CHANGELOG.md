# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 01/09/2025

### Added
- Caching mechanism in the backend to store and retrieve threads based on session ID. Thread - Session ID pairs are stored using a dictionary.
- Init endpoint for initializing the Assistant and starting a new thread. This thread will coincide with a session ID provided by the frontend.
- console.log() statement indicates a successful retrieval of the assistant + thread.

### Changed
- The chatthread container in the About page now automatically scrolls to the bottom of the thread of messages.

### Removed
- console.log() statement that shows the request URL.

### Fixed
- Loading circle on the About page now only appears for the duration of time it takes to retrieve the assistant and corresponding thread for the session. 
- Users can now switch between different parts of the website and then come back to the About page with the same thread and assistant. The chat history will display and auto-scroll to the bottom.

## [1.1.0] - 12/20/2024

### Fixed
- Optimized the AssistantController by first checking if the Accept header is present or if it doesn't contain "text/event-stream". 
Returns a status 200 OK if either of those conditions are met instead of doing the run.
- apiKey and assistantId are now passed into the OpenAIService constructor rather than being initialized in the constructor. 
This allows both variables to be awaited asynchronously in Program.cs.

## [1.0.0] - 12/17/2024

### Added
- Initial release of the Javierlabs site.
- Frontend UI with the Gruvbox Dark theme
- Backend that serves an OpenAI Assistant response to the Chatbox in the about page of the frontend.
- README.md

test
