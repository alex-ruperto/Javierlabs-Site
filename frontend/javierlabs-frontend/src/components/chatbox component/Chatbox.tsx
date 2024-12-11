import {useState, ReactElement} from 'react';
import "./Chatbox.css";
import React from "react";

export function Chatbox(): ReactElement {
    const handleInputChange= (e:React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value); // update the state with the input value
    }

    const [inputValue, setInputValue] = useState('');

    const handleSubmit = () => {
        if (inputValue.trim() != '') {
            console.log('User Input: ', inputValue); // Handle user input
            setInputValue('');
        }
    }

    /**
     * Render the chat input UI
     * Includes an input field for the user to type and a button to submit the input.
     */

    return (
        <div className="chatbox-input-container">
            {/* Input field for user messages */}
            <input
                className="chatbox-input" // CSS class for styling the input field
                type="text"
                placeholder="Type your message..."
                value={inputValue}
                onChange={handleInputChange}
            />
            {/* Button submit the input */}
            <button
                className="chatbox-submit-button"
                onClick={handleSubmit}
            >
                Send
            </button>
        </div>

    );
}