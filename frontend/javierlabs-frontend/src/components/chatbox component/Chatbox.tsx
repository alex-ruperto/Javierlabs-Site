import {useState, ReactElement} from 'react';
import "./Chatbox.css";
import {Message} from "../chatthread component/ChatThread.tsx"
import React from "react";

// triggers the addMessage function in the parent component (about page)
type ChatboxProps = {
    addMessage: (message: Message) => void; // Function that adds a message
};
export function Chatbox( { addMessage }: ChatboxProps): ReactElement {
    const [inputValue, setInputValue] = useState(''); // input field value

    // handle changes of the input box
    function handleInputChange (e: React.ChangeEvent<HTMLInputElement>) {
        setInputValue(e.target.value); // update the state with the input value
    }

    // handle the submit functionality in the input box
    function handleSubmit() {
        if (inputValue.trim() != '') {
            // Add user's message to the chat
            const userMessage: Message = { text: inputValue, sender: 'user' };
            addMessage(userMessage);

            // Simulate a bot response
            const botMessage: Message = { text: `You said: ${inputValue}`, sender: 'bot'}
            setTimeout(() => {
                addMessage(botMessage);
            }, 500);

            // Clear the text field
            setInputValue('');
        }
    }

    function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>){
        if (e.key === 'Enter'){
            handleSubmit();
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
                />
                {/* Button submit the input */}
                <button
                    className="chatbox-submit-button"
                    onClick={handleSubmit}
                >
                    Send
                </button>
            </div>
        </div>

    );
}