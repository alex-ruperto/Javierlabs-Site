import { useState, ReactElement } from 'react';
import "./Chatbox.css";
import {Message} from "../chatthread component/ChatThread.tsx"
import React from "react";

// triggers the addMessage function in the parent component (about page)
type ChatboxProps = {
    addMessage: (message: Omit<Message, 'id'>) => string; // Add a message and return its ID
    updateMessage: (id: string, message: Partial<Message>) => void; // Update message by ID
    setShowChatThread: React.Dispatch<React.SetStateAction<boolean>>; // If needed to ensure the thread is shown after first message
};

export function Chatbox( { addMessage, updateMessage, setShowChatThread }: ChatboxProps): ReactElement {
    const [inputValue, setInputValue] = useState(''); // input field value
    const [responseIsLoading, setResponseIsLoading] = useState(false); // Loading state for bot streaming response

    // handle changes of the input box
    function handleInputChange (e: React.ChangeEvent<HTMLInputElement>) {
        setInputValue(e.target.value); // update the state with the input value
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

            // Account for certain responses.
            const requestUrl = `https://javierlabs-backend-gkaje5hgend3etbh.eastus-01.azurewebsites.net/api/assistant/stream?prompt=${encodeURIComponent(inputValue)}`;
            const response = await fetch(requestUrl, { method: 'GET'});

            if (response.status === 429) {
                // Rate limit exceeded
                updateMessage(botId, { text: "Rate limit exceeded. Please try again later." });
                setResponseIsLoading(false);
                return;
            } else if (response.status === 503) {
                // Server issue
                updateMessage(botId, { text: "Server is currently unavailable. Please try again later." });
                setResponseIsLoading(false);
                return;
            } else if (!response.ok) {
                // Other error
                updateMessage(botId, { text: "An error occurred. Please try again." });
                setResponseIsLoading(false);
                return;
            }

            // If we get here, response is OK, start the SSE
            const eventSource = new EventSource(requestUrl);

            // On each chunk of data from the SSE:
            eventSource.onmessage = (event) => {
                const chunk = event.data;            // Current chunk of text from the server
                botMessageContent += chunk;          // Append chunk to the accumulated response

                // Update the previously created bot message by its ID
                updateMessage(botId, {
                    text: botMessageContent,
                });
            };

            eventSource.onerror = () => {
                // On error, close the event source and stop loading
                eventSource.close();
                setResponseIsLoading(false);
            };

            eventSource.onopen = () => {
                // When the connection opens, do nothing special
            };
        }
    }

    async function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>){
        if (e.key === 'Enter'){
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
                    {responseIsLoading ? "Loading...": "Send"}
                </button>
            </div>
        </div>

    );
}