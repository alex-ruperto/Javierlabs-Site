# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 12/20/2024

### Fixed
- Optimized the AssistantController by first checking if the Accept header is present or if it doesn't contain "text/event-stream". 
Returns a status 200 OK if either of those conditions are met instead of doing the run.
- apiKey and assistantId are now passed into the OpenAIService constructor rather than being initialized in the constructor. 
This allows both variables to be awaited asynchronously in Program.cs.

## [1.0.0] - 12/17/2024

### Added
- Initial release of the Javierlabs site.
- Frontend UI with the Gruvbox theme
- Backend that serves an OpenAI Assistant response to the Chatbox in the about page of the frontend.
- README.md