import { useState, ReactElement } from 'react';
import "./Chatbox.css";
import {Message} from "../chatthread component/ChatThread.tsx"
import React from "react";

// triggers the addMessage function in the parent component (about page)
type ChatboxProps = {
    addMessage: (message: Message) => number; // Function that adds a message
    updateMessage: (index: number, message: Message) => void; // Update an existing message
};

export function Chatbox( { addMessage, updateMessage }: ChatboxProps): ReactElement {
    const [inputValue, setInputValue] = useState(''); // input field value
    const [responseIsLoading, setResponseIsLoading] = useState(false); // Loading state for bot streaming response
    // handle changes of the input box
    function handleInputChange (e: React.ChangeEvent<HTMLInputElement>) {
        setInputValue(e.target.value); // update the state with the input value
    }

    // handle the submit functionality in the input box
    async function handleSubmit() {
        if (inputValue.trim() != '') {
            // Add user's message to the chat
            const userMessage: Message = { text: inputValue, sender: 'user' };
            addMessage(userMessage);

            // Bot response streaming
            const botMessage: Message = {text: "", sender: "bot"}; // Initially empty
            const botMessageIndex = addMessage(botMessage);

            setResponseIsLoading(true);
            setInputValue("");

            // Use a local variable to track the accumulated bot response
            let botMessageContent = "";

            // Fetch the server-side event from the backend (SSE)
            const eventSource = new EventSource(
                `http://localhost:5026/api/assistant/stream?prompt=${encodeURIComponent(inputValue)}`
            );

            // Stream the response into one message
            eventSource.onmessage = (event) => {
                const chunk = event.data; // Streamed chunk from the backend
                console.log("Received chunk: ", chunk); // Debug: log each chunk

                botMessageContent += chunk; // Add the chunk to the accumulated response

                // Update the bot's message incrementally
                updateMessage(botMessageIndex, {
                    text: botMessageContent,
                    sender: "bot",
                });
            };

            eventSource.onerror = () => {
                eventSource.close();
                setResponseIsLoading(false);
            }
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