import { useState, ReactElement } from 'react';
import "./Chatbox.css";
import { Message } from "../chatthread component/ChatThread.tsx"
import React from "react";

// triggers the addMessage function in the parent component (about page)
type ChatboxProps = {
    addMessage: (message: Omit<Message, 'id'>) => string; // Add a message and return its ID
    updateMessage: (id: string, message: Partial<Message>) => void; // Update message by ID
    setShowChatThread: React.Dispatch<React.SetStateAction<boolean>>; // If needed to ensure the thread is shown after first message
};

export function Chatbox({ addMessage, updateMessage, setShowChatThread }: ChatboxProps): ReactElement {
    const [inputValue, setInputValue] = useState(''); // input field value
    const [responseIsLoading, setResponseIsLoading] = useState(false); // Loading state for bot streaming response
    let currentEventSource: EventSource | null = null; // track the current event source

    // handle changes of the input box
    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setInputValue(e.target.value); // update the state with the input value
    }

    function getSessionId(): string | null {
        return sessionStorage.getItem("sessionId");
    }

    // Handle message submission
    async function handleSubmit() {
        if (inputValue.trim() !== '') {
            // Add user message and get its ID
            addMessage({
                text: inputValue,  // The user's entered text
                sender: 'user',    // Mark as 'user' message
            });

            // Show the chat thread if it isn't showing already
            setShowChatThread(true);

            // Clear the input field
            setInputValue("");

            // Add a placeholder bot message and store its ID for later updates
            const botId = addMessage({
                text: "",       // Start empty, we'll update as we stream
                sender: "bot"   // Mark as 'bot' message
            });

            setResponseIsLoading(true);

            // This variable accumulates streamed response text
            let botMessageContent = "";

            // Retrieve the session ID
            const sessionId = getSessionId();
            if (!sessionId) {
                updateMessage(botId, { text: "Session ID not found. Please refresh the page." })
                setResponseIsLoading(false);
                return;
            }

            // Close the current EventSource if it exists
            if (currentEventSource) {
                currentEventSource.close();
                currentEventSource = null;
            }

            // Construct the request URL
            // Replace with http://localhost:XXXX for local dev or import.meta.env.VITE_API_BASE_URL for prod
            const baseUrl = "http://localhost:5026";
            const requestUrl = `${baseUrl}/api/assistant/stream?prompt=${encodeURIComponent(inputValue)}&sessionId=${sessionId}`;

            try {
                // Start SSE if this logic is reached.
                currentEventSource = new EventSource(requestUrl);

                currentEventSource.onmessage = (event) => {
                    if (event.data === "[DONE]") {
                        currentEventSource?.close();
                        currentEventSource = null;
                        setResponseIsLoading(false);
                    } else {
                        botMessageContent += event.data;
                        updateMessage(botId, { text: botMessageContent });
                    }
                };

                currentEventSource.onerror = () => {
                    if (currentEventSource?.readyState !== EventSource.CLOSED) {
                        setResponseIsLoading(false);
                        updateMessage(botId, { text: "An error occurred while streaming. Please try again." });
                        currentEventSource?.close();
                        currentEventSource = null;
                    }
                };

            } catch (error) {
                console.error("Error while handling the SSE request: ", error);
                updateMessage(botId, { text: "Failed to stream response. Please try again later." });
                setResponseIsLoading(false);
            }
        }
    }

    async function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            await handleSubmit();
        }
    }

    /**
     * Render the chat input UI
     * Includes an input field for the user to type and a button to submit the input.
     */

    return (
        <div className="chatbox-container">
            {/* Input field for user messages */}
            <div className="chatbox-input-container">
                <input
                    className="chatbox-input" // CSS class for styling the input field
                    type="text"
                    placeholder="Type your message..."
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                    disabled={responseIsLoading} // Disable input during streaming
                />
                {/* Button submit the input */}
                <button
                    className="chatbox-submit-button"
                    onClick={handleSubmit}
                    disabled={responseIsLoading}
                >
                    {responseIsLoading ? "Loading..." : "Send"}
                </button>
            </div>
        </div>

    );
}
