# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 12/20/2024

### Added
- 

### Fixed
- Optimized the AssistantController by first checking if the Accept header is present or if it doesn't contain "text/event-stream". Returns a status 200 OK if either of those conditions are met instead of doing the run.
- 

### Removed
- TODO

## [1.0.0] - 12/16/2024